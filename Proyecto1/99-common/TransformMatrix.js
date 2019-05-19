class TransformMatrix{
    
    constructor(){
        //atributos necesarios para crear la matriz de transformacion
        this.angle = [0,0,0];
        this.scale = 1;
        this.trans = [0,0,0];
        this.rotQuat = quat.create();
        this.origen = [0,0,0]
        this.box = [0,0,0,0,0,0] //[minX,maxX,minY,maxY,minZ,maxZ]
    }
    //setters y getters
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

    getTransformMatrix(){//devuelve la matriz de transformacion
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
}
