var esferas = [];
var renderloopid;

var luz1 = new Luz(); //luz roja nave

luz1.set_spot_direction([0.0,-1.0,0.5,0.0]);
luz1.set_spot_angle(Math.cos(glMatrix.toRadian(15)));

var luz2 = new Luz(); // luz verde nave

luz2.set_spot_direction([-0.5,-1.0,0.0,0.0]);
luz2.set_spot_angle(Math.cos(glMatrix.toRadian(15)));

var luz3 = new Luz(); //luz azul nave

luz3.set_spot_direction([0.5,-1.0,0.0,0.0]);
luz3.set_spot_angle(Math.cos(glMatrix.toRadian(15)));

var luz4 = new Luz(); //luz direccional

luz4.set_light_pos([0.0,-1.0,0.0,0.0]);

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
var lastDrawTime = 0;

var canvas
var gl = null;
var shaderProgram  = null; //Shader program to use.
var shaderProgramCookTorrance = null;

//Uniform de matrices
var u_modelMatrix;
var u_viewMatrix;
var	u_projectionMatrix;
var u_modelViewMatrix;
var u_modelViewProjectionMatrix
var	u_normalMatrix;

//Uniform de materiales
var	u_k_ambient;
var	u_k_diffuse;
var	u_exp_spec;
var u_alphaX;
var u_alphaY;
var u_f0;
var u_m;

//Uniform de luces
var	u_light_pos1;
var	u_light_intensity1;
var u_spot_direction1;
var u_spot_angle1;
var u_light_attenuation_a1;
var u_light_attenuation_b1;

var	u_light_pos2;
var	u_light_intensity2;
var u_spot_direction2;
var u_spot_angle2;
var u_light_attenuation_a2;
var u_light_attenuation_b2;

var	u_light_pos3;
var	u_light_intensity3;
var u_spot_direction3;
var u_spot_angle3;
var u_light_attenuation_a3;
var u_light_attenuation_b3;

var	u_light_pos4;
var	u_light_intensity4;
var u_spot_direction4;
var u_spot_angle4;
var u_light_attenuation_a4;
var u_light_attenuation_b4;

var posLocation;
var normLocation;

var cam = new Camera(); //vamos a controlar la camara desde esta clase
cam.setRadius(20);

var plano = new ObjetoGrafico();
var alien= new ObjetoGrafico();
var platoVolador= new ObjetoGrafico();
var silo=new ObjetoGrafico();

var arboles=new ObjetoGrafico();
var arboles2=new ObjetoGrafico();
var arboles3=new ObjetoGrafico();
var arboles4=new ObjetoGrafico();

var tractor=new ObjetoGrafico();

var granero=new ObjetoGrafico();
var luzEnCamara = "NO";

