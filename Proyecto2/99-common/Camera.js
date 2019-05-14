class Camera{//camara esferica con quaterniones
    constructor(){
        this.theta = 45; //angulo azimutal, de 0 a 360 grados
        this.phi = 45; //angulo polar, de 0 a 360 grados
        this.r = 10; //distancia al punto
        this.fovy = glMatrix.toRadian(50); 
        this.aspect = 1;
        this.zNear = 0.1;
        this.zFar = 200.0;
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();
        this.objetivo = new ObjetoGrafico();//objetivo por defecto, inicia en 0,0,0
    }

    getProj(){
        mat4.perspective(this.projMatrix, this.fovy, this.aspect, this.zNear, this.zFar);
        return this.projMatrix;
    }

    getView(){
        //transformacion para alejarnos del objetivo en R
        let t0 = mat4.create();
        mat4.fromTranslation(t0,[0,0,this.r]); 

        //transformacion para rotar alrededor del objetivo
        let R = mat4.create();
        let rotQuat = quat.create();
        quat.fromEuler(rotQuat, -this.phi,this.theta,0);
        mat4.fromQuat(R,rotQuat);

        //transformacion para apuntar al objetivo
        let t1 = mat4.create();
        mat4.fromTranslation(t1,this.objetivo.getTrans());

        //aplicamos las transformaciones y invertimos para obtener la view matrix
        mat4.multiply(this.viewMatrix,t1,R);
        mat4.multiply(this.viewMatrix,this.viewMatrix,t0);
        mat4.invert(this.viewMatrix,this.viewMatrix);
        
        return this.viewMatrix;
    }

    setTheta(newTheta){
        this.theta = newTheta;
        if(this.theta<0){
            this.theta = this.theta + 360;
        }
        if(this.theta>=360){
            this.theta = this.theta - 360;
        }
    }
    setPhi(newPhi){
        this.phi = newPhi;
        if(this.phi<=0){
            this.phi = this.phi + 360;
        }
        if(this.phi>360){
            this.phi = this.phi -360;
        }
    }
    setFovy(newFovy){
        this.fovy=glMatrix.toRadian(newFovy);
    }
    setRadius(newRadius){
        this.r = newRadius;
    }
    incTheta(dTheta){
        this.setTheta(this.theta+dTheta);
    }
    incPhi(dPhi){
        this.setPhi(this.phi+dPhi);
    }
    getTheta(){
        return this.theta;
    }
    getPhi(){
        return this.phi;
    }
    getRadius(){
        return this.r;
    }
    setObjetivo(newObjetivo){
        this.objetivo = newObjetivo
    }
}
