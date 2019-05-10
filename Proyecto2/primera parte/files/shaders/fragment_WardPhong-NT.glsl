var fragmentShaderWard = `#version 300 es
//Modelo de reflectancia de ward
//Implementado en los fragmentos (sombreado de Phong)
#define PI 3.14159265
precision highp float;

struct Material{
    vec3 k_ambient; 
    vec3 k_diffuse;
    vec3 k_spec;
    float alphaX;
    float alphaY;
};
struct Light{
    vec4 light_pos; //si w = 0 es vector de luz direccional, si w = 1 es posicion
    vec3 light_intensity; //[r,g,b]
    float spot_angle; // coseno, si es 0 o 1 no es spot
    vec4 spot_direction; 
};

uniform Material material;
uniform Light luz1,luz2,luz3;

in vec3 vNE; //Normal del vertice en coordenadas del ojo
in vec3 vVE; //Direccion del ojo al vertice en coordenadas del ojo
in float atenuacion;

out vec4 fragColor;

vec3 calcWardSpec(Light luz){
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

    float dotLN = dot(L,N); //cos theta i
    float dotVN = dot(V,N); //cos theta r
    float dotHN = dot(H,N); //cos theta h
    vec3 toReturn = vec3(0.0);
    
    if((luz.spot_angle > 0.0 && luz.spot_angle < 1.0 && dot(S, -L) > luz.spot_angle) //si es spot y esta dentro del cono
            ||  (luz.spot_angle < 0.00001 || luz.spot_angle > 0.99999) //o si es puntual
            ||  luz.light_pos.w < 0.00001){ //o si es direccional
        if(dotLN > 0.0 && dotVN > 0.0){
            float ax = material.alphaX;
            float ay = material.alphaY;
            vec3 X = vec3(1.0,0.0,0.0);
            vec3 Y = vec3(0.0,1.0,0.0);
            float exponent = -(
                pow(dot(H,X)/ax,2.0) + //cosphi2/ax2
                pow(dot(H,Y)/ay,2.0) //sinphi2/ay2
            ) / pow(dot(H,N),2.0);
            float ward = 1.0/(4.0 * PI * ax * ay * pow(dot(L,N)*dot(V,N),0.5));
            ward *= exp(exponent);
            toReturn = ward*material.k_spec*max(dotLN,0.0)*atenuacion*luz.light_intensity;
       
       
        }
    }
    return toReturn;
}

vec3 calcDiffuse(Light luz){
    vec3 vLE = vec3(0.0);
    if(luz.light_pos.w < 0.00001){ //si es luz direccional
        vLE = luz.light_pos.xyz;
    }else{ //no es luz direccional
        vLE = luz.light_pos.xyz + vVE;
    }

    vec3 vSD = luz.spot_direction.xyz;
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 S = normalize(vSD);
    float dotLN = dot(L,N);

    vec3 toReturn = vec3(0.0);

    if((luz.spot_angle > 0.0 && luz.spot_angle < 1.0 && dot(S, -L) > luz.spot_angle) //si es spot y esta dentro del cono
        ||  (luz.spot_angle < 0.00001 || luz.spot_angle > 0.99999) //o si es puntual
        ||  luz.light_pos.w < 0.00001){ //o si es direccional

        toReturn = (material.k_diffuse/PI)*max(dotLN,0.0)*atenuacion*luz.light_intensity;
    }           
    return toReturn;
}

void main()
{

    vec3 ambientLightning = material.k_ambient;  

    vec3 diffuseReflection1 = calcDiffuse(luz1);
    vec3 specularReflection1 = calcWardSpec(luz1);
    vec3 diffuseReflection2 = calcDiffuse(luz2);
    vec3 specularReflection2 = calcWardSpec(luz2);
    vec3 diffuseReflection3 = calcDiffuse(luz3);
    vec3 specularReflection3 = calcWardSpec(luz3);

    vec3 diffuseReflection = diffuseReflection1 + diffuseReflection2 + diffuseReflection3;
    vec3 specularReflection = specularReflection1 + specularReflection2 + specularReflection3;
  
    fragColor = vec4(
                    ambientLightning + 
    				diffuseReflection +
    				specularReflection, 1.0);
}
`