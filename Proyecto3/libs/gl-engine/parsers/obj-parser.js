export async function parse(objFileUrl) {
    const response = await fetch(objFileUrl)
    const objData  = await response.text()

    // Obtenemos las posiciones de los vertices, las coordenadas de texturas, normales, etc que conforman al modelo

    const positions = []            // elementos "v" : [[x, y, z], [x, y, z], ...]
    const textureCoordinates = []   // elementos "vt": [[s, t], [s, t], ...]
    const normals = []              // elementos "vn": [[x, y, z], [x, y, z], ...]

    const vertices = []             // info de cada vertice, i.e. indices a los arreglos de posiciones, coordenadas de textura y normales ("2/9/1 1/7/3 ..." -> [[1, 8, 0], [0, 6, 2], ...])
    const verticesIndex = new Map() // mapeo de grupos "v/vt/vn" a su indice en el arreglo de vertices (para acceso rapido)
    const faces = []                // grupos de indices de los vertices que forman cada cara [[v1, v2, v3], [v2, v3, v4], ...]

    const lines = objData.split("\n")

    for ( let line of lines ) {
        const lineElements = line.split(" ")        // "v 1.00 2.00 3.00" -> ["v", "1.00", "2.00", "3.00"]
        const firstElement = lineElements.shift()   // ["v", "1.00", "2.00", "3.00"] -> ["1.00", "1.00", "1.00"]

        switch (firstElement) {
            case "v":
                positions.push(lineElements.map(element => parseFloat(element)))
                break
            case "vt":
                textureCoordinates.push(lineElements.map(element => parseFloat(element)))
                break
            case "vn":
                normals.push(lineElements.map(element => parseFloat(element)))
                break
            case "f":
                const faceVertices = []

                for(let vertexString of lineElements) {
                    let vertexIndex = verticesIndex.get(vertexString)

                    if (vertexIndex === undefined) {
                        const vertex = vertexString.split("/").map(element => parseInt(element) - 1)
                        vertices.push( vertex )
                        vertexIndex = vertices.length - 1
                        verticesIndex.set(vertexString, vertexIndex)
                    }

                    faceVertices.push(vertexIndex)
                }

                faces.push(faceVertices)
                break
        }
    }

    // Pasamos la informacion obtenida a un formato apropiado para ser almacenada en buffers (flattened)

    const vertexPositions = []              // [x, y, z, x, y, z, x...]
    const vertexTextureCoordinates = []     // [s, t, s, t, s, ...]
    const vertexNormals = []                // [x, y, z, x, y, z, x...]

    for (let vertex of vertices) {
            const positionIndex           = vertex[0]
            const textureCoordinatesIndex = vertex[1]
            const normalIndex             = vertex[2]

            if ( !isNaN(positionIndex) ) vertexPositions.push(...positions[positionIndex])
            if ( !isNaN(textureCoordinatesIndex) ) vertexTextureCoordinates.push(...textureCoordinates[textureCoordinatesIndex])
            if ( !isNaN(normalIndex) ) vertexNormals.push(...normals[normalIndex])
    }

    const indexTriangles  = []        // indices para dibujado con gl.TRIANGLES
    const indexLines      = []        // indices para dibujado con gl.LINES
    const alreadyAddedLines = new Set() // lineas ya agregadas al indice ("1/2", "2/3", ... con "1/2" siendo la linea que una al vertice 1 y 2)

    for (let faceVertices of faces) {
        for (let index = 0; index < 3; index ++) {
            // para los indices de los triangulos, simplemente agregamos cada uno al arreglo correspondiente
            indexTriangles.push(faceVertices[index])

            // en el caso del arreglo de indices para lineas, agarramos de a dos indices (a, b) y chequeamos que el par no haya sido ya agregado,
            // (a fin de evitar redibujar lineas innecesariamente)
            const a = faceVertices[index]
            const b = faceVertices[(index + 1) % 3]

            if (!alreadyAddedLines.has(a + "/" + b)) {
                indexLines.push(a)
                indexLines.push(b)
                alreadyAddedLines.add(a + "/" + b) // la linea que une a y b
                alreadyAddedLines.add(b + "/" + a) // es la misma que una b y a
            }
        }
    }

    return {
        vertexPositions,
        vertexTextureCoordinates,
        vertexNormals,
        indexTriangles,
        indexLines
    }
}
