var sel = tMatTaza; //objeto seleccionado
var Orbitando=false;

//funciones que reaccionan a los botones/sliders del panel
function onSliderRotationX(slider) {
	
	sel.setAngleX(parseFloat(slider.value));

	onRender();
}

function onSliderRotationY(slider) {
	
	sel.setAngleY(parseFloat(slider.value));

	onRender();
}

function onSliderRotationZ(slider) {

	sel.setAngleZ(parseFloat(slider.value));

	onRender();
}

function onSliderScale(slider) {

	let oldvalue = sel.getScale();
	sel.setScale(parseFloat(slider.value));
	if(tMatTaza.collision(tMatCafetera)){
		sel.setScale(oldvalue);
	}
	document.getElementById('amount4').value=sel.getScale();
	document.getElementById('btn4').value=sel.getScale();
	

	onRender();
}


function onSliderTranslationX(slider) {
	let oldvalue = sel.getTransX();
	sel.setTransX(parseFloat(slider.value));
	if(tMatTaza.collision(tMatCafetera)){
		sel.setTransX(oldvalue);
	}
	document.getElementById('amount5').value=sel.getTransX();
	document.getElementById('btn5').value=sel.getTransX();
	onRender();
}

function onSliderTranslationY(slider) {	
	let oldvalue = sel.getTransY();
	sel.setTransY(parseFloat(slider.value));
	if(tMatTaza.collision(tMatCafetera)){
		sel.setTransY(oldvalue);
	}
	document.getElementById('amount6').value=sel.getTransY();
	document.getElementById('btn6').value=sel.getTransY();
	onRender();
}

function onSliderTranslationZ(slider) {	
	let oldvalue = sel.getTransZ();
	sel.setTransZ(parseFloat(slider.value));
	if(tMatTaza.collision(tMatCafetera)){
		sel.setTransZ(oldvalue);
	}
	document.getElementById('amount7').value=sel.getTransZ();
	document.getElementById('btn7').value=sel.getTransZ();
	onRender();
}


function onSliderCamPhi(slider) {
	cam.setPhi(parseFloat(slider.value));
	onRender();
}

function onSliderCamTheta(slider) {
	cam.setTheta(parseFloat(slider.value));
	onRender();
}

function onSliderCamRadius(slider) {
	cam.setRadius(parseFloat(slider.value));
	onRender();
}

function onSliderFovy(slider) {
	cam.setFovy(parseFloat(slider.value));
	onRender();
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
	onRender();
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
		onRender();
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
	tMatTaza = new TransformMatrix(); 
	tMatCafetera = new TransformMatrix();
	tMatTaza.setBox([0.4,0.4,0,0.7,0.4,0.4]);
	tMatCafetera.setBox([0.5,0.5,0,2.1,0.5,0.5]);
	sel = tMatTaza;
    tMatTaza.setTransZ(-1);
	tMatCafetera.setTransZ(1);
	document.getElementById('btnCamPhi').value = document.getElementById('btnCamPhi').defaultValue;
	document.getElementById('btnCamTheta').value = document.getElementById('btnCamTheta').defaultValue;
	document.getElementById('btnCamRadius').value = document.getElementById('btnCamRadius').defaultValue;
	document.getElementById('btnFovy').value = document.getElementById('btnFovy').defaultValue;
	document.getElementById('amountPhi').value = document.getElementById('btnCamPhi').defaultValue;
	document.getElementById('amountTheta').value = document.getElementById('btnCamTheta').defaultValue;
	document.getElementById('amountRadius').value = document.getElementById('btnCamRadius').defaultValue;
	document.getElementById('amountFovy').value = document.getElementById('btnFovy').defaultValue;
	document.getElementById('selectobj0').value = "Taza";
	let i;
	for (i = 1; i <= 7; i++) { 
		  document.getElementById('btn'+i).value = document.getElementById('btn'+i).defaultValue;
		  document.getElementById('amount'+i).value = document.getElementById('btn'+i).defaultValue;
	}
	document.getElementById('selectobj0').value = "Taza";
	
	onRender();
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
	onRender();
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
	onRender();
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
	onRender();
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
	onRender();
}

/*
	se ejecuta cuando el select que selecciona taza o cafetera cambia.
*/
function evento_cambiarObjSelect()
{
	if(document.getElementById('selectobj0').value == 'Taza')
	{
		setPrimeroTaza();
	}
	else if(document.getElementById('selectobj0').value == 'Cafetera')
	{
		setPrimeroCafetera();
	}
	document.getElementById('selectobj1').value="No";
	document.getElementById('selectobj3').value="No";
	document.getElementById('selectobj4').value="No";
	actSliders();
}


function actSliders(){
	if(document.getElementById('selectobj0').value == 'Taza'){
		sel = tMatTaza;
		
	}
	if(document.getElementById('selectobj0').value == 'Cafetera'){
		sel = tMatCafetera;
		
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
			case 4:
				document.getElementById('btn'+i).value = sel.getScale();
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
			case 7:
				document.getElementById('btn'+i).value = sel.getTransZ();
				document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
				break;
			default:
				break;
		  }
	}
}
function apuntar(){
	let punto = [0,0,0];
	punto[0] = parseFloat(document.getElementById("mirarX").value);
	punto[1] = parseFloat(document.getElementById("mirarY").value);
	punto[2] = parseFloat(document.getElementById("mirarZ").value);
	sel.apuntarA(punto);
	onRender();
}
var timerOnClick;

function onClickRotX(delta){
	timerOnClick = setInterval(function(){
		sel.sumarAngleX(delta);
		document.getElementById("btn1").value = sel.getAngleX();
		document.getElementById("amount1").value = document.getElementById("btn1").value;
		onRender();
	},20)	
}

function onClickRotY(delta){
	timerOnClick = setInterval(function(){
		sel.sumarAngleY(delta);
		document.getElementById("btn2").value = sel.getAngleY();
		document.getElementById("amount2").value = document.getElementById("btn2").value;
		onRender();
	},20)	
}

function onClickRotZ(delta){
	timerOnClick = setInterval(function(){
		sel.sumarAngleZ(delta);
		document.getElementById("btn3").value = sel.getAngleZ();
		document.getElementById("amount3").value = document.getElementById("btn3").value;
		onRender();
	},20)	
}

function onClickScale(delta){
	timerOnClick = setInterval(function(){
		let oldvalue = sel.getScale();
		sel.setScale(sel.getScale()+delta);
		if(tMatTaza.collision(tMatCafetera)){
			sel.setScale(oldvalue);
		}
		document.getElementById("btn4").value = sel.getScale();
		document.getElementById("amount4").value = document.getElementById("btn4").value;
		onRender();
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
	cam.setObjetivo(tMatTaza);
	onRender();
}
function focoCafetera(){
	cam.setObjetivo(tMatCafetera);
	onRender();
}
function focoCentro(){
	cam.setObjetivo(new TransformMatrix());
	onRender();
}
