var vertexShaderSource = `#version 300 es
//Modelo de iluminacion de Blinn-Phong
//Implementado en los fragmentos (sombreado de Phong)
uniform mat4 modelViewMatrix;
uniform mat4 modelViewProjMatrix;
uniform mat4 normalMatrix;
uniform vec4 light_pos; // coordenadas del ojo
uniform vec4 spot_direction; //coordenadas del ojo

in vec3 vertexPosition;
in vec3 vertexNormal;

out vec3 vNE; //Normal del vertice en coordenadas del ojo
out vec3 vLE; //Direccion de la luz al vertice en coordenadas del ojo
out vec3 vVE; //Direccion del ojo al vertice en coordenadas del ojo
out vec3 vSD; //Direccion del spot


void main(){
    gl_Position = modelViewProjMatrix  * vec4(vertexPosition,1);
    
    vec3 vertex_pos_eye = (modelViewMatrix*vec4(vertexPosition,1.0)).xyz; //posicion del vertice en coordenadas del ojo
    vVE = -vertex_pos_eye;
    vec3 vertex_normal_eye = (normalMatrix * vec4(vertexNormal,1.0)).xyz; //normal del vertice en coordenadas del ojo
    vNE = vertex_normal_eye;
    vec3 light_direction = light_pos.xyz - vertex_pos_eye; //direccion de la luz al vertice   
    vLE = light_direction;
    vSD = (spot_direction).xyz;
}
`