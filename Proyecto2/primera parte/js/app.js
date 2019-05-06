var esferas = [];

var luz1 = new Luz(); //luz direccional
luz1.set_light_intensity([1.0,1.0,1.0]);
luz1.set_spot_direction([0.0,-1.0,0.0,0.0]);
luz1.set_spot_angle(Math.cos(glMatrix.toRadian(45)));

var luz2 = new Luz(); // luz spot
luz2.set_light_intensity([1.0,1.0,1.0]);
luz2.set_spot_direction([0.0,-1.0,0.0,0.0]);
luz2.set_spot_angle(Math.cos(glMatrix.toRadian(50)));

var luz3 = new Luz(); //luz direccional
luz3.set_light_intensity([1.0,1.0,1.0]);
luz3.set_spot_direction([0.0,-1.0,0.0,0.0]);
luz3.set_spot_angle(Math.cos(glMatrix.toRadian(55)));

var timerRotarSobresuEje;
var timerRotacionRespecto;
var timerTecla;

var fpsElem = null;
var avgElem = null;
var frameTimes = [];
var maxFrames = 20;
let totalFPS = 0;
let frameCursor = 0;
let numFrames = 0; 

var canvas
var gl = null;
var shaderProgram  = null; //Shader program to use.

//Uniform locations.
var u_modelViewMatrix;
var u_modelViewProjMatrix;
var	u_normalMatrix;

var	u_k_ambient;
var	u_k_diffuse;
var	u_exp_spec;
var u_alphaX;
var u_alphaY;

var	u_light_pos1;
var	u_light_intensity1;
var u_spot_direction1;
var u_spot_angle1;

var	u_light_pos2;
var	u_light_intensity2;
var u_spot_direction2;
var u_spot_angle2;

var	u_light_pos3;
var	u_light_intensity3;
var u_spot_direction3;
var u_spot_angle3;

var posLocation;
var normLocation;

var cam = new Camera(); //vamos a controlar la camara desde esta clase
cam.setRadius(20);

var lampara1 = new ObjetoGrafico(); 
var lampara2 = new ObjetoGrafico(); 
var lampara3 = new ObjetoGrafico();
var plano = new ObjetoGrafico(); 

const DeltaRot=1; //cantidad de grados que rota
let teclaPresionada =false;

/*
	Inicialmente en la pantalla el evento de teclado solo puede capturar
	la tecla L la cual cumple la misma funcion de presionar primero el boton
	cargar y luego el boton renderizar.
	Es decir, ejecuta primero onLoad(), luego renderizar() y se habilitan los demas botones.
*/
function primerosEventos(){

	document.addEventListener('keydown', function (e) {
		switch(e.keyCode)
		{
			case 76 : {onLoad(); renderizar(); habilitarBotones(); break;}
		}

    }, false);
}

