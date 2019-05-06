var fragmentShaderSource = `#version 300 es
//Modelo de iluminacion de Phong
//Implementado en los fragmentos (sombreado de Phong)
precision highp float;

uniform vec3 k_ambient; 
uniform vec3 k_diffuse;
uniform vec3 k_spec;
uniform float exp_spec;
uniform vec3 light_pos;
uniform vec3 light_intensity;

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
    float fac_att = pow(0.2*length(vLE),-1.0); //factor de atenuacion
    
    fragColor = vec4(k_ambient + light_intensity * fac_att * (k_diffuse * diffuse + k_spec * specular),1.0);

}
`