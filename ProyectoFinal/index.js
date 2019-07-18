// 📥 Imports;
import { mat4, vec4, vec3 } from "/libs/gl-matrix/index.js";
import { getFileContentsAsText, toRadians, toSpherical, loadImage } from "/libs/utils.js";
import { Program, Material, Geometry, SceneObject, SceneLight, SphericalCamera, FpsCamera, FpsCameraControls, FrameBufferObject, IndexBuffer, FrameBuffer, VertexArray, VertexBuffer } from "/libs/gl-engine/index.js";
import { parse } from "/libs/gl-engine/parsers/obj-parser.js";

main();
var bajar = true;
var terminoX = false;
var terminoY = false;
var terminoZ = false;
var pulso = true;
var dentro = true;
var timer = 0;
var timerFantasma = 0;
var trampa = false
var irradiacion = 0;
var Voymitad1 = true;
var Voymitad2 = true;
var Voymitad3 = true;
var Voymitad4 = true;
var Voymitad5 = true;
var Voymitad6 = true;
var puertaAbierta = false;
var movFantasma = true;
//color luz
const colorx = 0.1;
const colory = 0.62;
const colorz = 1.0;
var effect = 1;
//Color de la luz que emiten las antorchas
const colorAnt = [0.5, 0.29, 0.0];
const colorLuzBicho = [0.0, 1.0, 0.066];

