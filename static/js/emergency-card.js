/**
 * emergency-card.js
 * ==================
 * Módulo de la tarjeta médica de emergencia.
 *
 * PRINCIPIO FUNDAMENTAL:
 * CERO datos quemados. Todo se lee dinámicamente
 * desde el DOM usando querySelector, dataset y
 * atributos data-*.
 *
 * Si cambias un número, nombre o texto en el HTML,
 * este script sigue funcionando sin modificaciones.
 */

(function () {
  'use strict';

  /* ------------------------------------------
     INICIALIZACIÓN
     ------------------------------------------ */

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    bindCopyButtons();
    bindCallButtons();
    bindWhatsAppButtons();
    bindPrintButton();
    renderTimestamp();
  }


  /* ------------------------------------------
     COPIAR — Botones con data-copy-target
     ------------------------------------------

     HTML esperado:
     <span id="mi-campo">Texto a copiar</span>
     <button data-copy-target="mi-campo">Copiar</button>

     El botón lee el textContent del elemento
     referenciado por el valor de data-copy-target.
     ------------------------------------------ */

  function bindCopyButtons() {
    const buttons = document.querySelectorAll('[data-copy-target]');

    buttons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const targetId = btn.dataset.copyTarget;
        if (!targetId) return;

        const targetEl = document.getElementById(targetId);
        if (!targetEl) {
          MedCard.toast('Elemento no encontrado', 'error');
          return;
        }

        /* Leer el texto. Para sr-only, usar textContent.
           Para elementos visibles, también textContent. */
        const text = targetEl.textContent.trim();

        if (!text) {
          MedCard.toast('No hay texto para copiar', 'warning');
          return;
        }

        const copied = await MedCard.copyToClipboard(text);

        if (copied) {
          /* Feedback visual en el botón */
          btn.classList.add('copied');
          setTimeout(() => btn.classList.remove('copied'), 2000);

          /* Truncar mensaje si es muy largo */
          const displayText = text.length > 40
            ? text.substring(0, 40) + '...'
            : text;
          MedCard.toast(`Copiado: ${displayText}`, 'success');
        } else {
          MedCard.toast('No se pudo copiar', 'error');
        }
      });
    });
  }


  /* ------------------------------------------
     LLAMAR — Botones con data-action="call"
     ------------------------------------------

     HTML esperado:
     <span id="ice-phone-1"
           data-phone="+573112345678">
       +57 311 234 5678
     </span>
     <button data-action="call"
             data-phone-target="ice-phone-1">
       Llamar
     </button>

     El botón busca el elemento referenciado
     por data-phone-target, lee su atributo
     data-phone, y genera el enlace tel:.
     ------------------------------------------ */

  function bindCallButtons() {
    const buttons = document.querySelectorAll('[data-action="call"]');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const phoneTargetId = btn.dataset.phoneTarget;
        if (!phoneTargetId) return;

        const phoneEl = document.getElementById(phoneTargetId);
        if (!phoneEl) {
          MedCard.toast('Contacto no encontrado', 'error');
          return;
        }

        /* El número real siempre vive en data-phone */
        const rawPhone = phoneEl.dataset.phone;
        if (!rawPhone) {
          MedCard.toast('Número no disponible', 'warning');
          return;
        }

        /* Generar enlace tel: y navegar */
        const telUri = `tel:${rawPhone}`;

        /* En contexto de prueba o si el protocolo no es soportado,
           se muestra el número como fallback */
        try {
          window.location.href = telUri;
        } catch (_) {
          MedCard.toast(`Llamar al: ${rawPhone}`, 'info', 5000);
        }
      });
    });
  }


  /* ------------------------------------------
     WHATSAPP — Botones con data-action="whatsapp"
     ------------------------------------------

     HTML esperado:
     <span id="ice-phone-1"
           data-phone="+573112345678">
       +57 311 234 5678
     </span>
     <button data-action="whatsapp"
             data-phone-target="ice-phone-1">
       WhatsApp
     </button>

     Lee data-phone del elemento referenciado,
     limpia el número y abre wa.me.
     ------------------------------------------ */

  function bindWhatsAppButtons() {
    const buttons = document.querySelectorAll('[data-action="whatsapp"]');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const phoneTargetId = btn.dataset.phoneTarget;
        if (!phoneTargetId) return;

        const phoneEl = document.getElementById(phoneTargetId);
        if (!phoneEl) {
          MedCard.toast('Contacto no encontrado', 'error');
          return;
        }

        const rawPhone = phoneEl.dataset.phone;
        if (!rawPhone) {
          MedCard.toast('Número no disponible', 'warning');
          return;
        }

        /* Limpiar el número: quitar +, espacios, guiones */
        const cleanNumber = MedCard.cleanPhone(rawPhone);

        if (!cleanNumber) {
          MedCard.toast('Número inválido', 'error');
          return;
        }

        /* Mensaje predefinido de emergencia.
           Se genera dinámicamente leyendo el nombre
           del paciente desde el DOM. */
        const patientNameEl = document.querySelector('.patient-name');
        const patientName = patientNameEl
          ? patientNameEl.textContent.trim()
          : 'paciente';

        const emergencyMsg = encodeURIComponent(
          `*EMERGENCIA MEDICA*\n` +
          `Soy personal de emergencia y estoy contactando sobre ${patientName}.`
        );

        const waUrl = `https://wa.me/${cleanNumber}?text=${emergencyMsg}`;

        /* Abrir en nueva pestaña/ventana */
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      });
    });
  }


  /* ------------------------------------------
     IMPRIMIR — Botón con data-action="print"
     ------------------------------------------ */

  function bindPrintButton() {
    const buttons = document.querySelectorAll('[data-action="print"]');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        window.print();
      });
    });
  }


  /* ------------------------------------------
     TIMESTAMP — Renderiza la fecha dinámicamente
     ------------------------------------------

     HTML esperado:
     <span id="card-timestamp"
           data-datetime="2025-01-15T08:30:00-05:00">
     </span>

     Lee data-datetime y muestra la fecha
     formateada dentro del span.
     ------------------------------------------ */

  function renderTimestamp() {
    const el = document.getElementById('card-timestamp');
    if (!el) return;

    const isoDate = el.dataset.datetime;
    if (!isoDate) return;

    const formatted = MedCard.formatDateTime(isoDate);
    if (formatted) {
      el.textContent = `Generada: ${formatted}`;
    }
  }

})();