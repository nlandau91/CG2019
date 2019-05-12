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
    vec4 pos; //si w = 0 es vector de luz direccional, si w = 1 es posicion
    vec3 intensity; //[r,g,b]
    float spot_angle; // coseno, si es 0 o 1 no es spot
    vec4 spot_direction;
    float attenuation_a;
    float attenuation_b;
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

vec3 color_cook_torrance(Light luz,vec3 N,vec3 V){
    vec3 vLE = vec3(0.0);
    float dist = 0.0;
    if(luz.pos.w < 0.00001){ //si es luz direccional
        vLE = luz.pos.xyz;
    }else{ //no es luz direccional
        vLE = luz.pos.xyz + vVE;
        dist = length(vLE);
    }

    vec3 vSD = luz.spot_direction.xyz;
    vec3 L = normalize(vLE);
    vec3 H = normalize(L+V);
    vec3 S = normalize(vSD);

    float dotLN = max(dot(L,N),0.0); //cos theta i
    float dotVN = max(dot(V,N),0.0); //cos theta r
    float dotHN = max(dot(H,N),0.0); //cos theta h
    float dotVH = max(dot(V,H),0.0);

    vec3 toReturn = vec3(0.0);
    if((luz.spot_angle > 0.0 && luz.spot_angle < 1.0 && dot(S, -L) > luz.spot_angle) //si es spot y esta dentro del cono
            ||  (luz.spot_angle < 0.00001 || luz.spot_angle > 0.99999) //o si es puntual
            ||  luz.pos.w < 0.00001){ //o si es direccional
        if(dotLN > 0.0 && dotVN > 0.0){
            float F = fresnelSchlick(dotHN);
            float D = D_beckman(dotHN);
    	    float G = calcularG(dotHN,dotVN,dotVH,dotLN);       
            float attenuation = 1.0/(1.0+luz.attenuation_a*dist+luz.attenuation_b*dist*dist);

            toReturn =  attenuation*luz.intensity*dotLN*( material.k_diffuse/PI + material.k_spec * (F*D*G)/(PI*dotVN*dotLN));
       
        }
    }


    return toReturn;
}
void main(){

    vec3 N = normalize(vNE);
    vec3 V = normalize(vVE);

    vec3 color1 = vec3(0.0);
    vec3 color2 = vec3(0.0);
    vec3 color3 = vec3(0.0);
    vec3 color = vec3(0.0);
   		
    color1 = color_cook_torrance(luz1,N,V);
    color2 = color_cook_torrance(luz2,N,V);
    color3 = color_cook_torrance(luz3,N,V);
    color = color1+color2+color3;
	   
    
    fragColor = vec4(material.k_ambient*0.3 + color,1.0); 

}
`