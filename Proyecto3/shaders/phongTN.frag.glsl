#version 300 es
#define MAX_LIGHTS 10
//Shader de fragmentos que implementa iluminacion de phong con sombreado de phong
//Hasta 10 luces de tipo puntual, spot y direccional
//Una textura de color y un normal map

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
    float shininess;
    sampler2D texture0; //diffuse texture
    sampler2D texture1; //normal map
};

uniform Material material;
uniform int numLights;

in vec3 vVE;
in vec3 vNE;
in vec2 fTexCoor;
in mat3 TBNMatrix;

out vec4 fragmentColor;

vec3 calcPhong(Light light, vec3 diffuseColor, vec3 specularColor, vec3 N, vec3 V){
    vec3 toReturn = vec3(0.0);
    if(length(light.color) > 0.0){//si la luz no esta apagada
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
        vec3 H = normalize(L + V);
        vec3 S = normalize(vSD);

        float dotLN = max(dot(L,N),0.0);
        float dotVN = max(dot(V,N),0.0);
        float dotHN = max(dot(H,N),0.0);

        if((light.spot_cutoff != -1.0 && dot(S, -L) > light.spot_cutoff) //si es spot y esta dentro del cono
                ||  light.spot_cutoff == -1.0 //o si es puntual
                ||  light.position.w < 0.00001){ //o si es direccional
            if(dotLN > EPSILON && dotVN > EPSILON){       
                float attenuation = 1.0/(1.0 + dist * light.linear_attenuation + dist*dist * light.quadratic_attenuation );  
                vec3 diffuse = diffuseColor * max(dot(L, N), 0.0);
                vec3 specular = specularColor * pow(max(dot(H,N),0.0),material.shininess);    
                toReturn = attenuation * light.color * (diffuse + specular);   
            }
        }             
    }
    return toReturn;
}

void main () {
    //vec3 N = normalize(vNE); //no vamos a usar esta normal, vamos a calcular una nueva a partir del normal map
    vec3 V = normalize(vVE);

    vec3 sampledNormal = vec3(texture(material.texture1, fTexCoor)); //obtenemos la nueva del mapa de normales
    vec3 N = TBNMatrix * (sampledNormal * 2.0 - 1.0); //la transformamos usando la matrix del espacio tangente

    vec3 diffuseColorFromTexture = texture(material.texture0,fTexCoor).rgb;
    vec3 specularColorFromTexture = diffuseColorFromTexture;

    vec3 outputColor = vec3(0.0);
    for(int i = 0; i < numLights; i++){
        outputColor += calcPhong(allLights[i],diffuseColorFromTexture,specularColorFromTexture,N,V);
    }

    vec3 ambient = diffuseColorFromTexture * 0.15;

    fragmentColor = vec4(ambient + outputColor, 1);
}