var renderMode = 'RENDERMODE_COOK_TORRANCE'; //shader por defecto
//var renderMode = 'RENDERMODE_WARD';

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


	//intensidad de las luces de la nave
	luz3.set_light_intensity(luz_azul);
	luz1.set_light_intensity(luz_roja);
	luz2.set_light_intensity(luz_verde);
    
    luz4.set_light_intensity(luz_dia);
	//ubico los modelos
	
	alien.setMaterial(material_redplastic);
	alien.setScale(0.3);
	alien.setTrans([0.0,0.0,0.0]);

	arboles.setMaterial(material_greenplastic);
	arboles.setScale(2.5);
	arboles.setTrans([10.0,0.0,10.0]);
	
	arboles2.setMaterial(material_greenplastic);
	arboles2.setScale(2.5);
	arboles2.setTrans([13.0,0.0,0.0]);

	arboles3.setMaterial(material_greenplastic);
	arboles3.setScale(2.5);
	arboles3.setTrans([13.0,0.0,5.0]);

	arboles4.setMaterial(material_greenplastic);
	arboles4.setScale(2.5);
	arboles4.setTrans([13.0,0.0,-5.0]);

	silo.setMaterial(material_silver);
	silo.setScale(2.0);
	silo.setTrans([-10.0,0.0,-7.0]);

	granero.setMaterial(material_blueplastic);
	granero.setScale(3.5);
	granero.setTrans([-3.0,0.0,-10.0]);

	tractor.setMaterial(material_oxido);
	tractor.setScale(3.0);
	tractor.setTrans([-10.0,0.0,0.0]);

	platoVolador.setMaterial(material_copper);
	platoVolador.setScale(3.5);
	platoVolador.setTrans([0.0,15.0,0.0]);

  	plano.setMaterial(material_plano);	
	plano.setScale(2);
	//ubicacion de las luces de la nave
	luz1.set_light_pos(platoVolador.getTrans(),1.0);
	luz2.set_light_pos(platoVolador.getTrans(),1.0);
	luz3.set_light_pos(platoVolador.getTrans(),1.0);
	
	
	
	
	//creo los shader
	shaderProgramCookTorrance = ShaderProgramHelper.create(vertexShaderCookTorrance, fragmentShaderCookTorrance);
	shaderProgramWard = ShaderProgramHelper.create(vertexShaderWard, fragmentShaderWard);
	
	//seteo el color del canvas
	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//para que los fragmentos no visibles no tapen a los visibles
	gl.enable(gl.DEPTH_TEST);

	//el boton de renderizar se habilita una vez que estemos listos para renderizar
	let boton_renderizar = document.getElementById('btnrenderizar');
	boton_renderizar.disabled=false;	
			
}
function cargarObjetos(){	
	plano.loadOBJ(planojs);
	tractor.loadOBJ(tractorjs);
	silo.loadOBJ(silojs);	
	arboles.loadOBJ(arbolesjs);
	arboles2.loadOBJ(arbolesjs);	
	arboles3.loadOBJ(arbolesjs);
	arboles4.loadOBJ(arbolesjs);
	granero.loadOBJ(granerojs);		
	platoVolador.loadOBJ(platoVoladorjs);
	alien.loadOBJ(alienjs);
	
}
function renderizar(){
	if(renderMode == 'RENDERMODE_COOK_TORRANCE')setShaderCookTorrance();
	if(renderMode == 'RENDERMODE_WARD')setShaderWard();
	cargarObjetos();
	renderloopid = requestAnimationFrame(onRender);

}
function onRender(now) {
	now *= 0.001;                            // milisegundos -> segundos
	const timeDelta = now - lastDrawTime;    // tiempo entre este frame y el anterior

	//actualizo posiciones y direcciones, ya que las lamparas y luces estan conectadas
	if(luzEnCamara == 'NAVE'){
		
		cam.setObjetivo(platoVolador);
		cam.setRadius(0);
	}
	
	if(renderMode == 'RENDERMODE_COOK_TORRANCE')renderWithCookTorrance();
	if(renderMode == 'RENDERMODE_WARD')renderWithWard();
	

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
	renderloopid = requestAnimationFrame(onRender);	
}

function renderWithCookTorrance(){
	//limpio el canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//dibujo el plano
	drawWithCookTorrance(plano);

	//dibujo las luces, acomodo sus posiciones y direcciones de acuerdo a las lamparas
	luz1.set_light_pos([platoVolador.getTransX(),platoVolador.getTransY(),platoVolador.getTransZ(),1.0]); //para controlar la luz
	let new_spot_direction1 = vec4.create();
	vec4.transformQuat(new_spot_direction1,[-0.1,-1.0,0.0,0.0],platoVolador.getRotation());
	luz1.set_spot_direction(new_spot_direction1);	
	

	luz2.set_light_pos([platoVolador.getTransX(),platoVolador.getTransY(),platoVolador.getTransZ(),1.0]);
	let new_spot_direction2 = vec4.create();
	vec4.transformQuat(new_spot_direction2,[0.1,-1.0,0.0,0.0],platoVolador.getRotation());
	luz2.set_spot_direction(new_spot_direction2);
	

	luz3.set_light_pos([platoVolador.getTransX(),platoVolador.getTransY(),platoVolador.getTransZ(),1.0]);
	let new_spot_direction3 = vec4.create();
	vec4.transformQuat(new_spot_direction3,[0.0,-1.0,0.1,0.0],platoVolador.getRotation());
	luz3.set_spot_direction(new_spot_direction3);
	

	luz4.set_light_pos([-0.3,-1.0,0.0,0.0]);

	
	//dibujo alien
	drawWithCookTorrance(alien);

	//dibujo plato
	drawWithCookTorrance(platoVolador);
	//dibujo arboles
	drawWithCookTorrance(arboles);
	drawWithCookTorrance(arboles2);
	drawWithCookTorrance(arboles3);
	drawWithCookTorrance(arboles4);
	//dibujo tractor
	drawWithCookTorrance(tractor);
	//dibujo silo
	drawWithCookTorrance(silo);
	drawWithCookTorrance(granero);


}

