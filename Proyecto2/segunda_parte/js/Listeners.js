var sel = alien; //objeto seleccionado

var selLight=luz1; //luz seleccionada

var Orbitando=false;

//funciones que reaccionan a los botones/sliders del panel
function onSliderRotationX(slider) {	
	sel.setAngleX(parseFloat(slider.value));
}

function onSliderRotationY(slider) {	
	sel.setAngleY(parseFloat(slider.value));	
}

function onSliderRotationZ(slider) {
	sel.setAngleZ(parseFloat(slider.value));	
}

function onSliderRed(slider) {
	if(selLight==luz1){
		selLight.set_light_intensity([parseFloat(slider.value),selLight.get_light_intensity()[1],selLight.get_light_intensity()[2]]);
	}
	else
	selLight.set_light_intensity([parseFloat(slider.value),selLight.get_light_intensity()[1],selLight.get_light_intensity()[2]]);
}

function onSliderGreen(slider) {
	if(selLight==luz1){
		luz2.set_light_intensity([luz2.get_light_intensity()[0],parseFloat(slider.value),luz2.get_light_intensity()[2]]);
	}
	else	
	selLight.set_light_intensity([selLight.get_light_intensity()[0],parseFloat(slider.value),selLight.get_light_intensity()[2]]);
}

function onSliderBlue(slider) {
	if(selLight==luz1){
		luz3.set_light_intensity([luz3.get_light_intensity()[0],luz3.get_light_intensity()[1],parseFloat(slider.value)]);
	}
	else
	selLight.set_light_intensity([selLight.get_light_intensity()[0],selLight.get_light_intensity()[1],parseFloat(slider.value)]);
}


function onSliderTranslationX(slider) {
	let oldvalue = sel.getTransX();
	sel.setTransX(parseFloat(slider.value));
	
	document.getElementById('amount5').value=sel.getTransX();
	document.getElementById('btn5').value=sel.getTransX();	
}

function onSliderTranslationY(slider) {	
	let oldvalue = sel.getTransY();
	sel.setTransY(parseFloat(slider.value));
	
	document.getElementById('amount6').value=sel.getTransY();
	document.getElementById('btn6').value=sel.getTransY();	
}

function onSliderTranslationZ(slider) {	
	let oldvalue = sel.getTransZ();
	sel.setTransZ(parseFloat(slider.value));

	document.getElementById('amount4').value=sel.getTransZ();
	document.getElementById('btn4').value=sel.getTransZ();	
}

function onSliderCamPhi(slider) {
	cam.setPhi(parseFloat(slider.value));	
}

function onSliderCamTheta(slider) {
	cam.setTheta(parseFloat(slider.value));
}

function onSliderCamRadius(slider) {
	cam.setRadius(parseFloat(slider.value));
}

function onSliderFovy(slider) {
	cam.setFovy(parseFloat(slider.value));
}

function canvas_size(slider)
{
	let canvas = document.getElementById('webglCanvas');
	canvas.width = parseFloat(slider.value);
	canvas.height = parseFloat(slider.value);
	document.getElementById('size').value = parseFloat(slider.value);
}

//Funciones de drag en el canvas
var drag = false;
var old_x, old_y;
var dX = 0, dY = 0;
mouseDown = function(e) {
	drag = true;
	old_x = e.pageX, old_y = e.pageY;	
	e.preventDefault();
	return false;
}
mouseUp = function(e) {
	drag = false;
	e.preventDefault();
	return false;
}
mouseMove = function(e) {
	if (!drag) return false;//si el click no esta apretado no hago nada
    dX = (e.pageX-old_x)*2*Math.PI/canvas.width;//calculo cuanto se movio el puntero en x y en y
	dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
	old_x = e.pageX, old_y = e.pageY;
    cam.incTheta(-50*dX);//modifico los angulos de la camara en un numero basado en el movimiento del puntero
	document.getElementById('btnCamTheta').value = cam.getTheta();
	document.getElementById('amountTheta').value = document.getElementById('btnCamTheta').value;
    cam.incPhi(50*dY);
	document.getElementById('btnCamPhi').value = cam.getPhi();
	document.getElementById('amountPhi').value = document.getElementById('btnCamPhi').value;
	
	e.preventDefault();
}

