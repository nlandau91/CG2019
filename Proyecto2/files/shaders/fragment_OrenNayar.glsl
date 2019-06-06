var fragmentShaderOrenNayar = `#version 300 es
//BRDF de Oren-Nayar
#define EPSILON 0.00001
precision highp float;
#define PI 3.14159265

struct Material{
    vec3 k_ambient; 
    vec3 k_diffuse;
    vec3 k_spec;
    float sigma;
};
struct Light{
    vec4 pos; //si w = 0 es vector de luz direccional, si w = 1 es posicion
    vec3 intensity; //[r,g,b]
    float spot_angle; // coseno, si es 0 o 1 no es spot
    vec4 spot_direction;
    float attenuation_a;
    float attenuation_b;
};

uniform Material material;
uniform Light luz1,luz2,luz3;

in vec3 vNE;
in vec3 vVE;

out vec4 fragColor;

vec3 orenNayarDiffuse(Light luz, float dotVN, vec3 N, vec3 V){
    vec3 toReturn = vec3(0.0,0.0,0.0);
    if(length(luz.intensity) > 0.0){ //checkeo si la luz esta prendida
        vec3 vLE = vec3(0.0);
        float dist = 0.0;
        if(luz.pos.w < 0.00001){ //si es luz direccional
            vLE = -luz.pos.xyz;
        }else{ //no es luz direccional
            vLE = luz.pos.xyz + vVE;
            dist = length(vLE);
        }
        vec3 vSD = luz.spot_direction.xyz;
        vec3 S = normalize(vSD);
        vec3 L = normalize(vLE);
        float dotLN = dot(L,N);
        float thetaI = acos(dotLN);
        float thetaR = acos(dotVN);
        if((luz.spot_angle != -1.0 && dot(S, -L) > luz.spot_angle) //si es spot y esta dentro del cono
                ||  luz.spot_angle == -1.0 //o si es puntual
                ||  luz.pos.w < 0.00001){ //o si es direccional
            if(dotLN > 0.0 && dotVN > 0.0){
        
                float alpha = max(thetaI,thetaR);
                float beta = min(thetaI,thetaR);

                float sigma2 = pow(material.sigma,2.0);

                float A = 1.0 - 0.5*sigma2/(sigma2+0.33);
                float B = 0.45*sigma2/(sigma2 + 0.09);

                float cosPHI = dot( normalize(V-N*(dotVN)), normalize(L - N*(dotLN)) );
                float attenuation = 1.0/(1.0+luz.attenuation_a*dist+luz.attenuation_b*dist*dist);
                toReturn = attenuation*luz.intensity*(material.k_diffuse/PI)*dotLN*(A+(B*max(0.0,cosPHI))*sin(alpha)*tan(beta));
            }
        }
    }
	return toReturn;

}

void main(){
    vec3 N = normalize(vNE);
    vec3 V = normalize(vVE);
    
    float dotVN = max(dot(N,V),0.0);
    
    vec3 diffuse1 = orenNayarDiffuse(luz1, dotVN, N, V);
    vec3 diffuse2 = orenNayarDiffuse(luz2, dotVN, N, V);
    vec3 diffuse3 = orenNayarDiffuse(luz3, dotVN, N, V);
    vec3 diffuse = diffuse1+diffuse2+diffuse3;
    
    vec3 specular = vec3(0.0);
       
    //fragColor = vec4(1.0,1.0,1.0,1.0);
    fragColor = vec4(material.k_ambient*0.3 + (diffuse + specular),1.0); 
    
}
`