function renderWithWard(){
	//limpio el canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//dibujo el plano
	drawWithWard(plano);

	//dibujo las luces, acomodo sus posiciones y direcciones de acuerdo a las lamparas
	luz1.set_light_pos([platoVolador.getTransX(),platoVolador.getTransY(),platoVolador.getTransZ(),1.0]); //para controlar la luz
	let new_spot_direction1 = vec4.create();
	vec4.transformQuat(new_spot_direction1,[0.0,-1.0,0.0,0.0],platoVolador.getRotation());
	luz1.set_spot_direction(new_spot_direction1);	
	

	luz2.set_light_pos([platoVolador.getTransX(),platoVolador.getTransY(),platoVolador.getTransZ(),1.0]);
	let new_spot_direction2 = vec4.create();
	vec4.transformQuat(new_spot_direction2,[0.0,-1.0,0.0,0.0],platoVolador.getRotation());
	luz2.set_spot_direction(new_spot_direction2);
	

	luz3.set_light_pos([platoVolador.getTransX(),platoVolador.getTransY(),platoVolador.getTransZ(),1.0]);
	let new_spot_direction3 = vec4.create();
	vec4.transformQuat(new_spot_direction3,[0.0,-1.0,0.0,0.0],platoVolador.getRotation());
	luz3.set_spot_direction(new_spot_direction3);
	

	//dibujo alien
	drawWithWard(alien);

	//dibujo plato
	drawWithWard(platoVolador);
	//dibujo arboles
	drawWithWard(arboles);
	drawWithWard(arboles2);
	drawWithWard(arboles3);
	drawWithWard(arboles4);
	//dibujo tractor
	drawWithWard(tractor);
	//dibujo silo
	drawWithWard(silo);
	drawWithWard(granero);

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
/**function rotarObj(){
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
*/

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
	
	document.getElementById('selectobj0').disabled=false;
	document.getElementById('selectobj1').disabled=false;
	document.getElementById('selectobj2').disabled=false;
	document.getElementById('selectobj3').disabled=false;

	///document.getElementById('rangeA').disabled=false;
	//document.getElementById('rangeD').disabled=false;
	//document.getElementById('rangeS').disabled=false;
	
	document.getElementById('sliderf0').disabled=false;
	document.getElementById('sliderm').disabled=false;
	document.getElementById('sliderax').disabled=false;
	document.getElementById('slideray').disabled=false;
	document.getElementById('slidersigma').disabled=false;

	document.getElementById('btnRed').disabled=false;
	document.getElementById('btnGreen').disabled=false;
	document.getElementById('btnBlue').disabled=false;

	document.getElementById('btn1').disabled=false;
	document.getElementById('btn2').disabled=false;
	document.getElementById('btn3').disabled=false;
	document.getElementById('btn4').disabled=false;
	document.getElementById('btn5').disabled=false;
	document.getElementById('btn6').disabled=false;

	document.getElementById('btnCamPhi').disabled=false;
	document.getElementById('btnCamTheta').disabled=false;
	document.getElementById('btnCamRadius').disabled=false;
	document.getElementById('btnFovy').disabled=false;

	document.getElementById('btnFocoCentro').disabled=false;
	document.getElementById('btnFocoAlien').disabled=false;
	document.getElementById('btnFocoNave').disabled=false;
	document.getElementById('btnFocoTractor').disabled=false;
}


