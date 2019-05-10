var fragmentShaderCookTorrance = `#version 300 es
//BRDF de Cook-Torrance
precision highp float;
#define PI 3.14159265

struct Material{
    vec3 k_ambient; 
    vec3 k_diffuse;
    vec3 k_spec;
    float m;
    float f0;
};
struct Light{
    vec4 light_pos; //si w = 0 es vector de luz direccional, si w = 1 es posicion
    vec3 light_intensity; //[r,g,b]
    float spot_angle; // coseno, si es 0 o 1 no es spot
    vec4 spot_direction; 
};

uniform mat4 viewMatrix; //solo para convertir la posicion de la luz
uniform Material material;
uniform Light luz1,luz2,luz3;

//uniform de luz

in vec3 vNE;
in vec3 vVE;

out vec4 fragColor;

float fresnelSchlick(float cosVH){//Aproximacion de schlick
    float fresnel = material.f0 + (1.0 - material.f0) * pow(1.0 - cosVH,5.0);
    return fresnel;
}

vec3 lambertDiffuse(){

    return material.k_diffuse/PI;
}

float D_beckman( float dotNH){
    float m2 = pow(material.m,2.0);
    float dotNH2 = pow(dotNH,2.0);
    float dotNH4 = pow(dotNH2,2.0);
    float num = exp(-1.0*((1.0-dotNH2)/(m2*dotNH2)));
    float den = 4.0*m2*dotNH4;
    return num/den;
}

float calcularG( float dotNH,float dotNV,float dotVH,float dotNL){
   	float Ge = (2.0*dotNH*dotNV)/dotVH;
    float Gs = (2.0*dotNH*dotNL)/dotVH;
    return min(1.0,min(Ge,Gs));
}

vec3 cook_torrance_spec(Light luz){
    vec3 vLE = vec3(0.0);
    if(luz.light_pos.w < 0.00001){ //si es luz direccional
        vLE = luz.light_pos.xyz;
    }else{ //no es luz direccional
        vLE = luz.light_pos.xyz + vVE;
    }

    vec3 vSD = luz.spot_direction.xyz;
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);
    vec3 S = normalize(vSD);

    float dotLN = max(dot(L,N),0.0); //cos theta i
    float dotVN = max(dot(V,N),0.0); //cos theta r
    float dotHN = max(dot(H,N),0.0); //cos theta h
    float dotVH = max(dot(V,H),0.0);

    vec3 toReturn = vec3(0.0);
    //if((luz.spot_angle > 0.0 && luz.spot_angle < 1.0 && dot(S, -L) > luz.spot_angle) //si es spot y esta dentro del cono
     //       ||  (luz.spot_angle < 0.00001 || luz.spot_angle > 0.99999) //o si es puntual
     //       ||  luz.light_pos.w < 0.00001){ //o si es direccional
        if(dotLN > 0.0 && dotVN > 0.0){
            float F = fresnelSchlick(dotHN);
            float D = D_beckman(dotHN);
    	    float G = calcularG(dotHN,dotVN,dotVH,dotLN);
            toReturn =  dotLN*(lambertDiffuse() + material.k_spec * (F*D*G)/(PI*dotVN*dotLN));
       
        }
    //}


    return toReturn;
}
void main(){
    // vec3 N = normalize(vNE);
    // vec3 V = normalize(vVE);
    // vec3 vLE = (viewMatrix * vec4(light_pos,1.0)).xyz + vVE;
    // vec3 L = normalize(vLE);
    // vec3 H = normalize(L+V);
    
    // float dotNV = max(dot(N,V),0.0);
    // float dotNL = max(dot(N,L),0.0);
    // float dotNH = max(dot(N,H),0.0);
    // float dotVH = max(dot(V,H),0.0);

    
    vec3 specular1 = vec3(0.0);
    vec3 specular2 = vec3(0.0);
    vec3 specular3 = vec3(0.0);
    vec3 specular = vec3(0.0);
   		
    specular1 = cook_torrance_spec(luz1);
    specular2 = cook_torrance_spec(luz2);
    specular3 = cook_torrance_spec(luz3);
    specular = specular1+specular2+specular3;
	   
    
    fragColor = vec4(material.k_ambient*0.3 + ( specular ),1.0); 
    //fragColor = vec4(1.0,1.0,1.0,1.0);

}
`