async function main() {

	const columnas = [];
	const antorchas = [];
	const bolsas = [];
	const barriles = [];
	const portaLanzas = [];
	const monedas = [];
	const rejas = [];
	const artorias = [];
	const diamantes = [];
	const lingotes = [];
	// #️⃣ Cargamos assets a usar ( modelos, codigo de shaders, etc )
	const fireBallGeometryData = await parse("/models/fireBall.obj");
	const pisoGeometryData = await parse("/models/piso.obj");
	const AntorchaGeometryData = await parse("/models/torch.obj");
	const techoGeometryData = await parse("/models/techo.obj");
	const paredGeometryData = await parse("/models/pared.obj");
	const pared2GeometryData = await parse("/models/pared2.obj");
	const cubeGeometryData = await parse("/models/cube.obj");
	const columnaGeometryData = await parse("/models/columna.obj");
	const barrilGeometryData = await parse("/models/barril.obj");
	const pedestalGeometryData = await parse("/models/pedestal.obj");
	const skullGeometryData = await parse("/models/skull.obj");
	const gateGeometryData = await parse("/models/gate.obj");
	const metalGateGeometryData = await parse("/models/metalGate.obj");

	const goldpileGeometryData = await parse("/models/goldpile.obj")


	const bolsaGeometryData = await parse("/models/bolsa.obj");
	const monedaGeometryData = await parse("/models/moneda.obj");
	const rejasGeometryData = await parse("/models/rejas.obj");
	const interruptorGeometryData = await parse("/models/interruptor.obj");

	//portalanzas
	const maderaGeometryData = await parse("/models/madera.obj");
	const lanza1GeometryData = await parse("/models/lanza1.obj");
	const lanza2GeometryData = await parse("/models/lanza2.obj");
	const lanza3GeometryData = await parse("/models/lanza3.obj");
	const lanza4GeometryData = await parse("/models/lanza4.obj");



	const artorias_malla_geometryData = await parse("/models/artorias_malla.obj");
	const artorias_armadura_geometryData = await parse("/models/artorias_armadura.obj");
	const artorias_casco_geometryData = await parse("/models/artorias_casco.obj");
	const artorias_tela_geometryData = await parse("/models/artorias_tela.obj");
	const artorias_espada_geometryData = await parse("/models/artorias_espada.obj");

	const diamondGeometryData = await parse("/models/diamond.obj");
	const goldIngotGeometryData = await parse("/models/goldIngot.obj");;

	const edgeDetectionPassVertexShaderSource = await getFileContentsAsText("/shaders/edgeDetectionPass.vert.glsl");
	const edgeDetectionPassFragmentShaderSource = await getFileContentsAsText("/shaders/edgeDetectionPass.frag.glsl");
	const multiplyVertexShaderSource = await getFileContentsAsText("/shaders/multiplyPass.vert.glsl");
	const multiplyFragmentShaderSource = await getFileContentsAsText("/shaders/multiplyPass.frag.glsl");
	const grayScalePassVertexShaderSource = await getFileContentsAsText("/shaders/grayscalePass.vert.glsl");
	const grayScalePassFragmentShaderSource = await getFileContentsAsText("/shaders/grayscalePass.frag.glsl");
	const colorVertexShaderSource = await getFileContentsAsText("/shaders/color.vert.glsl")
	const colorFragmentShaderSource = await getFileContentsAsText("/shaders/color.frag.glsl")
	const radialBlurPassVertexShaderSource = await getFileContentsAsText("/shaders/radialBlurPass.vert.glsl")
	const radialBlurPassFragmentShaderSource = await getFileContentsAsText("/shaders/radialBlurPass.frag.glsl")
	const additiveBlendingPassVertexShaderSource = await getFileContentsAsText("/shaders/additiveBlendingPass.vert.glsl")
	const additiveBlendingPassFragmentShaderSource = await getFileContentsAsText("/shaders/additiveBlendingPass.frag.glsl")
	const fireVertexShaderSource = await getFileContentsAsText("/shaders/fire.vs.glsl");
	const fireFragmentShaderSource = await getFileContentsAsText("/shaders/fire.fs.glsl");

	const fireRadVertexShaderSource = await getFileContentsAsText("/shaders/fireRadioactivo.vs.glsl");
	const fireRadFragmentShaderSource = await getFileContentsAsText("/shaders/fireRadioactivo.fs.glsl");

	const fireEnojadoVertexShaderSource = await getFileContentsAsText("/shaders/fireEnojado.vs.glsl");
	const fireEnojadoFragmentShaderSource = await getFileContentsAsText("/shaders/fireEnojado.fs.glsl");

	const shadowVertexShaderSource = await getFileContentsAsText("/shaders/Shadow.vs.glsl");
	const shadowFragmentShaderSource = await getFileContentsAsText("/shaders/Shadow.fs.glsl");

	const shadowMapGenVertexShaderSource = await getFileContentsAsText("/shaders/ShadowMapGen.vs.glsl");
	const shadowMapGenFragmentShaderSource = await getFileContentsAsText("/shaders/ShadowMapGen.fs.glsl");

	const phongTNVertexShaderSource = await getFileContentsAsText("/shaders/phongTN.vert.glsl");
	const phongTNFragmentShaderSource = await getFileContentsAsText("/shaders/phongTN.frag.glsl");

	const pickVertexShaderSource = await getFileContentsAsText("/shaders/pick.vert.glsl");
	const pickFragmentShaderSource = await getFileContentsAsText("/shaders/pick.frag.glsl");

	const shadowCookTorranceVertexShaderSource = await getFileContentsAsText("/shaders/ShadowCookTorrance.vs.glsl");
	const shadowCookTorranceFragmentShaderSource = await getFileContentsAsText("/shaders/ShadowCookTorranceGGX.fs.glsl");

	const varianteBVertexShaderSource = await getFileContentsAsText("/shaders/shaderB.vert.glsl");
	const varianteBFragmentShaderSource = await getFileContentsAsText("/shaders/shaderB.frag.glsl");

	const ghostVertexShaderSource = await getFileContentsAsText("/shaders/ghost.vs.glsl");
	const ghostFragmentShaderSource = await getFileContentsAsText("/shaders/ghost.fs.glsl");

	// #️⃣ Configuracion base de WebGL;

	const canvas = document.getElementById("webgl-canvas");

	//canvas.width = canvas.height
	const gl = canvas.getContext("webgl2");

	gl.clearColor(0.1, 0.18, 0.18, 1);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);

	// #️⃣ Creamos la camara y sus controles

	//const camera = new Camera();
	const camera = new FpsCamera();
	const CameraControls = new FpsCameraControls(camera, canvas);
	camera.setPosition(-14, 2, 0);
	camera.arcHorizontally(-1.6);
	var camaraAutomatica = 0;

	updateView(gl, canvas, camera)

	const offscreenCamera = new SphericalCamera();
	offscreenCamera.sphericalPosition.radius = 8;
	offscreenCamera.sphericalPosition.theta = 45;
	offscreenCamera.sphericalPosition.phi = 45;
	offscreenCamera.updateViewMatrix();
	offscreenCamera.updateProjectionMatrix();

	//Creamos el framebuffer del pick
	const fbo1 = new FrameBufferObject(gl, Math.floor(canvas.clientWidth * window.devicePixelRatio), Math.floor(canvas.clientHeight * window.devicePixelRatio));
	//Cargamos las imagenes y creamos las texturas

	const techoTextureAlbedo = gl.createTexture();
	const techoTextureNormal = gl.createTexture();
	const pisoTextureAlbedo = gl.createTexture();
	const pisoTextureNormal = gl.createTexture();
	const paredTextureAlbedo = gl.createTexture();
	const paredTextureNormal = gl.createTexture();
	const skyTexture = gl.createTexture();
	const antorchaTexture = gl.createTexture();
	const antorchaNormTexture = gl.createTexture();
	const antorchaMetallTexture = gl.createTexture();
	const barrilTexture = gl.createTexture();
	const barrilTextureNormal = gl.createTexture();

	const skullTexture = gl.createTexture();
	const skullTextureNormal = gl.createTexture();

	//portaEspadasyLanzas
	const maderaTexture = gl.createTexture();
	const maderaTextureNormal = gl.createTexture();
	const lanzaTexture = gl.createTexture();
	const lanzaTextureNormal = gl.createTexture();

	const humoTexture = gl.createTexture();
	const cellTexture = gl.createTexture();
	const waterDistortionTexture = gl.createTexture();

	const bolsaColorTexture = gl.createTexture();
	const bolsaNormalTexture = gl.createTexture();
	const monedaColorTexture = gl.createTexture();
	const monedaNormalTexture = gl.createTexture();
	const rejasColorTexture = gl.createTexture();
	const rejasNormalTexture = gl.createTexture();

	const pedestalTexture = gl.createTexture();
	const pedestalNormalTexture = gl.createTexture();


	const gateTexture = gl.createTexture();
	const gateNormalTexture = gl.createTexture();
	const ironTexture = gl.createTexture();

	const goldpileTextureColor = gl.createTexture();
	const goldpileTextureNormal = gl.createTexture();


	const artorias_armor_texture = gl.createTexture();
	const artorias_helmet_texture = gl.createTexture();
	const artorias_sword_texture = gl.createTexture();
	const artorias_skirt_texture = gl.createTexture();
	const artorias_chainmail_texture = gl.createTexture();

	const diamondTexture = gl.createTexture();
	const diamondNormalTexture = gl.createTexture();

	const goldIngotTexture = gl.createTexture();
	const goldIngotNormalTexture = gl.createTexture();

	armarTextura(goldpileTextureColor, await loadImage("/textures/goldpile_color.jpg"));
	armarTextura(goldpileTextureNormal, await loadImage("/textures/goldpile_normal.jpg"));

	armarTextura(bolsaNormalTexture, await loadImage("/textures/bolsa_normal.jpg"));
	armarTextura(bolsaColorTexture, await loadImage("/textures/bolsa_color.jpg"));
	armarTextura(monedaColorTexture, await loadImage("/textures/goldcoin_albedo.jpg"));
	armarTextura(monedaNormalTexture, await loadImage("/textures/goldcoin_normal.jpg"));

	armarTextura(rejasColorTexture, await loadImage("/textures/metal_color.jpg"));
	armarTextura(rejasNormalTexture, await loadImage("/textures/metal_normal.jpg"));


	armarTextura(techoTextureAlbedo, await loadImage("/textures/techo_albedo.jpg"));
	armarTextura(techoTextureNormal, await loadImage("/textures/techo_normal.jpg"));
	armarTextura(pisoTextureAlbedo, await loadImage("/textures/piso_albedo2.jpg"));
	armarTextura(pisoTextureNormal, await loadImage("/textures/piso_normal2.jpg"));
	armarTextura(paredTextureAlbedo, await loadImage("/textures/pared_albedo3.jpg"));
	armarTextura(paredTextureNormal, await loadImage("/textures/pared_normal3.jpg"));
	armarTextura(antorchaTexture, await loadImage("/textures/torchSpecular.png"));
	armarTextura(antorchaNormTexture, await loadImage("/textures/torchNormal.png"));
	armarTextura(antorchaMetallTexture, await loadImage("/textures/torchfbx_DefaultMaterial_AmbientOcclusion.png"));
	armarTextura(barrilTexture, await loadImage("/textures/barril.jpg"));
	armarTextura(barrilTextureNormal, await loadImage("/textures/barrilNormal.jpg"));
	//portalanza
	armarTextura(maderaTexture, await loadImage("/textures/madera.jpg"));
	armarTextura(maderaTextureNormal, await loadImage("/textures/maderaNormal.jpg"));
	armarTextura(lanzaTexture, await loadImage("/textures/lanza.jpg"));
	armarTextura(lanzaTextureNormal, await loadImage("/textures/lanzaNormal.jpg"));
	//Fuego
	armarTextura(humoTexture, await loadImage("/textures/noise1.jpg"));
	armarTextura(cellTexture, await loadImage("/textures/noise2.png"));
	armarTextura(waterDistortionTexture, await loadImage("/textures/WaterDistortion.jpg"));

	armarTextura(pedestalTexture, await loadImage("/textures/pedestal.jpg"));
	armarTextura(pedestalNormalTexture, await loadImage("/textures/pedestalNormal.jpg"));
	armarTextura(skullTexture, await loadImage("/textures/gold.jpg"));
	armarTextura(skullTextureNormal, await loadImage("/textures/goldNormal.jpg"));

	armarTextura(gateTexture, await loadImage("/textures/rocas.jpg"));
	armarTextura(gateNormalTexture, await loadImage("/textures/normalesRocas.png"));
	armarTextura(ironTexture, await loadImage("textures/iron.jpg"));

	armarTextura(artorias_armor_texture, await loadImage("textures/Mat_PlateArmor_Base_Color.png"));
	armarTextura(artorias_helmet_texture, await loadImage("textures/Mat_Helmet_Base_Color.png"));
	armarTextura(artorias_sword_texture, await loadImage("textures/Sword_albedo.jpg"));
	armarTextura(artorias_skirt_texture, await loadImage("textures/Mat_Skirt_Base_Color.png"));
	armarTextura(artorias_chainmail_texture, await loadImage("textures/Mat_Chainmail_Base_Color.png"));

	armarTextura(diamondTexture, await loadImage("textures/DiamondOutside_albedo.jpg"));
	armarTextura(diamondNormalTexture, await loadImage("textures/DiamondOutside_normal.png"));

	armarTextura(goldIngotTexture, await loadImage("textures/gold_albedo.jpg"));
	armarTextura(goldIngotNormalTexture, await loadImage("textures/gold_normal.jpg"));
	// #️⃣ Geometrias disponibles

	const techoGeometry = new Geometry(gl, techoGeometryData);
	const pisoGeometry = new Geometry(gl, pisoGeometryData);
	const paredGeometry = new Geometry(gl, paredGeometryData);
	const pared2Geometry = new Geometry(gl, pared2GeometryData);
	const cubeGeometry = new Geometry(gl, cubeGeometryData);
	const antorchaGeometry = new Geometry(gl, AntorchaGeometryData)
	const columnaGeometry = new Geometry(gl, columnaGeometryData);
	const barrilGeometry = new Geometry(gl, barrilGeometryData);
	//portalanzas
	const maderaGeometry = new Geometry(gl, maderaGeometryData);
	const lanza1Geometry = new Geometry(gl, lanza1GeometryData);
	const lanza2Geometry = new Geometry(gl, lanza2GeometryData);
	const lanza3Geometry = new Geometry(gl, lanza3GeometryData);
	const lanza4Geometry = new Geometry(gl, lanza4GeometryData);
	const fireBallGeometry = new Geometry(gl, fireBallGeometryData);
	const pedestalGeometry = new Geometry(gl, pedestalGeometryData);
	const skullGeometry = new Geometry(gl, skullGeometryData);
	const gateGeometry = new Geometry(gl, gateGeometryData);
	const metalGateGeometry = new Geometry(gl, metalGateGeometryData);

	const bolsaGeometry = new Geometry(gl, bolsaGeometryData);
	const monedaGeometry = new Geometry(gl, monedaGeometryData);
	const rejasGeometry = new Geometry(gl, rejasGeometryData);
	const interruptorGeometry = new Geometry(gl, interruptorGeometryData);

	const goldpileGeometry = new Geometry(gl, goldpileGeometryData);

	const artorias_malla_geometry = new Geometry(gl, artorias_malla_geometryData);
	const artorias_armadura_geometry = new Geometry(gl, artorias_armadura_geometryData);
	const artorias_casco_geometry = new Geometry(gl, artorias_casco_geometryData);
	const artorias_tela_geometry = new Geometry(gl, artorias_tela_geometryData);
	const artorias_espada_geometry = new Geometry(gl, artorias_espada_geometryData);
	const goldIngotGeometry = new Geometry(gl, goldIngotGeometryData);

	// #️⃣ Programas de shaders disponibles
	const ghostProgram = new Program(gl, ghostVertexShaderSource, ghostFragmentShaderSource);
	const multiplyPassProgram = new Program(gl, multiplyVertexShaderSource, multiplyFragmentShaderSource);
	const edgeDetectionPassProgram = new Program(gl, edgeDetectionPassVertexShaderSource, edgeDetectionPassFragmentShaderSource);
	const grayscalePassProgram = new Program(gl, grayScalePassVertexShaderSource, grayScalePassFragmentShaderSource);
	const colorProgram = new Program(gl, colorVertexShaderSource, colorFragmentShaderSource)
	const radialBlurPassProgram = new Program(gl, radialBlurPassVertexShaderSource, radialBlurPassFragmentShaderSource)
	const additiveBlendingPassProgram = new Program(gl, additiveBlendingPassVertexShaderSource, additiveBlendingPassFragmentShaderSource)
	const fireProgram = new Program(gl, fireVertexShaderSource, fireFragmentShaderSource);
	const fireRadioactivoProgram = new Program(gl, fireRadVertexShaderSource, fireRadFragmentShaderSource);
	const fireEnojadoProgram = new Program(gl, fireEnojadoVertexShaderSource, fireEnojadoFragmentShaderSource);
	const shadowProgram = new Program(gl, shadowVertexShaderSource, shadowFragmentShaderSource);
	const shadowMapGenProgram = new Program(gl, shadowMapGenVertexShaderSource, shadowMapGenFragmentShaderSource);
	const phongTNProgram = new Program(gl, phongTNVertexShaderSource, phongTNFragmentShaderSource);
	const pickProgram = new Program(gl, pickVertexShaderSource, pickFragmentShaderSource);
	const shadowCookTorranceProgram = new Program(gl, shadowCookTorranceVertexShaderSource, shadowCookTorranceFragmentShaderSource);
	const varianteBProgram = new Program(gl, varianteBVertexShaderSource, varianteBFragmentShaderSource);

	// #️⃣ Creamos materiales combinando programas con distintas propiedades
	const ghostMaterial = new Material(ghostProgram, true, true, { texture0: 0, texture1: 1 });
	const fireMaterial = new Material(fireProgram, true, true, { texture0: 0, texture1: 1, color1: [0.7294, 0.6, 0.078], color2: [1.0, 0.0, 0.0] });
	const fireMaterial2 = new Material(fireRadioactivoProgram, true, true, { texture0: 0, texture1: 1, color1: [0.1, 0.647058, 1.0], color2: [0.498, 0.8235, 1.0] });
	const fireEnojadoMaterial = new Material(fireEnojadoProgram, true, true, { texture0: 0, texture1: 1, color1: [0.0, 1.0, 0.066], color2: [0.7372, 1.0, 0.7568] });
	const techoMaterial = new Material(shadowCookTorranceProgram, true, true, { texture0: 1, texture1: 2, texture2: 3, m: 0.8, f0: 0.7, sigma: 0.8 });
	const pisoMaterial = new Material(shadowCookTorranceProgram, true, true, { texture0: 1, texture1: 2, texture2: 3, m: 0.3, f0: 0.7, sigma: 0.1 });
	const paredMaterial = new Material(shadowCookTorranceProgram, true, true, { texture0: 1, texture1: 2, texture2: 3, m: 0.4, f0: 0.7, sigma: 0.3 });
	const bolsaMaterial = new Material(shadowCookTorranceProgram, true, true, { texture0: 1, texture1: 2, texture2: 3, m: 0.9, f0: 0.03, sigma: 0.9 });
	const monedaMaterial = new Material(shadowCookTorranceProgram, true, true, { texture0: 1, texture1: 2, texture2: 3, m: 0.1, f0: 0.9, sigma: 0.0 });
	const rejasMaterial = new Material(shadowCookTorranceProgram, true, true, { texture0: 1, texture1: 2, texture2: 3, m: 0.2, f0: 0.9, sigma: 0.1 });
	const interruptorMaterial = new Material(shadowCookTorranceProgram, true, true, { texture0: 1, texture1: 2, texture2: 3, m: 0.4, f0: 0.7, sigma: 0.3 });
	const shadowCookTorranceMaterial = new Material(shadowCookTorranceProgram, true, true, { texture0: 1, texture1: 2, texture2: 3, m: 0.9, f0: 0.9, sigma: 0.0 });
	const skullMaterial = new Material(shadowCookTorranceProgram, true, true, { texture0: 1, texture1: 2, texture2: 3, m: 0.1, f0: 0.9, sigma: 0.0 })
    const goldpileMaterial = new Material(shadowCookTorranceProgram, true, true, { texture0: 1, texture1: 2, texture2: 3, m: 0.1, f0: 0.9, sigma: 0.9 })
    const barrilMaterial = new Material(shadowCookTorranceProgram, true, true, { texture0: 1, texture1: 2, texture2: 3, m: 0.1, f0: 0.3, sigma: 0.1 });
    const PortaLanzaMaterial = new Material(shadowCookTorranceProgram, true, true, { texture0: 1, texture1: 2, texture2: 3, m: 0.2, f0: 0.9, sigma: 0.3 });

	// #️⃣ Creamos los objetos de la escena
	const techo = new SceneObject(gl, techoGeometry, techoMaterial, [techoTextureAlbedo, techoTextureNormal]);
	const piso = new SceneObject(gl, pisoGeometry, pisoMaterial, [pisoTextureAlbedo, pisoTextureNormal]);
	const pared1 = new SceneObject(gl, paredGeometry, paredMaterial, [paredTextureAlbedo, paredTextureNormal]);
	const pared2 = new SceneObject(gl, pared2Geometry, paredMaterial, [paredTextureAlbedo, paredTextureNormal]);
	const pared3 = new SceneObject(gl, paredGeometry, paredMaterial, [paredTextureAlbedo, paredTextureNormal]);
	const pared4 = new SceneObject(gl, paredGeometry, paredMaterial, [paredTextureAlbedo, paredTextureNormal]);
	const goldpile = new SceneObject(gl, goldpileGeometry, goldpileMaterial, [goldpileTextureColor, goldpileTextureNormal]);

	pared1.position = [0, 0, 10]
	pared1.updateModelMatrix();
	pared3.position = [0, 0, -10]
	pared3.setRotation(0, 180, 0);
	pared3.updateModelMatrix();
	pared4.position = [10, 0, 0]
	pared4.setRotation(0, 90, 0);
	pared4.updateModelMatrix();

	//const esfera = new SceneObject(gl,esferaGeometry, esferaMaterial,[esferaTexture,esferaTextureNormal]);

	const interruptor = new SceneObject(gl, interruptorGeometry, interruptorMaterial, [paredTextureAlbedo, paredTextureNormal]);

	const fireLight1 = new SceneObject(gl, fireBallGeometry, fireMaterial, [humoTexture, waterDistortionTexture]);
	const fireluzAntorcha1 = new SceneObject(gl, fireBallGeometry, fireMaterial, [humoTexture, waterDistortionTexture]);
	const fireluzAntorcha2 = new SceneObject(gl, fireBallGeometry, fireMaterial, [humoTexture, waterDistortionTexture]);
	const fireluzAntorcha3 = new SceneObject(gl, fireBallGeometry, fireMaterial, [humoTexture, waterDistortionTexture]);
	const fireLightEntrada = new SceneObject(gl, fireBallGeometry, fireMaterial, [humoTexture, waterDistortionTexture]);
	const pedestal = new SceneObject(gl, pedestalGeometry, shadowCookTorranceMaterial, [pedestalTexture, pedestalNormalTexture]);
	const skull = new SceneObject(gl, skullGeometry, skullMaterial, [skullTexture, skullTextureNormal]);


	const gate = new SceneObject(gl, gateGeometry, shadowCookTorranceMaterial, [gateTexture, gateNormalTexture]);
	const metalGate = new SceneObject(gl, metalGateGeometry, shadowCookTorranceMaterial, [ironTexture]);
	const pared5 = new SceneObject(gl, pared2Geometry, paredMaterial, [paredTextureAlbedo, paredTextureNormal]);
	const pared6 = new SceneObject(gl, pared2Geometry, paredMaterial, [paredTextureAlbedo, paredTextureNormal]);
	//Entrada
	const pared7 = new SceneObject(gl, cubeGeometry, paredMaterial, [paredTextureAlbedo, paredTextureNormal]);
	const pared8 = new SceneObject(gl, cubeGeometry, paredMaterial, [paredTextureAlbedo, paredTextureNormal]);
	const pared9 = new SceneObject(gl, cubeGeometry, paredMaterial, [paredTextureAlbedo, paredTextureNormal]);
	//const pared10 = new SceneObject(gl,pared2Geometry, paredMaterial,[paredTextureAlbedo,paredTextureNormal]);
	const piso2 = new SceneObject(gl, pisoGeometry, pisoMaterial, [pisoTextureAlbedo, pisoTextureNormal]);
	const techo2 = new SceneObject(gl, cubeGeometry, techoMaterial, [techoTextureAlbedo, techoTextureNormal]);



	skull.setPosition(0.0, 1.1, 0.0);
	skull.updateModelMatrix();

	interruptor.setPosition(9.9, 1.52, 4);
	interruptor.rotateY(90);
	interruptor.updateModelMatrix();

	acomodarEntrada();

	crearLingotes();
	//crearDiamantes();

	fireLight1.setPosition(0, 0, 0);
	fireLight1.updateModelMatrix();
	let scaleMatrix = mat4.create();
	mat4.fromScaling(scaleMatrix, [0.3, 1.5, 0.3]);
	let matrix = fireLight1.modelMatrix;
	mat4.multiply(matrix, scaleMatrix, matrix);
	scaleMatrix = mat4.create();
	mat4.fromXRotation(scaleMatrix, toRadians(20));
	mat4.multiply(matrix, scaleMatrix, matrix);
	let translationMatrix = mat4.create();
	mat4.fromTranslation(translationMatrix, [-3, 2.175, -4.2105]);
	mat4.multiply(matrix, translationMatrix, matrix);

	fireluzAntorcha1.setPosition(0, 0, 0);
	fireluzAntorcha1.updateModelMatrix();
	scaleMatrix = mat4.create();
	mat4.fromScaling(scaleMatrix, [0.3, 1.5, 0.3]);
	matrix = fireluzAntorcha1.modelMatrix;
	mat4.multiply(matrix, scaleMatrix, matrix);
	scaleMatrix = mat4.create();
	mat4.fromXRotation(scaleMatrix, toRadians(-20));
	mat4.multiply(matrix, scaleMatrix, matrix);
	translationMatrix = mat4.create();
	mat4.fromTranslation(translationMatrix, [-3, 2.175, 4.2105]);
	mat4.multiply(matrix, translationMatrix, matrix);


	fireluzAntorcha2.setPosition(0, 0, 0);
	fireluzAntorcha2.updateModelMatrix();
	scaleMatrix = mat4.create();
	mat4.fromScaling(scaleMatrix, [0.3, 1.5, 0.3]);
	matrix = fireluzAntorcha2.modelMatrix;
	mat4.multiply(matrix, scaleMatrix, matrix);
	scaleMatrix = mat4.create();
	mat4.fromXRotation(scaleMatrix, toRadians(20));
	mat4.multiply(matrix, scaleMatrix, matrix);
	translationMatrix = mat4.create();
	mat4.fromTranslation(translationMatrix, [3, 2.175, -4.2105]);
	mat4.multiply(matrix, translationMatrix, matrix);


	fireluzAntorcha3.setPosition(0, 0, 0);
	fireluzAntorcha3.updateModelMatrix();
	scaleMatrix = mat4.create();
	mat4.fromScaling(scaleMatrix, [0.3, 1.5, 0.3]);
	matrix = fireluzAntorcha3.modelMatrix;
	mat4.multiply(matrix, scaleMatrix, matrix);
	scaleMatrix = mat4.create();
	mat4.fromXRotation(scaleMatrix, toRadians(-20));
	mat4.multiply(matrix, scaleMatrix, matrix);
	translationMatrix = mat4.create();
	mat4.fromTranslation(translationMatrix, [3, 2.175, 4.2105]);
	mat4.multiply(matrix, translationMatrix, matrix);

	techo.setPosition(0, 4.3, 0);
	techo.updateModelMatrix();

	CrearColumnasYAntorchas();
	CrearMonedasYBolsas();
	CrearRejas();


	const luz = new SceneObject(gl, fireBallGeometry, fireMaterial2, [humoTexture, waterDistortionTexture]);
	luz.setPosition(0, 0, 0);
	luz.updateModelMatrix();
	scaleMatrix = mat4.create();
	mat4.fromScaling(scaleMatrix, [0.2, 0.2, 0.2]);
	matrix = luz.modelMatrix;
	mat4.multiply(matrix, scaleMatrix, matrix);

	crearArtorias();
	const sceneObjects = [luz, fireLight1, fireluzAntorcha1, fireluzAntorcha2, fireluzAntorcha3, fireLightEntrada, piso, piso2, pared1,
		pared2, pared3, pared4, pared5, pared7, pared8, pared9, techo, interruptor, gate, metalGate, techo2, goldpile, skull, pedestal];
	sceneObjects.push.apply(sceneObjects, antorchas)
	sceneObjects.push.apply(sceneObjects, bolsas)
	sceneObjects.push.apply(sceneObjects, monedas)
	sceneObjects.push.apply(sceneObjects, columnas)
	sceneObjects.push.apply(sceneObjects, rejas);
	sceneObjects.push.apply(sceneObjects, artorias);
	//sceneObjects.push.apply(sceneObjects,diamantes);
	sceneObjects.push.apply(sceneObjects, lingotes);
	//en el CrearBarriles() le agrego los objetos al arreglo sceneObjets
	CrearBarriles();
	//en el CrearPortaLanzas() le agrego los objetos al arreglo sceneObjets
	CrearPortaLanzas();
	//Agrego los objetos que podran ser pickeados, estos tendran id > 0
	const pickableObjects = [luz];
	pickableObjects.push.apply(pickableObjects, barriles)
	pickableObjects.push(skull)
	pickableObjects.push.apply(pickableObjects, bolsas)
	pickableObjects.push.apply(pickableObjects, monedas)
	pickableObjects.push.apply(pickableObjects, lingotes);
	//Le asigno un id a cada objeto pickeable
	for (let i = 0; i < pickableObjects.length; i++) {
		pickableObjects[i].setId(i);
	}

	// #️⃣ Creamos las luces de la escena
	const light1 = new SceneLight([0.0, 0.0, -10.0, 1.0], [0.1, 0.62, 1.0], [0.0, -1.0, 0.0, 0.0], -1, luz);
	light1.linear_attenuation = 0.0;
	const luzAntorcha1 = new SceneLight([-3, 2.175, -4.2105, 1.0], [0.5, 0.29, 0], [0, -1, 0, 0], -1, null);
	luzAntorcha1.quadratic_attenuation = 0.5;
	const luzAntorcha2 = new SceneLight([-3, 2.175, 4.2105, 1.0], [0.5, 0.29, 0], [0, -1, 0, 0], -1, null);
	luzAntorcha2.quadratic_attenuation = 0.5;
	const luzAntorcha3 = new SceneLight([3, 2.175, -4.2105, 1.0], [0.5, 0.29, 0], [0, -1, 0, 0], -1, null);
	luzAntorcha3.quadratic_attenuation = 0.5;
	const luzAntorcha4 = new SceneLight([3, 2.175, 4.2105, 1.0], [0.5, 0.29, 0], [0, -1, 0, 0], -1, null);
	luzAntorcha4.quadratic_attenuation = 0.5;

	const luzEntrada = new SceneLight([-12, 2.52, 1.495, 1.0], [0.5, 0.29, 0], [0, -1, 0, 0], -1, null);
	luzEntrada.quadratic_attenuation = 1.5;
	const bichoLight = new SceneLight([0.0, 1.1, 0.0, 1.0], [0.0, 0.0, 0.0], [0.0, -1.0, 0.0, 0.0], -1, skull);
	bichoLight.linear_attenuation = 0.7;

	const cameraLight = new SphericalCamera()
	const cameraLViewMatrix = mat4.create();
	updateCamL();


	const sceneLights = [light1, luzAntorcha1, luzAntorcha2, luzAntorcha3, luzAntorcha4, luzEntrada, bichoLight];

	// 🎛 Setup de sliders y botones

	// Buscamos elementos en el DOM
	const selectedTextureSize = document.getElementById("select0");
	const selectedEffect = document.getElementById("selectEffect");
	const rotSliderX = document.getElementById("slider0");
	const rotSliderY = document.getElementById("slider1");
	const rotSliderZ = document.getElementById("slider2");
	const transSliderX = document.getElementById("slider3");
	const transSliderY = document.getElementById("slider4");
	const transSliderZ = document.getElementById("slider5");
	//Slider de antorchas
	const sliderA1 = document.getElementById("sliderA1");
	const sliderA2 = document.getElementById("sliderA2");
	const sliderA3 = document.getElementById("sliderA3");
	const sliderA4 = document.getElementById("sliderA4");
  const sliderA5 = document.getElementById("sliderA5");

	const btnMovFantasma = document.getElementById("btnMovFantasma");
	const selectedIlumination = document.getElementById("select2");

	const selectedShader = document.getElementById("select1");

	selectedTextureSize.addEventListener("input", () => {
		changeTextureSize();
	});
	selectedIlumination.addEventListener("input", () => {
		changeIlumination();
	});
	selectedEffect.addEventListener("input", () => {
		changeEffect();
	});
	btnMovFantasma.addEventListener("click", () => {
		movFantasma = !movFantasma;
		//timerFantasma = 90*1.2/0.001;
		timerFantasma = (1.2 / 0.001) * 90
		console.log(Math.sin(toRadians(1 / 1.2 * timerFantasma * 0.001)));
	});

	function changeEffect() {
		effect = parseFloat(selectedEffect.value);
		console.log(effect);
	}

	function changeTextureSize() {
		//console.log(parseFloat(selectedTextureSize.value));
		SHADOW_MAP_SIZE = parseFloat(selectedTextureSize.value);
		setTextureConfig();
	}
	function changeIlumination() {
		irradiacion = parseFloat(selectedIlumination.value);
		if (irradiacion == 0.0) light1.setColor([0.0, 0.62, 1.0]);
	}

	//leo los valores de los sliders de traslacion y los uso para settear la traslacion del objeto seleccionado
	function updateTranslation() {
		pickableObjects[parseFloat(selectedObject.value)].setPosition(parseFloat(transSliderX.value),
			parseFloat(transSliderY.value),
			parseFloat(transSliderZ.value))
		pickableObjects[parseFloat(selectedObject.value)].updateModelMatrix();
		updateCamL();
	};
	//leo los valores de los sliders de rotacion y los uso para settear la rotacion del objeto seleccionado
	function updateRotation() {
		pickableObjects[parseFloat(selectedObject.value)].setRotation(parseFloat(rotSliderX.value),
			parseFloat(rotSliderY.value),
			parseFloat(rotSliderZ.value))
		pickableObjects[parseFloat(selectedObject.value)].updateModelMatrix();
	};

	sliderA1.addEventListener("input", updateAntorcha1);
	sliderA2.addEventListener("input", updateAntorcha2);
	sliderA3.addEventListener("input", updateAntorcha3);
	sliderA4.addEventListener("input", updateAntorcha4);
  sliderA5.addEventListener("input", updateAntorcha5);

	function updateAntorcha1() {
		luzAntorcha1.color = [parseFloat(sliderA1.value) * colorAnt[0], parseFloat(sliderA1.value) * colorAnt[1], parseFloat(sliderA1.value) * colorAnt[2]];
	}
	function updateAntorcha2() {
		luzAntorcha2.color = [parseFloat(sliderA2.value) * colorAnt[0], parseFloat(sliderA2.value) * colorAnt[1], parseFloat(sliderA2.value) * colorAnt[2]];
	}
	function updateAntorcha3() {
		luzAntorcha3.color = [parseFloat(sliderA3.value) * colorAnt[0], parseFloat(sliderA3.value) * colorAnt[1], parseFloat(sliderA3.value) * colorAnt[2]];
	}
	function updateAntorcha4() {
		luzAntorcha4.color = [parseFloat(sliderA4.value) * colorAnt[0], parseFloat(sliderA4.value) * colorAnt[1], parseFloat(sliderA4.value) * colorAnt[2]];
	}
  function updateAntorcha5(){
    luzEntrada.color = [parseFloat(sliderA5.value) * colorAnt[0], parseFloat(sliderA5.value) * colorAnt[1], parseFloat(sliderA5.value) * colorAnt[2]];
  }

	//controlo los colores de la luz seleccionada
	//lightRedSlider.addEventListener( "input", updateLightColor );
	//lightGreenSlider.addEventListener( "input", updateLightColor );
	//lightBlueSlider.addEventListener( "input", updateLightColor );
	//leo los valores de los sliders de color y los uso para settear el color de la luz seleccionada
	//function updateLightColor() {
	//    sceneLights[parseFloat(selectedLight.value)].color = [parseFloat(lightRedSlider.value),
	//                                                            parseFloat(lightGreenSlider.value),
	//                                                            parseFloat(lightBlueSlider.value)];
	//};
	//;
	//actualizo los sliders de la camara con los valores de la camara
	// function updateCamSliders() {
	//     // camPhiSlider.value = toDegrees( camera.phi );
	//     // camThetaSlider.value = toDegrees( camera.theta );
	//     // camRadiusSlider.value = camera.radius;
	//     camFovSlider.value = toDegrees( camera.getFov() );
	// };
	// #️⃣ Fullscreen quad (dos triangulos)

	const quadDrawMode = gl.TRIANGLES

	const quadVertexBuffers = {
		vertexPosition: new VertexBuffer(gl, [-1, -1, 1, -1, 1, 1, -1, 1]),
		vertexTextureCoordinates: new VertexBuffer(gl, [0, 0, 1, 0, 1, 1, 0, 1])
	}
	const quadIndexBuffer = new IndexBuffer(gl, [0, 1, 2, 0, 2, 3])

	const quadVertexArray = new VertexArray(gl, radialBlurPassProgram, quadVertexBuffers, quadIndexBuffer)

	// #️⃣ Frame Buffers para renderizado offscreen

	const asUsualFrameBuffer = new FrameBuffer(gl, [canvas.width, canvas.height])
	const lightAndOccludingObjectsFrameBuffer = new FrameBuffer(gl, [canvas.width / 2, canvas.height / 2])
	const radialBlurPassFrameBuffer = new FrameBuffer(gl, [canvas.width / 2, canvas.height / 2], false)
	const grayscalePassFrameBuffer = new FrameBuffer(gl, [canvas.width, canvas.height], false);
	const edgeDetectionPassFrameBuffer = new FrameBuffer(gl, [canvas.width, canvas.height], false)

	function updateCamL() {
		cameraLight.radius = toSpherical(luz.position).radius;
		cameraLight.theta = toSpherical(luz.position).theta;
		cameraLight.phi = toSpherical(luz.position).phi;
		light1.setPosition([luz.position[0], luz.position[1], luz.position[2], 1]);
		cameraLight.setFov(90);
		cameraLight.setNear(5);
		cameraLight.setFar(20);
		mat4.lookAt(cameraLViewMatrix, luz.position, [0, 1.5, 0], [0, 1, 0])
	}

	//le doy la posicion inicial a los sliders
	//updateObjectSliders();
	//updateCamSliders();
	//updateLightSliders();

	// #️⃣ Posicion inicial de cada objeto

	//columna.setPosition(-3, 0, -5);
	//columna.updateModelMatrix();
	luz.setPosition(9.20, 1.52, -8.20);
	luz.updateModelMatrix();

	updateCamL();

	// define size and format of level 0
	let level = 0;
	let internalFormat = gl.DEPTH_COMPONENT16;
	let border = 0;
	let format = gl.DEPTH_COMPONENT;
	let type = gl.UNSIGNED_INT;
	let data = null;
	var SHADOW_MAP_SIZE = 1024

	/*FUNCIONAMIENTO SOMBRAS GLOBALES CON CUBEMAPS
	  La idea general del shadowmapping es poner una camara en la posicion de
	  la luz y guardar los valores de profundidad en una textura, que despues
	  sera usada al renderizar la escena.
	  El problema aparece con las luces puntuales. ¿A donde apuntamos la camara?
	  Con cubemaps se arregla. Hacemos que la camara apunte en 6 direcciones
	  distintas, una a la vez. Y en cada direccion genera una textura.
	  Luego, en el ciclo de renderizado normal, se obtiene el valor de la textura
	  del cubemap para cada vertice y se decide si se dibuja o no.
	*/

	//Creo el cubemap
	var shadowMapCube = gl.createTexture();
	var shadowMapFrameBuffer;
	var shadowMapRenderBuffer;
	setTextureConfig();

	const ext = gl.getExtension("EXT_color_buffer_float");
	if (!ext) {
		alert("need EXT_color_buffer_float");
		return;
	}



	//console.log(gl.UNSIGNED_INT);
	//Creo los arreglos con direcciones para cada cara del cubemap
	//Direcciones Target
	var ENV_CUBE_LOOK_DIR = [
		[1.0, 0.0, 0.0],
		[-1.0, 0.0, 0.0],
		[0.0, 1.0, 0.0],
		[0.0, -1.0, 0.0],
		[0.0, 0.0, 1.0],
		[0.0, 0.0, -1.0]
	];

	//Direcciones UP
	var ENV_CUBE_LOOK_UP = [
		[0.0, -1.0, 0.0],
		[0.0, -1.0, 0.0],
		[0.0, 0.0, 1.0],
		[0.0, 0.0, -1.0],
		[0.0, -1.0, 0.0],
		[0.0, -1.0, 0.0]
	];

	//Creo la matriz de proyeccion de la camara en la posicion de la luz
	var shadowMapProj = mat4.create();
	var shadowClipNearFar = [0.1, 30.0];
	mat4.perspective(shadowMapProj, toRadians(90), 1, shadowClipNearFar[0], shadowClipNearFar[1]);

	camera.radius = 35;;
	camera.theta = toRadians(-35);
	//contador de frames
	const fpsElem = document.getElementById("fps");
	let then = 0;

	// #️⃣ Iniciamos el render-loop 🎬

	var MoverLuz = 0;
	const ButtonMovLuz = document.getElementById("btnMovLuz");

	ButtonMovLuz.addEventListener("click", () => { MoverLuz = !MoverLuz });
	const start = new Date().getTime();
	var act = start - start;
	var osc = 0.0;
	requestAnimationFrame(render);

	function moverLuz() {

		if (!terminoX) {
			if (Math.abs(Math.trunc(luz.position[0] * 10.0) - Math.trunc(interruptor.position[0] * 10.0)) >= 7.0) {

				if (Math.trunc(luz.position[0] * 10.0) < Math.trunc(interruptor.position[0] * 10.0))
					luz.setPosition(luz.position[0] + 0.1, luz.position[1], luz.position[2]);
				else
					if (Math.trunc(luz.position[0] * 10.0) >= Math.trunc(interruptor.position[0] * 10.0))
						luz.setPosition(luz.position[0] - 0.1, luz.position[1], luz.position[2]);
			}
			else
				terminoX = true;
		}

		if (!terminoY) {
			if (Math.abs(Math.trunc(interruptor.position[1] * 10.0) - Math.trunc(luz.position[1] * 10.0)) > 1.0) {
				if (Math.trunc(luz.position[1] * 10.0) > Math.trunc(interruptor.position[1] * 10.0))
					luz.setPosition(luz.position[0], luz.position[1] - 0.1, luz.position[2]);
				else
					if (Math.trunc(luz.position[1] * 10.0) <= Math.trunc(interruptor.position[1] * 10.0))
						luz.setPosition(luz.position[0], luz.position[1] + 0.1, luz.position[2]);

			}
			else
				terminoY = true;
		}

		if (!terminoZ) {
			if (Math.abs(Math.trunc(interruptor.position[2] * 10.0) - Math.trunc(luz.position[2] * 10.0)) > 3.0) {
				if (Math.trunc(luz.position[2] * 10.0) > Math.trunc(interruptor.position[2] * 10.0))
					luz.setPosition(luz.position[0], luz.position[1], luz.position[2] - 0.1);
				else
					if (Math.trunc(luz.position[2] * 10.0) < Math.trunc(interruptor.position[2] * 10.0))
						luz.setPosition(luz.position[0], luz.position[1], luz.position[2] + 0.1);
			}
			else {

				terminoZ = true;
			}
		}

		luz.updateModelMatrix();
	}


	function MoverInterruptor() {
		if (dentro) {
			if (Math.trunc(interruptor.position[0] * 10.0) < 109.0)
				interruptor.setPosition(interruptor.position[0] + 0.2, interruptor.position[1], interruptor.position[2]);
			else
				dentro = false;

		}
		else
			if (Math.trunc(interruptor.position[0] * 10.0) > 99.0)
				interruptor.setPosition(interruptor.position[0] - 0.2, interruptor.position[1], interruptor.position[2]);
			else
				pulso = false;

		interruptor.updateModelMatrix();
	}


	function setTextureConfig() {
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
		for (let i = 0; i < 6; i++) {
			gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, SHADOW_MAP_SIZE, SHADOW_MAP_SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		}
		//Creo los framebuffer que almacenan la textura.
		shadowMapFrameBuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFrameBuffer);
		shadowMapRenderBuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, shadowMapRenderBuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	function render(now) {
		now *= 0.001;                          // convert to seconds
		const deltaTime = now - then;          // compute time since last frame
		then = now;                            // remember time for next frame
		const fps = 1 / deltaTime;             // compute frames per second
		fpsElem.value = fps.toFixed(1);  // update fps display
		//actualizamos valores
		updateCamL();
		act = new Date().getTime() - start;
		if (camaraAutomatica) {
			camera.arcHorizontally(deltaTime);
		}
		if (movFantasma)
			timerFantasma += 500;
		moveGhost();
		//Con esto el bicho se mantiene con la animacion
		skull.setPosition(skull.getPosX(), 1.1 + (Math.sin(act / 1000.0) + 1.0) / 2.0, skull.getPosZ());
		skull.rotateY(3)
		skull.updateModelMatrix();

		CameraControls.move();
		if (irradiacion == 1.0) {
			osc = (Math.sin(act / 1000.0) + 1.0) / 2.0;
			if (osc < 0.1) osc = 0.1;
			light1.setColor([colorx * osc, colory * osc, colorz * osc]);
			//console.log(light1.color)
		}

		if (MoverLuz) {
			if (!trampa) {
				if (Math.trunc(luz.position[0] * 10.0) > -4.0 && Voymitad1)
					luz.setPosition(luz.position[0] - 0.1, luz.position[1], luz.position[2]);
				else
					if (Math.trunc(luz.position[2] * 10.0) <= 64.0 && Voymitad1)
						luz.setPosition(luz.position[0], luz.position[1], luz.position[2] + 0.1);
					else {
						Voymitad1 = false;
						if (Math.trunc(luz.position[0] * 10.0) <= 64.0 && Voymitad2)
							luz.setPosition(luz.position[0] + 0.1, luz.position[1], luz.position[2]);
						else
							if (Voymitad2 && Math.trunc(luz.position[2] * 10.0) >= -25.0)
								luz.setPosition(luz.position[0], luz.position[1], luz.position[2] - 0.1);
							else {
								Voymitad2 = false;
								if (Math.trunc(luz.position[0] * 10.0) >= -64.0 && Voymitad3)
									luz.setPosition(luz.position[0] - 0.1, luz.position[1], luz.position[2]);
								else
									if (Math.trunc(luz.position[2] * 10.0) <= 62.0 && Voymitad3)
										luz.setPosition(luz.position[0], luz.position[1], luz.position[2] + 0.1);
									else {
										Voymitad3 = false;
										if (Math.trunc(luz.position[0] * 10.0) < -14.0 && Voymitad4)
											luz.setPosition(luz.position[0] + 0.1, luz.position[1], luz.position[2]);
										else
											if (Math.trunc(luz.position[2] * 10.0) > -82.0 && Voymitad4)
												luz.setPosition(luz.position[0], luz.position[1], luz.position[2] - 0.1);
											else {
												Voymitad4 = false;
												if (Math.trunc(luz.position[0] * 10.0) > -64.0 && Voymitad5)
													luz.setPosition(luz.position[0] - 0.1, luz.position[1], luz.position[2]);
												else
													if (Math.trunc(luz.position[2] * 10.0) < 12.0 && Voymitad5)
														luz.setPosition(luz.position[0], luz.position[1], luz.position[2] + 0.1);
													else {
														Voymitad5 = false;
														if (Math.trunc(luz.position[0] * 10.0) < 64.0 && Voymitad6)
															luz.setPosition(luz.position[0] + 0.1, luz.position[1], luz.position[2]);
														else
															if (Math.trunc(luz.position[2] * 10.0) > -82.0 && Voymitad6)
																luz.setPosition(luz.position[0], luz.position[1], luz.position[2] - 0.1);
															else {
																Voymitad1 = true;
																Voymitad2 = true;
																Voymitad3 = true;
																Voymitad4 = true;
																Voymitad5 = true;
															}
													}
											}
									}

							}


					}
				luz.updateModelMatrix();
			}
		}
		if (trampa) {
			if (skull.material == skullMaterial) {
				skull.material = fireEnojadoMaterial;
				skull.textures = [humoTexture, waterDistortionTexture];
			}
			osc = (Math.sin(act / 100.0) + 1.0) / 2.0;
			bichoLight.color = [colorLuzBicho[0] * osc, colorLuzBicho[1] * osc, colorLuzBicho[2] * osc];
			bichoLight.position = [skull.getPosX(), skull.getPosY(), skull.getPosZ(), 1.0];

		}
		else {
			if (skull.material == fireEnojadoMaterial) {
				skull.material = skullMaterial;
				skull.textures = [skullTexture, skullTextureNormal];
				bichoLight.color = [0.0, 0.0, 0.0];
			}
		}

		if (trampa) {
			if (bajar) {
				if (rejas[0].getPosY() > 4) {
					for (var i = 0; i < 23; i++) {
						rejas[i].translateY(-0.2);
						rejas[i].updateModelMatrix();
					}
				}
				else
					bajar = false;

			}
			else {
				if (!terminoX || !terminoY || !terminoZ)
					moverLuz();
				else
					if (pulso) {
						MoverInterruptor();
					}
					else {
						if (rejas[0].getPosY() < 8.2) {
							for (var i = 0; i < 23; i++) {
								rejas[i].translateY(0.02);
								rejas[i].updateModelMatrix();
							}
						}
						else
							if (rejas[0].getPosY() < 7) {
								for (var i = 0; i < 23; i++) {
									rejas[i].translateY(0.02);
									rejas[i].updateModelMatrix();
								}
							}
							else {
								terminoX = false;
								terminoY = false;
								terminoZ = false;
								pulso = true;
								dentro = true;
								trampa = false;
								bajar = true;
							}
					}

			}
		}





		if (CameraControls.leftClicked) {//Si hubo un click izquierdo, checkeamos si pickio algun objeto
			//dibujamos la escena dando un color a cada objeto dependiendo de su id
			drawPick();
			//Esperamos hasta que todos los draw terminen
			//Muy lento, generalmente hay mucho tiempo entre gl.draw() y--
			//-- todos los fragmentos completamente rasterizados
			//gl.flush();
			//gl.finish();
			gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
			//Leemos el pixel en la posicion X,Y del mouse sobre el canvas
			//Lento, hasta para 1 pixel, porque el framebuffer esta en la GPU
			let pixels = new Uint8Array(4);
			gl.readPixels(CameraControls.currentX, CameraControls.currentY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
			let id = colorToId(pixels);
			if (id != -1 && id != 16777215) { //si el id corresponde a un objeto pickeable
				//console.log("id del objeto pickeable: "+parseFloat(id)) //hago algo
				if (id == luz.id || vec3.dist(pickableObjects[id].position, camera.position) < 4) {
					CameraControls.pickedObject = pickableObjects[id];
					if (id > skull.id && pickableObjects.length || id == skull.id && !trampa) {
						trampa = true;
					}
				}



			}
			else {
				CameraControls.pickedObject = null;
			}
			CameraControls.leftClicked = false;
		}
		// 2️⃣ Dibujamos la escena con el cubo usando el Frame Buffer por defecto (asociado al canvas)
		timer += 10;
		let posL = guardarPosiciones();
		simularAntorcha();
		generateShadowMap(); //Genero sombras
		if (puertaAbierta) {
			abrirPuerta();
		}
		if (selectedShader.value == "DEFAULT") {
			if (effect != 2) {
				asUsualFrameBuffer.bind()
				gl.viewport(0, 0, asUsualFrameBuffer.width, asUsualFrameBuffer.height)
				gl.enable(gl.DEPTH_TEST)
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

				drawSceneAsUsual()

				if (effect == 0) {
					grayscalePassFrameBuffer.bind()
					gl.viewport(0, 0, grayscalePassFrameBuffer.width, grayscalePassFrameBuffer.height)
					gl.disable(gl.DEPTH_TEST)
					gl.clear(gl.COLOR_BUFFER_BIT)

					grayscalePass(asUsualFrameBuffer)


					edgeDetectionPassFrameBuffer.bind()
					gl.viewport(0, 0, edgeDetectionPassFrameBuffer.width, edgeDetectionPassFrameBuffer.height)
					gl.disable(gl.DEPTH_TEST)
					gl.clear(gl.COLOR_BUFFER_BIT)
					edgeDetectionPass(grayscalePassFrameBuffer)

					gl.bindFramebuffer(gl.FRAMEBUFFER, null)
					gl.viewport(0, 0, canvas.width, canvas.height)
					gl.disable(gl.DEPTH_TEST)
					gl.clear(gl.COLOR_BUFFER_BIT)

					multiplyPass(asUsualFrameBuffer, edgeDetectionPassFrameBuffer)
				}
				if (effect == 1) {
					// 3️⃣ Aplicamos el filtro de blur radial sobre la escena anterior, generando el efecto de iluminacion volumetrica
					lightAndOccludingObjectsFrameBuffer.bind()
					gl.viewport(0, 0, lightAndOccludingObjectsFrameBuffer.width, lightAndOccludingObjectsFrameBuffer.height)
					gl.enable(gl.DEPTH_TEST)
					gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
					drawLightAndOccludingObjects()

					radialBlurPassFrameBuffer.bind()
					gl.viewport(0, 0, radialBlurPassFrameBuffer.width, radialBlurPassFrameBuffer.height)
					gl.disable(gl.DEPTH_TEST)
					gl.clear(gl.COLOR_BUFFER_BIT)

					radialBlurPass(lightAndOccludingObjectsFrameBuffer)

					// 4️⃣ Dibujamos sobre el canvas, combinando la escena original con la iluminacion volumetrica

					gl.bindFramebuffer(gl.FRAMEBUFFER, null)
					gl.viewport(0, 0, canvas.width, canvas.height)
					gl.disable(gl.DEPTH_TEST)
					gl.clear(gl.COLOR_BUFFER_BIT)

					additiveBlendingPass(asUsualFrameBuffer, radialBlurPassFrameBuffer)
				}
			}
			else {
				gl.bindFramebuffer(gl.FRAMEBUFFER, null)
				updateView(gl, canvas, camera, true)
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
				drawSceneAsUsual();
			}
		} else {
			if (selectedShader.value == "UNTEXTURED") {
				drawVarianteB();
			}
		}
		restaurarPosiciones(posL);
		// Solicitamos el proximo frame
		requestAnimationFrame(render);
	}

	function drawVarianteB() {
		// Enlazamos el Frame Buffer conectado al canvas (desenlazando el actual), y lo configuramos
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
		gl.clearColor(0.05, 0.05, 0.05, 1)
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		// Actualizamos vista en caso de cambios en el tamaño del canvas (e.g. por cambios en tamaño de la ventana)
		updateView(gl, canvas, camera, true)
		// Limpiamos buffers de color y profundidad del canvas antes de empezar a dibujar los objetos de la escena
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

		varianteBProgram.use();
		varianteBProgram.setUniformValue("pointLightPosition", light1.position);
		varianteBProgram.setUniformValue("shadowClipNearFar", shadowClipNearFar);
		varianteBProgram.setUniformValue("lightShadowMap", 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);

		// Dibujamos los objetos de la escena;
		for (let object of sceneObjects) {
			mat4.multiply(object.modelViewMatrix, camera.viewMatrix, object.modelMatrix);
			mat4.invert(object.normalMatrix, object.modelViewMatrix);
			mat4.transpose(object.normalMatrix, object.normalMatrix);

			// Actualizamos los uniforms a usar ( provenientes de la camara, el objeto, material y fuentes de luz )
			varianteBProgram.setUniformValue("projectionMatrix", camera.projectionMatrix);
			varianteBProgram.setUniformValue("modelMatrix", object.modelMatrix);
			varianteBProgram.setUniformValue("modelViewMatrix", object.modelViewMatrix);
			varianteBProgram.setUniformValue("normalMatrix", object.normalMatrix);

			if (object.material.affectedByLight) {
				let i = 0;
				for (let light of sceneLights) {

					let lightPosEye = vec4.create();
					vec4.transformMat4(lightPosEye, light.position, camera.viewMatrix);
					varianteBProgram.setUniformValue("allLights[" + i.toString() + "].position", lightPosEye);
					varianteBProgram.setUniformValue("allLights[" + i.toString() + "].color", light.color);
					varianteBProgram.setUniformValue("allLights[" + i.toString() + "].linear_attenuation", light.linear_attenuation);
					varianteBProgram.setUniformValue("allLights[" + i.toString() + "].quadratic_attenuation", light.quadratic_attenuation);
					i++;
				};
				varianteBProgram.setUniformValue("numLights", i);
			}

			// Seteamos info de su geometria
			object.vertexArray.bind();
			//info de texturas

			// Lo dibujamos
			gl.drawElements(object.drawMode, object.indexBuffer.size, object.indexBuffer.dataType, 0);
		}
	}

	function guardarPosiciones() {
		return [luzAntorcha1.position, luzAntorcha2.position, luzAntorcha3.position, luzAntorcha4.position,luzEntrada.position];
	}
	function simularAntorcha() {
		let a = Math.random() * (0.3 - 0.1) + 0.1;
		let b = Math.random() * (0.3 - 0.1) + 0.1;
		let c = Math.random() * (0.3 - 0.1) + 0.1;
		let d = Math.random() * (0.3 - 0.1) + 0.1;
		luzAntorcha1.setPosition([luzAntorcha1.position[0] + a, luzAntorcha1.position[1], luzAntorcha1.position[2] + a, 1]);
		luzAntorcha2.setPosition([luzAntorcha2.position[0] - b, luzAntorcha2.position[1], luzAntorcha2.position[2] - b, 1]);
		luzAntorcha3.setPosition([luzAntorcha3.position[0] + c, luzAntorcha3.position[1], luzAntorcha3.position[2] + c, 1]);
		luzAntorcha4.setPosition([luzAntorcha4.position[0] - d, luzAntorcha4.position[1], luzAntorcha4.position[2] - d, 1]);
    luzEntrada.setPosition([luzEntrada.position[0] - d, luzEntrada.position[1], luzEntrada.position[2] - d, 1]);
	}
	function restaurarPosiciones(posL) {
		luzAntorcha1.setPosition(posL[0]);
		luzAntorcha2.setPosition(posL[1]);
		luzAntorcha3.setPosition(posL[2]);
		luzAntorcha4.setPosition(posL[3]);
    luzEntrada.setPosition(posL[4]);
	}
	function edgeDetectionPass(inputBuffer) {
		// 🎨 Dibujamos quad fullscreen

		edgeDetectionPassProgram.use()

		edgeDetectionPassProgram.setUniformValue("colorSource", 0)
		edgeDetectionPassProgram.setUniformValue("resolution", [canvas.width, canvas.height])
		edgeDetectionPassProgram.setUniformValue("edgeThreshold", 0.1)

		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, inputBuffer.colorTexture)

		quadVertexArray.bind()

		gl.drawElements(quadDrawMode, quadIndexBuffer.size, quadIndexBuffer.dataType, 0)
	}
	function grayscalePass(inputBuffer) {
		// 🎨 Dibujamos quad fullscreen

		grayscalePassProgram.use()

		grayscalePassProgram.setUniformValue("colorSource", 0)

		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, inputBuffer.colorTexture)

		quadVertexArray.bind()

		gl.drawElements(quadDrawMode, quadIndexBuffer.size, quadIndexBuffer.dataType, 0)
	}
	function multiplyPass(inputBufferA, inputBufferB) {
		// 🎨 Dibujamos quad fullscreen

		multiplyPassProgram.use()

		multiplyPassProgram.setUniformValue("colorSourceA", 0)
		multiplyPassProgram.setUniformValue("colorSourceB", 1)

		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, inputBufferA.colorTexture)
		gl.activeTexture(gl.TEXTURE1)
		gl.bindTexture(gl.TEXTURE_2D, inputBufferB.colorTexture)

		quadVertexArray.bind()

		gl.drawElements(quadDrawMode, quadIndexBuffer.size, quadIndexBuffer.dataType, 0)
	}
	function drawPick() {//Dibujamos la escena en codigo de colores, para guardarla en un framebuffer y leerla despues
		// Enlazamos el Frame Buffer creado y lo configuramos
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo1.frameBuffer);
		gl.clearColor(1.0, 1.0, 1.0, 1); //pintamos la escena de blanco, todo lo blanco no sera pickeable
		// Actualizamos vista en caso de cambios en el tamaño del canvas (e.g. por cambios en tamaño de la ventana)
		//updateView(gl, canvas, camera, true)
		gl.viewport(0, 0, canvas.width, canvas.height)
		// Limpiamos buffers de color y profundidad del canvas antes de empezar a dibujar los objetos de la escena
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		// Seteamos el programa a usar y matrices
		pickProgram.use();
		pickProgram.setUniformValue("viewMatrix", camera.viewMatrix);
		pickProgram.setUniformValue("projectionMatrix", camera.projectionMatrix);

		// Dibujamos los objetos de la escena;
		for (let object of pickableObjects) {
			pickProgram.setUniformValue("modelMatrix", object.modelMatrix);
			pickProgram.setUniformValue("PickingColor", idToColor(object.getId()));
			//console.log(object.getId())
			// Seteamos info de su geometria
			object.vertexArray.bind();
			// Lo dibujamos
			gl.drawElements(object.drawMode, object.indexBuffer.size, object.indexBuffer.dataType, 0);
		}
	}

	function drawLightAndOccludingObjects() {
		// 🎨 Dibujamos en negro todos los objetos que ocluyen (tapan) la luz (i.e. la tetera)

		colorProgram.use()
		colorProgram.setUniformValue("viewMatrix", camera.viewMatrix)
		colorProgram.setUniformValue("projectionMatrix", camera.projectionMatrix)
		colorProgram.setUniformValue("color", [0.0, 0.0, 0.0])

		for (let i = 1; i < sceneObjects.length; i++) {

			colorProgram.setUniformValue("modelMatrix", sceneObjects[i].modelMatrix)
			sceneObjects[i].vertexArray.bind()
			gl.drawElements(sceneObjects[i].drawMode, sceneObjects[i].indexBuffer.size, sceneObjects[i].indexBuffer.dataType, 0)
		}


		// 🎨 Dibujamos al objeto que representa a la fuente de luz en el color de la misma  (i.e. la esfera en color blanco)

		colorProgram.use()

		colorProgram.setUniformValue("viewMatrix", camera.viewMatrix)
		colorProgram.setUniformValue("projectionMatrix", camera.projectionMatrix)
		colorProgram.setUniformValue("modelMatrix", luz.modelMatrix)
		colorProgram.setUniformValue("color", light1.color)
		luz.vertexArray.bind()

		gl.drawElements(luz.drawMode, luz.indexBuffer.size, luz.indexBuffer.dataType, 0)
	}

	function radialBlurPass(inputBuffer) {
		// 🎨 Dibujamos quad fullscreen

		radialBlurPassProgram.use()

		radialBlurPassProgram.setUniformValue("colorSource", 0)
		let lightPosEye = vec4.create();
		vec4.transformMat4(lightPosEye, light1.position, camera.viewMatrix);
		radialBlurPassProgram.setUniformValue("center", toTextureCoordinatesSpace(light1.position, camera))
		radialBlurPassProgram.setUniformValue("exposure", 1)
		radialBlurPassProgram.setUniformValue("decay", 0.95)
		radialBlurPassProgram.setUniformValue("sampleWeight", 0.05)
		radialBlurPassProgram.setUniformValue("samples", 50)

		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, inputBuffer.colorTexture)

		quadVertexArray.bind()

		gl.drawElements(quadDrawMode, quadIndexBuffer.size, quadIndexBuffer.dataType, 0)
	}

	function additiveBlendingPass(inputBufferA, inputBufferB) {
		// 🎨 Dibujamos quad fullscreen

		additiveBlendingPassProgram.use()

		additiveBlendingPassProgram.setUniformValue("colorSourceA", 0)
		additiveBlendingPassProgram.setUniformValue("colorSourceB", 1)

		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, inputBufferA.colorTexture)
		gl.activeTexture(gl.TEXTURE1)
		gl.bindTexture(gl.TEXTURE_2D, inputBufferB.colorTexture)

		quadVertexArray.bind()

		gl.drawElements(quadDrawMode, quadIndexBuffer.size, quadIndexBuffer.dataType, 0)
	}

	/*
	  Funcion que genera las sombras
	*/
	function generateShadowMap() {
		shadowMapGenProgram.use(); //Seteo el programa a usar
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube); //Bindeo texturas y buffers
		gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFrameBuffer);
		gl.bindRenderbuffer(gl.RENDERBUFFER, shadowMapRenderBuffer);

		//Paso uniforms
		shadowMapGenProgram.setUniformValue("shadowClipNearFar", shadowClipNearFar);
		shadowMapGenProgram.setUniformValue("pointLightPosition", light1.position);
		shadowMapGenProgram.setUniformValue("mProj", shadowMapProj);
		for (let i = 0; i < 6; i++) {//Para cada cara del cubemap...
			let lookAt = vec3.create();
			let matriz = mat4.create();
			vec3.add(lookAt, light1.position, ENV_CUBE_LOOK_DIR[i]); //Calculo el centro al cual mirar
			mat4.lookAt(matriz, light1.position, lookAt, ENV_CUBE_LOOK_UP[i]); //Miro a la direccion necesaria
			shadowMapGenProgram.setUniformValue("mView", matriz);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, shadowMapCube, 0);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, shadowMapRenderBuffer);
			gl.clearColor(0, 0, 0, 1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//Limpio pantalla
			gl.viewport(0, 0, SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);//Hago viewport para que dibuje texturas del tamaño deseado
			gl.enable(gl.DEPTH_TEST);
			gl.enable(gl.CULL_FACE);
			for (let object of sceneObjects) { //Renderizo cada objeto
				if (object.material.program != fireProgram && object.material.program != fireRadioactivoProgram && object.material.program != ghostProgram) {
					shadowMapGenProgram.setUniformValue("mWorld", object.modelMatrix);
					object.vertexArray.bind();
					gl.drawElements(object.drawMode, object.indexBuffer.size, object.indexBuffer.dataType, 0);
				}
			}
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}

	// function drawFire(){
	//   gl.bindFramebuffer(gl.FRAMEBUFFER,null);
	//   //gl.clearColor(0.2,0.22,0.25,1);
	//   gl.viewport(0,0,canvas.width,canvas.height);
	//   fireProgram.use();
	//   // gl.enable(gl.BLEND);
	//   // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	//   //gl.clear(gl.DEPTH_BUFFER_BIT| gl.COLOR_BUFFER_BIT);
	//   fireProgram.setUniformValue("projectionMatrix",camera.projectionMatrix);
	//   fireProgram.setUniformValue("viewMatrix",camera.viewMatrix);
	//   fireProgram.setUniformValue("modelMatrix",planoFuego.modelMatrix);
	//   fireProgram.setUniformValue("texture0",0);
	//   fireProgram.setUniformValue("fTime",timer);
	//   gl.activeTexture(gl.TEXTURE0);
	//   gl.bindTexture(gl.TEXTURE_2D,humoTexture);
	//   fireProgram.setUniformValue("texture1",1);
	//   gl.activeTexture(gl.TEXTURE1);
	//   gl.bindTexture(gl.TEXTURE_2D,waterDistortionTexture);
	//   planoFuego.vertexArray.bind();
	//   gl.drawElements(planoFuego.drawMode,planoFuego.indexBuffer.size,planoFuego.indexBuffer.dataType,0);
	// }

	function drawSceneOffscreen(object) { //cambiado para dibujar al ufo en el cubo
		// Enlazamos el Frame Buffer creado y lo configuramos
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo1.frameBuffer);
		gl.clearColor(0.2, 0.22, 0.25, 1);
		gl.viewport(0, 0, fbo1.frameBufferWidth, fbo1.frameBufferHeight);
		offscreenCamera.setTarget(object.position);

		mat4.multiply(object.modelViewMatrix, offscreenCamera.viewMatrix, object.modelMatrix);
		mat4.invert(object.normalMatrix, object.modelViewMatrix);
		mat4.transpose(object.normalMatrix, object.normalMatrix);

		// Limpiamos buffers de color y profundidad del Frame Buffer antes de empezar a dibujar los objetos de la escena
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Seteamos el programa a usar;
		object.material.program.use();

		// Actualizamos los uniforms a usar ( provenientes de la camara, el objeto, material y fuentes de luz )
		object.material.program.setUniformValue("viewMatrix", offscreenCamera.viewMatrix);
		object.material.program.setUniformValue("projectionMatrix", offscreenCamera.projectionMatrix);
		object.material.program.setUniformValue("modelMatrix", object.modelMatrix);
		object.material.program.setUniformValue("modelViewMatrix", object.modelViewMatrix);
		object.material.program.setUniformValue("normalMatrix", object.normalMatrix);


		for (let name in object.material.properties) {
			const value = object.material.properties[name];
			object.material.program.setUniformValue("material." + name, value);
		}
		if (object.material.affectedByLight) {
			let i = 0;
			for (let light of sceneLights) {
				//paso la informacion de las luces. La posicion de la luz y la direccion del spot son convertidas a coordenadas del ojo
				//si la luz esta asociada a un objeto, se obtiene su posicion y rotacion a partir del objeto
				if (light.model != null) {
					//si la luz esta asociada a un objeto, actualizo su posicion y rotacion
					light.position[0] = light.model.position[0];
					light.position[1] = light.model.position[1];
					light.position[2] = light.model.position[2];
					let newSpotDirection = vec4.create();
					vec4.transformQuat(newSpotDirection, light.default_spot_direction, light.model.rotQuat);
					light.spot_direction = newSpotDirection;
				}
				let lightPosEye = vec4.create();
				vec4.transformMat4(lightPosEye, light.position, offscreenCamera.viewMatrix);
				object.material.program.setUniformValue("allLights[" + i.toString() + "].position", lightPosEye);
				object.material.program.setUniformValue("allLights[" + i.toString() + "].color", light.color);
				let spotDirEye = vec4.create();
				vec4.transformMat4(spotDirEye, light.spot_direction, offscreenCamera.viewMatrix);
				object.material.program.setUniformValue("allLights[" + i.toString() + "].spot_direction", spotDirEye);
				object.material.program.setUniformValue("allLights[" + i.toString() + "].spot_cutoff", light.spot_cutoff);
				object.material.program.setUniformValue("allLights[" + i.toString() + "].linear_attenuation", light.linear_attenuation);
				object.material.program.setUniformValue("allLights[" + i.toString() + "].quadratic_attenuation", light.quadratic_attenuation);
				i++;
			};
			object.material.program.setUniformValue("numLights", i);
		}

		// Seteamos info de su geometria
		object.vertexArray.bind();
		//info de texturas
		if (object.material.textured) {
			let i;
			for (i = 0; i < object.textures.length; i++) {
				gl.activeTexture(gl.TEXTURE0 + i);
				gl.bindTexture(gl.TEXTURE_2D, object.textures[i]);
			}
		}
		// Lo dibujamos
		gl.drawElements(object.drawMode, object.indexBuffer.size, object.indexBuffer.dataType, 0);
	}

	function drawSceneAsUsual() {
		// Enlazamos el Frame Buffer conectado al canvas (desenlazando el actual), y lo configuramos
		// gl.bindFramebuffer(gl.FRAMEBUFFER, null)
		// gl.clearColor(0.05, 0.05, 0.05, 1)
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		// Actualizamos vista en caso de cambios en el tamaño del canvas (e.g. por cambios en tamaño de la ventana)
		//updateView(gl, canvas, camera, true)
		//gl.viewport(0,0,700,700)
		//updateView(gl, canvas, camera, true)
		// Limpiamos buffers de color y profundidad del canvas antes de empezar a dibujar los objetos de la escena
		//  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		// Dibujamos los objetos de la escena;
		for (let object of sceneObjects) {
			mat4.multiply(object.modelViewMatrix, camera.viewMatrix, object.modelMatrix);
			mat4.invert(object.normalMatrix, object.modelViewMatrix);
			mat4.transpose(object.normalMatrix, object.normalMatrix);
			// Seteamos el programa a usar;
			object.material.program.use();
			if (object.material.program == shadowProgram || object.material.program == shadowCookTorranceProgram || object.material.program == varianteBProgram) {
				object.material.program.setUniformValue("pointLightPosition", light1.position);
				object.material.program.setUniformValue("shadowClipNearFar", shadowClipNearFar);
				object.material.program.setUniformValue("lightShadowMap", 0);
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
			}
			if (object.material.program == ghostProgram) {
				object.material.program.setUniformValue("fTime", timer);
				if (movFantasma)
					object.material.program.setUniformValue("intensidad", timerFantasma);
				else {
					object.material.program.setUniformValue("intensidad", -1);
				}
			}
			if (object.material.program == fireEnojadoProgram) object.material.program.setUniformValue("fTime", timer);
			if (object.material.program == fireProgram) {
				object.material.program.setUniformValue("fTime", timer);
				if (object == fireLight1) object.material.program.setUniformValue("intensidad", parseFloat(sliderA1.value));
				if (object == fireluzAntorcha1) object.material.program.setUniformValue("intensidad", parseFloat(sliderA2.value));
				if (object == fireluzAntorcha2) object.material.program.setUniformValue("intensidad", parseFloat(sliderA3.value));
				if (object == fireluzAntorcha3) object.material.program.setUniformValue("intensidad", parseFloat(sliderA4.value));
        if (object == fireLightEntrada) object.material.program.setUniformValue("intensidad", parseFloat(sliderA5.value));
			}
			if (object.material.program == fireRadioactivoProgram) {
				object.material.program.setUniformValue("fTime", timer);
				if (irradiacion == 1.0) object.material.program.setUniformValue("miliseg", act);
				else object.material.program.setUniformValue("miliseg", 0.0);
			}
			// Actualizamos los uniforms a usar ( provenientes de la camara, el objeto, material y fuentes de luz )
			object.material.program.setUniformValue("viewMatrix", camera.viewMatrix);
			object.material.program.setUniformValue("projectionMatrix", camera.projectionMatrix);
			object.material.program.setUniformValue("modelMatrix", object.modelMatrix);
			object.material.program.setUniformValue("modelViewMatrix", object.modelViewMatrix);
			object.material.program.setUniformValue("normalMatrix", object.normalMatrix);
			for (let name in object.material.properties) {
				const value = object.material.properties[name];
				object.material.program.setUniformValue("material." + name, value);
			}
			//en caso de que sea la esfera le seteo el uniform "float miliseg"
			//if(object == sceneObjects[8]){
			//  object.material.program.setUniformValue( "miliseg", new Date().getTime()- start );
			//}
			if (object.material.affectedByLight) {
				let i = 0;
				for (let light of sceneLights) {
					//paso la informacion de las luces. La posicion de la luz y la direccion del spot son convertidas a coordenadas del ojo
					//si la luz esta asociada a un objeto, se obtiene su posicion y rotacion a partir del objeto
					// if(light.model != null){
					//     //si la luz esta asociada a un objeto, actualizo su posicion y rotacion
					//     light.position[0] = light.model.position[0];
					//     light.position[1] = light.model.position[1];
					//     light.position[2] = light.model.position[2];
					//     let newSpotDirection = vec4.create();
					//     vec4.transformQuat(newSpotDirection,light.default_spot_direction,light.model.rotQuat);
					//     light.spot_direction = newSpotDirection;
					// }
					let lightPosEye = vec4.create();
					vec4.transformMat4(lightPosEye, light.position, camera.viewMatrix);
					object.material.program.setUniformValue("allLights[" + i.toString() + "].position", lightPosEye);
					object.material.program.setUniformValue("allLights[" + i.toString() + "].color", light.color);
					let spotDirEye = vec4.create();
					vec4.transformMat4(spotDirEye, light.spot_direction, camera.viewMatrix);
					object.material.program.setUniformValue("allLights[" + i.toString() + "].spot_direction", spotDirEye);
					object.material.program.setUniformValue("allLights[" + i.toString() + "].spot_cutoff", light.spot_cutoff);
					object.material.program.setUniformValue("allLights[" + i.toString() + "].linear_attenuation", light.linear_attenuation);
					object.material.program.setUniformValue("allLights[" + i.toString() + "].quadratic_attenuation", light.quadratic_attenuation);
					i++;
				};
				object.material.program.setUniformValue("numLights", i);
			}

			// Seteamos info de su geometria
			object.vertexArray.bind();
			//info de texturas
			if (object.material.textured) {
				let i;
				if (object.material.program == shadowProgram || object.material.program == shadowCookTorranceProgram || object.material.program == varianteBProgram) {
					for (i = 0; i < object.textures.length; i++) {
						gl.activeTexture(gl.TEXTURE1 + i);
						gl.bindTexture(gl.TEXTURE_2D, object.textures[i]);
					}
				}
				else {
					for (i = 0; i < object.textures.length; i++) {
						gl.activeTexture(gl.TEXTURE0 + i);
						gl.bindTexture(gl.TEXTURE_2D, object.textures[i]);
					}
				}
			}
			// Lo dibujamos
			gl.drawElements(object.drawMode, object.indexBuffer.size, object.indexBuffer.dataType, 0);
		}
	}

	function armarTextura(texture, image) {

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	async function crearObjeto(gl, obj, program, lighted, textured, texturas, properties = {}) {
		let geometryData = await parse(obj)
		let geometry = new Geometry(gl, geometryData)
		let material = new Material(program, lighted, textured, properties)
		return new SceneObject(gl, geometry, material, texturas, false)
	}

	//Los metodos que estan en utils me tiran undefined o NaN.
	//Implemente los mismos, pero aca. Al final no los uso...
	// function convertirAEsfericas(x,y,z){
	//   let r = Math.sqrt(x*x+y*y+z*z);
	//   let theta = Math.atan(x/z);
	//   let phi = Math.acos(y/r);
	//   return [r,theta,phi];
	// }
	//
	// function convertirACartesianas(radius,theta,phi){
	//   let x = radius * Math.sin(phi) * Math.sin(theta)
	//   let y = radius * Math.cos(phi)
	//   let z = radius * Math.sin(phi) * Math.cos(theta)
	//   return [x,y,z];
	// }
	function CrearColumnasYAntorchas() {
		for (let i = 0; i < 4; i++) {
			columnas[i] = new SceneObject(gl, columnaGeometry, shadowCookTorranceMaterial, [paredTextureAlbedo, paredTextureNormal], false);
		}
		for (let j = 0; j < 5; j++) {
			antorchas[j] = new SceneObject(gl, antorchaGeometry, shadowCookTorranceMaterial, [antorchaTexture, antorchaNormTexture, antorchaMetallTexture], false);
		}


		columnas[0].setPosition(-3, 0, -5);
		columnas[0].updateModelMatrix();
		columnas[1].setPosition(3, 0, -5);
		columnas[1].updateModelMatrix();
		columnas[2].setPosition(3, 0, 5);
		columnas[2].setRotation(0, 180, 0);
		columnas[2].updateModelMatrix();
		columnas[3].setPosition(-3, 0, 5);
		columnas[3].setRotation(0, 180, 0);
		columnas[3].updateModelMatrix();


		// for(let i = 0; i<columnas.length; i++){
		//   let sm = mat4.create();
		//   let m = columnas[i].modelMatrix;
		//   mat4.fromScaling(sm,[1,1.45,1]);
		//   mat4.multiply(m,sm,m);
		// }

		antorchas[0].setPosition(-3, 1.7, -4.5);
		antorchas[0].updateModelMatrix();
		antorchas[1].setPosition(-3, 1.7, 4.5);
		antorchas[1].rotateY(180);
		antorchas[1].updateModelMatrix();
		antorchas[2].setPosition(3, 1.7, -4.5);
		antorchas[2].updateModelMatrix();
		antorchas[3].setPosition(3, 1.7, 4.5);
		antorchas[3].rotateY(180);
		antorchas[3].updateModelMatrix();
		antorchas[4].setPosition(-12, 1.7, 1.91);
		antorchas[4].rotateY(180);
		antorchas[4].updateModelMatrix();
	}

	function CrearMonedasYBolsas() {
		for (var i = 0; i < 12; i++) {
			bolsas[i] = new SceneObject(gl, bolsaGeometry, bolsaMaterial, [bolsaColorTexture, bolsaNormalTexture]);
			monedas[i] = new SceneObject(gl, monedaGeometry, monedaMaterial, [monedaColorTexture, monedaNormalTexture]);
		}

		bolsas[0].rotateY(45);
		bolsas[0].setPosition(-1, 0, 2);
		bolsas[0].updateModelMatrix();
		bolsas[1].rotateY(90);
		bolsas[1].setPosition(-1.5, 0, 2);
		bolsas[1].updateModelMatrix();
		bolsas[2].rotateY(10);
		bolsas[2].setPosition(1.0, 0, 2);
		bolsas[2].updateModelMatrix();
		bolsas[3].rotateY(180);
		bolsas[3].setPosition(1.5, 0, 1.3);
		bolsas[3].updateModelMatrix();
		bolsas[4].rotateX(90);
		bolsas[4].setPosition(-1.5, 0.3, -3);
		bolsas[4].updateModelMatrix();
		bolsas[5].rotateY(45);
		bolsas[5].rotateX(90);
		bolsas[5].setPosition(2, 0.3, -3.5);
		bolsas[5].updateModelMatrix();
		bolsas[6].rotateX(-90);
		bolsas[6].setPosition(1.5, 0, -3.5);
		bolsas[6].updateModelMatrix();
		bolsas[7].rotateZ(45);
		bolsas[7].setPosition(-0.8, 0, -3.0);
		bolsas[7].updateModelMatrix();
		bolsas[8].setPosition(-1, 0, -1);
		bolsas[8].updateModelMatrix();
		bolsas[9].setPosition(-1, 0, -2);
		bolsas[9].updateModelMatrix();
		bolsas[10].setPosition(-1.5, 0, -1.5);
		bolsas[10].updateModelMatrix();
		bolsas[11].setPosition(1, 0, -2);
		bolsas[11].updateModelMatrix();

		monedas[0].setPosition(1.2, 0, -2);
		monedas[0].updateModelMatrix();
		monedas[1].setPosition(-1.8, 0, -2);
		monedas[1].updateModelMatrix();
		monedas[2].setPosition(-1.5, 0, -2);
		monedas[2].updateModelMatrix();
		monedas[3].setPosition(1.5, 0, -2);
		monedas[3].updateModelMatrix();
		monedas[4].setPosition(2, 0, -2);
		monedas[4].updateModelMatrix();
		monedas[5].setPosition(-1, 0, -2);
		monedas[5].updateModelMatrix();
		monedas[6].setPosition(1, 0, -2);
		monedas[6].updateModelMatrix();
		monedas[7].setPosition(-1.5, 0, -1.7);
		monedas[7].updateModelMatrix();
		monedas[8].setPosition(1.3, 0, -2);
		monedas[8].updateModelMatrix();
		monedas[9].setPosition(-1.1, 0, 1.4);
		monedas[9].updateModelMatrix();
		monedas[10].setPosition(0.6, 0, -0.3);
		monedas[10].updateModelMatrix();
		monedas[11].setPosition(0.1, 0, -0.7);
		monedas[11].updateModelMatrix();
	}

	function CrearRejas() {
		for (var i = 0; i < 23; i++)
			rejas[i] = new SceneObject(gl, rejasGeometry, rejasMaterial, [rejasColorTexture, rejasNormalTexture]);

		rejas[0].setPosition(-1.6, 8.2, -5);
		rejas[0].updateModelMatrix();
		rejas[1].setPosition(-0.5, 8.2, -5);
		rejas[1].updateModelMatrix();
		rejas[2].setPosition(0.6, 8.2, -5);
		rejas[2].updateModelMatrix();
		rejas[3].setPosition(1.6, 8.2, -5);
		rejas[3].updateModelMatrix();

		rejas[4].setPosition(-1.6, 8.2, 5);
		rejas[4].updateModelMatrix();
		rejas[5].setPosition(-0.5, 8.2, 5);
		rejas[5].updateModelMatrix();
		rejas[6].setPosition(0.6, 8.2, 5);
		rejas[6].updateModelMatrix();
		rejas[7].setPosition(1.6, 8.2, 5);
		rejas[7].updateModelMatrix();

		rejas[8].rotateY(90);
		rejas[8].setPosition(3, 8.2, -3.7);
		rejas[8].updateModelMatrix();
		rejas[9].rotateY(90);
		rejas[9].setPosition(3, 8.2, -2.6);
		rejas[9].updateModelMatrix();
		rejas[10].rotateY(90);
		rejas[10].setPosition(3, 8.2, -1.5);
		rejas[10].updateModelMatrix();
		rejas[11].rotateY(90);
		rejas[11].setPosition(3, 8.2, -0.4);
		rejas[11].updateModelMatrix();
		rejas[12].rotateY(90);
		rejas[12].setPosition(3, 8.2, 0.8);
		rejas[12].updateModelMatrix();
		rejas[13].rotateY(90);
		rejas[13].setPosition(3, 8.2, 1.9);
		rejas[13].updateModelMatrix();
		rejas[14].rotateY(90);
		rejas[14].setPosition(3, 8.2, 3.6);
		rejas[14].updateModelMatrix();

		rejas[15].rotateY(90);
		rejas[15].setPosition(-3, 8.2, -3.7);
		rejas[15].updateModelMatrix();
		rejas[16].rotateY(90);
		rejas[16].setPosition(-3, 8.2, -2.6);
		rejas[16].updateModelMatrix();
		rejas[17].rotateY(90);
		rejas[17].setPosition(-3, 8.2, -1.5);
		rejas[17].updateModelMatrix();
		rejas[18].rotateY(90);
		rejas[18].setPosition(-3, 8.2, -0.4);
		rejas[18].updateModelMatrix();
		rejas[19].rotateY(90);
		rejas[19].setPosition(-3, 8.2, 0.8);
		rejas[19].updateModelMatrix();
		rejas[20].rotateY(90);
		rejas[20].setPosition(-3, 8.2, 1.9);
		rejas[20].updateModelMatrix();
		rejas[21].rotateY(90);
		rejas[21].setPosition(-3, 8.2, 3.6);
		rejas[21].updateModelMatrix();
		rejas[22].rotateY(90);
		rejas[22].setPosition(-3, 8.2, 2.7);
		rejas[22].updateModelMatrix();
	}


	function CrearBarriles() {
		for (let i = 0; i < 6; i++) {
			barriles[i] = new SceneObject(gl, barrilGeometry, barrilMaterial, [barrilTexture, barrilTextureNormal], false);
			sceneObjects.push(barriles[i]);
		}
		barriles[0].setPosition(9.55, 1.76, 0.0)
		barriles[0].updateModelMatrix();
		barriles[1].setPosition(9.55, 0.88, -0.5)
		barriles[1].updateModelMatrix();
		barriles[2].setPosition(9.55, 0.88, 0.5)
		barriles[2].updateModelMatrix();
		barriles[3].setPosition(9.55, 0.0, -1.0)
		barriles[3].updateModelMatrix();
		barriles[4].setPosition(9.55, 0.0, 0.0)
		barriles[4].updateModelMatrix();
		barriles[5].setPosition(9.55, 0.0, 1.0)
		barriles[5].updateModelMatrix();
	}
	function CrearPortaLanzas() {
		portaLanzas[0] = new SceneObject(gl, maderaGeometry, PortaLanzaMaterial, [maderaTexture, maderaTextureNormal], false);
		sceneObjects.push(portaLanzas[0]);
		portaLanzas[0].setRotation(0.0, 0.0, 0.0);
		portaLanzas[0].setPosition(2.4, 0.0, 3.1);
		portaLanzas[0].updateModelMatrix();

		portaLanzas[1] = new SceneObject(gl, lanza1Geometry, PortaLanzaMaterial, [lanzaTexture, lanzaTextureNormal], false);
		sceneObjects.push(portaLanzas[1]);
		portaLanzas[1].setRotation(0.0, 0.0, 0.0);
		portaLanzas[1].setPosition(2.4, 0.0, 3.1);
		portaLanzas[1].updateModelMatrix();

		portaLanzas[2] = new SceneObject(gl, lanza2Geometry, PortaLanzaMaterial, [lanzaTexture, lanzaTextureNormal], false);
		sceneObjects.push(portaLanzas[2]);
		portaLanzas[2].setRotation(0.0, 0.0, 0.0);
		portaLanzas[2].setPosition(2.4, 0.0, 3.1);
		portaLanzas[2].updateModelMatrix();

		portaLanzas[3] = new SceneObject(gl, lanza3Geometry, PortaLanzaMaterial, [lanzaTexture, lanzaTextureNormal], false);
		sceneObjects.push(portaLanzas[3]);
		portaLanzas[3].setRotation(0.0, 0.0, 0.0);
		portaLanzas[3].setPosition(2.4, 0.0, 3.1);
		portaLanzas[3].updateModelMatrix();

		portaLanzas[4] = new SceneObject(gl, lanza4Geometry, PortaLanzaMaterial, [lanzaTexture, lanzaTextureNormal], false);
		sceneObjects.push(portaLanzas[4]);
		portaLanzas[4].setRotation(0.0, 0.0, 0.0);
		portaLanzas[4].setPosition(2.4, 0.0, 3.1);
		portaLanzas[4].updateModelMatrix();
	}

	function acomodarEntrada() {

		let sm = mat4.create();
		let m = gate.modelMatrix;
		mat4.fromScaling(sm, [0.5, 1.9, 2.1]);
		mat4.multiply(m, sm, m);
		sm = mat4.create();
		mat4.fromTranslation(sm, [-10.05, -1, 1.5]);
		mat4.multiply(m, sm, m);



		sm = mat4.create();
		m = metalGate.modelMatrix;
		mat4.fromScaling(sm, [1, 1.9, 2.1]);
		mat4.multiply(m, sm, m);
		sm = mat4.create();
		mat4.fromTranslation(sm, [-9.85, 2, 1.5]);
		mat4.multiply(m, sm, m);

		// metalGate.setPosition(-9.85,-0.5,0.8);
		// metalGate.updateModelMatrix();

		sm = mat4.create();
		m = pared2.modelMatrix;
		mat4.fromScaling(sm, [1, 1, 0.4]);
		mat4.multiply(m, sm, m);
		sm = mat4.create();
		mat4.fromTranslation(sm, [0, 0, 5.99]);
		mat4.multiply(m, sm, m);

		sm = mat4.create();
		m = pared5.modelMatrix;
		mat4.fromScaling(sm, [1, 1, 0.4]);
		mat4.multiply(m, sm, m);
		sm = mat4.create();
		mat4.fromTranslation(sm, [0, 0, -5.95]);
		mat4.multiply(m, sm, m);


		//Pared izquierda de afuera de la puerta
		sm = mat4.create();
		m = pared7.modelMatrix;
		mat4.fromScaling(sm, [2, 2.2, 0.04]);
		mat4.multiply(m, sm, m);
		sm = mat4.create();
		mat4.fromTranslation(sm, [-12.1, 2.1, -2]);
		mat4.multiply(m, sm, m);

		//Pared derecha de afuera de la puerta
		sm = mat4.create();
		m = pared8.modelMatrix;
		mat4.fromScaling(sm, [2, 2.2, 0.04]);
		mat4.multiply(m, sm, m);
		sm = mat4.create();
		mat4.fromTranslation(sm, [-12.1, 2.1, 2]);
		mat4.multiply(m, sm, m);

		//Pared atras de afuera de la puerta
		sm = mat4.create();
		m = pared9.modelMatrix;
		mat4.fromScaling(sm, [0.04, 2.2, 2]);
		mat4.multiply(m, sm, m);
		sm = mat4.create();
		mat4.fromTranslation(sm, [-14, 2.1, 0]);
		mat4.multiply(m, sm, m);

		// sm = mat4.create();
		// m = pared10.modelMatrix;
		// mat4.fromScaling(sm,[0.15,0.2,0.08]);
		// mat4.multiply(m,sm,m);
		// sm = mat4.create();
		// mat4.fromTranslation(sm,[-8.5,3.1,0]);
		// mat4.multiply(m,sm,m);
		//Piso entrada

		sm = mat4.create();
		m = piso2.modelMatrix;
		mat4.fromScaling(sm, [0.2, 1, 0.2]);
		mat4.multiply(m, sm, m);
		sm = mat4.create();
		mat4.fromTranslation(sm, [-12, 0, 0]);
		mat4.multiply(m, sm, m);

		sm = mat4.create();
		m = fireLightEntrada.modelMatrix;
		mat4.fromScaling(sm, [0.3, 1.5, 0.3]);
		mat4.multiply(m, sm, m);
		sm = mat4.create();
		mat4.fromXRotation(sm, toRadians(-20));
		mat4.multiply(m, sm, m);
		sm = mat4.create();
		mat4.fromTranslation(sm, [-12, 2.175, 1.625]);
		mat4.multiply(m, sm, m);

		sm = mat4.create();
		m = techo2.modelMatrix;
		mat4.fromScaling(sm, [2, 0.2, 2.3]);
		mat4.multiply(m, sm, m);
		sm = mat4.create();
		mat4.fromTranslation(sm, [-12.1, 4.6, 0]);
		mat4.multiply(m, sm, m);

	}

	function crearArtorias() {
		artorias.push(new SceneObject(gl, artorias_espada_geometry, ghostMaterial, [artorias_sword_texture, humoTexture], false));
		artorias.push(new SceneObject(gl, artorias_malla_geometry, ghostMaterial, [artorias_chainmail_texture, humoTexture], false));

		artorias.push(new SceneObject(gl, artorias_armadura_geometry, ghostMaterial, [artorias_armor_texture, humoTexture], false));

		artorias.push(new SceneObject(gl, artorias_tela_geometry, ghostMaterial, [artorias_skirt_texture, humoTexture], false));

		artorias.push(new SceneObject(gl, artorias_casco_geometry, ghostMaterial, [artorias_helmet_texture, humoTexture], false));

		for (let i = 0; i < artorias.length; i++) {
			let sm = mat4.create();
			let m = artorias[i].modelMatrix;
			mat4.fromScaling(sm, [0.1, 0.1, 0.1]);
			mat4.multiply(m, sm, m);
			sm = mat4.create();
			mat4.fromYRotation(sm, toRadians(-90));
			mat4.multiply(m, sm, m);
			sm = mat4.create();
			mat4.fromTranslation(sm, [0, 0, 8]);
			artorias[i].setPosition(0, 0, 8);
			mat4.multiply(m, sm, m);
		}

	}

	function rotateArtorias() {
		for (let i = 0; i < artorias.length; i++) {
			let m = artorias[i].modelMatrix;
			let tm = mat4.create();
			let tmInv = mat4.create();
			mat4.fromTranslation(tm, [-artorias[i].position[0], -artorias[i].position[1], -artorias[i].position[2]]);
			mat4.multiply(m, tm, m);
			mat4.invert(tmInv, tm);
			tm = mat4.create();
			mat4.fromYRotation(tm, toRadians(-90));
			mat4.multiply(m, tm, m);
			mat4.multiply(m, tmInv, m);
		}
	}

	var moveGhostLeft = true;
	var moveGhostForward = false;
	var moveGhostRight = false;
	var moveGhostBackwards = false;
	function moveGhost() {
		let value = Math.sin(toRadians((1 / 1.2) * timerFantasma * 0.001));
		if (value <= 0 && movFantasma) {
			if (moveGhostLeft) {
				for (let i = 0; i < artorias.length; i++) {
					let m = artorias[i].modelMatrix;
					let tm = mat4.create();
					mat4.fromTranslation(tm, [-0.1, 0, 0]);
					artorias[i].setPosition(artorias[i].position[0] - 0.1, artorias[i].position[1], artorias[i].position[2]);
					mat4.multiply(m, tm, m);
				}
			}
			if (moveGhostForward) {
				for (let i = 0; i < artorias.length; i++) {
					let m = artorias[i].modelMatrix;
					let tm = mat4.create();
					mat4.fromTranslation(tm, [0, 0, -0.1]);
					artorias[i].setPosition(artorias[i].position[0], artorias[i].position[1], artorias[i].position[2] - 0.1);
					mat4.multiply(m, tm, m);
				}
			}
			if (moveGhostRight) {
				for (let i = 0; i < artorias.length; i++) {
					let m = artorias[i].modelMatrix;
					let tm = mat4.create();
					mat4.fromTranslation(tm, [0.1, 0, 0]);
					artorias[i].setPosition(artorias[i].position[0] + 0.1, artorias[i].position[1], artorias[i].position[2]);
					mat4.multiply(m, tm, m);
				}
			}
			if (moveGhostBackwards) {
				for (let i = 0; i < artorias.length; i++) {
					let m = artorias[i].modelMatrix;
					let tm = mat4.create();
					mat4.fromTranslation(tm, [0, 0, 0.1]);
					artorias[i].setPosition(artorias[i].position[0], artorias[i].position[1], artorias[i].position[2] + 0.1);
					mat4.multiply(m, tm, m);
				}
			}
			if (artorias[0].position[0] <= -8 && artorias[0].position[2] >= 8 && moveGhostLeft) {
				moveGhostLeft = false;
				moveGhostForward = true;
				rotateArtorias();
			}
			if (artorias[0].position[0] <= -8 && artorias[0].position[2] <= -8 && moveGhostForward) {
				moveGhostForward = false;
				moveGhostRight = true;
				rotateArtorias();
			}
			if (artorias[0].position[0] >= 8 && artorias[0].position[2] <= -8 && moveGhostRight) {
				moveGhostRight = false;
				moveGhostBackwards = true;
				rotateArtorias();
			}
			if (artorias[0].position[0] >= 8 && artorias[0].position[2] >= 8 && moveGhostBackwards) {
				moveGhostBackwards = false;
				moveGhostLeft = true;
				rotateArtorias();
			}
		}

	}

	function crearLingotes() {
		for (let i = 0; i < 3; i++) {
			lingotes[i] = new SceneObject(gl, goldIngotGeometry, goldpileMaterial, [goldIngotTexture, goldIngotNormalTexture]);
		}
		lingotes[0].setPosition(2, 0, 1.5);
		lingotes[1].setPosition(-2, 0, -0.62);
		lingotes[2].setPosition(0, 0, 2);

		for (let i = 0; i < 3; i++) {
			lingotes[i].updateModelMatrix();
		}
	}
}



