#version 300 es
//Shader de fragmentos
//Una textura siempre iluminada
precision highp float;

struct Material {
    sampler2D texture0;
};

uniform Material material;
in vec2 fTexCoor;

out vec4 fragmentColor;

void main () {

    vec4 fragColorFromTexture = texture(material.texture0,fTexCoor);

    fragmentColor = fragColorFromTexture;

}
