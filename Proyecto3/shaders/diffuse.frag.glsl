#version 300 es

precision highp float;

in vec3 outgoingLight;

out vec4 fragmentColor;

void main () {
    fragmentColor = vec4(outgoingLight, 1);
}