function onLoad() {
	
	//Una vez que se ejecuta esta función la cual prepara todo para poder renderizar,
	//el tamaño del canvas ya no puede editarse, por lo tanto la opcion de redimencionar
	//desaparece
	var Tabla_tam_can = document.getElementById('tabla_tam_canvas');
	Tabla_tam_can.style.display="none";

	//obtenemos el canvas donde vamos a dibujar
	canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	fpsElem = document.getElementById('fps');
	avgElem = document.getElementById('avg');

	//Agregamos eventos de teclado y mouse
	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	canvas.addEventListener("mouseout", mouseUp, false);
	canvas.addEventListener("mousemove", mouseMove, false);
	document.addEventListener('keydown', function (e) {
		
		//si es una de las teclas de movimiento uso timer, sino solo presiono una vez
		if( (e.keyCode==37) ||  (e.keyCode==39))
		{
			if (teclaPresionada==false)
			{
				teclaPresionada=true;
				timerTecla = setInterval(function() {Evento_teclado(e);},20);

			}
		}
		else
			Evento_teclado(e);
		
    }, false);

    document.addEventListener('keyup', function (e) {
    	
    	if((e.keyCode==37) ||  (e.keyCode==39))
    	{
    		teclaPresionada =false;
			clearInterval(timerTecla);
    	}
    	
	}, false);


	//ubico los modelos
	lampara1.setTrans([3.0,3.0,3.0]);
	luz1.set_light_pos(lampara1.getTrans());
	lampara2.setTrans([-3.0,3.0,3.0]);
	luz2.set_light_pos(lampara2.getTrans());
	lampara3.setTrans([0.0,3.0,-3.0]);
	luz3.set_light_pos(lampara3.getTrans());
	

	//vertexShaderSource y fragmentShaderSource estan importadas en index.html <script>
	//creo el shader
	shaderProgram = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
	//obtengo la direccion de las variables
	posLocation = gl.getAttribLocation(shaderProgram, 'vertexPosition');
	normLocation = gl.getAttribLocation(shaderProgram, 'vertexNormal');
	u_modelViewMatrix = gl.getUniformLocation(shaderProgram, 'modelViewMatrix');
	u_modelViewProjMatrix = gl.getUniformLocation(shaderProgram, 'modelViewProjMatrix');
	u_normalMatrix = gl.getUniformLocation(shaderProgram, 'normalMatrix');
	u_k_ambient = gl.getUniformLocation(shaderProgram, 'material.k_ambient');
	u_k_diffuse = gl.getUniformLocation(shaderProgram, 'material.k_diffuse');
	u_k_spec = gl.getUniformLocation(shaderProgram, 'material.k_spec');
	//u_exp_spec = gl.getUniformLocation(shaderProgram, 'exp_spec');

	u_light_pos1 = gl.getUniformLocation(shaderProgram, 'luz1.light_pos');
	u_light_intensity1 = gl.getUniformLocation(shaderProgram, 'luz1.light_intensity');
	u_spot_direction1 = gl.getUniformLocation(shaderProgram, 'luz1.spot_direction');
	u_spot_angle1 = gl.getUniformLocation(shaderProgram, 'luz1.spot_angle');
	u_light_pos2 = gl.getUniformLocation(shaderProgram, 'luz2.light_pos');
	u_light_intensity2 = gl.getUniformLocation(shaderProgram, 'luz2.light_intensity');
	u_spot_direction2 = gl.getUniformLocation(shaderProgram, 'luz2.spot_direction');
	u_spot_angle2 = gl.getUniformLocation(shaderProgram, 'luz2.spot_angle')
	u_light_pos3 = gl.getUniformLocation(shaderProgram, 'luz3.light_pos');
	u_light_intensity3 = gl.getUniformLocation(shaderProgram, 'luz3.light_intensity');
	u_spot_direction3 = gl.getUniformLocation(shaderProgram, 'luz3.spot_direction');
	u_spot_angle3 = gl.getUniformLocation(shaderProgram, 'luz3.spot_angle')

	u_alphaX = gl.getUniformLocation(shaderProgram, 'material.alphaX');
	u_alphaY = gl.getUniformLocation(shaderProgram, 'material.alphaY');
					
	plano.loadOBJ(planojs);
	lampara1.loadOBJ(lamparajs);
	lampara2.loadOBJ(lamparajs);
	lampara3.loadOBJ(lamparajs);
	cargarEsferas();
	

	//seteo el color del canvas
	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//para que los fragmentos no visibles no tapen a los visibles
	gl.enable(gl.DEPTH_TEST);

	//el boton de renderizar se habilita una vez que estemos listos para renderizar
	let boton_renderizar = document.getElementById('btnrenderizar');
	boton_renderizar.disabled=false;	
			
}
function renderizar(){
	//renderLoopTimer = setInterval("onRender()",16.666666);
	requestAnimationFrame(onRender);
}
let lastDrawTime = 0;
function onRender(now) {
	now *= 0.001;                            // milisegundos -> segundos
    const timeDelta = now - lastDrawTime;    // tiempo entre este frame y el anterior


	//limpio el canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//dibujo el plano
	plano.setMaterial(material_plano);
	plano.setScale(2);
	plano.draw();

	//dibujo las luces, acomodo sus posiciones y direcciones de acuerdo a las lamparas
	luz1.set_light_pos([lampara1.getTransX(),lampara1.getTransY(),lampara1.getTransZ(),1.0]); //para controlar la luz
	let new_spot_direction1 = vec4.create();
	vec4.transformQuat(new_spot_direction1,[0.0,-1.0,0.0,0.0],lampara1.getRotation());
	luz1.set_spot_direction(new_spot_direction1);
	lampara1.setMaterial(material_silver);
	lampara1.draw();	

	luz2.set_light_pos([lampara2.getTransX(),lampara2.getTransY(),lampara2.getTransZ(),1.0]);
	new_spot_direction = vec4.create();
	vec4.transformQuat(new_spot_direction,[0.0,-1.0,0.0,0.0],lampara2.getRotation());
	luz2.set_spot_direction(new_spot_direction);
	lampara2.setMaterial(material_silver);
	lampara2.draw();

	luz3.set_light_pos([lampara3.getTransX(),lampara3.getTransY(),lampara3.getTransZ(),1.0]);
	new_spot_direction = vec4.create();
	vec4.transformQuat(new_spot_direction,[0.0,-1.0,0.0,0.0],lampara3.getRotation());
	luz3.set_spot_direction(new_spot_direction);
	lampara3.setMaterial(material_silver);
	lampara3.draw();

	
	//dibujarEsferas
	let i = 0;
	let j = 0;
	for(i = 0; i<4; i++){
		for(j = 0; j<6; j++){
			esferas[i*6+j].draw();
		}
	}

	// Guardamos el momento en el que se dibujo este frame y solicitamos el proximo
	lastDrawTime = now;
	let fps = 1 / timeDelta
	fpsElem.value = fps.toFixed(1);
	// add the current fps and remove the oldest fps
	totalFPS += fps - (frameTimes[frameCursor] || 0);
	// record the newest fps
	frameTimes[frameCursor++] = fps;	
	// needed so the first N frames, before we have maxFrames, is correct.
	numFrames = Math.max(numFrames, frameCursor);	
	// wrap the cursor
	frameCursor %= maxFrames;  
	const averageFPS = totalFPS / numFrames;
	avgElem.value = averageFPS.toFixed(1);  // update avg display
	requestAnimationFrame(onRender);
	
}

