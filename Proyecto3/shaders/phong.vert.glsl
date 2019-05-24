#version 300 es

struct Light {
    vec3 color;     // Light intensity
    vec3 position;  // Light position
    vec3 spot_direction;
    float spot_cutoff;
};
struct Material {
    vec3 Ka;    // Surface ambient reflectivity
    vec3 Kd;    // Surface diffuse reflectivity
    vec3 Ks;
    float shininess;
};

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 normalMatrix;

uniform Light light0, light1;
uniform Material material;

in vec3 vertexPosition;
in vec3 vertexNormal;

out vec3 outgoingLight;

vec3 calcPhong(Light light,vec3 N, vec3 V){
    vec3 L = normalize(vec3(viewMatrix * vec4(light.position.xyz, 1) - modelViewMatrix * vec4(vertexPosition, 1)));
    vec3 H = normalize(L + V);
    float dotHN = max(dot(H,N),0.0);
    vec3 ambient = material.Ka * light.color;
    vec3 diffuse = material.Kd * light.color * max(dot(L, N), 0.0);
    vec3 specular = material.Ks * pow(max(dot(H,N),0.0),material.shininess) * light.color;
    return ambient + diffuse + specular;
}

void main () {
    vec3 N = normalize(vec3(normalMatrix * vec4(vertexNormal, 0)));
    vec3 V = normalize(-(modelViewMatrix * vec4(vertexPosition,1.0)).xyz);

    vec3 color0 = calcPhong(light0,N,V);
    vec3 color1 = calcPhong(light1,N,V);

    outgoingLight = color0 + color1;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1);
}


