let incremento = 0.1;


function MoverEnXPos(transfMat)
{
	transfMat.setSumaTransX(parseFloat(incremento));
	document.getElementById("btn3").value = transfMat.getTransX();
	document.getElementById("amount3").value = document.getElementById("btn3").value;
	
}


function MoverEnXNeg(transfMat)
{
	transfMat.setSumaTransX(parseFloat(-incremento));
	document.getElementById("btn3").value = transfMat.getTransX();
	document.getElementById("amount3").value = document.getElementById("btn3").value;
	
}



function MoverEnYPos(transfMat)
{
	transfMat.setSumaTransY(parseFloat(incremento));
	document.getElementById("btn4").value = transfMat.getTransY();
	document.getElementById("amount4").value = document.getElementById("btn4").value;
	
}

function MoverEnYNeg(transfMat)
{
	transfMat.setSumaTransY(parseFloat(-incremento));
	document.getElementById("btn4").value = transfMat.getTransY();
	document.getElementById("amount4").value = document.getElementById("btn4").value;
	
}


function MoverEnZPos(transfMat)
{
	transfMat.setSumaTransZ(parseFloat(incremento));
	document.getElementById("btn5").value = transfMat.getTransZ();
	document.getElementById("amount5").value = document.getElementById("btn5").value;
	
}

function MoverEnZNeg(transfMat)
{
	transfMat.setSumaTransZ(parseFloat(-incremento));
	document.getElementById("btn5").value = transfMat.getTransZ();
	document.getElementById("amount5").value = document.getElementById("btn5").value;
	
}