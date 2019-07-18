#version 300 es

precision highp float;

uniform sampler2D colorSource;

in vec2 fragmentTextureCoordinates;

out vec4 fragmentColor;

void main () {
    vec4 colorSample = texture(colorSource, fragmentTextureCoordinates);
    float grayscale = colorSample.r * 0.2126 + colorSample.g * 0.7152 + colorSample.b * 0.0722;
    fragmentColor = vec4(vec3(grayscale), 1);
}
