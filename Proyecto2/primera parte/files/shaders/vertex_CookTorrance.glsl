var vertexShaderCookTorrance = `#version 300 es
//BRDF de Cook-Torrance

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 normalMatrix;

in vec3 vertexPosition;
in vec3 vertexNormal;

out vec3 vNE;
out vec3 vVE;

void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition,1.0);
	
    vNE = (normalMatrix * vec4(vertexNormal,1.0)).xyz;
    vVE = -(modelViewMatrix * vec4(vertexPosition,1.0)).xyz;
}
`