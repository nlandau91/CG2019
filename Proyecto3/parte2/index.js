// 📥 Imports
import { mat4, vec4 } from '/libs/gl-matrix/index.js'
import { getFileContentsAsText, toRadians, toDegrees, loadImage } from '/libs/utils.js'
import { Program, Material, Geometry, SceneObject, SceneLight, Camera, CameraMouseControls } from '/libs/gl-engine/index.js'
import { parse } from '/libs/gl-engine/parsers/obj-parser.js'

main()

async function main() {

    // #️⃣ Cargamos assets a usar ( modelos, codigo de shaders, etc )

    const graneroGeometryData = await parse( '/models/granero.obj' )
    const ufoGeometryData = await parse( '/models/ufo.obj' )
    const alienGeometryData = await parse( '/models/alien_demon.obj' )
    const planoGeometryData = await parse( '/models/plano.obj' )
    const tractorGeometryData = await parse( '/models/tractor.obj' )
    const siloGeometryData = await parse( '/models/silo.obj' )
    const skyGeometryData = await parse( '/models/dome.obj' )
    const lanternGeometryData = await parse( '/models/lantern.obj' )

    const phongTVertexShaderSource = await getFileContentsAsText( '/shaders/phongT.vert.glsl' )
    const phongTFragmentShaderSource = await getFileContentsAsText( '/shaders/phongT.frag.glsl' )

    const phongTNVertexShaderSource = await getFileContentsAsText( '/shaders/phongTN.vert.glsl' )
    const phongTNFragmentShaderSource = await getFileContentsAsText( '/shaders/phongTN.frag.glsl' )

    const ufoVertexShaderSource = await getFileContentsAsText( '/shaders/ufo.vert.glsl' )
    const ufoFragmentShaderSource = await getFileContentsAsText( '/shaders/ufo.frag.glsl' )

    const TexturaVertexShaderSource = await getFileContentsAsText( '/shaders/Textura.vert.glsl' )
    const TexturaFragmentShaderSource = await getFileContentsAsText( '/shaders/Textura.frag.glsl' )

    const alienVertexShaderSource = await getFileContentsAsText( '/shaders/alien.vert.glsl' )
    const alienFragmentShaderSource = await getFileContentsAsText( '/shaders/alien.frag.glsl' )

    // #️⃣ Configuracion base de WebGL

    const canvas = document.getElementById( 'webgl-canvas' )
    const gl = canvas.getContext( 'webgl2' )

    gl.clearColor( 0.1, 0.18, 0.18, 1 )
    gl.enable( gl.DEPTH_TEST )

    // #️⃣ Creamos la camara y sus controles

    const camera = new Camera()
    const cameraMouseControls = new CameraMouseControls( camera, canvas )

    //Cargamos las imagenes y creamos las texturas

    const planoTexture = gl.createTexture()
    const graneroTexture = gl.createTexture()
    const graneroNormalMap = gl.createTexture()
    const tractorTexture = gl.createTexture()
    const tractorNormalMap = gl.createTexture()
    const siloTexture = gl.createTexture()
    const siloNormalMap = gl.createTexture()
    const alienTextureColor = gl.createTexture()
    const alienTextureAmbient = gl.createTexture()
    const alienTextureNormal = gl.createTexture()
    const ufoTextureDiffuse = gl.createTexture()
    const ufoTextureSpecular = gl.createTexture()
    const ufoTextureNormal = gl.createTexture()
    const ufoTextureGlow = gl.createTexture()
    const skyTexture = gl.createTexture()
    const lanternTextureDiffuse = gl.createTexture()
    const lanternTextureNormal = gl.createTexture()
    const lanternTextureGlow = gl.createTexture()
    const lanternTextureSpecular = gl.createTexture()
    
    armarTextura(planoTexture, await loadImage('textures/grass1.jpg'))
    armarTextura(graneroTexture, await loadImage('textures/granero.jpeg'))
    armarTextura(graneroNormalMap, await loadImage('textures/granero_normal.jpg'))
    armarTextura(tractorTexture, await loadImage('textures/tractor.jpeg'))
    armarTextura(tractorNormalMap, await loadImage('textures/tractor_normal.jpg'))
    armarTextura(siloTexture, await loadImage('textures/silo.jpeg'))
    armarTextura(siloNormalMap, await loadImage('textures/silo_normal.jpg'))
    armarTextura(alienTextureColor, await loadImage('textures/alien_monster1_color.jpg'))
    armarTextura(alienTextureAmbient, await loadImage('textures/alien_monster1_ambient.jpg'))
    armarTextura(alienTextureNormal, await loadImage('textures/alien_monster1_normal.jpg'))
    armarTextura(ufoTextureDiffuse, await loadImage('textures/ufo_diffuse_fixed.jpg'))
    armarTextura(ufoTextureSpecular, await loadImage('textures/ufo_spec.jpg'))
    armarTextura(ufoTextureNormal, await loadImage('textures/ufo_normal.jpg'))
    armarTextura(ufoTextureGlow, await loadImage('textures/ufo_diffuse_glow_fixed.jpg'))
    armarTextura(skyTexture, await loadImage('textures/soleado.jpg'))
    armarTextura(lanternTextureDiffuse, await loadImage('textures/lantern_color.jpg'))
    armarTextura(lanternTextureNormal, await loadImage('textures/lantern_normal.jpg'))
    armarTextura(lanternTextureGlow,  await loadImage('textures/lantern_ambient.jpg'))
    armarTextura(lanternTextureSpecular, await loadImage('textures/lantern_specular.jpg'))


    // #️⃣ Geometrias disponibles

    const graneroGeometry = new Geometry( gl, graneroGeometryData )
    const ufoGeometry = new Geometry( gl, ufoGeometryData )
    const alienGeometry = new Geometry( gl, alienGeometryData )
    const planoGeometry = new Geometry( gl, planoGeometryData )
    const tractorGeometry = new Geometry( gl, tractorGeometryData )
    const siloGeometry = new Geometry( gl, siloGeometryData )
    const skyGeometry = new Geometry( gl, skyGeometryData )
    const lanternGeometry = new Geometry( gl, lanternGeometryData)

    // #️⃣ Programas de shaders disponibles

    const phongTProgram = new Program( gl, phongTVertexShaderSource, phongTFragmentShaderSource )
    const phongTNProgram = new Program( gl, phongTNVertexShaderSource, phongTNFragmentShaderSource )
    const ufoProgram = new Program( gl, ufoVertexShaderSource, ufoFragmentShaderSource )
    const TexturaProgram = new Program( gl, TexturaVertexShaderSource, TexturaFragmentShaderSource )
    const alienProgram = new Program( gl, alienVertexShaderSource, alienFragmentShaderSource )

    // #️⃣ Creamos materiales combinando programas con distintas propiedades

    const planoMaterial = new Material( phongTProgram, true, true, { texture0: 0, shininess: 0.0} )
    const graneroMaterial = new Material( phongTNProgram, true, true, { texture0: 0, texture1: 1, shininess: 0.0} )
    const tractorMaterial = new Material( phongTNProgram, true, true, { texture0: 0, texture1: 1, shininess: 27.0} )
    const siloMaterial = new Material( phongTNProgram, true, true, { texture0: 0, texture1: 1, shininess: 35.0} )
    const ufoMaterial = new Material( ufoProgram, true, true, { texture0: 0, texture1: 1, texture2: 2, texture3 : 3, m: 0.2, f0: 0.9} )
    const alienMaterial = new Material( alienProgram, true, true, { texture0: 0, texture1: 1, texture2 : 2, shininess: 96.078431} )
    const skyMaterial = new Material( TexturaProgram, false, true, { texture0: 0} )
    const lanternMaterial = new Material( ufoProgram, true, true, {texture0: 0, texture1: 1, texture2: 2, texture3 : 3, m: 0.2, f0: 0.9})

    // #️⃣ Creamos los objetos de la escena

    const granero = new SceneObject( gl, graneroGeometry, graneroMaterial, [graneroTexture, graneroNormalMap], false )
    const tractor = new SceneObject( gl, tractorGeometry, tractorMaterial, [tractorTexture, tractorNormalMap], false )
    const silo = new SceneObject( gl, siloGeometry, siloMaterial, [siloTexture, siloNormalMap], false )
    const ufo = new SceneObject( gl, ufoGeometry, ufoMaterial, [ufoTextureDiffuse, ufoTextureSpecular, ufoTextureNormal, ufoTextureGlow], false )
    const sky = new SceneObject( gl, skyGeometry, skyMaterial, [skyTexture], false )
    const alien = new SceneObject( gl, alienGeometry, alienMaterial, [alienTextureColor, alienTextureAmbient, alienTextureNormal], false )
    const plano = new SceneObject( gl, planoGeometry, planoMaterial, [planoTexture], false )
    const lantern = new SceneObject( gl, lanternGeometry, lanternMaterial, [lanternTextureDiffuse, lanternTextureSpecular, lanternTextureNormal, lanternTextureGlow], false )

    const sceneObjects = [alien, ufo, plano, granero, tractor, silo, sky, lantern ]


    const lightUfo = new SceneLight( [0.0, 5.0, 0.0, 1.0], [0.0, 0.3, 0.0], [0.0, -1.0, 0.0, 0.0], Math.cos(toRadians(25)), ufo )
    lightUfo.quadratic_attenuation = 0.02
    const lightLantern = new SceneLight( [0.0, 1.75, 1.35, 1.0], [255/255, 132/255, 0/255], [-0.2, -1.0, 0.0, 0.0],  -1.0, lantern ) //1900k luz de vela
    lightLantern.linear_attenuation = 1.0
    const lightDirectional = new SceneLight( [0.5, -1.0, -1.0, 0.0], [0.5*255/255,0.5*236/255,0.5*219/255], [0.5, -1.0, 0.0, 0.0], -1.0 )

    const sceneLights = [lightUfo, lightLantern, lightDirectional]

    // 🎛 Setup de sliders

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
    const selectedLight = document.getElementById('select1')
    const lightRedSlider = document.getElementById( 'slider10')
    const lightGreenSlider = document.getElementById( 'slider11')
    const lightBlueSlider = document.getElementById( 'slider12')
    const btnFocoCentro = document.getElementById( 'btnFocoCentro')
    const btnFocoAlien = document.getElementById( 'btnFocoAlien')
    const btnFocoUfo= document.getElementById( 'btnFocoUfo')
    const btnDiaSoleado = document.getElementById( 'btnDiaSoleado' )
    const btnDiaNublado = document.getElementById( 'btnDiaNublado' )
    const btnAtardecer = document.getElementById( 'btnAtardecer' )
    const btnNoche = document.getElementById( 'btnNoche' )

    btnDiaSoleado.addEventListener( 'click' ,async () => {
        armarTextura(skyTexture,await loadImage('textures/soleado.jpg'))
        lightDirectional.position = [0.5, -1.0, -1.0, 0.0]
        lightDirectional.color = [0.5*255/255,0.5*236/255,0.5*219/255] //5400k
    })
    btnDiaNublado.addEventListener( 'click' ,async () => {
        armarTextura(skyTexture,await loadImage('textures/nublado.jpg'))
        lightDirectional.position = [0.5, -1.0, -1.0, 0.0]
        lightDirectional.color = [0.5*230/255,0.5*235/255,0.5*255/255] //7500k 
    })
    btnAtardecer.addEventListener( 'click' ,async() => {
        armarTextura(skyTexture,await loadImage('textures/atardecer.jpg'))
        lightDirectional.position = [0.5, -0.1, -1.0, 0.0]
        lightDirectional.color = [0.5*255/255,0.5*177/255,0.5*110/255] //3000k
    })
    btnNoche.addEventListener( 'click' ,async () => {
        armarTextura(skyTexture,await loadImage('textures/noche.jpg'))
        lightDirectional.position = [0.0, -1.0, 0.0, 0.0]
        lightDirectional.color = [0.01*210/255,0.01*223/255,0.01*255/255] //9000k
    })

    btnFocoCentro.addEventListener( 'click', () => {camera.setTarget([0,0,0])})
    btnFocoAlien.addEventListener( 'click', () => {camera.setTarget(alien.position)})
    btnFocoUfo.addEventListener( 'click', () => {camera.setTarget(ufo.position)})

    selectedObject.addEventListener( 'input', updateObjectSliders )

    transSliderX.addEventListener( 'input', updateTranslation )
    transSliderY.addEventListener( 'input', updateTranslation )
    transSliderZ.addEventListener( 'input', updateTranslation )
    
    rotSliderX.addEventListener( 'input', updateRotation )
    rotSliderY.addEventListener( 'input', updateRotation )
    rotSliderZ.addEventListener( 'input', updateRotation )

    camPhiSlider.addEventListener( 'input', ( event ) => { camera.phi = toRadians( event.target.valueAsNumber ) } )
    camThetaSlider.addEventListener( 'input', ( event ) => { camera.theta = toRadians( event.target.valueAsNumber ) } )
    camRadiusSlider.addEventListener( 'input', ( event ) => { camera.radius = event.target.valueAsNumber } )
    camFovSlider.addEventListener( 'input', ( event ) => { camera.setFov( toRadians( event.target.valueAsNumber ) ) } )

    selectedLight.addEventListener( 'input', updateLightSliders )

    lightRedSlider.addEventListener( 'input', updateLightColor )
    lightGreenSlider.addEventListener( 'input', updateLightColor )
    lightBlueSlider.addEventListener( 'input', updateLightColor )

    function updateLightColor() {
        sceneLights[parseFloat(selectedLight.value)].color = [parseFloat(lightRedSlider.value),
                                                                parseFloat(lightGreenSlider.value),
                                                                parseFloat(lightBlueSlider.value)]
    }
       
    function updateLightSliders() {
        let luz = sceneLights[parseFloat( selectedLight.value )]
        lightRedSlider.value = luz.color[0]
        lightGreenSlider.value = luz.color[1]
        lightBlueSlider.value = luz.color[2]
    }

    function updateObjectSliders() {
        let objeto = sceneObjects[parseFloat( selectedObject.value )]
        rotSliderX.value = objeto.rotation[0]
        rotSliderY.value = objeto.rotation[1]
        rotSliderZ.value = objeto.rotation[2]
        transSliderX.value = objeto.position[0]
        transSliderY.value = objeto.position[1]
        transSliderZ.value = objeto.position[2]
    }

    function updateTranslation() {
        sceneObjects[parseFloat( selectedObject.value )].setPosition( parseFloat( transSliderX.value ), 
                                                                        parseFloat( transSliderY.value ), 
                                                                        parseFloat( transSliderZ.value ) )
        sceneObjects[parseFloat( selectedObject.value )].updateModelMatrix()
    }
    function updateRotation() {
        sceneObjects[parseFloat( selectedObject.value )].setRotation( parseFloat( rotSliderX.value ), 
                                                                        parseFloat( rotSliderY.value ), 
                                                                        parseFloat( rotSliderZ.value ) )
        sceneObjects[parseFloat( selectedObject.value )].updateModelMatrix()
    }

    function updateCamSliders() {
        camPhiSlider.value = toDegrees( camera.phi )
        camThetaSlider.value = toDegrees( camera.theta )
        camRadiusSlider.value = camera.radius
        camFovSlider.value = toDegrees( camera.getFov() )
    }

    updateObjectSliders()
    updateCamSliders()
    updateLightSliders()

    // #️⃣ Posicion inicial de cada objeto

    granero.setPosition( 0.0, 0.0, 0.0 )
    granero.updateModelMatrix()

    silo.setPosition( 4.0, 0.0, 0.0 )
    silo.updateModelMatrix()

    tractor.setPosition( -2.0, 0.0, 1.0 )
    tractor.updateModelMatrix()

    ufo.setPosition( 0.0, 5.0, 0.0 )
    ufo.updateModelMatrix()

    alien.setPosition( 0.0, 0.0, 2.0 )
    alien.updateModelMatrix()

    lantern.setPosition (0.0, 1.75, 1.35)
    lantern.setRotation(0,90,0)
    lantern.updateModelMatrix()
    //contador de frames
    const fpsElem = document.getElementById( 'fps' )
    let then = 0

    // #️⃣ Iniciamos el render-loop 🎬

    requestAnimationFrame( render )

    function render(now) {
        now *= 0.001;                          // convert to seconds
        const deltaTime = now - then;          // compute time since last frame
        then = now;                            // remember time for next frame
        const fps = 1 / deltaTime;             // compute frames per second
        fpsElem.value = fps.toFixed(1);  // update fps display
        // Actualizacion de matrices de cada objeto
        for ( let object of sceneObjects ) {
            mat4.multiply( object.modelViewMatrix, camera.viewMatrix, object.modelMatrix )
            mat4.invert( object.normalMatrix, object.modelViewMatrix )
            mat4.transpose( object.normalMatrix, object.normalMatrix )

            /* 📝
             Si ademas de la camara, los objetos tambien tuviesen algun tipo de movimiento ( o animacion ), tambien tendriamos
             que actualizar la 'modelMatrix' de cada uno.
             */
        }

        // Limpiamos buffers de color y profundidad del canvas antes de empezar a dibujar los objetos de la escena
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )

        // Dibujamos los objetos de la escena
        for ( let object of sceneObjects ) {
            // Seteamos el programa a usar
            object.material.program.use()

            // Actualizamos los uniforms a usar ( provenientes de la camara, el objeto, material y fuentes de luz )
            object.material.program.setUniformValue( 'viewMatrix', camera.viewMatrix )
            object.material.program.setUniformValue( 'projectionMatrix', camera.projectionMatrix )
            object.material.program.setUniformValue( 'modelMatrix', object.modelMatrix )
            object.material.program.setUniformValue( 'modelViewMatrix', object.modelViewMatrix )
            object.material.program.setUniformValue( 'normalMatrix', object.normalMatrix )
            

            for ( let name in object.material.properties ) {
                const value = object.material.properties[name]
                object.material.program.setUniformValue( 'material.' + name, value )
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
                    let lightPosEye = vec4.create()
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
                object.material.program.setUniformValue( 'numLights', i )
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
            gl.drawElements( object.drawMode, object.indexBuffer.size, object.indexBuffer.dataType, 0 )
        }

        // Solicitamos el proximo frame
        updateObjectSliders()
        updateCamSliders()
        updateLightSliders()
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

}
