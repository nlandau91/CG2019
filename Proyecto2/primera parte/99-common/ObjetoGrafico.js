class ObjetoGrafico{
    
    constructor(){
        //atributos necesarios para crear la matriz de transformacion
        this.angle = [0,0,0];
        this.scale = 1;
        this.trans = [0,0,0];
        this.rotQuat = quat.create();
        this.origen = [0,0,0]
        this.box = [0,0,0,0,0,0] //[minX,maxX,minY,maxY,minZ,maxZ]
        this.material = new Material();
        this.vao = null;
        this.parsedOBJ = null;

    }
    //setters y getters
    setVao(newVao){
        this.vao = newVao;
    }
    setMaterial(new_material){
        this.material = new_material;
    }
    setAngleX(x){
        this.sumarAngleX(x-this.angle[0]);
    }  
    setAngleY(y){
        this.sumarAngleY(y-this.angle[1]);
    }
    setAngleZ(z){
        this.sumarAngleZ(z-this.angle[2]);
    }
    setTransX(x){
        this.trans[0] = x;
    }
     setTransY(y){
        this.trans[1] = y;
    }
    setTransZ(z){
        this.trans[2] = z;
    }
    setTrans(newTrans){
        this.trans = newTrans;
    }
    setScale(s){
        this.scale = s;
    }
    setSumaTransX(x){
        this.trans[0]+=x;
    }

    setSumaTransY(y){
        this.trans[1]+=y;
    }

    setSumaTransZ(z){
        this.trans[2]+=z;
    }
    setBox(newBox){
        this.box = newBox;
    }
    setParsedOBJ(newOBJ){
        this.parsedOBJ = newOBJ;
    }
    getBox(){
        return this.box;
    }
    getTransX(){
        return this.trans[0];
    }
    getTransY(){
        return this.trans[1];
    }
    getTransZ(){
        return this.trans[2];
    }
    getAngleX(){
        return this.angle[0];
    }   
    getAngleY(){
        return this.angle[1];
    }    
    getAngleZ(){
        return this.angle[2];
    }
    getScale(){
        return this.scale;
    }
    getVao(){
        return this.vao;
    }
    getRotation(){
        return this.rotQuat;
    }

    sumarAngleX(delta){
        this.angle[0] = this.angle[0]+delta;
        if(this.angle[0]>180){
            this.angle[0] = this.angle[0] - 360;
        }
        if(this.angle[0]<=-180){
            this.angle[0] = this.angle[0] + 360;
        }
        let q = quat.create();
        quat.fromEuler(q,delta,0,0);
        quat.multiply(this.rotQuat,this.rotQuat,q);

    }

    sumarAngleY(delta){
        this.angle[1] = this.angle[1]+delta;
        if(this.angle[1]>180){
            this.angle[1] = this.angle[1] - 360;
        }
        if(this.angle[1]<=-180){
            this.angle[1] = this.angle[1] + 360;
        }
        let q = quat.create();
        quat.fromEuler(q,0,delta,0);
        quat.multiply(this.rotQuat,this.rotQuat,q);

    }

    sumarAngleZ(delta){
        this.angle[2] = this.angle[2]+delta;
        if(this.angle[2]>180){
            this.angle[2] = this.angle[2] - 360;
        }
        if(this.angle[2]<=-180){
            this.angle[2] = this.angle[2] + 360;
        }
        let q = quat.create();
        quat.fromEuler(q,0,0,delta);
        quat.multiply(this.rotQuat,this.rotQuat,q);

    }

    getModelMatrix(){//devuelve la matriz de transformacion
        let tMatrix = mat4.create();
        mat4.fromRotationTranslationScale(tMatrix,this.rotQuat,this.trans,[this.scale,this.scale,this.scale]);
        return tMatrix;    
    }

    getTrans(){
        return this.trans;
    }

    getBoxPos(){//devuele la caja de colision del objeto, luego de escalarlo y trasladarlo
        let BoxPos = [0,0,0,0,0,0];
        BoxPos[0] = this.trans[0] - this.scale*this.box[0];
        BoxPos[1] = this.trans[0] + this.scale*this.box[1];
        BoxPos[2] = this.trans[1] - this.scale*this.box[2];
        BoxPos[3] = this.trans[1] + this.scale*this.box[3];
        BoxPos[4] = this.trans[2] - this.scale*this.box[4];
        BoxPos[5] = this.trans[2] + this.scale*this.box[5];
        
        return BoxPos;
    }

    collision(transMatrix){//devuelve true si hay colision
        let box1 = this.getBoxPos();
        let box2 = transMatrix.getBoxPos();

        return (box1[0] <= box2[1] && box1[1] >= box2[0]) &&
         (box1[2] <= box2[3] && box1[3] >= box2[2]) &&
         (box1[4] <= box2[5] && box1[5] >= box2[4]);
    }


    rotarRespectoA(punto,angulos){ // [x,y,z],[x°,y°,z°]

        let q = quat.create();
        quat.fromEuler(q,angulos[0],angulos[1],angulos[2]);
        let tm = mat4.create();
        mat4.fromRotationTranslationScaleOrigin(tm,q,[0,0,0],[1,1,1],punto) //rotacion respecto al punto
        let tMatrix = mat4.create();
        quat.normalize(this.rotQuat,this.rotQuat);
        mat4.fromRotationTranslation(tMatrix,this.rotQuat,this.trans); //rotacion sobre si mismo y traslado
        mat4.mul(tMatrix,tm,tMatrix); //multiplico las matrices para sumar las transformaciones
        mat4.getRotation(this.rotQuat,tMatrix); //actualizo los valores de rotacion
        mat4.getTranslation(this.trans,tMatrix); //actualizo los valores de traslacion       

    }

    apuntarA(punto){ // [x,y,z]
        let tm = mat4.create();
        mat4.targetTo(tm,this.trans,punto,[0,1,0]);
        mat4.getRotation(this.rotQuat,tm);
    }

    slerping(punto, delta){
        console.log("asd");
        let tm = mat4.create();
        mat4.targetTo(tm,this.trans,punto,[0,1,0]);
        let q = quat.create();
        mat4.getRotation(q,tm);

        quat.slerp(this.rotQuat,this.rotQuat,q,delta);
    }

    getMaterial(){
        return this.material;
    }

    loadOBJ(OBJsrc){
        this.parsedOBJ = OBJParser.parseFile(OBJsrc);
        let indices = this.parsedOBJ.indices;
        let positions = this.parsedOBJ.positions;
        let normales = this.parsedOBJ.normals;	
        //creo los vao
        let vertexAttributeInfoArray = [
            new VertexAttributeInfo(positions, posLocation, 3),
            new VertexAttributeInfo(normales, normLocation, 3)
        ];
        this.vao = VAOHelper.create(indices, vertexAttributeInfoArray);
    }

    draw(){
        gl.useProgram(shaderProgram);

        let model_view_matrix = mat4.create();
        mat4.mul(model_view_matrix,cam.getView(),this.getModelMatrix());
        gl.uniformMatrix4fv(u_modelViewMatrix, false, model_view_matrix);

        let model_view_projection_matrix = mat4.create();
        mat4.mul(model_view_projection_matrix,cam.getProj(),model_view_matrix);
        gl.uniformMatrix4fv(u_modelViewProjMatrix, false, model_view_projection_matrix);

        let normalMatrix = mat4.create();
        mat4.mul(normalMatrix,cam.getView(),this.getModelMatrix());
        mat4.invert(normalMatrix,normalMatrix);
        mat4.transpose(normalMatrix,normalMatrix);
        gl.uniformMatrix4fv(u_normalMatrix, false, normalMatrix);

        gl.uniform3fv(u_k_ambient, this.material.get_k_ambient());
        gl.uniform3fv(u_k_diffuse, this.material.get_k_diffuse());
        gl.uniform3fv(u_k_spec, this.material.get_k_spec());
        //gl.uniform1f(u_exp_spec, this.material.get_exp_spec());
        gl.uniform1f(u_alphaX, 0.4);
        gl.uniform1f(u_alphaY, 0.7);

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

        //luz2
        let light_pos_eye2 = vec4.create();
        vec4.transformMat4(light_pos_eye2,luz2.get_light_pos(),cam.getView());
        gl.uniform4fv(u_light_pos2, light_pos_eye2);

        let spot_direction_eye2 = vec4.create();
        vec4.transformMat4(spot_direction_eye2,luz2.get_spot_direction(),cam.getView());
        gl.uniform4fv(u_spot_direction2, spot_direction_eye2);

        gl.uniform3fv(u_light_intensity2, luz2.get_light_intensity());
        gl.uniform1f(u_spot_angle2, luz2.get_spot_angle());

        //luz3
        let light_pos_eye3 = vec4.create();
        vec4.transformMat4(light_pos_eye3,luz3.get_light_pos(),cam.getView());
        gl.uniform4fv(u_light_pos3, light_pos_eye3);

        let spot_direction_eye3 = vec4.create();
        vec4.transformMat4(spot_direction_eye3,luz3.get_spot_direction(),cam.getView());
        gl.uniform4fv(u_spot_direction3, spot_direction_eye3);

        gl.uniform3fv(u_light_intensity3, luz3.get_light_intensity());
        gl.uniform1f(u_spot_angle3, luz3.get_spot_angle());

        //elijo el vao a usar y llamo a draw elements
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.parsedOBJ.indices.length, gl.UNSIGNED_INT, 0);
        //desconecto el vao y el shader
        gl.bindVertexArray(null);
        gl.useProgram(null);
    }

}