//reordena los indices de un obj para poder ser dibujado en forma de wireframes
function reordenarIndices(srcIndices){
	let i = 0;
	let dstIndices = [];
		while(i<srcIndices.length){
			dstIndices.push(srcIndices[i]);
			dstIndices.push(srcIndices[i+1]);
			dstIndices.push(srcIndices[i+1]);
			dstIndices.push(srcIndices[i+2]);
			dstIndices.push(srcIndices[i+2]);
			dstIndices.push(srcIndices[i]);
			i = i+3;
		}	
	return dstIndices;
}

/*
	rota el objeto 1 sobre su propio eje
*/
function rotarObj(){
	if(document.getElementById('selectobj0').value=='Lampara1'){

		let eje = document.getElementById('selectobj1').value;
		
		if (eje=="No")
		{
			//si se selecciona "no" entonces limpio el timer
			clearInterval(timerRotarSobresuEje); 
			return;
		}
		{
			clearInterval(timerRotarSobresuEje); // limpio por cualquier movimiento anterior
			
			let delta = DeltaRot;
			let start = Date.now();
			timerRotarSobresuEje = setInterval(function() {
			
			let timePassed = Date.now() - start;
			if (timePassed >= 20000) {
				clearInterval(timerRotarSobresuEje); // termino a los 20 segundos
				document.getElementById('selectobj1').value="No";
				return;
			}
			if (eje=="Y")
			{
				lampara1.sumarAngleY(delta);
			}
				else if (eje=="X")
					lampara1.sumarAngleX(delta);
						else if (eje=="Z")
							lampara1.sumarAngleZ(delta);
								else if (eje=="XY")
								{
									lampara1.sumarAngleX(delta);
									lampara1.sumarAngleY(delta);
								}												
			
			}, 10);
		}
	}
	if(document.getElementById('selectobj0').value=='Lampara2'){
		let eje = document.getElementById('selectobj1').value;
	
		if (eje=="No")
		{
			//si se selecciona "no" entonces limpio el timer
			clearInterval(timerRotarSobresuEje); // limpio
			return;
		}
		{
			clearInterval(timerRotarSobresuEje); // limpio por cualquier movimiento anterior
			
			let delta = -DeltaRot;
			let start = Date.now();
			timerRotarSobresuEje = setInterval(function() {
			
			let timePassed = Date.now() - start;
			if (timePassed >= 20000) {
				clearInterval(timerRotarSobresuEje); // termino a los 20 segundos
				document.getElementById('selectobj1').value="No";
				return;
			}
			if (eje=="Y")
				lampara2.sumarAngleY(delta);
				else if (eje=="X")
					lampara2.sumarAngleX(delta);
						else if (eje=="Z")
							lampara2.sumarAngleZ(delta);
								else if (eje=="XY")
								{
									lampara2.sumarAngleX(delta);
									lampara2.sumarAngleY(delta);
								}
			
			}, 10);
		}
	}
}

function rotarAlrededorPunto(objeto,punto,angulo) {		
		objeto.rotarRespectoA(punto,angulo);		
	
	}

