var vertexShaderOrenNayar = `#version 300 es
//BRDF de Oren-Nayar



uniform mat4 modelViewProjMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 normalMatrix;

in vec3 vertexPosition;
in vec3 vertexNormal;

out vec3 vNE;
out vec3 vVE;

void main(){
    gl_Position = modelViewProjMatrix * vec4(vertexPosition,1.0);
	
    vNE = (normalMatrix * vec4(vertexNormal,1.0)).xyz;
    vVE = -(modelViewMatrix * vec4(vertexPosition,1.0)).xyz;
}
`