function drawWithCookTorrance(objeto){//dibujamos el objeto con el shader de cook torrance

		gl.useProgram(shaderProgram);

		let model_view_matrix = mat4.create();
		mat4.mul(model_view_matrix,cam.getView(),objeto.getModelMatrix());
		gl.uniformMatrix4fv(u_modelViewMatrix, false, model_view_matrix);

		gl.uniformMatrix4fv(u_viewMatrix,false,cam.getView());
		gl.uniformMatrix4fv(u_projectionMatrix,false,cam.getProj());

		gl.uniformMatrix4fv(u_modelMatrix,false,objeto.getModelMatrix());

		let normalMatrix = mat4.create();
		mat4.mul(normalMatrix,cam.getView(),objeto.getModelMatrix());
		mat4.invert(normalMatrix,normalMatrix);
		mat4.transpose(normalMatrix,normalMatrix);
		gl.uniformMatrix4fv(u_normalMatrix, false, normalMatrix);

        gl.uniform3fv(u_k_ambient, objeto.material.get_k_ambient());
        gl.uniform3fv(u_k_diffuse, objeto.material.get_k_diffuse());
        gl.uniform3fv(u_k_spec, objeto.material.get_k_spec());
        gl.uniform1f(u_f0,objeto.material.get_f0());
        gl.uniform1f(u_m,objeto.material.get_m());

	
        //luces
        //luz1
        let light_pos_eye1 = vec4.create();
        vec4.transformMat4(light_pos_eye1,luz1.get_light_pos(),cam.getView());
        gl.uniform4fv(u_light_pos1, light_pos_eye1);

        let spot_direction_eye1 = vec4.create();
        vec4.transformMat4(spot_direction_eye1,luz1.get_spot_direction(),cam.getView());
        gl.uniform4fv(u_spot_direction1, spot_direction_eye1);

        gl.uniform3fv(u_light_intensity1, luz1.get_light_intensity());
		gl.uniform1f(u_spot_angle1, luz1.get_spot_angle());
		gl.uniform1f(u_light_attenuation_a1, luz1.get_attenuation_a());
		gl.uniform1f(u_light_attenuation_b1, luz1.get_attenuation_b());

        //luz2
        let light_pos_eye2 = vec4.create();
        vec4.transformMat4(light_pos_eye2,luz2.get_light_pos(),cam.getView());
        gl.uniform4fv(u_light_pos2, light_pos_eye2);

        let spot_direction_eye2 = vec4.create();
        vec4.transformMat4(spot_direction_eye2,luz2.get_spot_direction(),cam.getView());
        gl.uniform4fv(u_spot_direction2, spot_direction_eye2);

        gl.uniform3fv(u_light_intensity2, luz2.get_light_intensity());
		gl.uniform1f(u_spot_angle2, luz2.get_spot_angle());
		gl.uniform1f(u_light_attenuation_a2, luz2.get_attenuation_a());
		gl.uniform1f(u_light_attenuation_b2, luz2.get_attenuation_b());

        //luz3
        let light_pos_eye3 = vec4.create();
        vec4.transformMat4(light_pos_eye3,luz3.get_light_pos(),cam.getView());
        gl.uniform4fv(u_light_pos3, light_pos_eye3);

        let spot_direction_eye3 = vec4.create();
        vec4.transformMat4(spot_direction_eye3,luz3.get_spot_direction(),cam.getView());
        gl.uniform4fv(u_spot_direction3, spot_direction_eye3);

        gl.uniform3fv(u_light_intensity3, luz3.get_light_intensity());
		gl.uniform1f(u_spot_angle3, luz3.get_spot_angle());
		gl.uniform1f(u_light_attenuation_a3, luz3.get_attenuation_a());
		gl.uniform1f(u_light_attenuation_b3, luz3.get_attenuation_b());
		//luz4
		let light_pos_eye4 = vec4.create();
        vec4.transformMat4(light_pos_eye4,luz4.get_light_pos(),cam.getView());
        gl.uniform4fv(u_light_pos4, light_pos_eye4);

        let spot_direction_eye4 = vec4.create();
        vec4.transformMat4(spot_direction_eye4,luz4.get_spot_direction(),cam.getView());
        gl.uniform4fv(u_spot_direction4, spot_direction_eye4);

        gl.uniform3fv(u_light_intensity4, luz4.get_light_intensity());
		gl.uniform1f(u_spot_angle4, luz4.get_spot_angle());
		gl.uniform1f(u_light_attenuation_a4, luz4.get_attenuation_a());
		gl.uniform1f(u_light_attenuation_b4, luz4.get_attenuation_b());

        //elijo el vao a usar y llamo a draw elements
        gl.bindVertexArray(objeto.getVao());
        gl.drawElements(gl.TRIANGLES, objeto.getParsedOBJ().indices.length, gl.UNSIGNED_INT, 0);
        //desconecto el vao y el shader
        gl.bindVertexArray(null);
        gl.useProgram(null);
}

