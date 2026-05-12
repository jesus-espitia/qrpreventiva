(function () {
    'use strict';
    function escapeHtml(str) {
        if (!str) return '';

        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function copyToClipboard(text) {

        if (navigator.clipboard && window.isSecureContext) {

            return navigator.clipboard.writeText(text)
                .then(function () {
                    return true;
                })
                .catch(function () {
                    return false;
                });

        }

        return new Promise(function (resolve) {

            try {

                var textarea = document.createElement('textarea');

                textarea.value = text;

                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';

                document.body.appendChild(textarea);

                textarea.focus();
                textarea.select();

                var success = document.execCommand('copy');

                document.body.removeChild(textarea);

                resolve(success);

            } catch (e) {

                resolve(false);

            }

        });

    }

    function cleanPhone(phone) {

        if (!phone) return '';

        return phone.replace(/\D/g, '');

    }

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

        setTimeout(function () {

            toast.classList.add('toast-out');

            toast.addEventListener('animationend', function () {

                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }

            });

        }, duration);

    }

    function getPatientName() {

        var patientEl = document.querySelector('.patient-name');

        if (!patientEl) {
            return 'Paciente';
        }

        return patientEl.textContent.trim();

    }

    // ============================================================
    // LLAMADAS TELEFÓNICAS
    // ============================================================

    var callButtons = document.querySelectorAll('.btn-call');

    callButtons.forEach(function (btn) {

        btn.addEventListener('click', function () {

            var contact = btn.closest('.ice-contact');

            if (!contact) return;

            // ====================================================
            // TELÉFONO
            // ====================================================

            var phoneEl = contact.querySelector('.ice-phone');

            if (!phoneEl) return;

            var rawPhone = phoneEl.textContent.trim();

            var phone = cleanPhone(rawPhone);

            if (!phone) return;

            // ====================================================
            // NOMBRE CONTACTO
            // ====================================================

            var nameEl = contact.querySelector('.ice-name');

            var contactName = nameEl
                ? nameEl.textContent.trim()
                : 'Contacto ICE';

            var telUri = 'tel:+' + phone;

            // ====================================================
            // MÓVIL
            // ====================================================

            if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {

                window.location.href = telUri;

            } else {

                // ====================================================
                // SWEET ALERT
                // ====================================================

                Swal.fire({
                    title: '¿Realizar llamada?',
                    html:
                        '<b>' + escapeHtml(contactName) + '</b><br>' +
                        '+' + escapeHtml(phone),
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Llamar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#dc2626',
                    reverseButtons: true,
                    focusCancel: true
                }).then(function (result) {

                    if (result.isConfirmed) {

                        window.location.href = telUri;

                    }

                });

            }

        });

    });

    // ============================================================
    // WHATSAPP
    // ============================================================

    var waButtons = document.querySelectorAll('.btn-wa');

    waButtons.forEach(function (btn) {

        btn.addEventListener('click', function () {

            var contact = btn.closest('.ice-contact');

            if (!contact) return;

            // ====================================================
            // NOMBRE CONTACTO
            // ====================================================

            var nameEl = contact.querySelector('.ice-name');

            var contactName = nameEl
                ? nameEl.textContent.trim()
                : 'Contacto ICE';

            // ====================================================
            // TELÉFONO
            // ====================================================

            var phoneEl = contact.querySelector('.ice-phone');

            if (!phoneEl) return;

            var rawPhone = phoneEl.textContent.trim();

            var phone = cleanPhone(rawPhone);

            if (!phone) return;

            // ====================================================
            // NOMBRE PACIENTE
            // ====================================================

            var patientName = getPatientName();

            // ====================================================
            // MENSAJE
            // ====================================================

            var message =
                'Emergencia médica — Tarjeta de ' + patientName + '. Usted '+ contactName +' ha sido registrado como contacto de emergencia (ICE). Por favor comunicarse urgentemente.';

            // ====================================================
            // URL WHATSAPP
            // ====================================================

            var waUri =
                'https://wa.me/' +
                phone +
                '?text=' +
                encodeURIComponent(message);

            window.open(
                waUri,
                '_blank',
                'noopener,noreferrer'
            );

        });

    });

    // ============================================================
    // IMPRIMIR
    // ============================================================

    var printButtons = document.querySelectorAll('[data-action="print"]');

    printButtons.forEach(function (btn) {

        btn.addEventListener('click', function () {

            window.print();

        });

    });

    // ============================================================
    // TIMESTAMP
    // ============================================================

    var timestampEl = document.getElementById('card-timestamp');

    if (timestampEl) {

        var datetimeAttr = timestampEl.getAttribute('data-datetime');

        if (datetimeAttr) {

            try {

                var date = new Date(datetimeAttr);

                var meses = [
                    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
                    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
                ];

                var dia = date.getDate();

                var mes = meses[date.getMonth()];

                var anio = date.getFullYear();

                var horas = date
                    .getHours()
                    .toString()
                    .padStart(2, '0');

                var minutos = date
                    .getMinutes()
                    .toString()
                    .padStart(2, '0');

                timestampEl.textContent =
                    'Generado: ' +
                    dia + ' ' +
                    mes + ' ' +
                    anio + ', ' +
                    horas + ':' +
                    minutos;

            } catch (e) {

                timestampEl.textContent = datetimeAttr;

            }

        }

    }

    // ============================================================
    // ATAJO CTRL + SHIFT + C
    // ============================================================

    document.addEventListener('keydown', function (e) {

        if (
            (e.ctrlKey || e.metaKey) &&
            e.shiftKey &&
            e.key === 'C'
        ) {

            e.preventDefault();

            var allText = [];

            // ====================================================
            // NOMBRE
            // ====================================================

            var nameEl = document.querySelector('.patient-name');

            if (nameEl) {

                allText.push(nameEl.textContent.trim());

            }

            // ====================================================
            // GRUPO SANGUÍNEO
            // ====================================================

            var bloodEl = document.querySelector('.blood-type');

            if (bloodEl) {

                allText.push(
                    'Grupo: ' +
                    bloodEl.textContent.trim()
                );

            }

            // ====================================================
            // INFO GENERAL
            // ====================================================

            var values = document.querySelectorAll('.info-value');

            values.forEach(function (v) {

                allText.push(v.textContent.trim());

            });

            // ====================================================
            // SECCIONES MÉDICAS
            // ====================================================

            var sections = document.querySelectorAll('.med-section');

            sections.forEach(function (sec) {

                var title = sec.querySelector('h2');

                var items = sec.querySelectorAll('.med-list li');

                if (title) {

                    allText.push(
                        '\n' +
                        title.textContent.trim() +
                        ':'
                    );

                }

                items.forEach(function (li) {

                    allText.push(
                        '  - ' +
                        li.textContent.trim()
                    );

                });

            });

            // ====================================================
            // CONTACTOS ICE
            // ====================================================

            allText.push('\nContactos ICE:');

            var iceContacts = document.querySelectorAll('.ice-contact');

            iceContacts.forEach(function (c) {

                var n = c.querySelector('.ice-name');
                var r = c.querySelector('.ice-role');
                var p = c.querySelector('.ice-phone');

                if (n && p) {

                    var line = n.textContent.trim();

                    if (r) {

                        line +=
                            ' (' +
                            r.textContent.trim() +
                            ')';

                    }

                    line +=
                        ' — ' +
                        p.textContent.trim();

                    allText.push(line);

                }

            });

            // ====================================================
            // COPIAR
            // ====================================================

            var fullText = allText.join('\n');

            copyToClipboard(fullText)
                .then(function (ok) {

                    if (ok) {

                        showToast(
                            'Toda la información médica copiada'
                        );

                    }

                });

        }

    });

})();