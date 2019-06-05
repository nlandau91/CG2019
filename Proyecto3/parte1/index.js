// 📥 Imports
import { mat4, vec4 } from "/libs/gl-matrix/index.js"
import { getFileContentsAsText,loadImage,toRadians } from "/libs/utils.js"
import { Program, Material, Geometry, SceneObject, SceneLight, Camera, CameraMouseControls } from "/libs/gl-engine/index.js"
import { parse } from "/libs/gl-engine/parsers/obj-parser.js"

main()

async function main() {

    // #️⃣ Cargamos assets a usar (modelos, codigo de shaders, etc)

    const planoGeometryData      = await parse("/models/plano.obj")
    const esferaGeometryData      = await parse("/models/esfera.obj")
    const esferaGolfGeometryData  = await parse("/models/esferaGolf.obj")
    
    const phongTVertexShaderSource   = await getFileContentsAsText("/shaders/phongT.vert.glsl")
    const phongTFragmentShaderSource = await getFileContentsAsText("/shaders/phongT.frag.glsl")
    
    const phongTNVertexShaderSource   = await getFileContentsAsText("/shaders/phongTN.vert.glsl")
    const phongTNFragmentShaderSource = await getFileContentsAsText("/shaders/phongTN.frag.glsl")

    // #️⃣ Configuracion base de WebGL

    const canvas = document.getElementById("webgl-canvas")
    const gl = canvas.getContext("webgl2")

    gl.clearColor(0.1, 0.18, 0.18, 1)
    gl.enable(gl.DEPTH_TEST)

    // #️⃣ Creamos la camara y sus controles

    const camera = new Camera()
    const cameraMouseControls = new CameraMouseControls(camera, canvas)

    //creo las texturas
    const planoTexture = gl.createTexture()
    const esferaMercurio = gl.createTexture()
    const esferaMercurioNormal=gl.createTexture()

    const esferaTexture1 = gl.createTexture()
    const esferaGolfTexture = gl.createTexture()
    const esferaGolfNormal= gl.createTexture()

    armarTextura(planoTexture, await loadImage('/textures/grass1.jpg'))
    armarTextura(esferaMercurio, await loadImage('/textures/mercury.jpg'))
    armarTextura(esferaMercurioNormal, await loadImage('/textures/mercury_normal.jpg'))

    armarTextura(esferaGolfTexture, await loadImage('/textures/texturaGolf.jpg'))
    armarTextura(esferaGolfNormal, await loadImage('/textures/golf_normal.jpg'))
    

    // #️⃣ Geometrias disponibles

    const planoGeometry  = new Geometry(gl, planoGeometryData)
    const esferaGeometry  = new Geometry(gl, esferaGeometryData)
    const esferaGolfGeometry = new Geometry(gl, esferaGolfGeometryData)

    // #️⃣ Programas de shaders disponibles

    const phongTProgram = new Program(gl, phongTVertexShaderSource, phongTFragmentShaderSource)
    const phongTNProgram = new Program(gl, phongTNVertexShaderSource, phongTNFragmentShaderSource)


    // #️⃣ Creamos materiales combinando programas con distintas propiedades


    const planoMaterial = new Material(phongTProgram, true, true, { texture0: 0, shininess: 0})
    
    const esferaMercurioMaterial = new Material(phongTNProgram, true, true, { texture0: 0,texture1: 1, shininess: 4})
    const esferaGolfMaterial = new Material(phongTNProgram,true,true, { texture0: 0, texture1: 1, shininess: 100})
    

    // #️⃣ Creamos los objetos de la escena

    const plano = new SceneObject(gl, planoGeometry, planoMaterial, [planoTexture], false)
    const sceneObjects= []
    crearEsferas()

    // const sceneObjects = [granero, platoVolador, alien, plano]
    sceneObjects.push(plano)
    //direccional cuarta componente en 1
    
    const light0 = new SceneLight([-5.0, 5.0, 5.0, 1.0], [1.0, 1.0, 1.0], [0.0,-1.0,0.0,0.0], 0.3)
    const light1 = new SceneLight([5.0, 5.0, -5.0, 1.0], [1.0, 1.0, 1.0], [0.0,-1.0,0.0,0.0], 0.3)

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
                    object.material.program.setUniformValue( 'allLights['+ i.toString() + '].linear_attenuation', light.linear_attenuation )   
                    object.material.program.setUniformValue( 'allLights['+ i.toString() + '].quadratic_attenuation', light.quadratic_attenuation )
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
    
    function armarTextura( texture, image ) {

        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true )
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image )
        gl.generateMipmap(gl.TEXTURE_2D)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT )
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT )
        gl.bindTexture(gl.TEXTURE_2D, null)
    }
    
    function crearEsferas(){
        let i
        let j
        for(i=0 ;i<4;i++){
            for(j=0; j<6;j++){
                if(i==0){
                    sceneObjects[i*6+j]=new SceneObject(gl, esferaGolfGeometry, esferaGolfMaterial, [esferaGolfTexture,esferaGolfNormal], false)
                    sceneObjects[i*6+j].setPosition(3*i-4.0,0.0,3*j-6.0)
                    sceneObjects[i*6+j].updateModelMatrix()
                }
                if(i==1){
                        sceneObjects[i*6+j]=new SceneObject(gl, esferaGeometry, esferaMercurioMaterial, [esferaMercurio,esferaMercurioNormal], false)
                        sceneObjects[i*6+j].setPosition(3*i-4.0,0.0,3*j-6.0)
                        sceneObjects[i*6+j].updateModelMatrix()
                }
                if(i==2 || i==3){
                        sceneObjects[i*6+j]=new SceneObject(gl, esferaGeometry, esferaMercurioMaterial, [esferaMercurio,esferaMercurioNormal], false)
                        sceneObjects[i*6+j].setPosition(3*i-4.0,0.0,3*j-6.0)
                        sceneObjects[i*6+j].updateModelMatrix()       
                }
            }
        }

    }   


}

