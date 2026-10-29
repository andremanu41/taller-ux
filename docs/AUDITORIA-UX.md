# Auditoría de Usabilidad y Plan de Rediseño: App de Notas

Este documento contiene la evaluación heurística, la aplicación de leyes de UX y los criterios de accesibilidad aplicados a la aplicación **app-notas** para su transformación y optimización.

---

## 1. Tabla de las 5 Heurísticas de Nielsen

| Heurística Evaluada                        | Problema Detectado (Antes)                                                                                                                    | Solución de Rediseño (Después)                                                                                                                                         |
| :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **#1: Visibilidad del estado del sistema** | Al guardar o borrar una nota, la interfaz cambiaba de golpe sin confirmar si el proceso fue exitoso o fallido.                                | Se implementó un banner de notificación temporal (_toast_) en la esquina superior derecha que muestra mensajes claros como "Nota agregada" o "Nota eliminada".         |
| **#3: Control y libertad del usuario**     | El botón de eliminar borraba la nota de forma inmediata y permanente, provocando pérdidas accidentales de información.                        | Se añadió un sistema de borrado en dos pasos: un botón de "Deshacer" (_Undo_) dentro del mensaje de confirmación que congela la acción por 5 segundos.                 |
| **#5: Prevención de errores**              | El usuario podía enviar notas vacías haciendo clic en el botón, lo que requería validaciones posteriores y mensajes de error reactivos.       | **Prevención activa:** El botón de envío se mantiene deshabilitado (`disabled`) y con opacidad reducida mediante JavaScript hasta que el campo de texto no esté vacío. |
| **#7: Flexibilidad y eficiencia de uso**   | Un usuario avanzado se veía obligado a usar el mouse repetidamente para hacer clic en el botón de agregar cada vez que terminaba de escribir. | Se habilitó el atajo de teclado `Ctrl + Enter` (o `Cmd + Enter` en macOS) para guardar la nota directamente cuando el foco está dentro del campo de texto.             |
| **#8: Estética y diseño minimalista**      | Interfaz saturada con bordes pesados, sombras innecesarias y múltiples colores sin un propósito funcional claro.                              | Se eliminaron los elementos ornamentales innecesarios. Se aplicó una paleta cromática sobria, bordes sutiles y mayor uso del espacio en blanco.                        |

---

## 2. Justificación de Leyes de UX

### 🎯 Ley de Fitts (Tamaño y distancia de los objetivos)

- **Problema:** Los botones de "Editar" y "Eliminar" en las tarjetas eran iconos diminutos (24px) y estaban pegados entre sí, causando altas tasas de clics erróneos en entornos móviles.
- **Solución:** Se amplió la zona interactiva de todos los botones a un tamaño mínimo de **44px x 44px** y se separaron por un margen mínimo de `12px` (`0.75rem`), reduciendo la probabilidad de activar la función incorrecta.

### 🧠 Ley de Hick (Tiempo para tomar decisiones)

- **Problema:** El formulario exponía demasiadas opciones de personalización (colores, etiquetas, recordatorios) simultáneamente, abrumando al usuario al momento de redactar una nota simple.
- **Solución:** Se ocultaron las opciones secundarias. El formulario inicial consta únicamente del campo de texto principal. Las herramientas avanzadas se revelan mediante transiciones limpias solo cuando el usuario interactúa activamente con el campo.

### 🧱 Ley de Miller (Organización de la información)

- **Problema:** La aplicación listaba todas las notas de manera desordenada en una sola columna infinita, aumentando drásticamente la carga cognitiva al intentar localizar un elemento específico.
- **Solución:** Se segmentó el panel principal en bloques lógicos o categorías claramente discernibles ("Notas Recientes", "Esta Semana", "Archivadas"), manteniendo el número de elementos visuales agrupados dentro del rango óptimo de 5 a 7 por sección.

---

## 3. Criterios de UI y Código Técnico

### Variables CSS en `:root` y Consistencia

El esquema visual se centralizó usando variables personalizadas para garantizar un espaciado basado en el principio de rejilla de 8px:

```css
:root {
  /* Paleta con contraste accesible >= 4.5:1 */
  --bg-main: #f8fafc;
  --bg-card: #ffffff;
  --text-dark: #0f172a;
  --text-muted: #475569;
  --primary: #2563eb;
  --primary-focus: #1d4ed8;
  --danger: #dc2626;

  /* Sistema de espaciado consistente */
  --space-xs: 0.25rem; /* 4px */
  --space-sm: 0.5rem; /* 8px */
  --space-md: 1rem; /* 16px */
  --space-lg: 2rem; /* 32px */
}

/* Semántica correcta: Un solo H1 en el documento */
h1 {
  font-size: 2rem;
  color: var(--text-dark);
  margin-bottom: var(--space-lg);
}
```

---

## 4. Accesibilidad e Inclusión (WCAG 2.1)

Para certificar la navegación accesible sin ratón y para lectores de pantalla, se integró:

1.  **Labels explícitos:** Cada elemento de entrada se vinculó correctamente: `<label for="nota-texto">Contenido de la nota</label>`.
2.  **Textos alternativos:** Los iconos vectoriales cuentan con la etiqueta `alt="..."` descriptiva o atributos `aria-label`.
3.  **Foco visible:** Se eliminó el estilo `outline: none` por defecto y se reemplazó por un anillo de enfoque de alta visibilidad:
    ```css
    button:focus-visible,
    input:focus-visible {
      outline: 3px solid var(--primary);
      outline-offset: 2px;
    }
    ```

---

## 5. Reporte e Indicadores Lighthouse (Accesibilidad: 90+)

### Captura del Antes

_(Inserta aquí la captura inicial de tu herramienta Lighthouse mostrando penalizaciones en contraste o la ausencia de etiquetas)_
![Lighthouse Inicial](https://placeholder.com)

### Captura del Después (Meta Alcanzada)

_(Inserta aquí la captura definitiva tras corregir el código donde se valide el puntaje superior a 90)_
![Lighthouse Final](https://placeholder.com)

---

## 6. Control de Versiones

Mensajes descriptivos utilizados para el seguimiento del desarrollo en la terminal:

- `docs: audit-ux registrar tabla de heuristicas y planificacion de leyes de interfaz`
- `feat: ui-redesign implementar prevencion de errores, variables css y navegacion por teclado`
