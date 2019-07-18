#version 300 es

precision highp float;

uniform sampler2D colorSourceA;
uniform sampler2D colorSourceB;

in vec2 fragmentTextureCoordinates;

out vec4 fragmentColor;

void main () {
    vec4 colorSampleA = texture(colorSourceA, fragmentTextureCoordinates);
    vec4 colorSampleB = texture(colorSourceB, fragmentTextureCoordinates);

    fragmentColor = colorSampleA + colorSampleB;
}
