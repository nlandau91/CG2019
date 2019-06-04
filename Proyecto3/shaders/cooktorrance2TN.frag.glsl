#version 300 es
#define MAX_LIGHTS 10
#define PI 3.14159265
//Shader de fragmentos que implementa Cook Torrance con sombreado de phong
//Hasta 10 luces de tipo puntual, spot y direccional
//Una textura difusa, una textura especular, textura de emision y normal mapping
//Pensado para ser usado solamente un el modelo de ufo
#define EPSILON 0.00001
precision highp float;

uniform struct Light {
    vec3 color; // Light intensity
    vec4 position; // Light position in eye coordinates. If w==0.0, it is a directional light and [w,y,z] is the incident direction
    vec4 spot_direction; //spot direction in eye coordinates
    float spot_cutoff; //cosine of the angle, point lights have a spot_cutoff set to -1.0
    float linear_attenuation;
    float quadratic_attenuation;
} allLights[MAX_LIGHTS];

struct Material {
    float m; //rugosidad
    float f0; //fresnel
    sampler2D texture0; //diffuse texture
    sampler2D texture1; //specular texture
    sampler2D texture2; //normal map
    sampler2D texture3; //emission (ambient)
};

uniform Material material;
uniform int numLights;

in vec3 vVE;
in vec3 vNE;
in vec2 fTexCoor;
in mat3 TBNMatrix;

out vec4 fragmentColor;

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
vec3 color_cook_torrance(Light light, vec3 diffuseColor, vec3 specularColor, vec3 N, vec3 V){
    vec3 toReturn = vec3(0.0,0.0,0.0);
    if(length(light.color) > 0.0){ //checkeo si la luz esta prendida
        vec3 vLE = vec3(0.0);
        float dist = 0.0;
        if(light.position.w < 0.00001){ //si es luz direccional
            vLE = -light.position.xyz;
        }else{ //no es luz direccional
            vLE = light.position.xyz + vVE;
            dist = length(vLE);
        }

        vec3 vSD = light.spot_direction.xyz;
        vec3 L = normalize(vLE);
        vec3 H = normalize(L+V);
        vec3 S = normalize(vSD);

        float dotLN = max(dot(L,N),0.0); //cos theta i
        float dotVN = max(dot(V,N),0.0); //cos theta r
        float dotHN = max(dot(H,N),0.0); //cos theta h
        float dotVH = max(dot(V,H),0.0);

        if((light.spot_cutoff != -1.0 && dot(S, -L) > light.spot_cutoff) //si es spot y esta dentro del cono
                ||  light.spot_cutoff == -1.0 //o si es puntual
                ||  light.position.w < 0.00001){ //o si es direccional
            if(dotLN > EPSILON && dotVN > EPSILON){
                float attenuation = 1.0/(1.0 + dist * light.linear_attenuation + dist*dist * light.quadratic_attenuation );  
                float F = fresnelSchlick(dotHN);
                float D = D_beckman(dotHN);
                float G = calcularG(dotHN,dotVN,dotVH,dotLN);       

                toReturn =  light.color*attenuation*dotLN*( diffuseColor/PI + specularColor * (F*D*G)/(PI*dotVN*dotLN));
        
            }
        }
    }
    return toReturn;
}

void main () {
    //vec3 N = normalize(vNE); //no vamos a usar esta normal, vamos a calcular una nueva a partir del normal map
    vec3 V = normalize(vVE);

    vec3 sampledNormal = vec3(texture(material.texture2, fTexCoor)); //obtenemos la nueva del mapa de normales
    vec3 N = TBNMatrix * (sampledNormal * 2.0 - 1.0); //la transformamos usando la matrix del espacio tangente

    vec3 diffuseColorFromTexture = texture(material.texture0,fTexCoor).rgb;
    vec3 specularColorFromTexture = texture(material.texture1,fTexCoor).rgb;
    vec3 emission = texture(material.texture3,fTexCoor).rgb;

    vec3 outputColor = vec3(0.0);
    for(int i = 0; i < numLights; i++){
        outputColor += color_cook_torrance(allLights[i],diffuseColorFromTexture,specularColorFromTexture,N,V);
    }

    vec3 ambient = emission;

    fragmentColor = vec4(ambient + outputColor + emission, 1);
}
