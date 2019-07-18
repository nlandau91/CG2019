#version 300 es

precision highp float;

const int MAX_SAMPLES = 100;

uniform sampler2D colorSource;
uniform vec2 center;
uniform float exposure;
uniform float decay;
uniform float sampleWeight;
uniform int samples;

in vec2 fragmentTextureCoordinates;

out vec4 fragmentColor;

void main () {
    vec2 samplesDelta = (center - fragmentTextureCoordinates) / float(samples);
    vec2 sampleTextureCoordinates = fragmentTextureCoordinates;
    vec4 color = vec4(0, 0, 0, 1);

    for (int index = 0; index < MAX_SAMPLES; index++) {
        if (index == samples) break;

        vec4 sampleColor = texture(colorSource, sampleTextureCoordinates);
        float sampleDecay = pow(decay, float(index));
        color += sampleDecay * sampleWeight * sampleColor;
        sampleTextureCoordinates += samplesDelta;
    }

    fragmentColor = color * exposure;
}
