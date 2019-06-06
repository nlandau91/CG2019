var fragmentShaderWard = `#version 300 es
//Modelo de reflectancia de ward
//Implementado en los fragmentos (sombreado de Phong)
#define PI 3.14159265
#define EPSILON 0.00001
precision highp float;

struct Material{
    vec3 k_ambient; 
    vec3 k_diffuse;
    vec3 k_spec;
    float alphaX;
    float alphaY;
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

in vec3 vNE; //Normal del vertice en coordenadas del ojo
in vec3 vVE; //Direccion del ojo al vertice en coordenadas del ojo
in vec3 vX;
in vec3 vY;

out vec4 fragColor;

vec3 color_ward(Light luz,vec3 N,vec3 V,vec3 T,vec3 B){
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
        vec3 L = normalize(vLE);
        vec3 H = normalize(L+V);
        vec3 S = normalize(vSD);

        float dotLN = dot(L,N); //cos theta i
        float dotVN = dot(V,N); //cos theta r
        float dotHN = dot(H,N); //cos theta h
        
        if((luz.spot_angle != -1.0 && dot(S, -L) > luz.spot_angle) //si es spot y esta dentro del cono
                ||  luz.spot_angle == -1.0 //o si es puntual
                ||  luz.pos.w < 0.00001){ //o si es direccional
            if(dotLN > 0.0 && dotVN > 0.0){
                float ax = material.alphaX;
                float ay = material.alphaY;
                //vec3 X = vec3(1.0,0.0,0.0);
                //vec3 X = normalize(vX);
                vec3 X = T;
                //vec3 Y = vec3(0.0,1.0,0.0);
                //vec3 Y = normalize(vY);
                vec3 Y = B;

                // float cosphi = dot(H,X);      
                // float cosphi2 = cosphi*cosphi;
                // float sinphi2 = 1.0-cosphi2;
                // float tan2 = pow(tan(acos(dotHN)),2.0);
                // float exponent = -tan2 * (
                //     (cosphi2/(ax*ax)) + (sinphi2/(ay*ay))
                // );

            float exponent = -(
                pow(dot(H,X)/ax,2.0) + //cosphi2/ax2
                pow(dot(H,Y)/ay,2.0) //sinphi2/ay2
                ) / pow(dot(H,N),2.0);

                float ward = 1.0/(4.0 * PI * ax * ay * pow(dot(L,N)*dot(V,N),0.5));
                ward *= exp(exponent);
                float attenuation = 1.0/(1.0+luz.attenuation_a*dist+luz.attenuation_b*dist*dist);
                toReturn = (material.k_diffuse/PI + ward*material.k_spec)*max(dotLN,0.0)*attenuation*luz.intensity;
        
        
            }
        }
    }
    return toReturn;
}

void main()
{
    vec3 N = normalize(vNE);
    vec3 V = normalize(vVE);

    vec3 t1 = cross(vec3(0.0,0.0,1.0),N);
    vec3 t2 = cross(vec3(1.0,0.0,0.0),N);
    vec3 tangent = vec3(0.0);
    if(length(t1) > length(t2)){
        tangent = normalize(t1);
    }else{
        tangent = normalize(t2);
    }
    vec3 bitangent = cross(tangent,N);

    vec3 ambientLightning = material.k_ambient*0.3;  

    vec3 color1 = color_ward(luz1,N,V,tangent,bitangent);
    vec3 color2 = color_ward(luz2,N,V,tangent,bitangent);
    vec3 color3 = color_ward(luz3,N,V,tangent,bitangent);

    vec3 color = color1 + color2 + color3;
  
    fragColor = vec4(
                    ambientLightning + 
    				color, 1.0);
}
`