//Animacion orbitar
var timerOrbitar;
function orbitar(){

	if (Orbitando==false)
	{
		Orbitando=true;
		let delta = 1;//cantidad de grados que recorro en cada iteracion

		let start = Date.now();
		timerOrbitar = setInterval(function() {
		//document.getElementById('btnOrbitar').disabled = true;//deshabilito el boton mientras dura la animacion
		let timePassed = Date.now() - start;
		if (timePassed >= 20000) {
			clearInterval(timerOrbitar); // termino a los 20 segundos
			//document.getElementById('btnOrbitar').disabled = false; //reactivo el boton
			return;
		}
		let phi = cam.getPhi();
		cam.setPhi(0);
		cam.incTheta(delta);
		document.getElementById('btnCamTheta').value = cam.getTheta();
		document.getElementById('amountTheta').value = cam.getTheta();
		cam.setPhi(phi);
		
		}, 20);
	}
	else
	{
		Orbitando=false;
		clearInterval(timerOrbitar);
	}
	
}

//resetea la escena
function reset(){//reseteo los botones y la escena
	limpiar_timers();
	document.getElementById('btnOrbitar').disabled = false;
	cam = new Camera(); 
	cam.setRadius(20);
	
	luz3.set_light_intensity(luz_azul);
	luz1.set_light_intensity(luz_roja);
	luz2.set_light_intensity(luz_verde);
    
    luz4.set_light_intensity(luz_dia); 

	
	
	sel = alien;
	selLight= luz1;

	alien.setTrans([0.0,0.0,0.0]);
	platoVolador.setTrans([0.0,15.0,0.0]);
	luz1.set_light_pos(platoVolador.getTrans(),1.0);
	
	luz2.set_light_pos(platoVolador.getTrans(),1.0);
	
	luz3.set_light_pos(platoVolador.getTrans(),1.0);
	


	document.getElementById('btnCamPhi').value = document.getElementById('btnCamPhi').defaultValue;
	document.getElementById('btnCamTheta').value = document.getElementById('btnCamTheta').defaultValue;
	document.getElementById('btnCamRadius').value = document.getElementById('btnCamRadius').defaultValue;
	document.getElementById('btnFovy').value = document.getElementById('btnFovy').defaultValue;
	document.getElementById('amountPhi').value = document.getElementById('btnCamPhi').defaultValue;
	document.getElementById('amountTheta').value = document.getElementById('btnCamTheta').defaultValue;
	document.getElementById('amountRadius').value = document.getElementById('btnCamRadius').defaultValue;
	document.getElementById('amountFovy').value = document.getElementById('btnFovy').defaultValue;
	document.getElementById('selectobj0').value = "Alien";

	
	for (i = 1; i <= 6; i++) { 
		  document.getElementById('btn'+i).value = document.getElementById('btn'+i).defaultValue;
		  document.getElementById('amount'+i).value = document.getElementById('btn'+i).defaultValue;
	}
	renderizar();
	
}

function CamFront(){
	cam = new Camera();
	cam.setTheta(90);
	cam.setPhi(45);
	cam.setFovy(50);
	cam.setRadius(15);	
	document.getElementById('btnCamTheta').value = cam.getTheta();
	document.getElementById('amountTheta').value = cam.getTheta();
	document.getElementById('btnCamPhi').value = cam.getPhi();
	document.getElementById('amountPhi').value = cam.getPhi();	
	document.getElementById('btnCamRadius').value = cam.getRadius();
	document.getElementById('amountRadius').value = cam.getRadius();
	
}

