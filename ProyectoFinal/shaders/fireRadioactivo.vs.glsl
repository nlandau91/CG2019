#version 300 es
in vec3 vertexPosition;
in vec2 vertexTextureCoordinates;

const float fOneSec = 0.001;


uniform  mat4 projectionMatrix;
uniform  mat4 viewMatrix;
uniform  float fTime;


uniform mat4 modelMatrix;

out vec2 v_uv;
out vec2 v_uv_anim;

void main(void){
  v_uv = vertexTextureCoordinates;

  v_uv_anim = vertexTextureCoordinates;
  v_uv_anim -= fract(fTime * fOneSec * 0.2);
  v_uv_anim -= fract(fTime * fOneSec * 0.8);

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition,1.0);
}
