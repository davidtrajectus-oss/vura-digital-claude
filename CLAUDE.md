# VURA DIGITAL - ESTRUCTURA CORE Y REGLAS DE DESARROLLO

## 1. IDENTIDAD DE MARCA Y DISEÑO
- **Estética:** Tech-Startup, premium, oscura, minimalista y de alta velocidad.
- **Paleta de Colores Oficial:**
  - Fondo: Space Blue / Azul Noche (`#080810`) y variaciones (`#0f0f1a`, `#161625`).
  - Acento Principal: Tech Indigo (`#6c5ce7`) y (`#a29bfe`).
  - Acento Secundario (solo advertencias o sellos): Soft Gold (`#fdcb6e`).
  - Texto: Blanco Azulado (`#e4e4f0`) y Muted (`#7878a0`).
- **UX/UI:** Priorizar SIEMPRE el espacio negativo. Diseños limpios, sin sobrecarga.

## 2. REGLAS TÉCNICAS (STACK)
- **Frontend:** HTML5, CSS3 y Vanilla JavaScript (Cero frameworks pesados como React a menos que sea estrictamente necesario).
- **Rendimiento:** El objetivo innegociable es cargar en 1.2 segundos. Código hiper-optimizado.
- **Librerías Permitidas:** GSAP (ScrollTrigger) para animaciones, Lenis para smooth scroll.
- **Integraciones Críticas:** - Captación de leads: API de SheetDB (`https://sheetdb.io/api/v1/jtupg6j7hh3vy`).
  - Notificaciones: EmailJS.

## 3. TONO Y OBJETIVO DE NEGOCIO (EL "POR QUÉ")
- VURA no hace webs bonitas, hace **máquinas de facturar** para negocios locales.
- **Promesa innegociable:** Entrega en 7 días, Resultados en 30 días, **Garantía de Riesgo Cero de 90 días** (Devolución del 100%).
- Cualquier texto (copy) o diseño que generes debe estar enfocado en la conversión, la agresividad comercial y el dolor de perder clientes frente a la competencia.

## 4. INSTRUCCIONES PARA CLAUDE CODE
- Lee siempre este archivo antes de proponer o inyectar código.
- Si te pido modificar un componente, mantén la jerarquía CSS actual y los Design Tokens (variables de `:root`).
- No rompas NUNCA la función `fetch` que envía datos a SheetDB en los formularios.