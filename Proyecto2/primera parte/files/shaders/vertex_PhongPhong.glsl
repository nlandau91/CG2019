var vertexShaderSource = `#version 300 es
//Modelo de iluminacion de Phong
//Implementado en los fragmentos (sombreado de Phong)
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 normalMatrix;
uniform vec3 light_pos; // coordenadas del mundo

in vec3 vertexPosition;
in vec3 vertexNormal;

out vec3 vNE; //Normal del vertice en coordenadas del ojo
out vec3 vLE; //Direccion de la luz al vertice en coordenadas del ojo
out vec3 vVE; //Direccion del ojo al vertice en coordenadas del ojo


void main(){
     gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(vertexPosition,1);
    
    vec3 vertex_pos_eye = (viewMatrix*modelMatrix*vec4(vertexPosition,1.0)).xyz; //posicion del vertice en coordenadas del ojo
    vVE = -vertex_pos_eye;
    vec3 vertex_normal_eye = (normalMatrix * vec4(vertexNormal,1.0)).xyz; //normal del vertice en coordenadas del ojo
    vNE = vertex_normal_eye;
    vec3 light_pos_eye = (viewMatrix*vec4(light_pos,1.0)).xyz; //posicion de la fuente de luz en coordenadas del ojo
    vec3 light_direction = light_pos_eye - vertex_pos_eye; //direccion de la luz al vertice   
    vLE = light_direction;
}
`