function CamTrasera(){
	cam = new Camera();
	cam.setTheta(270);
	cam.setPhi(45);
	cam.setFovy(50);
	cam.setRadius(15);
	document.getElementById('btnCamTheta').value = cam.getTheta();
	document.getElementById('amountTheta').value = cam.getTheta();
	document.getElementById('btnCamPhi').value = cam.getPhi();
	document.getElementById('amountPhi').value = cam.getPhi();
	document.getElementById('btnCamRadius').value = cam.getRadius();
	document.getElementById('amountRadius').value = cam.getRadius();
	
}

function CamLeft(){
	cam = new Camera();
	cam.setTheta(0);
	cam.setPhi(45);
	cam.setFovy(50);
	cam.setRadius(15);	
	document.getElementById('btnCamTheta').value = cam.getTheta();
	document.getElementById('amountTheta').value = cam.getTheta();
	document.getElementById('btnCamPhi').value = cam.getPhi();
	document.getElementById('amountPhi').value = cam.getPhi();
	document.getElementById('btnCamRadius').value = cam.getRadius();
	document.getElementById('amountRadius').value = cam.getRadius();
	
}
function CamRight(){
	cam = new Camera();
	cam.setTheta(180);
	cam.setPhi(45);
	cam.setFovy(50);
	cam.setRadius(15);
	document.getElementById('btnCamTheta').value = cam.getTheta();
	document.getElementById('amountTheta').value = cam.getTheta();
	document.getElementById('btnCamPhi').value = cam.getPhi();
	document.getElementById('amountPhi').value = cam.getPhi();
	document.getElementById('btnCamRadius').value = cam.getRadius();
	document.getElementById('amountRadius').value = cam.getRadius();
	
}

/*
	se ejecuta cuando el select que selecciona taza o cafetera cambia.
*/
function evento_cambiarObjSelect()
{
	if(document.getElementById('selectobj0').value == 'Alien')
	{
		setPrimeroAlien();
	}
	else if(document.getElementById('selectobj0').value == 'Nave')
		{
			setPrimeroNave();
		}
	
	actSliders();
}

function actSliders(){
	if(document.getElementById('selectobj0').value == 'Alien'){
		sel = alien;		
	}
	if(document.getElementById('selectobj0').value == 'Nave'){
		sel = platoVolador;		
	}
	if(document.getElementById('selectobj1').value == 'Nave'){
		selLight = luz1;		
	}
	if(document.getElementById('selectobj1').value == 'Sol'){
		selLigth = luz4;		
	}	
	
	
	let i;
	for (i = 1; i <= 7; i++) { 
		switch (i) {
			case 1:
				document.getElementById('btn'+i).value = sel.getAngleX();
				document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
				break;
			case 2:
				document.getElementById('btn'+i).value =sel.getAngleY();
				document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
			  	break;
			case 3:
				document.getElementById('btn'+i).value = sel.getAngleZ();
				document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
				break;

			case 5:
				document.getElementById('btn'+i).value = sel.getTransX();
				document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
				break;
			case 6:
				document.getElementById('btn'+i).value = sel.getTransY();
				document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
				break;
			default:
				break;
		  }
	}
	if (selLight==luz4){
	document.getElementById('btnRed').value = selLight.get_light_intensity()[0];
	document.getElementById('btnGreen').value = selLight.get_light_intensity()[1];
	document.getElementById('btnBlue').value = selLight.get_light_intensity()[2];
	}
	else{
		document.getElementById('btnRed').value = luz1.get_light_intensity()[0];
		document.getElementById('btnGreen').value = luz2.get_light_intensity()[1];
		document.getElementById('btnBlue').value = luz3.get_light_intensity()[2];
	}
    
    //0 Alien
	//1 Nave
	//2 Tractor     
	//3 Silo  
	if(document.getElementById('selectobj3').value == '0'){
		document.getElementById('sliderf0').value = alien.getMaterial().get_f0();
		document.getElementById('sliderm').value = alien.getMaterial().get_m();
		document.getElementById('sliderax').value = alien.getMaterial().get_alpha_x();
		document.getElementById('slideray').value = alien.getMaterial().get_alpha_y();
		document.getElementById('slidersigma').value = alien.getMaterial().get_sigma();
			
	}
	if(document.getElementById('selectobj3').value == '1'){
		document.getElementById('sliderf0').value = platoVolador.getMaterial().get_f0();
		document.getElementById('sliderm').value = platoVolador.getMaterial().get_m();
		document.getElementById('sliderax').value = platoVolador.getMaterial().get_alpha_x();
		document.getElementById('slideray').value = platoVolador.getMaterial().get_alpha_y();
		document.getElementById('slidersigma').value = platoVolador.getMaterial().get_sigma();		
	}
	if(document.getElementById('selectobj3').value == '2'){
		document.getElementById('sliderf0').value = tractor.getMaterial().get_f0();
		document.getElementById('sliderm').value = tractor.getMaterial().get_m();
		document.getElementById('sliderax').value = tractor.getMaterial().get_alpha_x();
		document.getElementById('slideray').value = tractor.getMaterial().get_alpha_y();
		document.getElementById('slidersigma').value = tractor.getMaterial().get_sigma();	
	}
	if(document.getElementById('selectobj3').value == '3'){
		document.getElementById('sliderf0').value = silo.getMaterial().get_f0();
		document.getElementById('sliderm').value = silo.getMaterial().get_m();
		document.getElementById('sliderax').value = silo.getMaterial().get_alpha_x();
		document.getElementById('slideray').value = silo.getMaterial().get_alpha_y();
		document.getElementById('slidersigma').value = silo.getMaterial().get_sigma();		
	}


}
function apuntar(){
	let punto = [0,0,0];
	punto[0] = parseFloat(document.getElementById("mirarX").value);
	punto[1] = parseFloat(document.getElementById("mirarY").value);
	punto[2] = parseFloat(document.getElementById("mirarZ").value);
	sel.apuntarA(punto);
	
}
var timerOnClick;

