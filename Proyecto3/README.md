# Proyecto 3 - _Una Escena con más detalle. Texturas_

En este proyecto deberán generar dos escenas diferentes. Éstas deben estar constituidas por:

- __Escena A__. Debe organizarse sobre un plano. Sobre este plano deben ubicarse 24 esferas (en un arreglo de 6x4). Las texturas deben generarse con al menos tres métodos diferentes: mapeo 2D directo, procedural (mármol o madera) y multi- texturas. Como método de iluminación pueden utilizar el que les resulte más sencillo. En esta escena deben integrarse luces puntuales, direccionales y spots. Debe haber por lo menos una de cada una.

- __Escena B__. En esta escena se deben integrar, como mínimo, tres objetos con tres tipos de textura diferentes (dos, a lo sumo, pueden ser las utilizadas en la escena A). Una de las texturas debe ser procedural. La escena debe estar coherentemente integrada. Deben integrar las luces que consideren convenientes.

Pueden utilizar, como base, las escenas generadas en el Proyecto 2. Les recomendamos que, dado que este Proyecto es más sencillo que el anterior en términos de codificación, dediquen tiempo a encontrar/crear texturas interesantes para sus escenas.

En lo que respecta a la interacción con la escena deberán permitir que:

- En ambas escenas se deben poder variar los parámetros de las luces para apreciar las texturas en toda su potencialidad.
- En ambas escenas también deben poder variarse los parámetros de la textura que consideren adecuados.

## 1. Objetivo

En este trabajo se seguirán familiarizando con el proceso de incorporar objetos de apariencia cada vez más realista y con el renderizado de escenas con la incorporación de texturas.

Considerarán distintos modelos de fuentes de luz para que las características de las texturas puedan observarse adecuadamente. Este es un paso más hacia la creación de la escena del proyecto integrador.

## 2.  Los modelos y sus texturas

El mapeo UV es el proceso de asignar una coordenada UV a cada vértice de la malla o red poligonal. Como se mencionó en clase, éste es la etapa de parametrización de la textura. Sin embargo, las coordenadas UV no aparecen mágicamente en las redes poligonales; muchas veces, ustedes tendrán que crear sus propias coordenadas UV.

Si genera un modelo o si obtiene un modelo OBJ que no tenga coordenadas UV de textura, éstas [pueden generarse usando Blender](https://en.wikibooks.org/wiki/Blender_3D:_Noob_to_Pro/UV_Map_Basics). Si el modelo tiene coordenadas UV y quieren crear una textura para éste, una alternativa es pintar una textura sobre la red que representa al objeto después de crear un mapa UV para ella. En [este tutorial](https://www.youtube.com/watch?v=LcCQKuWPhXk) se puede ver una alternativa sobre cómo hacerlo en Blender. De todos modos, hay diferentes tutoriales en línea que explican cómo hacerlo. Alternativamente, puede guardar el mapa UV como una imagen en Blender y después pueden insertar ese mapa UV como una capa en Photoshop, GIMP, Gimp online o cualquier herramienta de edición de imágenes que quieran usar y crear así su propia textura.

Hay algunas texturas disponibles en [OpenFootage](https://www.openfootage.net/over-500-highres-textures-download-for-free/), [Textures](https://www.textures.com/), [TextureKing](https://www.textureking.com/), [LugherTexture](http://www.lughertexture.com/), [3DTexture](http://www.3dtexture.net/) y una lista de sitios en [FreeTextureSite](http://freetexturesite.blogspot.com/).

En cuanto a las luces, pueden usar los modelos de luces vistos en clase y que ya han implementado.


## 3. Extras

Se detallan algunas sugerencias para superar lo mínimo necesario para completar este Proyecto. ¡Sólo intenten hacer esto una vez que hayan cumplido con los requerimientos mínimos para el proyecto!

Se sugiere aplicar, sobre un objeto:

- _Texturas de ambiente_. [Guía de cómo generar un mapa en Blender](https://aerotwist.com/tutorials/create-your-own-environment-maps/).
- _Texturas de desplazamiento_. Los mapas pueden generarse, por ejemplo, con [NormalMap Online](https://cpetry.github.io/NormalMap-Online/).
- _Texturas con mapas de normales_. Los mapas pueden generarse, por ejemplo, con [NormalMap Online](https://cpetry.github.io/NormalMap-Online/), [ShaderMap](https://shadermap.com/home/), etc.
- _Texturas 3D_.
- Algún otro tipo de textura que no se haya mencionado previamente.

Un [este link](https://www.slant.co/topics/4757/~programs-for-making-height-maps-normal-maps-and-or-other-maps) encontraran una recopilación de herramientas para generar distintos tipos de mapas de texturas.

__En todos los casos se pueden usar texturas bajadas directamente de Internet.__

## 4. Calificación

El Proyecto será calificado de acuerdo a las rúbricas proporcionadas en la sub-sección 4.2. Se presentan rúbricas para la evaluación de:
                
- Aspectos cognitivos
- Presentación
- Exposición oral

La Presentación será evaluada también por los propios compañeros. En este caso, la cátedra evaluará (y calificará) a los alumnos por cómo evalúan a sus compañeros.

Para aprobar el proyecto ninguno de los ítems evaluados debe ser insuficiente. La nota se integrará considerando todos los requerimientos exigidos.


### 4.1 Texturas a aplicar

Los modelos proporcionados o creados por la cátedra para la explicación de los temas no contarán para este requisito.

En lo que respecta a la escena B, cualquier textura que encuentren en la Web o que ustedes mismos creen o generen debe ser aplicada sobre modelos calificados. Éstos se refieren a modelos más complejos que una simple primitiva geométrica (por ejemplo, esfera, cubo, plano, cónica, etc.) o una combinación trivial de múltiples primitivas geométricas (por ejemplo, dos esferas apiladas una encima de la otra).

Si estos requisitos no están del todo claros, pregunten a los auxiliares de la cátedra para que le proporcione orientación.

### 4.2 Rúbricas

Disponibles en la [version PDF del enunciado](docs/Proyecto-3.pdf).