function rotacionResp(punto)
{
	let obj1 = sel;
	let obj2;
	let delta;
	if(obj1==lampara1){
		obj2 = lampara2;
		delta = -3;
	}
	if(obj1==lampara2){
		obj2 = lampara1;
		delta = 3;
	}	
	let eje;
	if(punto == null){
		//si no se pasa ningun punto por parametro, se rota respecto al otro objeto, 
		//por lo tanto se toma el eje seleccionado en el select 4
		eje = document.getElementById('selectobj4').value;	
		document.getElementById('selectobj3').value="No"; //reestablezco la opcion en la otra rotacion 
	}else{
		//si se pasa un punto por parametro, se rota respecto al punto, por lo tanto
		//se toma el eje seleccionado en el select 3
		eje = document.getElementById('selectobj3').value;
		document.getElementById('selectobj4').value="No";
	}
		if (eje=="No")
		{
			//si se selecciona "no" entonces limpio el timer
			clearInterval(timerRotacionRespecto); 
			return;
		}
		{
			clearInterval(timerRotacionRespecto); // limpio por cualquier movimiento anterior		
			let start = Date.now();
			timerRotacionRespecto = setInterval(function() {			
			let timePassed = Date.now() - start;
			if (timePassed >= 20000) {
				clearInterval(timerRotacionRespecto); // termino a los 20 segundos
				document.getElementById('selectobj3').value="No";
				document.getElementById('selectobj4').value="No";
				return;
			}
		if(punto == null){
			punto = obj2.getTrans();
		}
		if(eje=="X"){
			rotarAlrededorPunto(obj1,punto,[delta,0,0]);
		}
		if(eje=="Y"){
			rotarAlrededorPunto(obj1,punto,[0,delta,0]);
		}
		if(eje=="Z"){
			rotarAlrededorPunto(obj1,punto,[0,0,delta]);
		}
			}, 20);
		}
}


function limpiar_timers()
{
	clearInterval(timerOnClick);
	clearInterval(timerOrbitar);
	clearInterval(timerRotarSobresuEje);
	clearInterval(timerRotacionRespecto);
	clearInterval(timerTecla);

}

function habilitarBotones()
{
	document.getElementById('Frente').disabled=false;
	document.getElementById('Trasera').disabled=false;
	document.getElementById('Izquierda').disabled=false;
	document.getElementById('Derecha').disabled=false;
	document.getElementById('btnOrbitar').disabled=false;
	document.getElementById('btnReiniciar').disabled=false;
	
	document.getElementById('b1').disabled=false;
	document.getElementById('b2').disabled=false;
	document.getElementById('b3').disabled=false;
	document.getElementById('b4').disabled=false;
	document.getElementById('b5').disabled=false;
	document.getElementById('b6').disabled=false;
	document.getElementById('b7').disabled=false;
	document.getElementById('b8').disabled=false;
	document.getElementById('b9').disabled=false;
	document.getElementById('b10').disabled=false;
	document.getElementById('b11').disabled=false;
	document.getElementById('b12').disabled=false;
	document.getElementById('b13').disabled=false;
	document.getElementById('b14').disabled=false;
	

	
	document.getElementById('selectobj0').disabled=false;
	document.getElementById('selectobj1').disabled=false;
	document.getElementById('selectobj3').disabled=false;
	document.getElementById('selectobj4').disabled=false;
	
	document.getElementById('btn1').disabled=false;
	document.getElementById('btn2').disabled=false;
	document.getElementById('btn3').disabled=false;
	document.getElementById('btn4').disabled=false;
	document.getElementById('btn5').disabled=false;
	document.getElementById('btn6').disabled=false;
	document.getElementById('btn7').disabled=false;

	document.getElementById('btnCamPhi').disabled=false;
	document.getElementById('btnCamTheta').disabled=false;
	document.getElementById('btnCamRadius').disabled=false;
	document.getElementById('btnFovy').disabled=false;

	document.getElementById('btnFocoTaza').disabled=false;
	document.getElementById('btnFocoCafetera').disabled=false;
	document.getElementById('btnFocoCentro').disabled=false;
}
function cargarEsferas(){
	let esferaParsedOBJ = OBJParser.parseFile(esferaOBJ);		
    let indicesEsfera = esferaParsedOBJ.indices;
    let positionsEsfera = esferaParsedOBJ.positions;
	let normalesEsfera = esferaParsedOBJ.normals;
	let esfera_vertexAttributeInfoArray = [
        new VertexAttributeInfo(positionsEsfera, posLocation, 3),
        new VertexAttributeInfo(normalesEsfera, normLocation, 3)
    ];
	esfera_vao = VAOHelper.create(indicesEsfera, esfera_vertexAttributeInfoArray);
	let i = 0;
	let j = 0;
	for(i = 0; i<4; i++){
		//console.log("cargando..."+i*25+"%");
		for(j = 0; j<6; j++){
			esferas[i*6+j] = new ObjetoGrafico();
			esferas[i*6+j].setTrans([3*i-4.0,0.0,3*j-6.0]);
			esferas[i*6+j].setParsedOBJ(esferaParsedOBJ);
			esferas[i*6+j].setVao(esfera_vao);
			if(i==0) esferas[i*6+j].setMaterial(material_gold);
			if(i==1) esferas[i*6+j].setMaterial(material_brass);
			if(i==2) esferas[i*6+j].setMaterial(material_blackplastic);
			if(i==3) esferas[i*6+j].setMaterial(material_pearl);
		}
	}

}
