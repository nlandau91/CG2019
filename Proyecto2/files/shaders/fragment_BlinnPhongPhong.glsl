var fragmentShaderBlinnPhong = `#version 300 es
//Modelo de iluminacion de Blinn-Phong
//Implementado en los fragmentos (sombreado de Phong)
precision highp float;

struct Material{
    vec3 k_ambient; 
    vec3 k_diffuse;
    vec3 k_spec;
    float exp_spec;
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
uniform Light luz1,luz2,luz3,luz4;

in vec3 vNE; //Normal del vertice en coordenadas del ojo
in vec3 vVE; //Direccion del ojo al vertice en coordenadas del ojo

out vec4 fragColor;

vec3 calcBlinnPhong(Light luz,vec3 N,vec3 V){
    vec3 toReturn = vec3(0.0);
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
        vec3 L = normalize(vLE);
        vec3 H = normalize(L+V);
        vec3 S = normalize(vSD);

        float dotLN = max(dot(L,N),0.0);
        float dotVN = max(dot(V,N),0.0);
        float dotHN = max(dot(H,N),0.0);

        if((luz.spot_angle != -1.0 && dot(S, -L) > luz.spot_angle) //si es spot y esta dentro del cono
                ||  luz.spot_angle == -1.0 //o si es puntual
                ||  luz.pos.w < 0.00001){ //o si es direccional
            if(dotLN > 0.0 && dotVN > 0.0){       
                float attenuation = 1.0/(1.0+luz.attenuation_a*dist+luz.attenuation_b*dist*dist);
                float spec = pow(dotHN,material.exp_spec);
                toReturn =  attenuation*luz.intensity*dotLN*( material.k_diffuse + material.k_spec*spec );
        
            }
        }
    }
    return toReturn;
}
 
void main()
{
    vec3 N = normalize(vNE);
    vec3 V = normalize(vVE);
    vec3 color1 = calcBlinnPhong(luz1,N,V);
    vec3 color2 = calcBlinnPhong(luz2,N,V);
    vec3 color3 = calcBlinnPhong(luz3,N,V);
    vec3 color = color1+color2+color3;
    
    fragColor = vec4(material.k_ambient*0.3 + color,1.0);

}
`