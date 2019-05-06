class Material{
    constructor(){
        this.k_ambient = [0.0,0.0,0.0];
        this.k_diffuse = [0.0,0.0,0.0];
        this.k_spec = [0.0,0.0,0.0];
        this.exp_spec = 0.0;
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
}