let incremento = 0.1;

/*
	Cada funcion chequea colisiones y realiza transformaciones de traslación
*/


function MoverEnXPos(transfMat)
{
	let oldvalue = transfMat.getTransX();
	transfMat.setSumaTransX(parseFloat(incremento));
	if(tMatTaza.collision(tMatCafetera)){
			transfMat.setTransX(oldvalue);
		}
	document.getElementById("btn5").value = transfMat.getTransX();
	document.getElementById("amount5").value = document.getElementById("btn5").value;
	onRender();
}


function MoverEnXNeg(transfMat)
{
	let oldvalue = transfMat.getTransX();
	transfMat.setSumaTransX(parseFloat(-incremento));
	if(tMatTaza.collision(tMatCafetera)){
			transfMat.setTransX(oldvalue);
		}
	document.getElementById("btn5").value = transfMat.getTransX();
	document.getElementById("amount5").value = document.getElementById("btn5").value;
	onRender();
}



function MoverEnYPos(transfMat)
{
	let oldvalue = transfMat.getTransY();
	transfMat.setSumaTransY(parseFloat(incremento));
	if(tMatTaza.collision(tMatCafetera)){
			transfMat.setTransY(oldvalue);
		}
	document.getElementById("btn6").value = transfMat.getTransY();
	document.getElementById("amount6").value = document.getElementById("btn6").value;
	onRender();
}

function MoverEnYNeg(transfMat)
{
	let oldvalue = transfMat.getTransY();
	transfMat.setSumaTransY(parseFloat(-incremento));
	if(sel.getTransY()<0 || tMatTaza.collision(tMatCafetera)){
			transfMat.setTransY(oldvalue);
		}
	document.getElementById("btn6").value = transfMat.getTransY();
	document.getElementById("amount6").value = document.getElementById("btn6").value;
	onRender();
}


function MoverEnZPos(transfMat)
{
	let oldvalue = transfMat.getTransZ();
	transfMat.setSumaTransZ(parseFloat(incremento));
	if(tMatTaza.collision(tMatCafetera)){
			transfMat.setTransZ(oldvalue);
		}
	document.getElementById("btn7").value = transfMat.getTransZ();
	document.getElementById("amount7").value = document.getElementById("btn7").value;
	onRender();
}

function MoverEnZNeg(transfMat)
{
	let oldvalue = transfMat.getTransZ();
	transfMat.setSumaTransZ(parseFloat(-incremento));
	if(tMatTaza.collision(tMatCafetera)){
			transfMat.setTransZ(oldvalue);
		}
	document.getElementById("btn7").value = transfMat.getTransZ();
	document.getElementById("amount7").value = document.getElementById("btn7").value;
	onRender();
}