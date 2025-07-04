# Fábrica de Botones Personalizados para Canvas LMS

Este es un script de usuario para Tampermonkey que mejora el Editor de Contenido Enriquecido (RCE) de Canvas LMS, añadiendo una potente herramienta para crear y personalizar botones de llamada a la acción (CTA) de forma rápida e intuitiva.

![Imagen del ícolo de la aplicación](https://github.com/PabloGGuizar/fabrica-de-botones/blob/main/src/Icono-Fabrica-de-Botones.jpg)

![Imagen del menú de la aplicación](https://github.com/PabloGGuizar/fabrica-de-botones/blob/main/src/Menu-Fabrica-de-Botones.jpg)

![Imagen de un botón de ejemplo creado con el script](https://github.com/PabloGGuizar/fabrica-de-botones/blob/main/src/Boton.jpg)

## ¿Qué problema resuelve?

El editor por defecto de Canvas no ofrece una forma sencilla de crear botones estilizados. Los educadores y diseñadores de cursos a menudo necesitan insertar código HTML manualmente o recurrir a soluciones complejas para añadir botones atractivos que mejoren la navegación y la experiencia del usuario. Este script simplifica ese proceso a unos pocos clics.

## Características Principales

* **Integración Perfecta:** Añade un nuevo icono directamente a la barra de herramientas del editor de Canvas para un acceso rápido.
* **Interfaz Visual e Intuitiva:** Todas las opciones se configuran desde una ventana emergente fácil de usar, con una vista previa en tiempo real.
* **Personalización Completa:**
    * **Texto y Enlace:** Define el texto del botón y la URL de destino.
    * **Colores:** Elige el color de fondo, del texto y del borde con selectores de color.
    * **Tamaño y Forma:** Ajusta el tamaño (padding) y el redondeado de los bordes con opciones visuales.
    * **Bordes:** Define el grosor del borde, desde "ninguno" hasta "muy grueso".
    * **Tamaño de Texto:** Controla el tamaño de la fuente del botón (pequeño, normal, grande).
* **Biblioteca de Iconos:**
    * Elige entre una amplia selección de iconos profesionales de la biblioteca Feather Icons.
    * Selecciona la posición del icono (izquierda o derecha del texto).
    * El color del icono se adapta automáticamente al color del texto para un contraste perfecto.
* **Detección Inteligente:** Si seleccionas un enlace existente en el editor antes de abrir la herramienta, esta rellenará automáticamente el texto y la URL, permitiéndote convertir cualquier enlace en un botón al instante.
* **Inserción Robusta:** Utiliza la API oficial del editor de Canvas (TinyMCE) para insertar el código, garantizando la máxima compatibilidad y evitando que Canvas modifique o "rompa" el estilo del botón.

## Instalación

Para usar este script, necesitas la extensión de navegador Tampermonkey.

1.  **Instala Tampermonkey:** Si aún no la tienes, instala la extensión desde la tienda oficial de tu navegador:
    * [Tampermonkey para Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    * [Tampermonkey para Firefox](https://addons.mozilla.org/es/firefox/addon/tampermonkey/)
    * [Tampermonkey para Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2.  **Crea un Nuevo Script:**
    * Haz clic en el icono de Tampermonkey en tu navegador y selecciona "Panel de control".
    * Ve a la pestaña con el icono `+` para crear un nuevo script.

3.  **Copia y Pega el Código:**
    * Borra todo el código de ejemplo que aparece.
    * Copia el contenido completo del archivo `fabrica-de-botones/script.user.js` y pégalo en el editor de Tampermonkey.

4.  **Guarda el Script:**
    * Ve a `Archivo > Guardar` en el editor de Tampermonkey o presiona `Ctrl + S`.

¡Y eso es todo! El script se activará automáticamente la próxima vez que cargues una página de Canvas con el editor de texto.

## ¿Cómo Usarlo?

1.  Ve a cualquier página, anuncio, tarea o foro de Canvas donde puedas usar el editor de texto.
2.  En la barra de herramientas, busca el nuevo icono de un cuadrado con un signo de más (`+`).
3.  Haz clic en el icono para abrir la ventana "Crear Botón Personalizado".
4.  **Personaliza tu botón:**
    * Modifica el texto y la URL.
    * Ajusta los colores, tamaños y bordes.
    * Selecciona un icono y su posición si lo deseas.
    * Observa la vista previa en tiempo real para ver cómo queda.
5.  Haz clic en **"Insertar Botón"**. El botón se añadirá en la posición de tu cursor.

**Consejo:** Para convertir un enlace que ya existe en un botón, simplemente selecciona el texto del enlace con el ratón *antes* de hacer clic en el icono de la herramienta.

## Personalización de Iconos

Puedes añadir fácilmente más iconos de la biblioteca [Feather Icons](https://feathericons.com/).

1.  Busca el icono que deseas en la web de Feather Icons y copia su nombre (p. ej., `award`).
2.  Abre el script en el panel de Tampermonkey.
3.  Busca la constante `ICON_MAP`.
4.  Añade una nueva línea con el formato `'Nombre para mostrar': 'nombre-del-icono'`.

    ```javascript
    const ICON_MAP = {
        // ... (iconos existentes) ...
        'Premio': 'award',
        'Cámara': 'camera'
    };
    ```
5.  Guarda el script. Los nuevos iconos aparecerán en el selector.

## Licencia

Este script se distribuye bajo la licencia [Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Licencia Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>

**Atribución:** Este script fue generado en un entorno colaborativo con la asistencia de Gemini, un LLM de Google.
