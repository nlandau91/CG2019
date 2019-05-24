#version 300 es

struct Light {
    vec3 color;     // Light intensity
    vec3 position;  // Light position
};
struct Material {
    vec3 Ka;    // Surface ambient reflectivity
    vec3 Kd;    // Surface diffuse reflectivity
};

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 normalMatrix;

uniform Light light;
uniform Material material;

in vec3 vertexPosition;
in vec3 vertexNormal;

out vec3 outgoingLight;

void main () {
    vec3 N = normalize(vec3(normalMatrix * vec4(vertexNormal, 0)));
    vec3 L = normalize(vec3(viewMatrix * vec4(light.position, 1) - modelViewMatrix * vec4(vertexPosition, 1)));

    vec3 ambient = material.Ka * light.color;
    vec3 diffuse = material.Kd * light.color * max(dot(L, N), 0.0);

    outgoingLight = ambient + diffuse;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1);
}


