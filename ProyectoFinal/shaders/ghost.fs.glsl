#version 300 es
precision mediump float;

in vec2 v_uv;
in vec2 v_uv_anim;
struct Material {
    sampler2D texture0; //diffuse texture
    sampler2D texture1; //normal map
    vec3 color1;
    vec3 color2;
};
uniform Material material;
uniform mediump float intensidad;
out vec4 fragColor;

// vec3 palette(float t, vec3 a,vec3 b, vec3 c,vec3 d){return a+b*cos(6.28318*(c*t+d));}
//
// const float ColorAnchor[3] = float[](0.0,0.5,0.65);
// const vec4 ColorRamp[3] = vec4[](
//     vec4(0.0,0.0,0.0,0.0),
//     vec4(0.933,0.679,0.378,1.0),
//     vec4(1.0,0.992,0.703,1.0)
// );
//
// vec4 getColorRamp(float v,float feather){
//   for(int i=0; i<2; i++){
//     if(v >= ColorAnchor[i] && v < ColorAnchor[i+1])
//       return mix(ColorRamp[i],ColorRamp[i+1],smoothstep(ColorAnchor[i+1]-feather,ColorAnchor[i+1],v));
//   }
//   return ColorRamp[2];
// }
//
// const float DistortStrength = 0.15;
void main(){
  // float grad = mix(2.0,0.0,v_uv.y+0.45);
  // vec4 d = texture(material.texture1,v_uv);
  // vec4 d1 = d * 0.2;
  // vec4 d2 = (d * 2.0 - 1.0) * 0.2;
  //
  //
  // // fragColor = vec4(grad,grad,grad,1.0);
  // // return;
  vec3 n =  texture(material.texture0, v_uv).xyz;
  vec3 n2 = texture(material.texture1, v_uv_anim).xyz;
  // n += grad;
  // fragColor = vec4(n.r,n.r,n.r,n.r);
  float a;
  if(intensidad>=0.0){
    a = sin(radians((1.0/1.2)*intensidad*0.001));
  }
  else
    a=1.0;

  //fragColor *=intensidad * mix( vec4(material.color1,1.0),vec4(material.color2,1.0), v_uv.y );
  if(a>=0.0){
    fragColor = vec4(a*(vec3(0,1,0.2823)*n+n2),a*0.6);
  }

  //fragColor *= vec4( palette(v_uv.y, vec3(0.8,0.5,0.4), vec3(0.2, 0.4, 0.2), vec3(2.0, 1.0, 1.0), vec3(0.00, 0.25, 0.25)), 1.0 );
	//fragColor *= vec4( palette(v_uv.y, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 1.0), vec3(0.00, 0.33, 0.67)), 1.0 );



  //fragColor = getColorRamp(clamp(n.r,0.0,1.0),0.45);
  fragColor.rgb *= fragColor.a ;
  //if(fragColor.a<0.1) discard;
  //fragColor = vec4(1.0);
}
