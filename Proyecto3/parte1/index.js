// 📥 Imports
import { mat4, vec4 } from "/libs/gl-matrix/index.js"
import { getFileContentsAsText,loadImage,toRadians,toDegrees } from "/libs/utils.js"
import { Program, Material, Geometry, SceneObject, SceneLight, Camera, CameraMouseControls } from "/libs/gl-engine/index.js"
import { parse } from "/libs/gl-engine/parsers/obj-parser.js"

main()

async function main() {

    // #️⃣ Cargamos assets a usar (modelos, codigo de shaders, etc)

    const planoGeometryData      = await parse("/models/plano.obj")
    const esferaGeometryData      = await parse("/models/esfera.obj")
    const esferaGolfGeometryData  = await parse("/models/esferaGolf.obj")
    const lamparaGeometryData= await parse("/models/linterna.obj")
    
    const phongTVertexShaderSource   = await getFileContentsAsText("/shaders/phongT.vert.glsl")
    const phongTFragmentShaderSource = await getFileContentsAsText("/shaders/phongT.frag.glsl")
    
    const phongTNVertexShaderSource   = await getFileContentsAsText("/shaders/phongTN.vert.glsl")
    const phongTNFragmentShaderSource = await getFileContentsAsText("/shaders/phongTN.frag.glsl")

    const proceduralMarbleVertexShaderSource = await getFileContentsAsText( '/shaders/marbleProcedural.vert.glsl' )
    const proceduralMarbleFragmentShaderSource = await getFileContentsAsText( '/shaders/marbleProcedural.frag.glsl' )

    const proceduralVertexShaderSource = await getFileContentsAsText( '/shaders/procedural.vert.glsl' )
    const proceduralFragmentShaderSource = await getFileContentsAsText( '/shaders/procedural.frag.glsl' )

    const cookTorrance2TNVertexShaderSource = await getFileContentsAsText( '/shaders/cooktorrance2TN.vert.glsl' )
    const cookTorrance2TNFragmentShaderSource = await getFileContentsAsText( '/shaders/cooktorrance2TN.frag.glsl' )

    const cookTorranceTNVertexShaderSource = await getFileContentsAsText( '/shaders/cooktorranceTN.vert.glsl' )
    const cookTorranceTNFragmentShaderSource = await getFileContentsAsText( '/shaders/cooktorranceTN.frag.glsl' )

    // #️⃣ Configuracion base de WebGL

    const canvas = document.getElementById("webgl-canvas")
    const gl = canvas.getContext("webgl2")

    gl.clearColor(0.1, 0.18, 0.18, 1)
    gl.enable(gl.DEPTH_TEST)

    // #️⃣ Creamos la camara y sus controles

    const camera = new Camera()
    const cameraMouseControls = new CameraMouseControls(camera, canvas)
    var camaraAutomatica= 0
    //creo las texturas
    const planoTexture = gl.createTexture()
    const esferaMercurio = gl.createTexture()
    const esferaMercurioNormal=gl.createTexture()

    const esferaTexture1 = gl.createTexture()
    const esferaGolfTexture = gl.createTexture()
    const esferaGolfNormal= gl.createTexture()

    const esferaGoldTexture=gl.createTexture()
    const esferaGoldTextureNormal=gl.createTexture()
    const esferaGoldSpec=gl.createTexture()

    armarTextura(planoTexture, await loadImage('/textures/TexturesCom_DishCloth2_1K_albedo.jpg'))
    armarTextura(esferaMercurio, await loadImage('/textures/mercury.jpg'))
    armarTextura(esferaMercurioNormal, await loadImage('/textures/mercury_normal.jpg'))

    armarTextura(esferaGoldTexture, await loadImage('/textures/gold.jpg'))
    armarTextura(esferaGoldTextureNormal, await loadImage('/textures/gold_normal.jpg'))
    armarTextura(esferaGoldSpec,await loadImage('/textures/gold_spec.jpg'))

    armarTextura(esferaGolfTexture, await loadImage('/textures/texturaGolf.jpg'))
    armarTextura(esferaGolfNormal, await loadImage('/textures/golf_normal.jpg'))
    

    // #️⃣ Geometrias disponibles

    const planoGeometry  = new Geometry(gl, planoGeometryData)
    const esferaGeometry  = new Geometry(gl, esferaGeometryData)
    const esferaGolfGeometry = new Geometry(gl, esferaGolfGeometryData)
    const lamparaGeometry= new Geometry(gl, lamparaGeometryData)

    // #️⃣ Programas de shaders disponibles

    const phongTProgram = new Program(gl, phongTVertexShaderSource, phongTFragmentShaderSource)
    const phongTNProgram = new Program(gl, phongTNVertexShaderSource, phongTNFragmentShaderSource)
    const proceduralMarbleProgram = new Program( gl, proceduralMarbleVertexShaderSource, proceduralMarbleFragmentShaderSource )
    const proceduralProgram = new Program( gl, proceduralVertexShaderSource, proceduralFragmentShaderSource )
    const cookTorrance2TNProgram = new Program( gl, cookTorrance2TNVertexShaderSource, cookTorrance2TNFragmentShaderSource )
    const cookTorranceTNProgram = new Program( gl, cookTorranceTNVertexShaderSource, cookTorranceTNFragmentShaderSource )


    // #️⃣ Creamos materiales combinando programas con distintas propiedades


    const planoMaterial = new Material( proceduralMarbleProgram, false, false, {} )
    const esferaMercurioMaterial = new Material(cookTorranceTNProgram, true, true, { texture0: 0,texture1: 1,m: 1, f0: 0, sigma: 1.0})
    const esferaGolfMaterial = new Material(phongTNProgram,true,true, { texture0: 0, texture1: 1, shininess: 100})
    const esferaGoldMaterial = new Material(cookTorrance2TNProgram,true,true, { texture0: 0, texture1: 1, texture2: 2,m: 0.04, f0: 1.0, sigma: 0.0})
    const woodMaterial = new Material( proceduralProgram, true, false, { kd: [0.30980392156,0.14117647058,0.07058823529], shininess: 110, resolution: [1.5,0.5]} )

    

    // #️⃣ Creamos los objetos de la escena

    const plano = new SceneObject(gl, planoGeometry, planoMaterial, [planoTexture], false)
    const sceneObjects= []
    crearEsferas()

    // const sceneObjects = [granero, platoVolador, alien, plano]
    sceneObjects.push(plano)


    const light0obj= new SceneObject(gl, lamparaGeometry, woodMaterial, [],false)
    
    const light1obj= new SceneObject(gl, lamparaGeometry, woodMaterial, [],false)
    

    sceneObjects.push(light0obj)
    sceneObjects.push(light1obj)
    
    const light0 = new SceneLight([-5.0, 5.0, 5.0, 1.0], [0.5, 0.5, 0.5], [0.0,-1.0,0.0,0.0], 0.3,light0obj)
    const light1 = new SceneLight([5.0, 5.0, -5.0, 1.0], [0.5, 0.5, 0.5], [0.0,-1.0,0.0,0.0], -1.0,light1obj)
    const lightDirectional = new SceneLight( [0.5, -1.0, -1.0, 0.0], [0.5*255/255,0.5*236/255,0.5*219/255], [0.5, -1.0, 0.0, 0.0], -1.0 )

    const sceneLights = [light0,light1,lightDirectional]

    //Setup sliders y botones
    // Buscamos elementos en el DOM
    const selectedObject = document.getElementById( 'select0' )
    const rotSliderX = document.getElementById( 'slider0' )
    const rotSliderY = document.getElementById( 'slider1' )
    const rotSliderZ = document.getElementById( 'slider2' )
    const transSliderX = document.getElementById( 'slider3' )
    const transSliderY = document.getElementById( 'slider4' )
    const transSliderZ = document.getElementById( 'slider5' )
    const camPhiSlider = document.getElementById( 'slider6' )
    const camThetaSlider = document.getElementById( 'slider7' )
    const camRadiusSlider = document.getElementById( 'slider8' )
    const camFovSlider = document.getElementById( 'slider9' )
    const lightRedSlider = document.getElementById( 'slider10')
    const lightGreenSlider = document.getElementById( 'slider11')
    const lightBlueSlider = document.getElementById( 'slider12')
    const btnDiaSoleado = document.getElementById( 'btnDiaSoleado' )
    const btnDiaNublado = document.getElementById( 'btnDiaNublado' )
    const btnAtardecer = document.getElementById( 'btnAtardecer' )
    const btnNoche = document.getElementById( 'btnNoche' )
    const btnCamaraAutomatica = document.getElementById( 'btnCamaraAutomatica' )
    const selectedTarget = document.getElementById('select3')

    btnCamaraAutomatica.addEventListener ('click', () => { camaraAutomatica = !camaraAutomatica })

    //las propiedades de la luz direccional
    btnDiaSoleado.addEventListener( 'click' ,async () => {
        lightDirectional.position = [0.5, -1.0, -1.0, 0.0]
        lightDirectional.color = [0.5*255/255,0.5*236/255,0.5*219/255] //5400k
    })
    btnDiaNublado.addEventListener( 'click' ,async () => {
        lightDirectional.position = [0.5, -1.0, -1.0, 0.0]
        lightDirectional.color = [0.5*230/255,0.5*235/255,0.5*255/255] //7500k 
    })
    btnAtardecer.addEventListener( 'click' ,async() => {
        lightDirectional.position = [0.5, -0.1, -1.0, 0.0]
        lightDirectional.color = [0.5*255/255,0.5*177/255,0.5*110/255] //3000k
    })
    btnNoche.addEventListener( 'click' ,async () => {
        lightDirectional.position = [0.0, -1.0, 0.0, 0.0]
        lightDirectional.color = [0.01*210/255,0.01*223/255,0.01*255/255] //9000k
    })

    //cuando cambio el objeto seleccionado actualizo los sliders
    selectedObject.addEventListener( 'input', updateObjectSliders )
    //actualizo los sliders del objeto con los valores del objeto seleccionado
    function updateObjectSliders() {
        let objeto = sceneObjects[25+parseFloat( selectedObject.value )]
        rotSliderX.value = objeto.rotation[0]
        rotSliderY.value = objeto.rotation[1]
        rotSliderZ.value = objeto.rotation[2]
        transSliderX.value = objeto.position[0]
        transSliderY.value = objeto.position[1]
        transSliderZ.value = objeto.position[2]
        let luz = sceneLights[parseFloat( selectedObject.value )]
        lightRedSlider.value = luz.color[0]
        lightGreenSlider.value = luz.color[1]
        lightBlueSlider.value = luz.color[2]
    }

    //estos listeners controlan la traslacion y la rotacion del objeto seleccionado
    transSliderX.addEventListener( 'input', updateTranslation )
    transSliderY.addEventListener( 'input', updateTranslation )
    transSliderZ.addEventListener( 'input', updateTranslation )  
    rotSliderX.addEventListener( 'input', updateRotation )
    rotSliderY.addEventListener( 'input', updateRotation )
    rotSliderZ.addEventListener( 'input', updateRotation )
    //leo los valores de los sliders de traslacion y los uso para settear la traslacion del objeto seleccionado
    function updateTranslation() {
        sceneObjects[25+parseFloat( selectedObject.value )].setPosition( parseFloat( transSliderX.value ), 
                                                                        parseFloat( transSliderY.value ), 
                                                                        parseFloat( transSliderZ.value ) )
        sceneObjects[25+parseFloat( selectedObject.value )].updateModelMatrix()

    }
    //leo los valores de los sliders de rotacion y los uso para settear la rotacion del objeto seleccionado
    function updateRotation() {
        sceneObjects[25+parseFloat( selectedObject.value )].setRotation( parseFloat( rotSliderX.value ), 
                                                                        parseFloat( rotSliderY.value ), 
                                                                        parseFloat( rotSliderZ.value ) )
        sceneObjects[25+parseFloat( selectedObject.value )].updateModelMatrix()
    }

    //control de la camara
    camPhiSlider.addEventListener( 'input', ( event ) => { camera.phi = toRadians( event.target.valueAsNumber ) } )
    camThetaSlider.addEventListener( 'input', ( event ) => { camera.theta = toRadians( event.target.valueAsNumber ) } )
    camRadiusSlider.addEventListener( 'input', ( event ) => { camera.radius = event.target.valueAsNumber } )
    camFovSlider.addEventListener( 'input', ( event ) => { camera.setFov( toRadians( event.target.valueAsNumber ) ) } )


    //controlo los colores de la luz seleccionada
    lightRedSlider.addEventListener( 'input', updateLightColor )
    lightGreenSlider.addEventListener( 'input', updateLightColor )
    lightBlueSlider.addEventListener( 'input', updateLightColor )
    //leo los valores de los sliders de color y los uso para settear el color de la luz seleccionada
    function updateLightColor() {
        sceneLights[parseFloat(selectedObject.value)].color = [parseFloat(lightRedSlider.value),
                                                                parseFloat(lightGreenSlider.value),
                                                                parseFloat(lightBlueSlider.value)]
    }
    
    //actualizo los sliders de la camara con los valores de la camara
    function updateCamSliders() {
        camPhiSlider.value = toDegrees( camera.phi )
        camThetaSlider.value = toDegrees( camera.theta )
        camRadiusSlider.value = camera.radius
        camFovSlider.value = toDegrees( camera.getFov() )
    }

    //le doy la posicion inicial a los sliders
    updateObjectSliders()
    updateCamSliders()

    //Posicion inicial de los objetos luz
    light0obj.setPosition(-5.0,7.0,5.0)
    light0obj.updateModelMatrix()
    light1obj.setPosition(5.0,7.0,-5.0)
    light1obj.updateModelMatrix()

    
    // #️⃣ Iniciamos el render-loop 🎬
    //contador de frames
    const fpsElem = document.getElementById( 'fps' )
    let then = 0
    requestAnimationFrame(render)

    function render(now) {
         now *= 0.001;                          // convert to seconds
        const deltaTime = now - then;          // compute time since last frame
        then = now;                            // remember time for next frame
        const fps = 1 / deltaTime;             // compute frames per second
        fpsElem.value = fps.toFixed(1);  // update fps display
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
        if(camaraAutomatica){
            camera.arcHorizontally(deltaTime)
        }

        if(selectedTarget.value == 'centro'){
            camera.setTarget([0,0,0])        
        }
        if(selectedTarget.value == 'Luz1'){
            camera.setTarget(light0obj.position)        
        }
        if(selectedTarget.value == 'Luz2'){
            camera.setTarget(light1obj.position)        
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

        /// Solicitamos el proximo frame
        updateObjectSliders()
        updateCamSliders()
        requestAnimationFrame( render )
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
                        sceneObjects[i*6+j]=new SceneObject( gl, esferaGeometry, woodMaterial, [],false )
                        sceneObjects[i*6+j].setPosition(3*i-4.0,0.0,3*j-6.0)
                        sceneObjects[i*6+j].updateModelMatrix() 
                        
                }
                if(i==2){
                        sceneObjects[i*6+j]=new SceneObject(gl, esferaGeometry, esferaGoldMaterial, [esferaGoldTexture,esferaGoldSpec,esferaGoldTextureNormal], false)
                        sceneObjects[i*6+j].setPosition(3*i-4.0,0.0,3*j-6.0)
                        sceneObjects[i*6+j].updateModelMatrix()       
                }
                if(i==3){
                        sceneObjects[i*6+j]=new SceneObject(gl, esferaGeometry, esferaMercurioMaterial, [esferaMercurio,esferaMercurioNormal], false)
                        sceneObjects[i*6+j].setPosition(3*i-4.0,0.0,3*j-6.0)
                        sceneObjects[i*6+j].updateModelMatrix()

                }
            }
        }

    }   


}
                        