function updateView(gl, canvas, camera, forceUpdate = false) {
	// Obtenemos el tamaño en pantalla del canvas
	const displayWidth = Math.floor(canvas.clientWidth * window.devicePixelRatio)
	const displayHeight = Math.floor(canvas.clientHeight * window.devicePixelRatio)

	// Vemos si las dimensiones del buffer del canvas (numero de pixeles) coincide con su tamaño en pantalla
	if (forceUpdate || (canvas.width !== displayWidth) || (canvas.height !== displayHeight)) {
		// Ajustamos dimensiones del buffer para que coincidan con su tamaño en pantalla
		canvas.width = displayWidth
		canvas.height = displayHeight

		// Ajustamos relacion de aspecto de la camara
		camera.aspect = displayWidth / displayHeight
		camera.updateProjectionMatrix()

		// Actualizamos mapeo entre coorenadas del espacio de clipping (de -1 a 1) a pixeles en pantalla
		gl.viewport(0, 0, displayWidth, displayHeight)
	}
}

function idToColor(id) {
	// Convertimos el ID a un color
	let r = (id & 0x000000FF) >> 0;
	let g = (id & 0x0000FF00) >> 8;
	let b = (id & 0x00FF0000) >> 16;
	return [r / 255.0, g / 255.0, b / 255.0];
}

function colorToId(data) {
	// Convertimos un color a un ID
	let pickedID = data[0] + data[1] * 256 + data[2] * 256 * 256;
	return pickedID;
}
function toTextureCoordinatesSpace(position, camera) {
	const transformedPosition = position;

	// Transformacion a espacio del ojo
	vec4.transformMat4(transformedPosition, transformedPosition, camera.viewMatrix)

	// Transformacion a espacio de clipping
	vec4.transformMat4(transformedPosition, transformedPosition, camera.projectionMatrix)

	// Transformacion a coordenadas normalizadas del dispositivo (i.e. division perspectiva)
	const w = transformedPosition[3]
	vec4.scale(transformedPosition, transformedPosition, 1 / w)

	// Mapeo a rango de coordenadas de textura [-1, 1] -> [0, 1]
	vec4.add(transformedPosition, transformedPosition, [1.0, 1.0, 0.0, 0.0])
	vec4.scale(transformedPosition, transformedPosition, 0.5)

	return [transformedPosition[0], transformedPosition[1]]
}
