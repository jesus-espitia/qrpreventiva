
'use strict';

/**
 * Muestra una notificación toast temporal
 * @param {string} message - Texto a mostrar
 * @param {string} type - Tipo: 'success' | 'error' | 'info' | por defecto
 * @param {number} duration - Duración en milisegundos
 */
function showToast(message, type, duration) {
  type = type || '';
  duration = duration || 2500;

  var container = document.getElementById('toastContainer');
  if (!container) return;

  var toast = document.createElement('div');
  toast.className = 'toast' + (type ? ' toast--' + type : '');
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('toast--exit');
    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

/**
 * Copia texto al portapapeles con fallback
 * @param {string} text - Texto a copiar
 * @returns {Promise}
 */
function copyToClipboard(text) {
  if (!text) return Promise.reject('Texto vacío');

  /* API moderna */
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  /* Fallback para navegadores antiguos o contextos no seguros */
  return new Promise(function (resolve, reject) {
    try {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      var success = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (success) {
        resolve();
      } else {
        reject('execCommand falló');
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Limpia un string telefónico dejando solo dígitos
 * @param {string} phone - Número con formato
 * @returns {string} Solo dígitos
 */
function cleanPhoneNumber(phone) {
  return phone.replace(/\D/g, '');
}

/**
 * Inicializa el contenedor de toasts si no existe
 */
function initToastContainer() {
  if (!document.getElementById('toastContainer')) {
    var container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
}

/* Ejecutar al cargar */
document.addEventListener('DOMContentLoaded', initToastContainer);