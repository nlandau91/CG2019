import { mat4, quat } from "/libs/gl-matrix/index.js"
import { toCartesian, toRadians, limitToRange, toDegrees } from "/libs/utils.js"

const DEFAULT_RADIUS = 45                // distancia al origen
const DEFAULT_THETA  = toRadians(0)   // angulo horizontal alrededor del eje y (partiendo del eje z positivo, en sentido anti-horario)
const DEFAULT_PHI    = toRadians(60)    // angulo vertical desde el eje y positivo

export class Camera {

    constructor() {
        this.sphericalPosition = { radius: DEFAULT_RADIUS, theta: DEFAULT_THETA, phi: DEFAULT_PHI }
        this.target = [0,0,0]
        this.up     = [0, 1, 0]
        this.fov    = toRadians(45)
        this.aspect = 1
        this.near   = 0.1
        this.far    = 1000

        this.onPositionChange = () => {} // funcion que se ejecuta ante cada cambio en la posicion de la camara (por defecto una "funcion vacia" o no-op)

        this.viewMatrix = mat4.create()
        this.projectionMatrix = mat4.create()

        this.updateViewMatrix()
        this.updateProjectionMatrix()
    }

    // Setters & Getters

    setTarget(value) {
        this.target = value
        this.updateViewMatrix()
    }

    getTarget() {
        return this.target
    }

    set radius(value) {
        this.sphericalPosition.radius = limitToRange(value, this.near, this.far) // radius: [near, far]
        this.updateViewMatrix()
        this.onPositionChange(this.sphericalPosition)
    }
    get radius() {
        return this.sphericalPosition.radius
    }

    set theta(value) {
        this.sphericalPosition.theta = ( value === Math.PI * 2 ) ? value : ( value + Math.PI * 2 ) % ( Math.PI * 2 ) // theta: [0, 360]
        this.updateViewMatrix()
        this.onPositionChange(this.sphericalPosition)
    }
    get theta() {
        return this.sphericalPosition.theta
    }

    set phi(value) {
        this.sphericalPosition.phi = limitToRange(value, 0.01, Math.PI) // phi: [0.1, 180]
        this.updateViewMatrix()
        this.onPositionChange(this.sphericalPosition)
    }
    get phi() {
        return this.sphericalPosition.phi
    }

    setFov(value) {
        this.fov = value
        this.updateProjectionMatrix()
    }
    getFov() {
        return this.fov
    }

    // Actualizacion de matrices

    updateViewMatrix() {
         const { x, y, z } = toCartesian(this.sphericalPosition)
         mat4.lookAt(this.viewMatrix, [x, y, z], this.target, this.up)


        // //transformacion para alejarnos del objetivo en R
        // let t0 = mat4.create();
        // mat4.fromTranslation(t0,[0,0,this.sphericalPosition.radius]); 

        // //transformacion para rotar alrededor del objetivo
        // let R = mat4.create();
        // let rotQuat = quat.create();
        // quat.fromEuler(rotQuat, -toDegrees(this.sphericalPosition.phi)+DEFAULT_PHI,toDegrees(this.sphericalPosition.theta),0);
        // mat4.fromQuat(R,rotQuat);

        // //transformacion para apuntar al objetivo
        // let t1 = mat4.create();
        // mat4.fromTranslation(t1,this.target);

        // //aplicamos las transformaciones e invertimos para obtener la view matrix
        // mat4.multiply(this.viewMatrix,t1,R);
        // mat4.multiply(this.viewMatrix,this.viewMatrix,t0);
        // mat4.invert(this.viewMatrix,this.viewMatrix);
        
        //return this.viewMatrix;
    }

    updateProjectionMatrix() {
        mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far)
    }

    /* 📝 Movimientos de camara
     Dolly in|out - Acerca|aleja a la camara de su objetivo (equivale a disminuir|aumentar el radio)
     Arco horizontal|vertical - Mueve a la camara alrededor de su objetivo en forma circular (equivale a modificar los valores de theta|phi)
     */

    dolly(value) {
        this.radius = this.radius - value
    }

    arcVertically(value) {
        this.phi = this.phi - value
    }

    arcHorizontally(value) {
        this.theta = this.theta + value
    }

    reset() {
        this.sphericalPosition = { radius: DEFAULT_RADIUS, theta: DEFAULT_THETA, phi: DEFAULT_PHI }
        this.onPositionChange(this.sphericalPosition)
        this.updateViewMatrix()
    }
}
