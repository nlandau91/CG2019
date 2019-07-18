#version 300 es

in vec2 vertexPosition;
in vec2 vertexTextureCoordinates;

out vec2 fragmentTextureCoordinates;

void main() {
    fragmentTextureCoordinates = vertexTextureCoordinates;
    gl_Position = vec4(vertexPosition, 0, 1);
}

/*
 💭 El shader no recibe ninguna matriz (modelo, view, etc), que onda?

 Generalmente, antes de asignar un valor a la salida "gl_Position" del shader de vertices siempre multiplicamos
 por las matrices de modelo, vista, etc. En este caso, la idea es dibujar al quad sin modificar su posicion,
 escalado, etc. A este fin, podriamos multiplicarlo por una modelMatrix identidad, o lo que seria lo mismo (y es
 lo que hacemos), simplemente la omitimos.

 💭 Y las de vista y proyeccion?

 Resulta que una matriz de vista identidad equivale a una camara ubicada sobre el eje z+ (en [0, 0, 1]) mirando
 hacia el origen y un vector up [0, 1, 0]. Y una matriz de proyeccion identidad equivale a aplicar una proyeccion
 ortografica con una relacion de aspecto 1:1, plano near en -1 y plano far en 1. Si aplicaramos esas matrices a
 nuestro quad, lo terminariamos viendo desde el eje z+ ocupando todo nuestro campo de vision (i.e. a pantalla
 completa). Esto es exactamente lo que buscamos, y dado que ambas son matrices identidades, da lo mismo aplicarlas
 o no, por lo que las omitimos.
 */