function drawWithWard(objeto){//dibujamos el objeto con el shader de cook torrance

	gl.useProgram(shaderProgram);

	let model_view_matrix = mat4.create();
	mat4.mul(model_view_matrix,cam.getView(),objeto.getModelMatrix());
	gl.uniformMatrix4fv(u_modelViewMatrix, false, model_view_matrix);

	let model_view_projection_matrix = mat4.create();
    mat4.mul(model_view_projection_matrix,cam.getProj(),model_view_matrix);
    gl.uniformMatrix4fv(u_modelViewProjectionMatrix, false, model_view_projection_matrix);

	let normalMatrix = mat4.create();
	mat4.mul(normalMatrix,cam.getView(),objeto.getModelMatrix());
	mat4.invert(normalMatrix,normalMatrix);
	mat4.transpose(normalMatrix,normalMatrix);
	gl.uniformMatrix4fv(u_normalMatrix, false, normalMatrix);

	gl.uniform3fv(u_k_ambient, objeto.material.get_k_ambient());
	gl.uniform3fv(u_k_diffuse, objeto.material.get_k_diffuse());
	gl.uniform3fv(u_k_spec, objeto.material.get_k_spec());
	gl.uniform1f(u_alphaX,objeto.material.get_alpha_x());
	gl.uniform1f(u_alphaY,objeto.material.get_alpha_y());


	//luces
	//luz1
	let light_pos_eye1 = vec4.create();
	vec4.transformMat4(light_pos_eye1,luz1.get_light_pos(),cam.getView());
	gl.uniform4fv(u_light_pos1, light_pos_eye1);

	let spot_direction_eye1 = vec4.create();
	vec4.transformMat4(spot_direction_eye1,luz1.get_spot_direction(),cam.getView());
	gl.uniform4fv(u_spot_direction1, spot_direction_eye1);

	gl.uniform3fv(u_light_intensity1, luz1.get_light_intensity());
	gl.uniform1f(u_spot_angle1, luz1.get_spot_angle());
	gl.uniform1f(u_light_attenuation_a1, luz1.get_attenuation_a());
	gl.uniform1f(u_light_attenuation_b1, luz1.get_attenuation_b());

	//luz2
	let light_pos_eye2 = vec4.create();
	vec4.transformMat4(light_pos_eye2,luz2.get_light_pos(),cam.getView());
	gl.uniform4fv(u_light_pos2, light_pos_eye2);

	let spot_direction_eye2 = vec4.create();
	vec4.transformMat4(spot_direction_eye2,luz2.get_spot_direction(),cam.getView());
	gl.uniform4fv(u_spot_direction2, spot_direction_eye2);

	gl.uniform3fv(u_light_intensity2, luz2.get_light_intensity());
	gl.uniform1f(u_spot_angle2, luz2.get_spot_angle());
	gl.uniform1f(u_light_attenuation_a2, luz2.get_attenuation_a());
	gl.uniform1f(u_light_attenuation_b2, luz2.get_attenuation_b());

	//luz3
	let light_pos_eye3 = vec4.create();
	vec4.transformMat4(light_pos_eye3,luz3.get_light_pos(),cam.getView());
	gl.uniform4fv(u_light_pos3, light_pos_eye3);

	let spot_direction_eye3 = vec4.create();
	vec4.transformMat4(spot_direction_eye3,luz3.get_spot_direction(),cam.getView());
	gl.uniform4fv(u_spot_direction3, spot_direction_eye3);

	gl.uniform3fv(u_light_intensity3, luz3.get_light_intensity());
	gl.uniform1f(u_spot_angle3, luz3.get_spot_angle());
	gl.uniform1f(u_light_attenuation_a3, luz3.get_attenuation_a());
	gl.uniform1f(u_light_attenuation_b3, luz3.get_attenuation_b());

	//luz4
	let light_pos_eye4 = vec4.create();
	vec4.transformMat4(light_pos_eye4,luz4.get_light_pos(),cam.getView());
	gl.uniform4fv(u_light_pos4, light_pos_eye4);

	let spot_direction_eye4 = vec4.create();
	vec4.transformMat4(spot_direction_eye4,luz4.get_spot_direction(),cam.getView());
	gl.uniform4fv(u_spot_direction4, spot_direction_eye4);

	gl.uniform3fv(u_light_intensity4, luz4.get_light_intensity());
	gl.uniform1f(u_spot_angle4, luz4.get_spot_angle());
	gl.uniform1f(u_light_attenuation_a4, luz4.get_attenuation_a());
	gl.uniform1f(u_light_attenuation_b4, luz4.get_attenuation_b());

	//elijo el vao a usar y llamo a draw elements
	gl.bindVertexArray(objeto.getVao());
	gl.drawElements(gl.TRIANGLES, objeto.getParsedOBJ().indices.length, gl.UNSIGNED_INT, 0);
	//desconecto el vao y el shader
	gl.bindVertexArray(null);
	gl.useProgram(null);
}

