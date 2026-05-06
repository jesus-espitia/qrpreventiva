/**
 * ============================================
 * TARJETA MÉDICA DE EMERGENCIA
 * Lógica principal de la aplicación
 * ============================================
 */

(function () {
    'use strict';

    /* ------------------------------------------
       REFERENCIAS AL DOM
       ------------------------------------------ */
    const DOM = {
        liveClock: document.getElementById('liveClock'),
        currentDate: document.getElementById('currentDate'),
        toastContainer: document.getElementById('toastContainer'),
        btnCall: document.getElementById('btnCall'),
        btnCallSecondary: document.getElementById('btnCallSecondary'),
        btnWhatsapp: document.getElementById('btnWhatsapp'),
        btnWhatsappSecondary: document.getElementById('btnWhatsappSecondary'),
        btnCopyPhone: document.getElementById('btnCopyPhone'),
        btnCopyPhoneSecondary: document.getElementById('btnCopyPhoneSecondary'),
        btnCopyAll: document.getElementById('btnCopyAll'),
        icePhone: document.getElementById('icePhone'),
        icePhoneSecondary: document.getElementById('icePhoneSecondary'),
        identityData: document.getElementById('identityData'),
        medicalData: document.getElementById('medicalData'),
        medicalNote: document.getElementById('medicalNote'),
        bloodTypeBlock: document.getElementById('bloodTypeBlock'),
        iceContact: document.getElementById('iceContact'),
        iceContactSecondary: document.getElementById('iceContactSecondary'),
    };

    /* ------------------------------------------
       DATOS DE COPIA (texto plano)
       ------------------------------------------ */
    const INFO = {
        identity: [
            'Tipo: Cédula de Ciudadanía',
            'No. Documento: 1.024.587.963',
            'Licencia: B2 — LC-987632',
            'SOAT: Vigente (vence 15/Mar/2026)',
            'EPS: Nueva EPS — Contributivo',
            'Nacimiento: 14/Jul/1985 (39 años)',
        ].join('\n'),

        medical: [
            'Grupo Sanguíneo: O+ (RH Positivo)',
            'ALERGIAS: Penicilina (anafilaxis), Latex (dermatitis), Ibuprofeno (urticaria)',
            'CONDICIONES: Diabetes Tipo 2, Hipertensión arterial, Asma leve',
            'MEDICAMENTOS: Metformina 850mg c/12h, Losartán 50mg c/24h, Salbutamol inhalador SOS, AAS 100mg c/24h',
            'RESTRICCIONES: No penicilina, no latex, no AINEs, control glucémico c/4h si inconsciente',
            'OBS: Anticoagulante (AAS). Evaluar sangrado. Dispositivo médico en brazo izq.',
        ].join('\n'),

        phonePrimary: '+573114567890',
        phoneSecondary: '+573102345678',

        getAll: function () {
            const icePrimary = DOM.iceContact
                ? 'ICE PRINCIPAL: María Lucía Ríos de Mendoza (Esposa) — ' + this.phonePrimary
                : '';
            const iceSecondary = DOM.iceContactSecondary
                ? 'ICE SECUNDARIO: Jorge Enrique Mendoza Pérez (Padre) — ' + this.phoneSecondary
                : '';

            return [
                '=== TARJETA MÉDICA DE EMERGENCIA ===',
                'Paciente: Carlos Andrés Mendoza Ríos',
                'C.C.: 1.024.587.963',
                '',
                '--- DOCUMENTACIÓN ---',
                this.identity,
                '',
                '--- INFORMACIÓN MÉDICA VITAL ---',
                this.medical,
                '',
                '--- CONTACTOS DE EMERGENCIA ---',
                icePrimary,
                iceSecondary,
                '',
                'Generado: ' + new Date().toLocaleString('es-CO'),
            ].join('\n');
        },
    };

    /* ------------------------------------------
       RELOJ EN TIEMPO REAL
       ------------------------------------------ */
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        if (DOM.liveClock) {
            DOM.liveClock.textContent = hours + ':' + minutes + ':' + seconds;
        }
    }

    /* ------------------------------------------
       FECHA ACTUAL
       ------------------------------------------ */
    function updateDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        const formatted = now.toLocaleDateString('es-CO', options);

        if (DOM.currentDate) {
            DOM.currentDate.textContent = 'Consultado: ' + formatted;
        }
    }

    /* ------------------------------------------
       SISTEMA DE TOASTS
       ------------------------------------------ */
    function showToast(message, type) {
        type = type || 'info';
        var toast = document.createElement('div');
        toast.className = 'toast toast--' + type;
        toast.textContent = message;
        toast.setAttribute('role', 'status');

        DOM.toastContainer.appendChild(toast);

        // Auto-eliminar después de 2.5 segundos
        setTimeout(function () {
            toast.classList.add('toast-out');
            toast.addEventListener('animationend', function () {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            });
        }, 2500);
    }

    /* ------------------------------------------
       COPIAR AL PORTAPAPELES
       ------------------------------------------ */
    function copyToClipboard(text, successMsg) {
        // Intentar con la API moderna primero
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                showToast(successMsg || 'Copiado al portapapeles', 'success');
            }).catch(function () {
                fallbackCopy(text, successMsg);
            });
        } else {
            fallbackCopy(text, successMsg);
        }
    }

    // Fallback para navegadores sin Clipboard API
    function fallbackCopy(text, successMsg) {
        try {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.top = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);
            var ok = document.execCommand('copy');
            document.body.removeChild(textarea);

            if (ok) {
                showToast(successMsg || 'Copiado al portapapeles', 'success');
            } else {
                showToast('No se pudo copiar', 'info');
            }
        } catch (e) {
            showToast('Error al copiar', 'info');
        }
    }

    /* ------------------------------------------
       ANIMACIÓN DE BOTÓN COPIADO
       ------------------------------------------ */
    function animateCopyButton(btn) {
        if (!btn) return;
        btn.classList.add('copied');
        setTimeout(function () {
            btn.classList.remove('copied');
        }, 1500);
    }

    /* ------------------------------------------
       LLAMADA TELEFÓNICA
       ------------------------------------------ */
    function makeCall(phoneNumber) {
        // Limpiar el número para el protocolo tel:
        var clean = phoneNumber.replace(/[\s\-\.]/g, '');
        window.location.href = 'tel:' + clean;
        showToast('Iniciando llamada...', 'info');
    }

    /* ------------------------------------------
       ENVIAR WHATSAPP
       ------------------------------------------ */
    function sendWhatsApp(phoneNumber) {
        // Limpiar número y quitar el +
        var clean = phoneNumber.replace(/[^0-9]/g, '');

        // Mensaje predefinido de emergencia
        var message = encodeURIComponent(
            'EMERGENCIA MÉDICA — Soy personal de emergencia. ' +
            'Estoy contactando como contacto ICE de Carlos Andrés Mendoza Ríos ' +
            '(C.C. 1.024.587.963). Se necesita información o autorización urgente.'
        );

        window.open('https://wa.me/' + clean + '?text=' + message, '_blank');
        showToast('Abriendo WhatsApp...', 'info');
    }

    /* ------------------------------------------
       EXTRACTOR DE TEXTO DE ELEMENTOS DEL DOM
       Para botones de copiar sección
       ------------------------------------------ */
    function extractTextFromGrid(container) {
        if (!container) return '';
        var items = container.querySelectorAll('.data-item');
        var lines = [];
        items.forEach(function (item) {
            var label = item.querySelector('.data-item__label');
            var value = item.querySelector('.data-item__value');
            if (label && value) {
                lines.push(label.textContent.trim() + ': ' + value.textContent.trim());
            }
        });
        return lines.join('\n');
    }

    function extractMedicalText() {
        var lines = [];

        // Grupo sanguíneo
        if (DOM.bloodTypeBlock) {
            var label = DOM.bloodTypeBlock.querySelector('.blood-type-display__label');
            var value = DOM.bloodTypeBlock.querySelector('.blood-type-display__value');
            var rh = DOM.bloodTypeBlock.querySelector('.blood-type-display__rh');
            if (label && value) {
                var bloodLine = label.textContent.trim() + ': ' + value.textContent.trim();
                if (rh) bloodLine += ' — ' + rh.textContent.trim();
                lines.push(bloodLine);
            }
        }

        // Tarjetas médicas
        if (DOM.medicalData) {
            var cards = DOM.medicalData.querySelectorAll('.medical-card');
            cards.forEach(function (card) {
                var title = card.querySelector('.medical-card__title');
                if (title) lines.push('--- ' + title.textContent.trim() + ' ---');
                var items = card.querySelectorAll('.medical-card__list li');
                items.forEach(function (li) {
                    lines.push('• ' + li.textContent.trim());
                });
                lines.push('');
            });
        }

        // Nota médica
        if (DOM.medicalNote) {
            var noteContent = DOM.medicalNote.querySelector('.medical-note__content');
            if (noteContent) {
                lines.push('OBSERVACIÓN: ' + noteContent.textContent.trim());
            }
        }

        return lines.join('\n');
    }

    /* ------------------------------------------
       EVENT LISTENERS
       ------------------------------------------ */
    function bindEvents() {
        // Botones de copiar sección (iconos en headers)
        document.querySelectorAll('.btn-copy[data-copy]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var target = btn.getAttribute('data-copy');
                var text = '';
                var msg = '';

                if (target === 'identity') {
                    text = INFO.identity;
                    msg = 'Documentación copiada';
                } else if (target === 'medical') {
                    text = extractMedicalText();
                    msg = 'Información médica copiada';
                }

                if (text) {
                    copyToClipboard(text, msg);
                    animateCopyButton(btn);
                }
            });
        });

        // Llamar contacto principal
        if (DOM.btnCall) {
            DOM.btnCall.addEventListener('click', function () {
                makeCall(INFO.phonePrimary);
            });
        }

        // Llamar contacto secundario
        if (DOM.btnCallSecondary) {
            DOM.btnCallSecondary.addEventListener('click', function () {
                makeCall(INFO.phoneSecondary);
            });
        }

        // WhatsApp principal
        if (DOM.btnWhatsapp) {
            DOM.btnWhatsapp.addEventListener('click', function () {
                sendWhatsApp(INFO.phonePrimary);
            });
        }

        // WhatsApp secundario
        if (DOM.btnWhatsappSecondary) {
            DOM.btnWhatsappSecondary.addEventListener('click', function () {
                sendWhatsApp(INFO.phoneSecondary);
            });
        }

        // Copiar teléfono principal
        if (DOM.btnCopyPhone) {
            DOM.btnCopyPhone.addEventListener('click', function () {
                copyToClipboard(INFO.phonePrimary, 'Número copiado: ' + INFO.phonePrimary);
            });
        }

        // Copiar teléfono secundario
        if (DOM.btnCopyPhoneSecondary) {
            DOM.btnCopyPhoneSecondary.addEventListener('click', function () {
                copyToClipboard(INFO.phoneSecondary, 'Número copiado: ' + INFO.phoneSecondary);
            });
        }

        // Copiar toda la información
        if (DOM.btnCopyAll) {
            DOM.btnCopyAll.addEventListener('click', function () {
                copyToClipboard(INFO.getAll(), 'Toda la información médica copiada');
            });
        }
    }

    /* ------------------------------------------
       INICIALIZACIÓN
       ------------------------------------------ */
    function init() {
        // Arrancar reloj
        updateClock();
        updateDate();
        setInterval(updateClock, 1000);

        // Vincular eventos
        bindEvents();
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();