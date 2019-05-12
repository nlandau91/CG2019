class Luz{

    constructor(){
        this.light_pos = [0.0,0.0,0.0,0.0]; //[x,y,z,w] // si w = 1 es luz direccional
        this.light_intensity = [0.0,0.0,0.0]; //[r,g,b]
        this.spot_direction = [0.0,0.0,0.0,0.0]; //[x,y,z,w]
        this.spot_angle = 0.0; //el valor representa el coseno del angulo, si es 0 o 1 no es spot
        this.attenuation_a = 0.1; //para atenuacion = 1/(1+a*dist+b*dist*dist)
        this.attenuation_b = 0.0; //para atenuacion = 1/(1+a*dist+b*dist*dist)
    }

    set_light_pos(new_light_pos){
        this.light_pos = new_light_pos;
    }
    set_light_intensity(new_light_intensity){
        this.light_intensity = new_light_intensity;
    }
    set_spot_direction(new_spot_direction){
        this.spot_direction = new_spot_direction;
    }
    set_spot_angle(new_spot_angle){
        this.spot_angle = new_spot_angle;
    }
    set_attenuation_a(a){
        this.attenuation_a = a;
    }
    set_attenuation_b(b){
        this.attenuation_b = b;
    }

    get_light_pos(){
        return this.light_pos;
    }
    get_light_intensity(){
        return this.light_intensity;
    }
    get_spot_direction(){
        return this.spot_direction
    }
    get_spot_angle(){
        return this.spot_angle;
    }
    get_attenuation_a(){
        return this.attenuation_a;
    }
    get_attenuation_b(){
        return this.attenuation_b;
    }
}