function setShaderCookTorrance(){
	shaderProgram = shaderProgramCookTorrance;

	posLocation = gl.getAttribLocation(shaderProgram, 'vertexPosition');
	normLocation = gl.getAttribLocation(shaderProgram, 'vertexNormal');

	u_modelViewMatrix = gl.getUniformLocation(shaderProgram, 'modelViewMatrix');
	u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
	u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
	u_projectionMatrix = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
	u_normalMatrix = gl.getUniformLocation(shaderProgram, 'normalMatrix');

	u_k_ambient = gl.getUniformLocation(shaderProgram, 'material.k_ambient');
	u_k_diffuse = gl.getUniformLocation(shaderProgram, 'material.k_diffuse');
	u_k_spec = gl.getUniformLocation(shaderProgram, 'material.k_spec');
	u_f0 = gl.getUniformLocation(shaderProgram, 'material.f0');
	u_m = gl.getUniformLocation(shaderProgram, 'material.m');

	u_light_pos1 = gl.getUniformLocation(shaderProgram, 'luz1.pos');
	u_light_intensity1 = gl.getUniformLocation(shaderProgram, 'luz1.intensity');
	u_spot_direction1 = gl.getUniformLocation(shaderProgram, 'luz1.spot_direction');
	u_spot_angle1 = gl.getUniformLocation(shaderProgram, 'luz1.spot_angle');
	u_light_attenuation_a1 = gl.getUniformLocation(shaderProgram, 'luz1.attenuation_a');
	u_light_attenuation_b1 = gl.getUniformLocation(shaderProgram, 'luz1.attenuation_b');

	u_light_pos2 = gl.getUniformLocation(shaderProgram, 'luz2.pos');
	u_light_intensity2 = gl.getUniformLocation(shaderProgram, 'luz2.intensity');
	u_spot_direction2 = gl.getUniformLocation(shaderProgram, 'luz2.spot_direction');
	u_spot_angle2 = gl.getUniformLocation(shaderProgram, 'luz2.spot_angle')
	u_light_attenuation_a2 = gl.getUniformLocation(shaderProgram, 'luz2.attenuation_a');
	u_light_attenuation_b2 = gl.getUniformLocation(shaderProgram, 'luz2.attenuation_b');

	u_light_pos3 = gl.getUniformLocation(shaderProgram, 'luz3.pos');
	u_light_intensity3 = gl.getUniformLocation(shaderProgram, 'luz3.intensity');
	u_spot_direction3 = gl.getUniformLocation(shaderProgram, 'luz3.spot_direction');
	u_spot_angle3 = gl.getUniformLocation(shaderProgram, 'luz3.spot_angle')
	u_light_attenuation_a3 = gl.getUniformLocation(shaderProgram, 'luz3.attenuation_a');
	u_light_attenuation_b3 = gl.getUniformLocation(shaderProgram, 'luz3.attenuation_b');

	u_light_pos4 = gl.getUniformLocation(shaderProgram, 'luz4.pos');
	u_light_intensity4 = gl.getUniformLocation(shaderProgram, 'luz4.intensity');
	u_spot_direction4 = gl.getUniformLocation(shaderProgram, 'luz4.spot_direction');
	u_spot_angle4 = gl.getUniformLocation(shaderProgram, 'luz4.spot_angle')
	u_light_attenuation_a4 = gl.getUniformLocation(shaderProgram, 'luz4.attenuation_4');
	u_light_attenuation_b4 = gl.getUniformLocation(shaderProgram, 'luz4.attenuation_4');




}
function setShaderWard(){
	shaderProgram = shaderProgramWard;

	posLocation = gl.getAttribLocation(shaderProgram, 'vertexPosition');
	normLocation = gl.getAttribLocation(shaderProgram, 'vertexNormal');

	u_modelViewMatrix = gl.getUniformLocation(shaderProgram, 'modelViewMatrix');
	u_modelViewProjectionMatrix = gl.getUniformLocation(shaderProgram, 'modelViewProjMatrix');
	u_normalMatrix = gl.getUniformLocation(shaderProgram, 'normalMatrix');

	u_k_ambient = gl.getUniformLocation(shaderProgram, 'material.k_ambient');
	u_k_diffuse = gl.getUniformLocation(shaderProgram, 'material.k_diffuse');
	u_k_spec = gl.getUniformLocation(shaderProgram, 'material.k_spec');
	u_alphaX = gl.getUniformLocation(shaderProgram, 'material.alphaX');
	u_alphaY = gl.getUniformLocation(shaderProgram, 'material.alphaY');

	u_light_pos1 = gl.getUniformLocation(shaderProgram, 'luz1.pos');
	u_light_intensity1 = gl.getUniformLocation(shaderProgram, 'luz1.intensity');
	u_spot_direction1 = gl.getUniformLocation(shaderProgram, 'luz1.spot_direction');
	u_spot_angle1 = gl.getUniformLocation(shaderProgram, 'luz1.spot_angle');
	u_light_attenuation_a1 = gl.getUniformLocation(shaderProgram, 'luz1.attenuation_a');
	u_light_attenuation_b1 = gl.getUniformLocation(shaderProgram, 'luz1.attenuation_b');

	u_light_pos2 = gl.getUniformLocation(shaderProgram, 'luz2.pos');
	u_light_intensity2 = gl.getUniformLocation(shaderProgram, 'luz2.intensity');
	u_spot_direction2 = gl.getUniformLocation(shaderProgram, 'luz2.spot_direction');
	u_spot_angle2 = gl.getUniformLocation(shaderProgram, 'luz2.spot_angle');
	u_light_attenuation_a2 = gl.getUniformLocation(shaderProgram, 'luz2.attenuation_a');
	u_light_attenuation_b2 = gl.getUniformLocation(shaderProgram, 'luz2.attenuation_b');

	u_light_pos3 = gl.getUniformLocation(shaderProgram, 'luz3.pos');
	u_light_intensity3 = gl.getUniformLocation(shaderProgram, 'luz3.intensity');
	u_spot_direction3 = gl.getUniformLocation(shaderProgram, 'luz3.spot_direction');
	u_spot_angle3 = gl.getUniformLocation(shaderProgram, 'luz3.spot_angle');
	u_light_attenuation_a3 = gl.getUniformLocation(shaderProgram, 'luz3.attenuation_a');
	u_light_attenuation_b3 = gl.getUniformLocation(shaderProgram, 'luz3.attenuation_b');

}

function changeRender(){
	let mode = document.getElementById('renderOption').value;
	if(mode == 'RENDERMODE_COOK_TORRANCE') renderMode = 'RENDERMODE_COOK_TORRANCE';
	if(mode == 'RENDERMODE_WARD') renderMode = 'RENDERMODE_WARD';
	cancelAnimationFrame(renderloopid);

	renderizar();
}