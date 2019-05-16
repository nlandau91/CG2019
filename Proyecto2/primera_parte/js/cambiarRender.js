function renderWithCookTorrance(){
	//limpio el canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//dibujo el plano
	drawWithCookTorrance(plano);

	//dibujo las luces, acomodo sus posiciones y direcciones de acuerdo a las lamparas
	luz1.set_light_pos([lampara1.getTransX(),lampara1.getTransY(),lampara1.getTransZ(),1.0]); //para controlar la luz	
	drawWithCookTorrance(lampara1);

	luz2.set_light_pos([lampara2.getTransX(),lampara2.getTransY(),lampara2.getTransZ(),1.0]);
	let new_spot_direction1 = vec4.create();
	vec4.transformQuat(new_spot_direction1,[0.0,-1.0,0.0,0.0],lampara2.getRotation());
	luz2.set_spot_direction(new_spot_direction1);
	drawWithCookTorrance(lampara2);

	luz3.set_light_pos([lampara3.getTransX(),lampara3.getTransY(),lampara3.getTransZ(),0.0]);

	//dibujarEsferas
	let i = 0;
	let j = 0;
	for(i = 0; i<4; i++){
		for(j = 0; j<6; j++){
			drawWithCookTorrance(esferas[i*6+j]);
		}
	}
}

function renderWithWard(){
	//limpio el canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//dibujo el plano
	drawWithWard(plano);

	//dibujo las luces, acomodo sus posiciones y direcciones de acuerdo a las lamparas
	luz1.set_light_pos([lampara1.getTransX(),lampara1.getTransY(),lampara1.getTransZ(),1.0]); //para controlar la luz
	let new_spot_direction1 = vec4.create();
	vec4.transformQuat(new_spot_direction1,[0.0,-1.0,0.0,0.0],lampara1.getRotation());
	luz1.set_spot_direction(new_spot_direction1);	
	drawWithWard(lampara1);

	luz2.set_light_pos([lampara2.getTransX(),lampara2.getTransY(),lampara2.getTransZ(),1.0]);
	let new_spot_direction2 = vec4.create();
	vec4.transformQuat(new_spot_direction2,[0.0,-1.0,0.0,0.0],lampara2.getRotation());
	luz2.set_spot_direction(new_spot_direction2);
	drawWithWard(lampara2);

	luz3.set_light_pos([lampara3.getTransX(),lampara3.getTransY(),lampara3.getTransZ(),0.0]);
	//drawWithWard(lampara3);

	//dibujarEsferas
	let i = 0;
	let j = 0;
	for(i = 0; i<4; i++){
		for(j = 0; j<6; j++){
			drawWithWard(esferas[i*6+j]);
		}
	}
}

function renderWithOrenNayar(){
	//limpio el canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//dibujo el plano
	drawWithOrenNayar(plano);

	//dibujo las luces, acomodo sus posiciones y direcciones de acuerdo a las lamparas
	luz1.set_light_pos([lampara1.getTransX(),lampara1.getTransY(),lampara1.getTransZ(),1.0]); //para controlar la luz
	let new_spot_direction1 = vec4.create();
	vec4.transformQuat(new_spot_direction1,[0.0,-1.0,0.0,0.0],lampara1.getRotation());
	luz1.set_spot_direction(new_spot_direction1);	
	drawWithOrenNayar(lampara1);

	luz2.set_light_pos([lampara2.getTransX(),lampara2.getTransY(),lampara2.getTransZ(),1.0]);
	let new_spot_direction2 = vec4.create();
	vec4.transformQuat(new_spot_direction2,[0.0,-1.0,0.0,0.0],lampara2.getRotation());
	luz2.set_spot_direction(new_spot_direction2);
	drawWithOrenNayar(lampara2);

	luz3.set_light_pos([lampara3.getTransX(),lampara3.getTransY(),lampara3.getTransZ(),0.0]);
	//drawWithOrenNayar(lampara3);

	//dibujarEsferas
	let i = 0;
	let j = 0;
	for(i = 0; i<4; i++){
		for(j = 0; j<6; j++){
			drawWithOrenNayar(esferas[i*6+j]);
		}
	}
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

	//elijo el vao a usar y llamo a draw elements
	gl.bindVertexArray(objeto.getVao());
	gl.drawElements(gl.TRIANGLES, objeto.getParsedOBJ().indices.length, gl.UNSIGNED_INT, 0);
	//desconecto el vao y el shader
	gl.bindVertexArray(null);
	gl.useProgram(null);
}

function drawWithOrenNayar(objeto){//dibujamos el objeto con el shader de cook torrance

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
	gl.uniform1f(u_sigma,objeto.material.get_sigma());


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

function setShaderOrenNayar(){
	shaderProgram = shaderProgramOrenNayar;

	posLocation = gl.getAttribLocation(shaderProgram, 'vertexPosition');
	normLocation = gl.getAttribLocation(shaderProgram, 'vertexNormal');

	u_modelViewMatrix = gl.getUniformLocation(shaderProgram, 'modelViewMatrix');
	u_modelViewProjectionMatrix = gl.getUniformLocation(shaderProgram, 'modelViewProjMatrix');
	u_normalMatrix = gl.getUniformLocation(shaderProgram, 'normalMatrix');

	u_k_ambient = gl.getUniformLocation(shaderProgram, 'material.k_ambient');
	u_k_diffuse = gl.getUniformLocation(shaderProgram, 'material.k_diffuse');
	u_k_spec = gl.getUniformLocation(shaderProgram, 'material.k_spec');
	u_sigma = gl.getUniformLocation(shaderProgram, 'material.sigma');

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
	renderMode = mode;
	//if(mode == 'RENDERMODE_COOK_TORRANCE') renderMode = 'RENDERMODE_COOK_TORRANCE';
	//if(mode == 'RENDERMODE_WARD') renderMode = 'RENDERMODE_WARD';
	cancelAnimationFrame(renderloopid);

	renderizar();
}