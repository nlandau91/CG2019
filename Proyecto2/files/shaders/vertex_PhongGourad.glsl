var vertexShaderSource = `#version 300 es
//Modelo de iluminacion de Phong
//Implementado en los vertices (sombreado de Gourad)
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 normalMatrix;
uniform vec3 k_ambient; 
uniform vec3 k_diffuse;
uniform vec3 k_spec;
uniform float exp_spec;
uniform vec3 light_pos; // coordenadas del mundo
uniform vec3 light_intensity; //intensidad de luz

in vec3 vertexPosition;
in vec3 vertexNormal;

out vec3 vColor;

void main(){
    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(vertexPosition,1);
    
    vec3 vertex_pos_eye = (viewMatrix*modelMatrix*vec4(vertexPosition,1.0)).xyz; //posicion del vertice en coordenadas del ojo
    vec3 vertex_normal_eye = (normalMatrix * vec4(vertexNormal,1.0)).xyz; //normal del vertice en coordenadas del ojo
    vec3 N = normalize(vertex_normal_eye);
    vec3 light_pos_eye = (viewMatrix*vec4(light_pos,1.0)).xyz; //posicion de la fuente de luz en coordenadas del ojo
    vec3 light_direction = light_pos_eye - vertex_pos_eye; //direccion de la luz al vertice
    vec3 L = normalize(light_direction);
    float diffuse = max(dot(L,N),0.0); //componente difusa del modelo de phong
    vec3 reflected_direction = reflect(-light_direction,vertex_normal_eye); //direccion de la luz reflejada en el vertice
    vec3 R = normalize(reflected_direction);
    vec3 view_direction = normalize(-vertex_pos_eye.xyz); //direccion del ojo hacia el vertice
    vec3 V = normalize(view_direction);
    float specular = pow(max(dot(R,V),0.0),exp_spec); //componente especular del modelo de phong
    if (dot(L,N) < 0.0){
        specular = 0.0;
    }
    float fac_att = pow(0.2*length(light_direction),-1.0); //factor de atenuacion

    vColor = k_ambient + fac_att * light_intensity * (k_diffuse * diffuse + k_spec * specular); //color del vertice dado por el modelo de phong
}
`