#version 300 es
precision mediump float;
#define MAX_LIGHTS 10
uniform vec4 pointLightPosition;
uniform vec3 kd;
uniform vec3 ks;
uniform samplerCube lightShadowMap;
uniform vec2 shadowClipNearFar;

// struct Light {
//     vec3 color;     // Light intensity
//     vec4 position;  // Light position
//     float linear_attenuation;
//     float quadratic_attenuation;
// };
// uniform Light light;

uniform struct Light {
    vec3 color; // Light intensity
    vec4 position; // Light position in eye coordinates. If w==0.0, it is a directional light and [w,y,z] is the incident direction
    vec4 spot_direction; //spot direction in eye coordinates
    float spot_cutoff; //cosine of the angle, point lights have a spot_cutoff set to -1.0
    float linear_attenuation;
    float quadratic_attenuation;
} allLights[MAX_LIGHTS];
uniform int numLights;
in vec2 fTexCoor;
in vec3 fPos;
// in vec3 vLE;
in vec3 vVE;
in vec3 vNE;
in mat3 TBNMatrix;
out vec4 fragColor;

struct Material {
    float shininess;
    sampler2D texture0; //diffuse texture
    sampler2D texture1; //normal map
};
uniform Material material;


vec3 calcSombras(Light light, vec3 N, vec3 V){
  vec3 toReturn = vec3(0.0);
  vec3 vLE = light.position.xyz + vVE;
  vec3 L = normalize(vLE);
  vec3 H = normalize(L + V);
  float dist = length(vLE);
  float LdotN = max(dot(L, N), 0.0);
  float HdotN = max(dot(H, N), 0.0);
  float dif		= LdotN;
  float specPhong = 0.0;

  if (LdotN > 0.0) {
     specPhong = pow(HdotN, material.shininess);
  }
  vec3 diffuseColorFromTexture = texture(material.texture0,fTexCoor).xyz;
  vec3 ambiente  =  vec3(0.0) * 0.5 ;
	vec3 difuso    =   diffuseColorFromTexture * dif;
  //vec3 difuso = vec3(0.0,0.0,0.8) * dif;
	vec3 especular =  vec3(0.2)* specPhong;
  float attenuation = 1.0/(1.0 + dist * light.linear_attenuation + dist*dist * light.quadratic_attenuation );

  vec3 toLightNormal = normalize(pointLightPosition.xyz - fPos);
  float fromLightToFrag = (dist-shadowClipNearFar.x)/(shadowClipNearFar.y-shadowClipNearFar.x);
  float shadowMapValue = texture(lightShadowMap,-toLightNormal).r;
  float lightIntensity = 0.0;
  if((shadowMapValue + 0.003)>= fromLightToFrag){
    lightIntensity += 0.4 * dif;
  }
  toReturn = ambiente + lightIntensity *light.color*(difuso + especular);
  return toReturn;
}

vec3 calcPhong(Light light, vec3 N, vec3 V){
  vec3 toReturn = vec3(0.0);
  vec3 vLE = light.position.xyz + vVE;
  vec3 L = normalize(vLE);
  vec3 H = normalize(L + V);
  float dist = length(vLE);
  float LdotN = max(dot(L, N), 0.0);
  float HdotN = max(dot(H, N), 0.0);
  float dif		= LdotN;
  float specPhong = 0.0;

  if (LdotN > 0.0) {
     specPhong = pow(HdotN, material.shininess);
  }
  vec3 diffuseColorFromTexture = texture(material.texture0,fTexCoor).xyz;
  vec3 ambiente  =  vec3(0.0) * 0.5 ;
	vec3 difuso    =   diffuseColorFromTexture * dif;
  //vec3 difuso = vec3(0.0,0.0,0.8) * dif;
	vec3 especular =  diffuseColorFromTexture* specPhong;
  float attenuation = 1.0/(1.0 + dist * light.linear_attenuation + dist*dist * light.quadratic_attenuation );

  toReturn = ambiente + light.color*attenuation*(difuso + especular);
  return toReturn;
}

void main(){
  vec3 V = normalize(vVE);

  // vec3 L = normalize(vLE);

  vec3 sampledNormal = vec3(texture(material.texture1, fTexCoor)); //obtenemos la nueva del mapa de normales
  vec3 N = normalize(TBNMatrix * (sampledNormal * 2.0 - 1.0)); //la transformamos usando la matrix del espacio tangente
  // float LdotN = max(dot(L, N), 0.0);
  // float HdotN = max(dot(H, N), 0.0);
  // float dif		= LdotN;
  // float specPhong = 0.0;
  //
  // if (LdotN > 0.0) {
  //    specPhong = pow(HdotN, material.shininess);
  // }
  // vec3 diffuseColorFromTexture = texture(material.texture0,fTexCoor).xyz;
  // vec3 ambiente  =  vec3(0.0) * 0.5 ;
	// vec3 difuso    =   diffuseColorFromTexture * dif;
  // //vec3 difuso = vec3(0.0,0.0,0.8) * dif;
	// vec3 especular =  vec3(0.5)* specPhong;
  // float attenuation = 1.0/(1.0 + dist * allLights[0].linear_attenuation + dist*dist * allLights[0].quadratic_attenuation );
  //
  // vec3 toLightNormal = normalize(allLights[0].position.xyz - fPos);
  // float fromLightToFrag = (dist-shadowClipNearFar.x)/(shadowClipNearFar.y-shadowClipNearFar.x);
  // float shadowMapValue = texture(lightShadowMap,-toLightNormal).r;
  // float lightIntensity = 0.0;
  // if((shadowMapValue + 0.003)>= fromLightToFrag){
  //   lightIntensity += 0.4 * dif;
  // }
  // //fragColor = vec4(1.0);
  // //fragColor = vec4(lightIntensity*(difuso),1.0);
//fragColor = vec4(ambiente + lightIntensity*allLights[0].color *attenuation *(difuso + especular), 1.0);

vec3 outputColor = vec3(0.0);
  outputColor +=calcSombras(allLights[0],N,V);
for(int i = 1; i < numLights; i++){
    outputColor += calcPhong(allLights[i],N,V);
}
fragColor = vec4(outputColor, 1.0);
//fragColor = vec4(1.0,0.1,0.1,1.0);
}
