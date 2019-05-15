
//la matriz del objeto principal sobre la cual se aplican cosas
//var transfMatrix1=lampara1;

//la matriz del objeto secundario
//var transfMatrix2=lampara2;

let Eje="Y";
let tipoMov="R"; //R ROTACION T TRASLACION
let respectoA ="P"; //P respecto a un punto, O respecto al centro del objeto
let DeltaRotarResop=3; //grados que rota

function setPrimeroTaza()
{
	transfMatrix1=lampara1;
	transfMatrix2=lampara2;
}

function setPrimeroCafetera()
{
	transfMatrix1=lampara2;
	transfMatrix2=lampara1;
}


/*
	82: tecla r (rotar)
	84: tecla t (trasladar)
	80: tecla p (respecto a otro objeto)
	79 tecla o (respecto a su centro)
	69 tecla e (Escalado)

	88: tecla x
	89: tecla y
	90 tecla z
*/
function Evento_teclado(e)
{
	switch(e.keyCode)
	{

		case 49 : {reiniciar_opciones(); transfMatrix1=lampara1; transfMatrix2=lampara2; document.getElementById('selectobj0').value="Taza"; actSliders(); break;}
		case 50 : {reiniciar_opciones(); transfMatrix1=lampara2; transfMatrix2=lampara1; document.getElementById('selectobj0').value="Cafetera"; actSliders(); break;}
		case 51 : {reiniciar_opciones(); transfMatrix1=lampara3; transfMatrix2=lampara1; document.getElementById('selectobj0').value="Lampara"; actSliders(); break;}
		
		case 82 : { tipoMov="R"; break;}
		case 84 : { tipoMov="T"; break;}
		case 69 : { tipoMov="E"; break;}

		case 88 : {Eje="X"; break;}
		case 89 : {Eje="Y"; break;}
		case 90 : {Eje="Z"; break;}
		
		case 80 : { respectoA="P"; break;}
		case 79 : { respectoA="O"; break;}
		
		default : {
						switch(tipoMov)
						{
							case "R":{
											switch(respectoA){
												case "P" : {Evento_teclado_rotacion_Respecto(e); break;}
												case "O" : {Evento_teclado_rotacion_Objeto(e); break; }
											}
											break;

									}
							
							case "T": { Evento_teclado_traslacion(e); break; }

							case "E": { Evento_teclado_escalado(e); break; }
						}
						break;
					}
	}
}

function reiniciar_opciones()
{
	 document.getElementById('selectobj1').value="No";
	 document.getElementById('selectobj3').value="No";
	 document.getElementById('selectobj4').value="No";
	 limpiar_timers();


}


/*
	49: numero 1 (cafetera)
	50: numero 2 (taza)

	37: tecla izquierda
	38: tecla derecha
*/

function Evento_teclado_rotacion_Respecto(e){

	switch(e.keyCode)
	{
		

		case 37 :{
					switch(Eje)
					{
						case "X" : {rotarRespaX(DeltaRotarResop); break;}
						case "Y" : {rotarRespaY(DeltaRotarResop); break;}
						case "Z" : {rotarRespaZ(DeltaRotarResop); break;}
					}
					break;
				}

		case 39 :{
					switch(Eje)
					{
						case "X" : {rotarRespaX(-DeltaRotarResop); break;}
						case "Y" : {rotarRespaY(-DeltaRotarResop); break;}
						case "Z" : {rotarRespaZ(-DeltaRotarResop); break;}
					}
					break;
				}

	}

}


function rotarRespaY(inc){
	transfMatrix1.rotarRespectoA(transfMatrix2.getTrans(),[0,inc,0]);
	
}

function rotarRespaX(inc){
	transfMatrix1.rotarRespectoA(transfMatrix2.getTrans(),[inc,0,0]);
	
}

function rotarRespaZ(inc){
	transfMatrix1.rotarRespectoA(transfMatrix2.getTrans(),[0,0,inc]);
	
}




function Evento_teclado_rotacion_Objeto(e){

	switch(e.keyCode)
	{


		case 37 :{
					switch(Eje)
					{
						case "X" : {rotarXOrig(DeltaRot); break;}
						case "Y" : {rotarYOrig(DeltaRot); break;}
						case "Z" : {rotarZOrig(DeltaRot); break;}
					}
					break;
				}

		case 39 :{
					switch(Eje)
					{
						case "X" : {rotarXOrig(-DeltaRot); break;}
						case "Y" : {rotarYOrig(-DeltaRot); break;}
						case "Z" : {rotarZOrig(-DeltaRot); break;}
					}
					break;
				}


	}

}


function rotarXOrig(inc){
	transfMatrix1.sumarAngleX(parseFloat(inc));
	
}


function rotarYOrig(inc){
	transfMatrix1.sumarAngleY(parseFloat(inc));
	
}


function rotarZOrig(inc){
	transfMatrix1.sumarAngleZ(parseFloat(inc));
	
}




function Evento_teclado_traslacion(e){
	
	switch(e.keyCode)
	{
		

		case 37 :{
					switch(Eje)
					{
						case "X" : {MoverEnXNeg(transfMatrix1); break;}
						case "Y" : {MoverEnYNeg(transfMatrix1); break;}
						case "Z" : {MoverEnZPos(transfMatrix1); break;}
					}
					break;
				}

		case 39 :{
					switch(Eje)
					{
						case "X" : {MoverEnXPos(transfMatrix1); break;}
						case "Y" : {MoverEnYPos(transfMatrix1); break;}
						case "Z" : {MoverEnZNeg(transfMatrix1); break;}
					}
					break;
				}


	}
}


function Evento_teclado_escalado(e){

	switch(e.keyCode)
	{
		case 37 : {escalado_positivo(); break;}

		case 39 : {escalado_negativo(); break;}
	}

}

function escalado_positivo()
{
	let oldvalue = transfMatrix1.getScale();
	transfMatrix1.setScale(transfMatrix1.getScale()+0.1);
	if(lampara1.collision(lampara2)){
		transfMatrix1.setScale(oldvalue);
	}
	document.getElementById('btn4').value=transfMatrix1.getScale();
	document.getElementById('amount4').value=document.getElementById('btn4').value;
	

	
}

function escalado_negativo()
{
	let oldvalue = transfMatrix1.getScale();
	transfMatrix1.setScale(transfMatrix1.getScale()-0.1);
	if(lampara1.collision(lampara2)){
		transfMatrix1.getScale().setScale(oldvalue);
	}
	document.getElementById('btn4').value=transfMatrix1.getScale();
	document.getElementById('amount4').value=document.getElementById('btn4').value;
	
	

	

}

