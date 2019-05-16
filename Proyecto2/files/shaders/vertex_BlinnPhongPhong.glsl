var vertexShaderBlinnPhong = `#version 300 es
//Modelo de iluminacion de Blinn-Phong
//Implementado en los fragmentos (sombreado de Phong)
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 normalMatrix;

in vec3 vertexPosition;
in vec3 vertexNormal;

out vec3 vNE; //Normal del vertice en coordenadas del ojo
out vec3 vVE; //Direccion del ojo al vertice en coordenadas del ojo

void main(){
    gl_Position = projectionMatrix * modelViewMatrix  * vec4(vertexPosition,1);
    
    vNE = (normalMatrix * vec4(vertexNormal,1.0)).xyz;
    vVE = -(modelViewMatrix * vec4(vertexPosition,1.0)).xyz;

}
`