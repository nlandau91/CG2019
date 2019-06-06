#version 300 es
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

in vec3 vertexPosition;

out vec3 vertexPosMC;

void main(){
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition,1.0);    
    vertexPosMC = vertexPosition;
    
}