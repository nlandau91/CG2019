#version 300 es
#define MAX_LIGHTS 10

precision highp float;

uniform struct Light {
    vec3 color; // Light intensity
    vec4 position; // Light position in eye coordinates. If w==0.0, it is a directional light and [w,y,z] is the incident direction
    vec4 spot_direction; //spot direction in eye coordinates
    float spot_cutoff; //cosine of the angle, point lights have a spot_cutoff set to -1.0
} allLights[MAX_LIGHTS];

struct Material {
    float shininess;
    sampler2D texture0; //diffuse texture
    sampler2D texture1; //specular texture
    sampler2D texture2; //normal map
};

uniform Material material;

in vec3 vVE;
in vec3 vNE;
in vec2 fTexCoor;
in mat3 TBNMatrix;

out vec4 fragmentColor;

vec3 calcPhong(Light light, vec3 diffuseColor, vec3 specularColor, vec3 N, vec3 V){
    vec3 toReturn = vec3(0.0);
    if(length(light.color) > 0.0){//si la luz no esta apagada
        vec3 vLE = vec3(0.0);
        if(light.position.w < 0.00001){ //si es luz direccional
            vLE = -light.position.xyz;
        }else{ //no es luz direccional
            vLE = light.position.xyz + vVE;
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
            if(dotLN > 0.0 && dotVN > 0.0){       
                vec3 diffuse = diffuseColor * light.color * max(dot(L, N), 0.0);
                vec3 specular = specularColor * light.color * pow(max(dot(H,N),0.0),material.shininess);    
                toReturn = diffuse + specular;   
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

    vec3 outputColor = vec3(0.0);
    int numLights = 4; //este valor deberia ser pasado por uniform, hardcodeamos 4 luces
    for(int i = 0; i < numLights; i++){
        outputColor += calcPhong(allLights[i],diffuseColorFromTexture,specularColorFromTexture,N,V);
    }

    vec3 ambient = diffuseColorFromTexture * 0.05;

    fragmentColor = vec4(ambient + outputColor, 1);
}
