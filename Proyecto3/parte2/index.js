// 📥 Imports
import { mat4, vec4, vec3 } from '/libs/gl-matrix/index.js'
import { getFileContentsAsText, toRadians, toDegrees } from '/libs/utils.js'
import { Program, Material, Geometry, SceneObject, SceneLight, Camera, CameraMouseControls } from '/libs/gl-engine/index.js'
import { parse } from '/libs/gl-engine/parsers/obj-parser.js'

main()

async function main() {

    // #️⃣ Cargamos assets a usar ( modelos, codigo de shaders, etc )

    const graneroGeometryData = await parse( '/models/granero.obj' )
    const ufoGeometryData = await parse( '/models/ufo2.obj' )
    const alienGeometryData = await parse( '/models/alien_demon.obj' )
    const planoGeometryData = await parse( '/models/plano.obj' )
    const tractorGeometryData = await parse( '/models/tractor.obj' )
    const siloGeometryData = await parse( '/models/silo.obj' )

    const basicVertexShaderSource = await getFileContentsAsText( '/shaders/basic.vert.glsl' )
    const basicFragmentShaderSource = await getFileContentsAsText( '/shaders/basic.frag.glsl' )
    const normalsVertexShaderSource = await getFileContentsAsText( '/shaders/normals.vert.glsl' )
    const normalsFragmentShaderSource = await getFileContentsAsText( '/shaders/normals.frag.glsl' )
    const diffuseVertexShaderSource = await getFileContentsAsText( '/shaders/diffuse.vert.glsl' )
    const diffuseFragmentShaderSource = await getFileContentsAsText( '/shaders/diffuse.frag.glsl' )
    const phongVertexShaderSource = await getFileContentsAsText( '/shaders/phong.vert.glsl' )
    const phongFragmentShaderSource = await getFileContentsAsText( '/shaders/phong.frag.glsl' )
    const phongTVertexShaderSource = await getFileContentsAsText( '/shaders/phongT.vert.glsl' )
    const phongTFragmentShaderSource = await getFileContentsAsText( '/shaders/phongT.frag.glsl' )

    // #️⃣ Configuracion base de WebGL

    const canvas = document.getElementById( 'webgl-canvas' )
    const gl = canvas.getContext( 'webgl2' )

    gl.clearColor( 0.1, 0.18, 0.18, 1 )
    gl.enable( gl.DEPTH_TEST )

    // #️⃣ Creamos la camara y sus controles

    const camera = new Camera()
    const cameraMouseControls = new CameraMouseControls( camera, canvas )

    //creo las texturas
    const planoTexture = gl.createTexture() //crear objeto textura
    planoTexture.image = new Image() // cargar imagen
    planoTexture.image.onload = function () {
        handleLoadedTexture( planoTexture )
    }
    planoTexture.image.src = 'textures/grass1.jpg'

    const graneroTexture = gl.createTexture()
    graneroTexture.image = new Image()
    graneroTexture.image.onload = function() {
        handleLoadedTexture( graneroTexture )
    }
    graneroTexture.image.src = 'textures/granero.jpeg'

    const tractorTexture = gl.createTexture()
    tractorTexture.image = new Image()
    tractorTexture.image.onload = function() {
        handleLoadedTexture( tractorTexture )
    }
    tractorTexture.image.src = 'textures/tractor.jpeg'

    const siloTexture = gl.createTexture()
    siloTexture.image = new Image()
    siloTexture.image.onload = function() {
        handleLoadedTexture( siloTexture )
    }
    siloTexture.image.src = 'textures/silo.jpeg'

    const ufoTexture = gl.createTexture()
    ufoTexture.image = new Image()
    ufoTexture.image.onload = function() {
        handleLoadedTexture( ufoTexture )
    }
    ufoTexture.image.src = 'textures/ufo_diffuse.png'

    const alienTexture = gl.createTexture()
    alienTexture.image = new Image()
    alienTexture.image.onload = function() {
        handleLoadedTexture( alienTexture )
    }
    alienTexture.image.src = 'textures/alien_monster1_color.jpeg'

    // #️⃣ Geometrias disponibles

    const graneroGeometry = new Geometry( gl, graneroGeometryData )
    const ufoGeometry = new Geometry( gl, ufoGeometryData )
    const alienGeometry = new Geometry( gl, alienGeometryData )
    const planoGeometry = new Geometry( gl, planoGeometryData )
    const tractorGeometry = new Geometry( gl, tractorGeometryData )
    const siloGeometry = new Geometry( gl, siloGeometryData )

    // #️⃣ Programas de shaders disponibles

    const basicProgram = new Program( gl, basicVertexShaderSource, basicFragmentShaderSource )
    const normalsProgram = new Program( gl, normalsVertexShaderSource, normalsFragmentShaderSource )
    const diffuseProgram = new Program( gl, diffuseVertexShaderSource, diffuseFragmentShaderSource )
    const phongProgram = new Program( gl, phongVertexShaderSource, phongFragmentShaderSource )
    const phongTProgram = new Program( gl, phongTVertexShaderSource, phongTFragmentShaderSource )

    // #️⃣ Creamos materiales combinando programas con distintas propiedades

    const whiteBasicMaterial = new Material( basicProgram, false, { color: [1, 1, 1] } )
    const normalsMaterial = new Material( normalsProgram, false )
    const whiteDiffuseMaterial = new Material( diffuseProgram, true, { Ka: [0.1, 0.1, 0.1], Kd: [1, 1, 1] } )
    const phongMaterial = new Material( phongProgram, true, false, { Ka: [0.1, 0.1, 0.1], Kd: [0.4, 0.4, 0.4], Ks: [0.8, 0.8, 0.8], shininess: 50.0} )
    const planoMaterial = new Material( phongTProgram, true, true, { shininess: 50.0} )
    const graneroMaterial = new Material( phongTProgram, true, true, { shininess: 50.0} )
    const tractorMaterial = new Material( phongTProgram, true, true, { shininess: 50.0} )
    const siloMaterial = new Material( phongTProgram, true, true, { shininess: 50.0} )
    const ufoMaterial = new Material( phongTProgram, true, true, { shininess: 50.0} )
    const alienMaterial = new Material( phongTProgram, true, true, { shininess: 50.0} )

    // #️⃣ Creamos los objetos de la escena

    const granero = new SceneObject( gl, graneroGeometry, graneroMaterial, graneroTexture, false )
    const tractor = new SceneObject( gl, tractorGeometry, tractorMaterial, tractorTexture, false )
    const silo = new SceneObject( gl, siloGeometry, siloMaterial, siloTexture, false )
    const ufo = new SceneObject( gl, ufoGeometry, ufoMaterial, ufoTexture, false )
    const alien = new SceneObject( gl, alienGeometry, alienMaterial, alienTexture, false )
    const plano = new SceneObject( gl, planoGeometry, planoMaterial, planoTexture, false )

    const sceneObjects = [alien, ufo, plano, granero, tractor, silo ]


    const lightUfo1 = new SceneLight( [0.0, 5.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.2, -1.0, -0.2, 0.0], 0.5 )
    const lightUfo2 = new SceneLight( [0.0, 5.0, 0.0, 1.0], [0.0, 1.0, 0.0], [-0.2, -1.0, 0.0, 0.0], 0.5 )
    const lightUfo3 = new SceneLight( [0.0, 5.0, 0.0, 1.0], [0.0, 0.0, 1.0], [0.2, -1.0, 0.2, 0.0], 0.5 )
    const lightDirectional = new SceneLight( [0.0, -1.0, 0.0, 0.0], [0.2, 0.2, 0.2], [0.5, -1.0, 0.0, 0.0], -1.0 )

    const sceneLights = [lightUfo1, lightUfo2, lightUfo3, lightDirectional]

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
        sceneObjects[parseFloat( selectedObject.value )].setPosition( parseFloat( transSliderX.value ), parseFloat( transSliderY.value ), parseFloat( transSliderZ.value ) );
        sceneObjects[parseFloat( selectedObject.value )].updateModelMatrix();
    }
    function updateRotation() {
        sceneObjects[parseFloat( selectedObject.value )].setRotation( parseFloat( rotSliderX.value ), parseFloat( rotSliderY.value ), parseFloat( rotSliderZ.value ) );
        sceneObjects[parseFloat( selectedObject.value )].updateModelMatrix();
    }

    function updateCamSliders() {
        camPhiSlider.value = toDegrees( camera.phi )
        camThetaSlider.value = toDegrees( camera.theta )
        camRadiusSlider.value = camera.radius
        camFovSlider.value = toDegrees( camera.getFov() )
    }

    updateCamSliders()


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

    // #️⃣ Iniciamos el render-loop 🎬

    requestAnimationFrame( render )

    function render() {
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
                    let lightPosEye = vec4.create();
                    vec4.transformMat4( lightPosEye, light.position, camera.viewMatrix )
                    object.material.program.setUniformValue( 'light'+ i.toString() + '.position', lightPosEye )
                    object.material.program.setUniformValue( 'light'+ i.toString() + '.color', light.color )
                    
                    
                    let spotDirEye = vec4.create()
                    vec4.transformMat4( spotDirEye, light.spot_direction, camera.viewMatrix )
                    object.material.program.setUniformValue( 'light'+ i.toString() + '.spot_direction', spotDirEye )   

                    object.material.program.setUniformValue( 'light'+ i.toString() + '.spot_cutoff', light.spot_cutoff )
                    i++
                    
                }
            }          

            // Seteamos info de su geometria
            object.vertexArray.bind()
            
            //info de texturas
            if( object.material.textured ) {
                gl.activeTexture( gl.TEXTURE0 )
                gl.bindTexture( gl.TEXTURE_2D, object.texture )
                gl.uniform1i( object.material.program.program.samplerUniform, 0 )
            }
            // Lo dibujamos
            gl.drawElements( object.drawMode, object.indexBuffer.size, object.indexBuffer.dataType, 0 )
        }

        // Solicitamos el proximo frame
        requestAnimationFrame( render )
    }
    
    function handleLoadedTexture( texture ) {
        gl.bindTexture( gl.TEXTURE_2D, texture )
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true )
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image )
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST )
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST )
        //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE )
        //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE )
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT )
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT )
        gl.bindTexture( gl.TEXTURE_2D, null )
    }
}