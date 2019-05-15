var sel = lampara1; //objeto seleccionado
var Orbitando=false;

//funciones que reaccionan a los botones/sliders del panel
function onSliderRotationX(slider) {	
	sel.setAngleX(parseFloat(slider.value));
}

function onSliderRotationZ(slider) {
	sel.setAngleZ(parseFloat(slider.value));	
}

function onSliderRed(slider) {
	let luz;
	if(document.getElementById('selectobj0').value == 'Lampara1'){
		luz = luz1;
	}
	if(document.getElementById('selectobj0').value == 'Lampara2'){
		luz = luz2;
	}
	if(document.getElementById('selectobj0').value == 'Lampara3'){
		luz = luz3;
	}
	luz.set_light_intensity([parseFloat(slider.value),luz.get_light_intensity()[1],luz.get_light_intensity()[2]]);
}

function onSliderGreen(slider) {	
	let luz;
	if(document.getElementById('selectobj0').value == 'Lampara1'){
		luz = luz1;
	}
	if(document.getElementById('selectobj0').value == 'Lampara2'){
		luz = luz2;
	}
	if(document.getElementById('selectobj0').value == 'Lampara3'){
		luz = luz3;
	}
	luz.set_light_intensity([luz.get_light_intensity()[0],parseFloat(slider.value),luz.get_light_intensity()[2]]);
}

function onSliderBlue(slider) {
	let luz;
	if(document.getElementById('selectobj0').value == 'Lampara1'){
		luz = luz1;
	}
	if(document.getElementById('selectobj0').value == 'Lampara2'){
		luz = luz2;
	}
	if(document.getElementById('selectobj0').value == 'Lampara3'){
		luz = luz3;
	}
	luz.set_light_intensity([luz.get_light_intensity()[0],luz.get_light_intensity()[1],parseFloat(slider.value)]);
}

function onSliderScale(slider) {
	let oldvalue = sel.getScale();
	sel.setScale(parseFloat(slider.value));
	if(lampara1.collision(lampara2)){
		sel.setScale(oldvalue);
	}
	document.getElementById('amount4').value=sel.getScale();
	document.getElementById('btn4').value=sel.getScale();
		
}

function onSliderTranslationX(slider) {
	let oldvalue = sel.getTransX();
	sel.setTransX(parseFloat(slider.value));
	if(lampara1.collision(lampara2)){
		sel.setTransX(oldvalue);
	}
	document.getElementById('amount5').value=sel.getTransX();
	document.getElementById('btn5').value=sel.getTransX();	
}

function onSliderTranslationY(slider) {	
	let oldvalue = sel.getTransY();
	sel.setTransY(parseFloat(slider.value));
	if(lampara1.collision(lampara2)){
		sel.setTransY(oldvalue);
	}
	document.getElementById('amount6').value=sel.getTransY();
	document.getElementById('btn6').value=sel.getTransY();	
}

function onSliderTranslationZ(slider) {	
	let oldvalue = sel.getTransZ();
	sel.setTransZ(parseFloat(slider.value));
	if(lampara1.collision(lampara2)){
		sel.setTransZ(oldvalue);
	}
	document.getElementById('amount7').value=sel.getTransZ();
	document.getElementById('btn7').value=sel.getTransZ();	
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
	lampara1 = new ObjetoGrafico(); 
	lampara1.setTrans([3.0,3.0,3.0]);
	luz1.set_light_pos(lampara1.getTrans());
	lampara1.setMaterial(material_silver);
	lampara2 = new ObjetoGrafico();
	lampara2.setTrans([-3.0,3.0,3.0]);
	luz2.set_light_pos(lampara2.getTrans());
	lampara2.setMaterial(material_silver);
	lampara3 = new ObjetoGrafico();
	lampara3.setTrans([0.0,3.0,-3.0]);
	luz3.set_light_pos(lampara3.getTrans(),0.0);
	lampara3.setMaterial(material_silver);
	sel = lampara1;
	document.getElementById('btnCamPhi').value = document.getElementById('btnCamPhi').defaultValue;
	document.getElementById('btnCamTheta').value = document.getElementById('btnCamTheta').defaultValue;
	document.getElementById('btnCamRadius').value = document.getElementById('btnCamRadius').defaultValue;
	document.getElementById('btnFovy').value = document.getElementById('btnFovy').defaultValue;
	document.getElementById('amountPhi').value = document.getElementById('btnCamPhi').defaultValue;
	document.getElementById('amountTheta').value = document.getElementById('btnCamTheta').defaultValue;
	document.getElementById('amountRadius').value = document.getElementById('btnCamRadius').defaultValue;
	document.getElementById('amountFovy').value = document.getElementById('btnFovy').defaultValue;
	document.getElementById('selectobj0').value = "Lampara1";
	let i;
	for (i = 1; i <= 7; i++) { 
		  if (i!=4){document.getElementById('btn'+i).value = document.getElementById('btn'+i).defaultValue;
		  document.getElementById('amount'+i).value = document.getElementById('btn'+i).defaultValue;}
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


function actSliders(){
	if(document.getElementById('selectobj0').value == 'Lampara1'){
		sel = lampara1;		
	}
	if(document.getElementById('selectobj0').value == 'Lampara2'){
		sel = lampara2;		
	}
	if(document.getElementById('selectobj0').value == 'Lampara3'){
		sel = lampara3;		
	}
	let i;
	// for (i = 1; i <= 7; i++) { 
	// 	switch (i) {
	// 		case 1:
	// 			document.getElementById('btn'+i).value = sel.getAngleX();
	// 			document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
	// 			break;
	// 		case 2:
	// 			document.getElementById('btn'+i).value =sel.getAngleY();
	// 			document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
	// 		  	break;
	// 		case 3:
	// 			document.getElementById('btn'+i).value = sel.getAngleZ();
	// 			document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
	// 			break;

	// 		case 5:
	// 			document.getElementById('btn'+i).value = sel.getTransX();
	// 			document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
	// 			break;
	// 		case 6:
	// 			document.getElementById('btn'+i).value = sel.getTransY();
	// 			document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
	// 			break;
	// 		case 7:
	// 			document.getElementById('btn'+i).value = sel.getTransZ();
	// 			document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
	// 			break;
	// 		default:
	// 			break;
	// 	  }
	// }
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

function onClickScale(delta){
	timerOnClick = setInterval(function(){
		let oldvalue = sel.getScale();
		sel.setScale(sel.getScale()+delta);
		if(lampara1.collision(lampara2)){
			sel.setScale(oldvalue);
		}
		document.getElementById("btn4").value = sel.getScale();
		document.getElementById("amount4").value = document.getElementById("btn4").value;
		
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
function focoTaza(){
	cam.setObjetivo(lampara1);
	
}
function focoCafetera(){
	cam.setObjetivo(lampara2);
	
}
function focoCentro(){
	cam.setObjetivo(new ObjetoGrafico());
	
}

function reiniciar_opciones()
{
	 document.getElementById('selectobj1').value="No";
	 document.getElementById('selectobj3').value="No";
	 document.getElementById('selectobj4').value="No";
	 limpiar_timers();
}