# Vogelkop · preview de la plataforma

Demo estática (sin backend) del sitio y la plataforma de Vogelkop Arquitectura e Ingeniería.
Todas las interacciones —formularios, login, aprobaciones— se simulan en el navegador.

## Cómo abrirla

```sh
python3 -m http.server 8000
```

Abre <http://localhost:8000/>. Hay que servir la carpeta: algunos navegadores bloquean los scripts si se abre el archivo directamente (`file://`).

## Páginas

| Página | Qué muestra |
| --- | --- |
| `Main.dc.html` | Inicio: héroe con modelo 3D por etapas, proyectos, antes/después, proceso, portal, testimonios y contacto. |
| `Recorridos.dc.html` | Visor 3D de los 4 proyectos: vista exterior por etapas, recorrido a pie, día/atardecer y pantalla completa. Acepta `?p=casa\|edificio\|pabellon\|campestre` y `&modo=walk`. |
| `SoyCliente.dc.html` | Portal del cliente: login con código y panel de obra (resumen, fotos, presupuesto y pagos, observaciones con aprobación, documentos). |

**Código de cliente demo:** `VK-2026-CR14` (Casa Ríos). También funciona `SoyCliente.dc.html?codigo=VK-2026-CR14`.

## Contenido de ejemplo

Dirección, teléfonos, correo, NIT, cifras, testimonio, equipo, montos y fechas son datos de ejemplo para la presentación. Están en el HTML de cada página (el pie de página se repite en las tres).

## Estructura

- `ds/vogelkop/` — design system (tokens, componentes y fuentes Unbounded / Outfit / IBM Plex Mono).
- `assets/` — imágenes de proyectos y motor 3D (`4cae64…js`, sobre Three.js `fb52fd…js`).
- `assets/brand/` — emblema, íconos de la app e imagen para compartir en redes (`og-image.jpg`).
- `assets/renders/` — vistas generadas desde los modelos 3D.
- `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest` — ícono del navegador y del celular.
- `support.js`, `vendor/` — runtime que renderiza las páginas `.dc.html`.
