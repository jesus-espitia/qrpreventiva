/**
 * emergency-card.js
 * Lógica interactiva para la tarjeta médica de emergencia:
 * - Copiar al portapapeles
 * - Llamar por teléfono
 * - Abrir WhatsApp
 * - Imprimir tarjeta
 * - Formatear timestamp
 * - Sistema de toasts
 */

(function () {
    'use strict';

    // ============================================================
    // UTILIDADES
    // ============================================================

    /**
     * Muestra un toast de confirmación en la esquina inferior derecha.
     * @param {string} message - Texto a mostrar
     * @param {number} duration - Duración en ms (default 2500)
     */
    function showToast(message, duration) {
        duration = duration || 2500;

        var container = document.getElementById('toast-container');
        if (!container) return;

        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML =
            '<svg class="toast-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M4 10l4 4 8-8"/>' +
            '</svg>' +
            '<span>' + escapeHtml(message) + '</span>';

        container.appendChild(toast);

        // Remover después de la duración
        setTimeout(function () {
            toast.classList.add('toast-out');
            toast.addEventListener('animationend', function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            });
        }, duration);
    }

    /**
     * Escapa caracteres HTML para prevenir inyección.
     */
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /**
     * Copia texto al portapapeles usando la API moderna o fallback.
     * @param {string} text
     * @returns {Promise<boolean>}
     */
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).then(function () {
                return true;
            }).catch(function () {
                return fallbackCopy(text);
            });
        }
        return Promise.resolve(fallbackCopy(text));
    }

    /**
     * Fallback para copiar al portapapeles con textarea temporal.
     */
    function fallbackCopy(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            var success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        } catch (e) {
            document.body.removeChild(textarea);
            return false;
        }
    }

    // ============================================================
    // COPIAR AL PORTAPAPELES
    // ============================================================

    var copyButtons = document.querySelectorAll('.copy-btn[data-copy-text]');

    copyButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var text = btn.getAttribute('data-copy-text');
            if (!text) return;

            copyToClipboard(text).then(function (ok) {
                if (ok) {
                    // Feedback visual en el botón
                    btn.classList.add('copied');
                    showToast('Copiado al portapapeles');

                    setTimeout(function () {
                        btn.classList.remove('copied');
                    }, 1500);
                } else {
                    showToast('No se pudo copiar');
                }
            });
        });
    });

    // ============================================================
    // LLAMAR POR TELÉFONO
    // ============================================================

    var callButtons = document.querySelectorAll('.btn-ice[data-call]');

    callButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var phone = btn.getAttribute('data-call');
            if (!phone) return;

            // Construir URI tel: (sin ceros innecesarios para Colombia)
            var telUri = 'tel:+' + phone;

            // Verificar si estamos en un dispositivo con capacidad de llamada
            if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
                window.location.href = telUri;
            } else {
                // En escritorio, mostrar confirmación
                if (confirm('Llamar al número: +' + phone + '?')) {
                    window.location.href = telUri;
                }
            }
        });
    });

    // ============================================================
    // WHATSAPP
    // ============================================================

    var waButtons = document.querySelectorAll('.btn-ice[data-whatsapp]');

    waButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var phone = btn.getAttribute('data-whatsapp');
            if (!phone) return;

            // Obtener nombre del contacto asociado
            var contact = btn.closest('.ice-contact');
            var nameEl = contact ? contact.querySelector('.ice-name') : null;
            var contactName = nameEl ? nameEl.textContent.trim() : 'contacto';

            // Mensaje predeterminado de emergencia
            var message = 'Emergencia médica — Tarjeta de María Camila Rodríguez Pérez. Soy contacto ICE: ' +
                contactName + '. Por favor comunicarse urgentemente.';

            var waUri = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);

            window.open(waUri, '_blank', 'noopener,noreferrer');
        });
    });

    // ============================================================
    // IMPRIMIR TARJETA
    // ============================================================

    var printButtons = document.querySelectorAll('[data-action="print"]');

    printButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            window.print();
        });
    });

    // ============================================================
    // FORMATO DE TIMESTAMP
    // ============================================================

    var timestampEl = document.getElementById('card-timestamp');

    if (timestampEl) {
        var datetimeAttr = timestampEl.getAttribute('data-datetime');

        if (datetimeAttr) {
            try {
                var date = new Date(datetimeAttr);

                // Meses en español
                var meses = [
                    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
                    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
                ];

                var dia = date.getDate();
                var mes = meses[date.getMonth()];
                var anio = date.getFullYear();

                var horas = date.getHours().toString().padStart(2, '0');
                var minutos = date.getMinutes().toString().padStart(2, '0');

                timestampEl.textContent = 'Generado: ' + dia + ' ' + mes + ' ' + anio + ', ' + horas + ':' + minutos;
            } catch (e) {
                timestampEl.textContent = datetimeAttr;
            }
        }
    }

    // ============================================================
    // ATAJOS DE TECLADO
    // ============================================================

    document.addEventListener('keydown', function (e) {
        // Ctrl+P para imprimir (comportamiento nativo, sin override)
        // Ctrl+Shift+C copia toda la info médica al portapapeles
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();

            var allText = [];

            // Nombre
            var nameEl = document.querySelector('.patient-name');
            if (nameEl) allText.push(nameEl.textContent.trim());

            // Grupo sanguíneo
            var bloodEl = document.querySelector('.blood-type');
            if (bloodEl) allText.push('Grupo: ' + bloodEl.textContent.trim());

            // Campos de info
            var values = document.querySelectorAll('.info-value');
            values.forEach(function (v) { allText.push(v.textContent.trim()); });

            // Secciones médicas
            var sections = document.querySelectorAll('.med-section');
            sections.forEach(function (sec) {
                var title = sec.querySelector('h2');
                var items = sec.querySelectorAll('.med-list li');
                if (title) allText.push('\n' + title.textContent.trim() + ':');
                items.forEach(function (li) { allText.push('  - ' + li.textContent.trim()); });
            });

            // Contactos ICE
            allText.push('\nContactos ICE:');
            var iceContacts = document.querySelectorAll('.ice-contact');
            iceContacts.forEach(function (c) {
                var n = c.querySelector('.ice-name');
                var r = c.querySelector('.ice-role');
                var p = c.querySelector('.ice-phone');
                if (n && p) {
                    var line = '  ' + n.textContent.trim();
                    if (r) line += ' (' + r.textContent.trim() + ')';
                    line += ' — ' + p.textContent.trim();
                    allText.push(line);
                }
            });

            var fullText = allText.join('\n');

            copyToClipboard(fullText).then(function (ok) {
                if (ok) {
                    showToast('Toda la información médica copiada');
                }
            });
        }
    });

})();