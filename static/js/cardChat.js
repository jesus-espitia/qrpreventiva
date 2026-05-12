/**
 * ========================================
 * CHATBOT.JS — Widget de chat para QRPreventiva
 * Redirige a WhatsApp para compra del servicio
 * ========================================
 */

(function () {
    'use strict';

    // ============================================================
    // CONFIGURACIÓN — Modificar aquí los datos quemados
    // ============================================================

    /* Número de WhatsApp con código de país (sin + ni espacios) */
    var WHATSAPP_PHONE = '573001234567';

    /* Mensajes predefinidos según la opción seleccionada */
    var WHATSAPP_MESSAGES = {
        buy: 'Hola, estoy interesado/a en adquirir QRPreventiva. Me gustaría recibir más información sobre cómo obtener el servicio.',
        question: 'Hola, tengo una pregunta sobre QRPreventiva. ¿Podrían ayudarme con más información?',
        support: 'Hola, ya soy usuario de QRPreventiva y necesito soporte con mi cuenta. ¿Podrían ayudarme?'
    };

    // ============================================================
    // ESTADO
    // ============================================================
    var isOpen = false;
    var hasInteracted = false;
    var isProcessing = false;

    // ============================================================
    // ELEMENTOS DEL DOM
    // ============================================================
    var widget = document.getElementById('chatbot-widget');
    var toggleBtn = document.getElementById('chatbot-toggle');
    var panel = document.getElementById('chatbot-panel');
    var closeBtn = document.getElementById('chatbot-close');
    var messagesContainer = document.getElementById('chatbot-messages');
    var optionsContainer = document.getElementById('chatbot-options');

    if (!widget || !toggleBtn || !panel) return;

    // ============================================================
    // UTILIDADES
    // ============================================================
    function getTimeString() {
        var now = new Date();
        var h = now.getHours().toString().padStart(2, '0');
        var m = now.getMinutes().toString().padStart(2, '0');
        return h + ':' + m;
    }

    function scrollToBottom() {
        requestAnimationFrame(function () {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
    }

    // ============================================================
    // MOSTRAR MENSAJE DEL BOT
    // ============================================================
    function addBotMessage(html, callback) {
        /* Indicador de escritura */
        var typing = document.createElement('div');
        typing.className = 'chatbot-typing';
        typing.setAttribute('aria-label', 'Escribiendo...');
        typing.innerHTML =
            '<span class="chatbot-typing-dot"></span>' +
            '<span class="chatbot-typing-dot"></span>' +
            '<span class="chatbot-typing-dot"></span>';
        messagesContainer.appendChild(typing);
        scrollToBottom();

        /* Reemplazar con el mensaje tras un delay */
        var delay = 600 + Math.floor(Math.random() * 500);

        setTimeout(function () {
            if (typing.parentNode) {
                typing.parentNode.removeChild(typing);
            }

            var msg = document.createElement('div');
            msg.className = 'chatbot-msg chatbot-msg--bot';
            msg.innerHTML =
                '<div class="chatbot-msg-bubble">' + html + '</div>' +
                '<div class="chatbot-msg-time">' + getTimeString() + '</div>';
            messagesContainer.appendChild(msg);
            scrollToBottom();

            if (callback) {
                setTimeout(callback, 150);
            }
        }, delay);
    }

    // ============================================================
    // MOSTRAR MENSAJE DEL USUARIO
    // ============================================================
    function addUserMessage(text) {
        var msg = document.createElement('div');
        msg.className = 'chatbot-msg chatbot-msg--user';
        msg.innerHTML =
            '<div class="chatbot-msg-bubble">' + text + '</div>' +
            '<div class="chatbot-msg-time">' + getTimeString() + '</div>';
        messagesContainer.appendChild(msg);
        scrollToBottom();
    }

    // ============================================================
    // RENDERIZAR OPCIONES
    // ============================================================
    function showOptions(options) {
        optionsContainer.innerHTML = '';

        options.forEach(function (opt) {
            var btn = document.createElement('button');
            btn.className = 'chatbot-option-btn';
            btn.innerHTML = opt.icon + '<span>' + opt.label + '</span>';

            /* CLAVE: stopPropagation para que el clic no burbujee
               al document y active el cierre por "clic fuera" */
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (!isProcessing) {
                    opt.action();
                }
            });

            optionsContainer.appendChild(btn);
        });
    }

    // ============================================================
    // BOTÓN DE WHATSAPP
    // ============================================================
    function showWhatsAppButton(messageKey) {
        optionsContainer.innerHTML = '';

        /* Separador */
        var divider = document.createElement('div');
        divider.className = 'chatbot-divider';
        divider.textContent = 'o';
        optionsContainer.appendChild(divider);

        /* Botón WhatsApp */
        var waBtn = document.createElement('button');
        waBtn.className = 'chatbot-wa-btn';
        waBtn.innerHTML =
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
            '<span>Chatear por WhatsApp</span>';

        waBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            openWhatsApp(messageKey);
        });

        optionsContainer.appendChild(waBtn);

        /* Botón de reiniciar */
        var restartBtn = document.createElement('button');
        restartBtn.className = 'chatbot-restart-btn';
        restartBtn.textContent = '← Volver al menú principal';

        restartBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            startConversation();
        });

        optionsContainer.appendChild(restartBtn);
    }

    // ============================================================
    // ABRIR WHATSAPP
    // ============================================================
    function openWhatsApp(messageKey) {
        var message = WHATSAPP_MESSAGES[messageKey] || WHATSAPP_MESSAGES.buy;
        var url = 'https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(message);
        window.open(url, '_blank', 'noopener,noreferrer');

        /* Mostrar mensaje de confirmación dentro del chat */
        addBotMessage('✅ Te hemos redirigido a WhatsApp. Si no se abrió automáticamente, verifica que tienes WhatsApp instalado.');
    }

    // ============================================================
    // FLUJO DE CONVERSACIÓN
    // ============================================================
    function startConversation() {
        messagesContainer.innerHTML = '';
        optionsContainer.innerHTML = '';
        isProcessing = false;

        addBotMessage(
            '¡Hola! 👋 Soy el asistente virtual de <strong>QRPreventiva</strong>. ¿En qué puedo ayudarte?',
            function () {
                isProcessing = false;
                showMainOptions();
            }
        );
    }

    function showMainOptions() {
        showOptions([
            {
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>',
                label: 'Quiero adquirir QRPreventiva',
                action: function () { handleOption('buy', 'Quiero adquirir QRPreventiva'); }
            },
            {
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
                label: 'Tengo una pregunta',
                action: function () { handleOption('question', 'Tengo una pregunta'); }
            },
            {
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
                label: 'Ya soy cliente, necesito soporte',
                action: function () { handleOption('support', 'Ya soy cliente, necesito soporte'); }
            }
        ]);
    }

    function handleOption(key, userText) {
        isProcessing = true;

        /* Mostrar selección del usuario como mensaje */
        addUserMessage(userText);

        /* Limpiar opciones mientras el bot responde */
        optionsContainer.innerHTML = '';

        /* Respuestas según la opción */
        var responses = {
            buy: '¡Excelente decisión! 💪 QRPreventiva es una herramienta que puede salvar vidas. Para completar tu solicitud, te conectaremos por WhatsApp con nuestro equipo.',
            question: '¡Con gusto te ayudamos! 😊 Nuestro equipo está disponible por WhatsApp para resolver todas tus dudas sobre QRPreventiva.',
            support: '¡Claro! Estamos aquí para ayudarte. 🛠️ Te conectaremos por WhatsApp con nuestro equipo de soporte técnico.'
        };

        var responseText = responses[key] || responses.buy;

        addBotMessage(responseText, function () {
            isProcessing = false;
            showWhatsAppButton(key);
        });
    }

    // ============================================================
    // TOGGLE DEL PANEL
    // ============================================================
    function openPanel() {
        isOpen = true;
        toggleBtn.classList.add('is-open');
        panel.classList.add('is-open');

        /* Quitar badge si existe */
        var badge = toggleBtn.querySelector('.chatbot-badge');
        if (badge) {
            badge.parentNode.removeChild(badge);
        }

        /* Iniciar conversación si es la primera vez */
        if (!hasInteracted) {
            hasInteracted = true;
            startConversation();
        }

        /* Enfocar el botón de cerrar para accesibilidad */
        setTimeout(function () {
            if (closeBtn) closeBtn.focus();
        }, 350);
    }

    function closePanel() {
        isOpen = false;
        toggleBtn.classList.remove('is-open');
        panel.classList.remove('is-open');
        toggleBtn.focus();
    }

    function togglePanel() {
        if (isOpen) {
            closePanel();
        } else {
            openPanel();
        }
    }

    // ============================================================
    // EVENTOS
    // ============================================================
    toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePanel();
    });

    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closePanel();
    });

    /* Cerrar con Escape */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen) {
            closePanel();
        }
    });

    /* Cerrar al hacer clic FUERA del widget.
       Se usa mousedown en vez de click para que se evalúe
       antes de que cualquier botón interno sea removido del DOM,
       evitando falsos positivos de "clic fuera". */
    document.addEventListener('mousedown', function (e) {
        if (isOpen && !widget.contains(e.target)) {
            closePanel();
        }
    });

    /* Prevenir que clics dentro del panel cierren el widget */
    panel.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // ============================================================
    // NOTIFICACIÓN AUTOMÁTICA
    // ============================================================
    setTimeout(function () {
        if (!hasInteracted && toggleBtn) {
            var badge = document.createElement('span');
            badge.className = 'chatbot-badge';
            badge.textContent = '1';
            badge.setAttribute('aria-label', '1 mensaje nuevo');
            toggleBtn.appendChild(badge);
        }
    }, 5000);

    // ============================================================
    // APARICIÓN INICIAL
    // ============================================================
    setTimeout(function () {
        widget.classList.add('is-ready');
    }, 800);

})();