function onClickRotX(delta){
	timerOnClick = setInterval(function(){
		sel.sumarAngleX(delta);
		document.getElementById("btn1").value = sel.getAngleX();
		document.getElementById("amount1").value = document.getElementById("btn1").value;
		
	},20)	
}

function onClickRotY(delta){
	timerOnClick = setInterval(function(){
		sel.sumarAngleY(delta);
		document.getElementById("btn2").value = sel.getAngleY();
		document.getElementById("amount2").value = document.getElementById("btn2").value;
		
	},20)	
}

function onClickRotZ(delta){
	timerOnClick = setInterval(function(){
		sel.sumarAngleZ(delta);
		document.getElementById("btn3").value = sel.getAngleZ();
		document.getElementById("amount3").value = document.getElementById("btn3").value;
		
	},20)	
}


function onClickTransXPos(){
	timerOnClick = setInterval("MoverEnXPos(sel)",20)	
}

function onClickTransXNeg(){
	timerOnClick = setInterval("MoverEnXNeg(sel)",20)	
}

function onClickTransYPos(){
	timerOnClick = setInterval("MoverEnYPos(sel)",20)	
}

function onClickTransYNeg(){
	timerOnClick = setInterval("MoverEnYNeg(sel)",20)	
}

function onClickTransZPos(){
	timerOnClick = setInterval("MoverEnZPos(sel)",20)	
}

function onClickTransZNeg(){
	timerOnClick = setInterval("MoverEnZNeg(sel)",20)	
}

function offClick(){
	clearInterval(timerOnClick);
}

function focoAlien(){
	cam.setObjetivo(alien);
	
}
function focoNave(){
	cam.setObjetivo(platoVolador);
	
}
function focoTractor(){
	cam.setObjetivo(tractor);
	
}
function focoCentro(){
	cam.setObjetivo(new ObjetoGrafico());
	
}

function selectLuzEnCam(){
	luzEnCamara = document.getElementById('selectobj2').value;
}

//0 Alien
//1 Nave
//2 Tractor     
//3 Silo             

