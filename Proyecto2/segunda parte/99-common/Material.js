class Material{
    constructor(){
        this.k_ambient = [0.0,0.0,0.0];
        this.k_diffuse = [0.0,0.0,0.0];
        this.k_spec = [0.0,0.0,0.0];
        this.exp_spec = 0.0; //shininess en el modelo de phong
        this.f0 = 0.0; //f0 de fresnel
        this.m = 0.0; //roughness
        this.alpha_x = 0.0; //alphax en el modelo de ward
        this.alpha_y = 0.0; //alphay en el modelo de ward
    }
    set_k_ambient(new_k_ambient){
        this.k_ambient = new_k_ambient;
    }
    set_k_diffuse(new_k_diffuse){
        this.k_diffuse = new_k_diffuse;
    }
    set_k_spec(new_k_spec){
        this.k_spec = new_k_spec;
    }
    set_exp_spec(new_exp_spec){
        this.exp_spec = new_exp_spec;
    }
    set_f0(new_f0){
        this.f0=new_f0;
    }
    set_m(new_m){
        this.m=new_m;
    }
    set_alpha_x(new_alpha_x){
        this.alpha_x = new_alpha_x;
    }
    set_alpha_y(new_alpha_y){
        this.alpha_y = new_alpha_y;
    }

    get_k_ambient(){
        return this.k_ambient;
    }
    get_k_diffuse(){
        return this.k_diffuse;
    }
    get_k_spec(){
        return this.k_spec;
    }
    get_exp_spec(){
        return this.exp_spec;
    }
    get_f0(){
        return this.f0;
    }
    get_m(){
        return this.m;
    }
    get_alpha_x(){
        return this.alpha_x;
    }
    get_alpha_y(){
        return this.alpha_y;
    }
}