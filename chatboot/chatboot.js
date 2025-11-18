(function () {
  const quimexScript = document.currentScript;
  const HISTORY_KEY = 'quimex-chat-history';
  const OPEN_KEY = 'quimex-chat-open';

  const safeStorage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (err) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (err) {
        // Ignored when storage is unavailable
      }
    }
  };

  const parseJSON = (value, fallback) => {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch (err) {
      return fallback;
    }
  };

  const init = () => {
    if (document.querySelector('.quimex-chat')) {
      return;
    }

    const logoSrc = quimexScript?.getAttribute('data-logo') || 'img/Logo.png';
    const welcomePrimary = quimexScript?.getAttribute('data-welcome') ||
      'Hola, soy Quimex del Grupo Termica. Estoy listo para guiarte en temas sanitarios.';
    const welcomeSecondary = quimexScript?.getAttribute('data-secondary') ||
      'Cuentame que servicio necesitas y un asesor humano continuara la conversacion en minutos.';
    const quickAttribute = quimexScript?.getAttribute('data-quick');
    const quickOptions = quickAttribute
      ? quickAttribute.split('|').map(item => item.trim()).filter(Boolean)
      : ['Agendar visita tecnica', 'Certificado sanitario', 'Control de plagas', 'Cursos de manipulacion'];

    const intentReplies = [
      {
        keywords: ['visita', 'agenda', 'agendar', 'cita', 'programa'],
        text: 'Perfecto. Indica ciudad, fecha estimada y un telefono de contacto para programar la visita tecnica.'
      },
      {
        keywords: ['certificado', 'sanitario', 'resolucion', 'tramite', 'registro'],
        text: 'Te guiamos con la Resolucion 2674 y demas requisitos. Comparte actividad economica y estado actual de tus documentos.'
      },
      {
        keywords: ['plaga', 'fumigacion', 'control', 'roedores', 'insectos'],
        text: 'Nuestro equipo maneja planes integrales de control de plagas. Que areas o especies deseas intervenir?'
      },
      {
        keywords: ['curso', 'capacitacion', 'manipulacion', 'entrenamiento'],
        text: 'Disponemos de cursos de manipulacion de alimentos y programas para tu personal. Dime numero de participantes y fechas objetivo.'
      }
    ];

    const fallbackReplies = [
      'Gracias por escribir a Grupo Termica. Un asesor revisara tu mensaje muy pronto.',
      'Tambien puedes escribirnos a Grupotermica2023@gmail.com o llamar al 320 295 5059.',
      'Plagion esta en beta y pronto integraremos IA para darte respuestas mas especificas.'
    ];
    let fallbackIndex = 0;

    const container = document.createElement('div');
    container.className = 'quimex-chat';
    container.innerHTML = `
      <div class="quimex-chat-widget" role="dialog" aria-live="polite" aria-label="Chat con Quimex" aria-hidden="true">
        <header class="quimex-chat__header">
          <div class="quimex-chat__brand">
            <div class="quimex-chat__logo">
              <img src="${logoSrc}" alt="Logo Grupo Termica">
            </div>
            <div>
              <p class="quimex-chat__title">Plagion</p>
              <p class="quimex-chat__subtitle">Asistente Grupo Termica</p>
            </div>
          </div>
          <button class="quimex-chat__close" type="button" aria-label="Minimizar chat">
            <span></span>
            <span></span>
          </button>
        </header>
        <div class="quimex-chat__body">
          <div class="quimex-chat__messages" aria-live="polite"></div>
          <div class="quimex-quick-list" aria-label="Atajos de mensaje"></div>
        </div>
        <form class="quimex-chat__form" autocomplete="off">
          <label class="sr-only" for="quimexChatInput">Escribe tu mensaje</label>
          <textarea id="quimexChatInput" name="quimexChatInput" placeholder="Escribe tu mensaje..." rows="2"></textarea>
          <button type="submit">Enviar</button>
        </form>
      </div>
      <button class="quimex-chat-launcher" type="button" aria-expanded="false">
        <span class="launcher__pulse" aria-hidden="true"></span>
        <div class="launcher__icon" aria-hidden="true">&#128172;</div>
        <div class="launcher__text">
          <strong>Contacta con Plagion</strong>
          <span>Tu asistente virtual</span>
        </div>
      </button>
    `;

    document.body.appendChild(container);

    const widget = container.querySelector('.quimex-chat-widget');
    const launcher = container.querySelector('.quimex-chat-launcher');
    const closeButton = container.querySelector('.quimex-chat__close');
    const form = container.querySelector('.quimex-chat__form');
    const input = container.querySelector('#quimexChatInput');
    const quickList = container.querySelector('.quimex-quick-list');
    const messagesEl = container.querySelector('.quimex-chat__messages');

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'quimex-typing';
    typingIndicator.setAttribute('aria-hidden', 'true');
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';

    let conversation = parseJSON(safeStorage.get(HISTORY_KEY), []);
    if (!conversation.length) {
      conversation = [
        createMessage('bot', welcomePrimary),
        createMessage('bot', welcomeSecondary)
      ];
      saveHistory();
    }

    renderMessages();
    applyQuickOptions();
    showTyping(false);

    const storedOpen = !!parseJSON(safeStorage.get(OPEN_KEY), false);
    setOpen(storedOpen);

    launcher.addEventListener('click', () => toggleChat());
    closeButton.addEventListener('click', () => toggleChat(false));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && container.classList.contains('is-open')) {
        toggleChat(false);
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      sendMessage(input.value);
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage(input.value);
      }
    });

    function toggleChat(forceState) {
      const nextState = typeof forceState === 'boolean'
        ? forceState
        : !container.classList.contains('is-open');
      setOpen(nextState);
    }

    function setOpen(isOpen) {
      container.classList.toggle('is-open', isOpen);
      widget.setAttribute('aria-hidden', (!isOpen).toString());
      launcher.setAttribute('aria-expanded', isOpen.toString());
      safeStorage.set(OPEN_KEY, JSON.stringify(isOpen));
      if (isOpen) {
        setTimeout(() => input.focus(), 150);
      }
    }

    function sendMessage(rawText) {
      const cleanText = rawText.trim();
      if (!cleanText) {
        return;
      }

      addMessage('user', cleanText);
      input.value = '';
      showTyping(true);

      setTimeout(() => {
        const reply = getBotReply(cleanText);
        addMessage('bot', reply);
        showTyping(false);
      }, 900 + Math.random() * 600);
    }

    function getBotReply(text) {
      const normalized = text.toLowerCase();
      const matched = intentReplies.find(entry =>
        entry.keywords.some(keyword => normalized.includes(keyword))
      );

      if (matched) {
        return matched.text;
      }

      const fallback = fallbackReplies[fallbackIndex % fallbackReplies.length];
      fallbackIndex += 1;
      return fallback;
    }

    function createMessage(owner, text) {
      return {
        owner,
        text,
        time: new Date().toISOString()
      };
    }

    function addMessage(owner, text) {
      conversation.push(createMessage(owner, text));
      saveHistory();
      renderMessages();
    }

    function saveHistory() {
      safeStorage.set(HISTORY_KEY, JSON.stringify(conversation));
    }

    function renderMessages() {
      messagesEl.innerHTML = '';
      conversation.forEach(message => {
        const bubble = document.createElement('div');
        bubble.className = `quimex-message quimex-message--${message.owner}`;
        bubble.innerHTML = `
          <div>${formatText(message.text)}</div>
          <time datetime="${message.time}">${formatTime(message.time)}</time>
        `;
        messagesEl.appendChild(bubble);
      });

      messagesEl.appendChild(typingIndicator);
      scrollMessages();
    }

    function showTyping(visible) {
      typingIndicator.classList.toggle('is-visible', visible);
      typingIndicator.setAttribute('aria-hidden', (!visible).toString());
      if (visible && !typingIndicator.isConnected) {
        messagesEl.appendChild(typingIndicator);
      }
      scrollMessages();
    }

    function scrollMessages() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function formatText(text) {
      return escapeHtml(text).replace(/\n/g, '<br>');
    }

    function formatTime(timestamp) {
      const date = new Date(timestamp);
      if (Number.isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function escapeHtml(str) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return str.replace(/[&<>"']/g, character => map[character]);
    }

    function applyQuickOptions() {
      quickList.innerHTML = '';
      quickOptions.forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'quimex-quick';
        button.textContent = option;
        button.addEventListener('click', () => {
          setOpen(true);
          sendMessage(option);
        });
        quickList.appendChild(button);
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

