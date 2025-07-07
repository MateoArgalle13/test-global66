Aplicación de Favoritos de Pokémon
Esta aplicación web permite a los usuarios buscar Pokémon y añadirlos a una lista de favoritos, guardada directamente en su navegador. Toda la información se obtiene de la PokeAPI. El desarrollo siguió las especificaciones de diseño, aplicando buenas prácticas como SOLID, y se enfocó en una sintaxis limpia, accesibilidad y mejoras de usabilidad para las pantallas de listado y favoritos, incluyendo optimización de iconos.

Herramientas Clave y Por Qué las Elegí
Construí esta app pensando en la escalabilidad y rendimiento, previendo el manejo de grandes volúmenes de datos.
Mis elecciones fueron:

    Vue.js (Composition API): Por su eficiencia y modularidad.

    Pinia: Para la persistencia de datos y gestión del estado, ideal para colecciones reactivas de cualquier tamaño.

    Vite: Mi build tool de alta velocidad.

    Vitest: Para pruebas unitarias rápidas y confiables.

    Vue Router: Para la navegación SPA.

    Bootstrap 5 (CDN): Para estilos rápidos y responsivos.

    Local Storage API: Para la persistencia de favoritos en el navegador.

Cómo lo Implementé y Buenas Prácticas Aplicadas
Mis decisiones buscan que la app maneje mucha información sin problemas, aplicando buenas prácticas:

    Estado Centralizado: Muevo los favoritos a un store global, asegurando una fuente única de verdad.

    Manejo Asíncrono de la API: Las llamadas a la API son asíncronas con control de errores para mayor robustez.

    Componentes Modulares: Divido la app en piezas reutilizables para dividir responsabilidades y mejorar la escalabilidad.

    Calidad de Código: ESLint y Prettier aseguran un código limpio y consistente.

    Principios SOLID: Sí, aplicamos principios SOLID, específicamente el Principio de Responsabilidad Única (SRP), al asegurar que cada componente y módulo tiene una tarea bien definida y única.

Cómo Correr y Visualizar el Proyecto
Para poner en marcha este proyecto en tu máquina local, sigue estos sencillos pasos:

    Prerrequisitos
    Asegúrate de tener Node.js (versión 18 o superior recomendada) y npm (o Yarn) instalados en tu sistema.

    Pasos de Instalación y Ejecución
    Clona el repositorio:
    Abre tu terminal o línea de comandos y ejecuta:

    Bash

    git clone https://github.com/MateoArgalle13/test-global66.git
    cd test-global66


    Instala las dependencias:
    Una vez dentro de la carpeta del proyecto, instala todas las dependencias necesarias. Puedes usar npm o yarn:

    Bash

    npm install
    # o
    yarn install
    Ejecuta el proyecto en modo desarrollo:
    Para iniciar el servidor de desarrollo y ver la aplicación en tu navegador, ejecuta:

    npm run dev
    # o
    yarn dev
    Esto usualmente iniciará la aplicación en http://localhost:5173/ (o un puerto similar). La URL exacta aparecerá en tu terminal.

    Ejecuta las pruebas unitarias (opcional):
    Si quieres correr las pruebas, usa:


    npm run test
    # o
    yarn test


    Compila para producción (opcional):
    Si necesitas generar una versión optimizada de la aplicación para despliegue, ejecuta:

    npm run build
    # o
    yarn build

    Esto creará una carpeta dist/ con los archivos listos para producción.

    ¡Y eso es todo! Con estos pasos, podrás tener el proyecto funcionando y explorarlo
