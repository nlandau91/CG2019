#version 300 es

precision highp float;

uniform sampler2D colorSource;
uniform vec2 resolution;
uniform float edgeThreshold;

in vec2 fragmentTextureCoordinates;

out vec4 fragmentColor;

void main () {

    /* 📝
     Para la deteccion de bordes usamos el llamado Sobel Operator, y pueden encontrar una explicacion excelente
     de su funcionamiento en el mas que recomendado canal de YouTube "Computerphile":
     https://www.youtube.com/watch?v=uihBwtPIBxM
     */

    ivec2 texel = ivec2(fragmentTextureCoordinates.x * resolution.x, fragmentTextureCoordinates.y * resolution.y);

    float texel00 = float(texelFetchOffset(colorSource, texel, 0, ivec2(-1,  1))); // texel[columna][fila]
    float texel01 = float(texelFetchOffset(colorSource, texel, 0, ivec2(-1,  0)));
    float texel02 = float(texelFetchOffset(colorSource, texel, 0, ivec2(-1, -1)));

    float texel10 = float(texelFetchOffset(colorSource, texel, 0, ivec2(0,  1)));
    float texel12 = float(texelFetchOffset(colorSource, texel, 0, ivec2(0, -1)));

    float texel20 = float(texelFetchOffset(colorSource, texel, 0, ivec2(1,  1)));
    float texel21 = float(texelFetchOffset(colorSource, texel, 0, ivec2(1,  0)));
    float texel22 = float(texelFetchOffset(colorSource, texel, 0, ivec2(1, -1)));

    float gradientX = texel20 + 2.0 * texel21 + texel22 - (texel00 + 2.0 * texel01 + texel02);
    float gradientY = texel02 + 2.0 * texel12 + texel22 - (texel00 + 2.0 * texel10 + texel20);

    float gradient = sqrt(gradientX * gradientX + gradientY * gradientY);

    fragmentColor = gradient > edgeThreshold ? vec4(0, 0, 0, 1) : vec4(1, 1, 1, 1);
}
