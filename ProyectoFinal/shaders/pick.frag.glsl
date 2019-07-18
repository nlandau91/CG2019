#version 300 es

precision highp float;

uniform vec3 PickingColor;

out vec4 fragmentColor;

void main() {
    fragmentColor = vec4(PickingColor,1.0);
}
