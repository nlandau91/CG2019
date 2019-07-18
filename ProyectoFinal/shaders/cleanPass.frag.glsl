#version 300 es

precision highp float;

uniform sampler2D colorSource;

in vec2 fragmentTextureCoordinates;

out vec4 fragmentColor;

void main () {
    fragmentColor = texture(colorSource, fragmentTextureCoordinates);
}
