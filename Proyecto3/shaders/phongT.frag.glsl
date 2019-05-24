#version 300 es

precision highp float;

struct Light {
    vec3 color;     // Light intensity
    vec4 position;  // Light position
    vec3 spot_direction;
    float spot_cutoff;
};
struct Material {
    float shininess;
};

uniform mat4 viewMatrix;
uniform Light light0, light1;
uniform Material material;
uniform sampler2D imagen;

in vec3 vVE;
in vec3 vNE;
in vec2 fTexCoor;

out vec4 fragmentColor;

vec3 calcPhong(Light light,vec3 N, vec3 V){
    vec3 L = normalize((viewMatrix * vec4(light.position.xyz, 1)).xyz + vVE);
    vec3 H = normalize(L + V);
    float dotHN = max(dot(H,N),0.0);
    vec3 vertColor = texture(imagen,fTexCoor).rgb;
    vec3 ambient = vertColor * 0.05 * light.color;
    vec3 diffuse = vertColor * light.color * max(dot(L, N), 0.0);
    vec3 specular = vec3(0.0);
    if(dot(L,N)>0.0){
        diffuse = vertColor * light.color * max(dot(L, N), 0.0);
        specular = vertColor * pow(max(dot(H,N),0.0),material.shininess) * light.color;    
    }
    return ambient + diffuse + specular;
}

void main () {
    vec3 N = normalize(vNE);
    vec3 V = normalize(vVE);

    vec3 color0 = calcPhong(light0,N,V);
    vec3 color1 = calcPhong(light1,N,V);

    //fragmentColor = vec4(1.0,1.0,1.0, 1);
    fragmentColor = vec4(color0 + color1, 1);
}
