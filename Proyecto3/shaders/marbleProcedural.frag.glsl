#version 300 es
#define MAX_LIGHTS 10
#define Integral(x, p, np) ((floor(x)*(p)) + max(fract (x) - (np), 0.0))
precision highp float;

uniform struct Light {
    vec3 color; // Light intensity
    vec4 position; // Light position in eye coordinates. If w==0.0, it is a directional light and [w,y,z] is the incident direction
    vec4 spot_direction; //spot direction in eye coordinates
    float spot_cutoff; //cosine of the angle, point lights have a spot_cutoff set to -1.0
    float linear_attenuation;
    float quadratic_attenuation;
} allLights[MAX_LIGHTS];

out vec4 fragColor;

 // definition of tiles, in meter:
   const vec3 tileSize = vec3(0.55, 0.5, 0.55);
   const vec3 tilePct = vec3(0.98,1.0, 0.98);

     // Expects -1<x<1
  vec3 marble_color (float x)
  {
    vec3 col;
    x = 0.5*(x+1.);          // transform -1<x<1 to 0<x<1
    x = sqrt(x);             // make x fall of rapidly...
    x = sqrt(x);
    x = sqrt(x);
    col = vec3(.2 + .75*x);  // scale x from 0<x<1 to 0.2<x<0.95
    col.b*=0.95;             // slightly reduce blue component (make color "warmer"):
    return col;
  }


vec4 permute(vec4 x)
{
  return mod(((x*34.0)+1.0)*x, 289.0);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float noise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

float turbulence (vec3 P, int numFreq)
   {
      float val = 0.0;
      float freq = 1.0;
      for (int i=0; i<numFreq; i++) {
         val += abs (noise (P*freq) / freq);
         freq *= 2.07;
      }
      return val;
   }
in vec3 vertexPosMC;
void main ()
   {
      // Definition of tiles, in meter:
     const vec3 tileSize = vec3(1.1,1.0, 1.1);
     const vec3 tilePct = vec3(0.98,1.0, 0.98);

     // Get tile number - this adapts tileSize, transforming 0..tileSize to 0..1.
     // (factor 16 comes from vs and should be removed at both ends!):
     vec3 Tpos = vertexPosMC.xyz / tileSize;

     // move each other row of tiles:
     if (fract (Tpos.x*0.5) > 0.5)
       Tpos.z += 0.5;

     // Make position relative to tile:
     vec3 pos = fract (Tpos);

     // --- Calculate the marble color ---
     const int roughness = 4;     // noisiness of veins (#octaves in turbulence)

     vec3 tileID = ceil(Tpos); // get ID of tile, unique to a tile and common to all its pixels
     float asc    = 3.0*noise (2.3*(tileID));  // use this as m in t=my+x, rather than just using t=x.

     const float PI = 3.1415;
     float amplitude = 6.0;
     float t = 2.0*PI*(vertexPosMC.x + (asc*vertexPosMC.z)) / tileSize.x ;
     t += amplitude*turbulence (vertexPosMC.xyz, roughness);
     // replicate over rows of tiles (wont be identical, because noise is depending on all coordinates of the input vector):
     t = sin(t);
     vec3 marbleColor = marble_color(t);
  
     // get filter size:
     vec3 fw = fwidth (vertexPosMC);
  
     // Determine if marble or joint: isMarble will be 0 if there is marble and 1 if we are in a joint
     // vec3 isMarble = step (pos, tilePct);
     vec3 isMarble = (Integral (pos+fw, tilePct, 1.-tilePct) - Integral (pos, tilePct, 1.-tilePct)) / fw;

     // mix the two colors together, isMarble decides which color to use:
     vec3 color = mix (vec3 (0.2, 0.2, 0.2), marbleColor, isMarble.x*isMarble.z);

     fragColor = vec4 (color, 1.0);
   }