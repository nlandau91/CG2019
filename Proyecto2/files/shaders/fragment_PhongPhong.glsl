var fragmentShaderSource = `#version 300 es
//Modelo de iluminacion de Phong
//Implementado en los fragmentos (sombreado de Phong)
//No implementa factor de atenuacion ni intencidad de la luz
#define EPSILON 0.00001
precision highp float;

uniform vec3 k_ambient; //Componente de ambiente
uniform vec3 k_diffuse; //Componente difusa
uniform vec3 k_spec; //Componente especular
uniform float exp_spec; //Brillo

in vec3 vNE; //Normal del vertice en coordenadas del ojo
in vec3 vLE; //Direccion de la luz al vertice en coordenadas del ojo
in vec3 vVE; //Direccion del ojo al vertice en coordenadas del ojo

out vec4 fragColor;
 
void main()
{
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 R = normalize(reflect(-vLE,vNE));
    
    float diffuse = max(dot(L,N),0.0);
    float specular = pow(max(dot(R,V),0.0),exp_spec);
    if (dot(L,N) < 0.0){
        specular = 0.0;
    }
    
    fragColor = vec4(k_ambient + (k_diffuse * diffuse + k_spec * specular),1.0);

}
`