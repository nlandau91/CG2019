let incremento = 0.1;

/*
	Cada funcion chequea colisiones y realiza transformaciones de traslación
*/


function MoverEnXPos(transfMat)
{
	let oldvalue = transfMat.getTransX();
	transfMat.setSumaTransX(parseFloat(incremento));
	
	document.getElementById("btn5").value = transfMat.getTransX();
	document.getElementById("amount5").value = document.getElementById("btn5").value;
	
}


function MoverEnXNeg(transfMat)
{
	let oldvalue = transfMat.getTransX();
	transfMat.setSumaTransX(parseFloat(-incremento));
	
	document.getElementById("btn5").value = transfMat.getTransX();
	document.getElementById("amount5").value = document.getElementById("btn5").value;
	
}



function MoverEnYPos(transfMat)
{
	let oldvalue = transfMat.getTransY();
	transfMat.setSumaTransY(parseFloat(incremento));
	
	document.getElementById("btn6").value = transfMat.getTransY();
	document.getElementById("amount6").value = document.getElementById("btn6").value;
	
}

function MoverEnYNeg(transfMat)
{
	let oldvalue = transfMat.getTransY();
	transfMat.setSumaTransY(parseFloat(-incremento));
	
	document.getElementById("btn6").value = transfMat.getTransY();
	document.getElementById("amount6").value = document.getElementById("btn6").value;
	
}


function MoverEnZPos(transfMat)
{
	let oldvalue = transfMat.getTransZ();
	transfMat.setSumaTransZ(parseFloat(incremento));
	
	document.getElementById("btn4").value = transfMat.getTransZ();
	document.getElementById("amount4").value = document.getElementById("btn4").value;
	
}

function MoverEnZNeg(transfMat)
{
	let oldvalue = transfMat.getTransZ();
	transfMat.setSumaTransZ(parseFloat(-incremento));
	
	document.getElementById("btn4").value = transfMat.getTransZ();
	document.getElementById("amount4").value = document.getElementById("btn4").value;
	
}