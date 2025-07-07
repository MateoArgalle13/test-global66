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