function onSliderKa(slider) {	
	let obj = parseFloat(document.getElementById('selectobj3').value);
	let value = parseFloat(slider.value);
	if(fila==0){
		alien.getMaterial().set_k_ambient(value);
	}
	else if(fila==1){
		platoVolador.getMaterial().set_k_ambient(value);
		}
		 else if(fila==2){
		 	tractor.getMaterial().set_k_ambient(value);
				}
		 else {
		 		silo.getMaterial().set_k_ambient(value);
			}
	

	
	
}

function onSliderKd(slider) {	
	let fila = parseFloat(document.getElementById('selectobj3').value);
	let value = parseFloat(slider.value);

	if(fila==0){
		alien.getMaterial().set_k_diffuse(value);
	}
	else if(fila==1){
		platoVolador.getMaterial().set_k_diffuse(value);
		}
		 else if(fila==2){
		 	tractor.getMaterial().set_k_diffuse(value);
				}
		 else {
		 		silo.getMaterial().set_k_diffuse(value);
			}
	
}

function onSliderKs(slider) {	
	let fila = parseFloat(document.getElementById('selectobj3').value);
	let value = parseFloat(slider.value);

	if(fila==0){
		alien.getMaterial().set_k_spec(value);
	}
	else if(fila==1){
		platoVolador.getMaterial().set_k_spec(value);
		}
		 else if(fila==2){
		 	tractor.getMaterial().set_k_spec(value);
				}
		 else {
		 		silo.getMaterial().set_k_spec(value);
			}
	
}

function onSliderF0(slider) {	
	let fila = parseFloat(document.getElementById('selectobj3').value);
	let value = parseFloat(slider.value);

	if(fila==0){
		alien.getMaterial().set_f0(value);
	}
	else if(fila==1){
		platoVolador.getMaterial().set_f0(value);
		}
		 else if(fila==2){
		 	tractor.getMaterial().set_f0(value);
				}
		 else {
		 		silo.getMaterial().set_f0(value);
			}
	
}

function onSliderM(slider) {	
	let fila = parseFloat(document.getElementById('selectobj3').value);
	let value = parseFloat(slider.value);

	if(fila==0){
		alien.getMaterial().set_m(value);
	}
	else if(fila==1){
		platoVolador.getMaterial().set_m(value);
		}
		 else if(fila==2){
		 	tractor.getMaterial().set_m(value);
				}
		 else {
		 		silo.getMaterial().set_m(value);
			}
	
}

function onSliderAx(slider) {	
	let fila = parseFloat(document.getElementById('selectobj3').value);
	let value = parseFloat(slider.value);

	if(fila==0){
		alien.getMaterial().set_alpha_x(value);
	}
	else if(fila==1){
		platoVolador.getMaterial().set_alpha_x(value);
		}
		 else if(fila==2){
		 	tractor.getMaterial().set_alpha_x(value);
				}
		 else {
		 		silo.getMaterial().set_alpha_x(value);
			}
	
}

function onSliderAy(slider) {	
	let fila = parseFloat(document.getElementById('selectobj3').value);
	let value = parseFloat(slider.value);

	if(fila==0){
		alien.getMaterial().set_alpha_y(value);
	}
	else if(fila==1){
		platoVolador.getMaterial().set_alpha_y(value);
		}
		 else if(fila==2){
		 	tractor.getMaterial().set_alpha_y(value);
				}
		 else {
		 		silo.getMaterial().set_alpha_y(value);
			}
	
}

function onSliderSigma(slider) {	
	let fila = parseFloat(document.getElementById('selectobj3').value);
	let value = parseFloat(slider.value);

	if(fila==0){
		alien.getMaterial().set_sigma(value);
	}
	else if(fila==1){
		platoVolador.getMaterial().set_sigma(value);
		}
		 else if(fila==2){
		 	tractor.getMaterial().set_sigma(value);
				}
		 else {
		 		silo.getMaterial().set_sigma(value);
			}	
}