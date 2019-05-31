// 📥 Imports
import { mat4, vec4 } from "/libs/gl-matrix/index.js"
import { getFileContentsAsText } from "/libs/utils.js"
import { Program, Material, Geometry, SceneObject, SceneLight, Camera, CameraMouseControls } from "/libs/gl-engine/index.js"
import { parse } from "/libs/gl-engine/parsers/obj-parser.js"

main()

async function main() {

    // #️⃣ Cargamos assets a usar (modelos, codigo de shaders, etc)

    const planoGeometryData      = await parse("/models/plano.obj")
    const esferaGeometryData      = await parse("/models/esfera.obj")

    const diffuseVertexShaderSource   = await getFileContentsAsText("/shaders/diffuse.vert.glsl")
    const diffuseFragmentShaderSource = await getFileContentsAsText("/shaders/diffuse.frag.glsl")
    const phongVertexShaderSource   = await getFileContentsAsText("/shaders/phong.vert.glsl")
    const phongFragmentShaderSource = await getFileContentsAsText("/shaders/phong.frag.glsl")
    
    const phongTVertexShaderSource   = await getFileContentsAsText("/shaders/phongT.vert.glsl")
    const phongTFragmentShaderSource = await getFileContentsAsText("/shaders/phongT.frag.glsl")

    // #️⃣ Configuracion base de WebGL

    const canvas = document.getElementById("webgl-canvas")
    const gl = canvas.getContext("webgl2")

    gl.clearColor(0.1, 0.18, 0.18, 1)
    gl.enable(gl.DEPTH_TEST)

    // #️⃣ Creamos la camara y sus controles

    const camera = new Camera()
    const cameraMouseControls = new CameraMouseControls(camera, canvas)

    //creo las texturas
    const planoTexture = gl.createTexture() //crear objeto textura
    planoTexture.image = new Image() // cargar imagen
    planoTexture.image.onload = function () {
        handleLoadedTexture(planoTexture)
    }
    planoTexture.image.src = "textures/plano.jpeg"

    const esferaTexture = gl.createTexture() //crear objeto textura
    esferaTexture.image = new Image() // cargar imagen
    esferaTexture.image.onload = function () {
        handleLoadedTexture(esferaTexture)
    }
    esferaTexture.image.src = "textures/TexturesCom_Plastic_SpaceBlanketFolds_512_albedo.jpg"

    // #️⃣ Geometrias disponibles

    const planoGeometry  = new Geometry(gl, planoGeometryData)
    const esferaGeometry  = new Geometry(gl, esferaGeometryData)
    

    // #️⃣ Programas de shaders disponibles

    const diffuseProgram = new Program(gl, diffuseVertexShaderSource, diffuseFragmentShaderSource)
    const phongProgram = new Program(gl, phongVertexShaderSource, phongFragmentShaderSource)
    const phongTProgram = new Program(gl, phongTVertexShaderSource, phongTFragmentShaderSource)

    // #️⃣ Creamos materiales combinando programas con distintas propiedades


    const whiteDiffuseMaterial = new Material(diffuseProgram, true, { Ka: [0.1, 0.1, 0.1], Kd: [1, 1, 1] })
    const phongMaterial = new Material(phongProgram, true, false, { Ka: [0.1,0.1,0.1], Kd: [0.4,0.4,0.4], Ks: [0.8,0.8,0.8], shininess: 50})
    const planoMaterial = new Material(phongTProgram, true, true, { texture0: 0, shininess: 50})
    const esferaMaterial = new Material(phongTProgram, true, true, { texture0: 0, shininess: 100})
    

    // #️⃣ Creamos los objetos de la escena

    const plano = new SceneObject(gl, planoGeometry, planoMaterial, [planoTexture], false)
    const esfera = new SceneObject(gl, esferaGeometry, esferaMaterial, [esferaTexture], false)
    const sceneObjects= []
    crearEsferas()

    // const sceneObjects = [granero, platoVolador, alien, plano]
    sceneObjects.push(plano)

    const lightPosition0 = [-5, 5, 5, 1]
    const lightColor0 = [1, 1, 1]
    const lightSpotDirection0 = [0,-1,0]
    const lightSpotCutoff0 = -1
    const light0 = new SceneLight(lightPosition0, lightColor0, lightSpotDirection0, lightSpotCutoff0)

    const ligthPosition1 = [5, -5, -5, 1]
    const lightColor1 = [1, 1, 1]
    const lightSpotDirection1 = [0,-1,0]
    const lightSpotCutoff1 = -1
    const light1 = new SceneLight(ligthPosition1, lightColor1, lightSpotDirection1, lightSpotCutoff1)

    const sceneLights = [light0,light1]

    // #️⃣ Posicion inicial de cada objeto

    
    // #️⃣ Iniciamos el render-loop 🎬

    requestAnimationFrame(render)

    function render() {
        // Actualizacion de matrices de cada objeto
        for (let object of sceneObjects) {
            mat4.multiply(object.modelViewMatrix, camera.viewMatrix, object.modelMatrix)
            mat4.invert(object.normalMatrix, object.modelViewMatrix)
            mat4.transpose(object.normalMatrix, object.normalMatrix)

            /* 📝
             Si ademas de la camara, los objetos tambien tuviesen algun tipo de movimiento (o animacion), tambien tendriamos
             que actualizar la "modelMatrix" de cada uno.
             */
        }

        // Limpiamos buffers de color y profundidad del canvas antes de empezar a dibujar los objetos de la escena
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        // Dibujamos los objetos de la escena
        for (let object of sceneObjects) {
            // Seteamos el programa a usar
            object.material.program.use()

            // Actualizamos los uniforms a usar (provenientes de la camara, el objeto, material y fuentes de luz)
            object.material.program.setUniformValue("viewMatrix", camera.viewMatrix)
            object.material.program.setUniformValue("projectionMatrix", camera.projectionMatrix)
            object.material.program.setUniformValue("modelMatrix", object.modelMatrix)
            object.material.program.setUniformValue("modelViewMatrix", object.modelViewMatrix)
            object.material.program.setUniformValue("normalMatrix", object.normalMatrix)
            

            for (let name in object.material.properties) {
                const value = object.material.properties[name]
                object.material.program.setUniformValue("material." + name, value)
            }
            if ( object.material.affectedByLight ) {
                let i = 0
                for( let light of sceneLights ) {
                    //paso la informacion de las luces. La posicion de la luz y la direccion del spot son convertidas a coordenadas del ojo
                    //si la luz esta asociada a un objeto, se obtiene su posicion y rotacion a partir del objeto
                    if(light.model != null){
                        //si la luz esta asociada a un objeto, actualizo su posicion y rotacion
                        light.position[0] = light.model.position[0]
                        light.position[1] = light.model.position[1]
                        light.position[2] = light.model.position[2]
                        let newSpotDirection = vec4.create()
                        vec4.transformQuat(newSpotDirection,light.default_spot_direction,light.model.rotQuat)
                        light.spot_direction = newSpotDirection
                    }
                    let lightPosEye = vec4.create();
                    vec4.transformMat4( lightPosEye, light.position, camera.viewMatrix )
                    object.material.program.setUniformValue( 'allLights['+ i.toString() + '].position', lightPosEye )
                    object.material.program.setUniformValue( 'allLights['+ i.toString() + '].color', light.color )                                   
                    let spotDirEye = vec4.create()
                    vec4.transformMat4( spotDirEye, light.spot_direction, camera.viewMatrix )
                    object.material.program.setUniformValue( 'allLights['+ i.toString() + '].spot_direction', spotDirEye )   
                    object.material.program.setUniformValue( 'allLights['+ i.toString() + '].spot_cutoff', light.spot_cutoff )
                    i++                    
                }
                object.material.program.setUniformValue('numLights',i)
            }                 

            // Seteamos info de su geometria
            object.vertexArray.bind()
            
            //info de texturas
            if( object.material.textured ) {
                let i
                for(i = 0; i < object.textures.length; i++) {                                                                     
                    gl.activeTexture( gl.TEXTURE0 + i )
                    gl.bindTexture( gl.TEXTURE_2D, object.textures[i] )
                }
            }
            // Lo dibujamos
            gl.drawElements(object.drawMode, object.indexBuffer.size, object.indexBuffer.dataType, 0)
        }

        // Solicitamos el proximo frame
        requestAnimationFrame(render)
    }
    
    function handleLoadedTexture(texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,texture.image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.bindTexture(gl.TEXTURE_2D, null)
    }
    
    function crearEsferas(){
        let i
        let j
        for(i=0 ;i<4;i++){
            for(j=0; j<6;j++){
                sceneObjects[i*6+j]=new SceneObject(gl, esferaGeometry, esferaMaterial, [esferaTexture], false)
                sceneObjects[i*6+j].setPosition(3*i-4.0,0.0,3*j-6.0)
                sceneObjects[i*6+j].updateModelMatrix() 
            }
        }

    }   


}

