// script.js — PsyFusions
// Вся интерактивность сайта: квиз, меню, FAQ, форма, скролл.

// ─── Данные квиза ────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  { text: "Как часто вы ощущаете внутреннее напряжение или тревогу?",
    options: ["почти никогда", "иногда", "довольно часто", "почти постоянно"] },
  { text: "Бывает ли, что мысли не дают вам расслабиться или спокойно уснуть?",
    options: ["нет", "иногда", "часто", "почти каждую ночь"] },
  { text: "Насколько легко вам расслабиться и почувствовать спокойствие?",
    options: ["легко", "иногда сложно", "чаще сложно", "почти невозможно"] },
  { text: "Чувствуете ли вы эмоциональную усталость или выгорание?",
    options: ["нет", "иногда", "довольно часто", "постоянно"] },
  { text: "Есть ли у вас ощущение, что вы «застряли» в сложной жизненной ситуации?",
    options: ["нет", "иногда возникает", "часто думаю об этом", "постоянно чувствую это"] },
  { text: "Насколько вы довольны своим эмоциональным состоянием сейчас?",
    options: ["полностью доволен", "скорее доволен", "скорее не доволен", "совсем не доволен"] },
  { text: "Если честно, насколько вам сейчас нужна поддержка?",
    options: ["не чувствую необходимости", "возможно, немного", "скорее нужна", "очень нужна"] },
];

const QUIZ_RESULTS = [
  { title: "Низкий уровень тревожности",
    desc: "Ваше эмоциональное состояние сейчас относительно стабильное. Тем не менее иногда полезно обращать внимание на внутренние сигналы и заботиться о своём психологическом состоянии." },
  { title: "Средний уровень тревожности",
    desc: "Судя по ответам, вы часто испытываете внутреннее напряжение. Это может быть связано со стрессом, накопленной усталостью или жизненными обстоятельствами. Работа с психологом помогает быстрее разобраться с причинами таких состояний." },
  { title: "Высокий уровень тревожности",
    desc: "Ваши ответы показывают высокий уровень эмоционального напряжения. В таких состояниях человеку бывает сложно самостоятельно справиться с тревожными мыслями. Психологическая поддержка может значительно облегчить состояние." },
];

// ─── Квиз (переиспользуемый) ─────────────────────────────────
function createQuiz(container, progressBar) {
  let step = 'intro';
  let currentQ = 0;
  let score = 0;

  function getResult() {
    if (score <= 7)  return QUIZ_RESULTS[0];
    if (score <= 14) return QUIZ_RESULTS[1];
    return QUIZ_RESULTS[2];
  }

  function updateProgress() {
    if (!progressBar) return;
    const pct = step === 'intro' ? 0
               : step === 'questions' ? Math.round((currentQ + 1) / QUIZ_QUESTIONS.length * 100)
               : 100;
    progressBar.style.width = pct + '%';
  }

  function render() {
    updateProgress();
    switch (step) {
      case 'intro':       renderIntro();       break;
      case 'questions':   renderQuestion();    break;
      case 'calculating': renderCalculating(); break;
      case 'result':      renderResult();      break;
      case 'form':        renderForm();        break;
      case 'submitted':   renderSubmitted();   break;
    }
  }

  // ── Intro ──
  function renderIntro() {
    container.innerHTML = `
      <div class="text-center fade-in">
        <div class="w-16 h-16 bg-[#F4F5F0] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#3D4435]">
          <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <h3 class="text-3xl font-serif mb-4 text-[#3D4435]">Проверьте уровень тревожности и эмоционального напряжения</h3>
        <p class="text-stone-500 mb-4 leading-relaxed">Ответьте на несколько вопросов и узнайте, в каком состоянии сейчас находится ваша нервная система.</p>
        <p class="text-stone-400 text-sm mb-8">Диагностика займёт не больше 2 минут.</p>
        <button id="quiz-start-btn" class="w-full bg-[#3D4435] text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#BC6C25] transition-all flex items-center justify-center gap-3">
          Начать тест
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>`;
    container.querySelector('#quiz-start-btn').onclick = () => { step = 'questions'; render(); };
  }

  // ── Question ──
  function renderQuestion() {
    const q = QUIZ_QUESTIONS[currentQ];
    container.innerHTML = `
      <div class="fade-in">
        <span class="text-[10px] font-bold uppercase tracking-widest text-[#BC6C25] mb-4 block">
          Вопрос ${currentQ + 1} из ${QUIZ_QUESTIONS.length}
        </span>
        <h3 class="text-2xl font-serif mb-8 text-[#3D4435]">${q.text}</h3>
        <div class="grid gap-3" id="quiz-options"></div>
      </div>`;

    const optContainer = container.querySelector('#quiz-options');
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'text-left p-5 rounded-2xl border border-stone-100 hover:border-[#BC6C25] hover:bg-[#F4F5F0]/60 transition-all text-stone-600 hover:text-[#3D4435] flex items-center justify-between group';
      btn.innerHTML = `
        <span>${opt}</span>
        <div class="w-6 h-6 rounded-full border border-stone-200 group-hover:border-[#BC6C25] flex items-center justify-center flex-shrink-0">
          <div class="w-2 h-2 rounded-full bg-[#BC6C25] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>`;
      btn.onclick = () => {
        score += idx;
        if (currentQ < QUIZ_QUESTIONS.length - 1) {
          currentQ++;
          render();
        } else {
          step = 'calculating';
          render();
          setTimeout(() => { step = 'result'; render(); }, 2000);
        }
      };
      optContainer.appendChild(btn);
    });
  }

  // ── Calculating ──
  function renderCalculating() {
    container.innerHTML = `
      <div class="text-center py-12 fade-in">
        <div class="flex justify-center mb-6">
          <div class="w-12 h-12 border-4 border-[#F4F5F0] border-t-[#BC6C25] rounded-full animate-spin"></div>
        </div>
        <h3 class="text-xl font-serif text-[#3D4435]">Анализируем ваши ответы...</h3>
      </div>`;
  }

  // ── Result ──
  function renderResult() {
    const r = getResult();
    container.innerHTML = `
      <div class="text-center fade-in">
        <div class="inline-block p-4 bg-[#F4F5F0] rounded-full mb-6">
          <svg width="32" height="32" fill="#BC6C25" stroke="#BC6C25" stroke-width="0.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <h3 class="text-3xl font-serif mb-4 text-[#3D4435]">${r.title}</h3>
        <p class="text-stone-500 mb-10 leading-relaxed">${r.desc}</p>
        <div class="bg-stone-50 p-8 rounded-[32px] mb-8 text-left border border-stone-100">
          <p class="text-[#3D4435] font-serif text-lg mb-4">Если вы хотите разобраться с причинами своего состояния и почувствовать больше спокойствия — вы можете записаться на консультацию.</p>
          <p class="text-stone-500 text-sm italic">Иногда одного разговора достаточно, чтобы увидеть ситуацию по-новому.</p>
        </div>
        <button id="quiz-to-form" class="w-full bg-[#3D4435] text-white py-6 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#BC6C25] transition-all shadow-xl">
          Записаться на консультацию
        </button>
      </div>`;
    container.querySelector('#quiz-to-form').onclick = () => { step = 'form'; render(); };
  }

  // ── Form ──
  function renderForm() {
    container.innerHTML = `
      <div class="fade-in">
        <h3 class="text-2xl font-serif mb-6 text-[#3D4435] text-center">Оставьте контакты для записи</h3>
        <form id="quiz-form" class="grid gap-4">
          <div class="grid gap-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-stone-400">Имя</label>
            <input name="name" type="text" required class="w-full p-5 rounded-2xl border border-stone-100 focus:border-[#BC6C25] outline-none transition-all bg-stone-50" />
          </div>
          <div class="grid gap-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-stone-400">Телефон или Telegram</label>
            <input name="contact" type="text" required class="w-full p-5 rounded-2xl border border-stone-100 focus:border-[#BC6C25] outline-none transition-all bg-stone-50" />
          </div>
          <button type="submit" class="w-full bg-[#BC6C25] text-white py-6 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#a05c1e] transition-all shadow-lg mt-4">
            Записаться на консультацию
          </button>
        </form>
        <p class="text-center text-stone-400 text-xs mt-4">Нажимая кнопку, вы откроете чат WhatsApp</p>
      </div>`;

    container.querySelector('#quiz-form').onsubmit = (e) => {
      e.preventDefault();
      const name    = e.target.name.value.trim();
      const contact = e.target.contact.value.trim();
      const result  = getResult().title;
      const text = `Привет! Меня зовут ${name}. Прошёл(а) диагностику тревожности — результат: «${result}». Хочу записаться на консультацию. Мой контакт: ${contact}`;
      window.open('https://wa.me/32467810422?text=' + encodeURIComponent(text), '_blank');
      step = 'submitted';
      render();
    };
  }

  // ── Submitted ──
  function renderSubmitted() {
    container.innerHTML = `
      <div class="text-center py-12 fade-in">
        <div class="w-20 h-20 bg-[#F4F5F0] rounded-full flex items-center justify-center mx-auto mb-8">
          <svg width="40" height="40" fill="none" stroke="#BC6C25" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h3 class="text-3xl font-serif mb-4 text-[#3D4435]">Заявка принята!</h3>
        <p class="text-stone-500 leading-relaxed mb-8">Спасибо! Оксана свяжется с вами в ближайшее время для уточнения деталей консультации.</p>
        <button id="quiz-reset" class="text-xs font-bold uppercase tracking-widest text-[#BC6C25] hover:underline">Пройти ещё раз</button>
      </div>`;
    container.querySelector('#quiz-reset').onclick = () => {
      step = 'intro'; currentQ = 0; score = 0; render();
    };
  }

  render();
}

// ─── Navbar ──────────────────────────────────────────────────
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('menu-toggle');
  const menu     = document.getElementById('mobile-menu');
  const iconOpen  = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');
  let   menuOpen  = false;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(253,252,249,0.85)';
      navbar.style.backdropFilter = 'blur(12px)';
      navbar.style.boxShadow = '0 1px 12px rgba(0,0,0,0.06)';
      navbar.style.paddingTop = '1rem';
      navbar.style.paddingBottom = '1rem';
    } else {
      navbar.style.background = 'rgba(253,252,249,0.92)';
      navbar.style.backdropFilter = 'blur(12px)';
      navbar.style.boxShadow = '0 1px 8px rgba(0,0,0,0.04)';
      navbar.style.paddingTop = '2rem';
      navbar.style.paddingBottom = '2rem';
    }
  });

  toggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menu.classList.toggle('hidden', !menuOpen);
    iconOpen.classList.toggle('hidden', menuOpen);
    iconClose.classList.toggle('hidden', !menuOpen);
  });

  window.closeMobileMenu = () => {
    menuOpen = false;
    menu.classList.add('hidden');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
  };
}

// ─── Quiz Modal ───────────────────────────────────────────────
function initQuizModal() {
  const modal = document.getElementById('quiz-modal');

  window.openQuizModal = () => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    const container = document.getElementById('quiz-modal-content');
    const progress  = document.getElementById('quiz-modal-progress');
    createQuiz(container, progress);
  };

  window.closeQuizModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.closeQuizModal();
  });
}

// ─── FAQ accordion ───────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon   = item.querySelector('.faq-icon');
    const title  = item.querySelector('h4');
    let   open   = false;

    btn.addEventListener('click', () => {
      open = !open;
      answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0';
      answer.style.opacity   = open ? '1' : '0';
      icon.style.transform   = open ? 'rotate(45deg)' : 'rotate(0deg)';
      title.style.color      = open ? '#BC6C25' : '#3D4435';
    });
  });
}

// ─── Contact form ─────────────────────────────────────────────
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  const wrap    = document.getElementById('contact-form-wrap');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = form.querySelector('[name="name"]').value.trim();
    const contact = form.querySelector('[name="contact"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    const text = `Привет! Меня зовут ${name}.${message ? ' Мой запрос: ' + message + '.' : ''} Мой контакт: ${contact}`;
    window.open('https://wa.me/32467810422?text=' + encodeURIComponent(text), '_blank');

    wrap.style.display    = 'none';
    success.style.display = 'block';
  });

  window.resetContactForm = () => {
    wrap.style.display    = 'block';
    success.style.display = 'none';
    form.reset();
  };
}

// ─── Scroll-to-top button ─────────────────────────────────────
function initScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    btn.style.opacity       = show ? '1' : '0';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  });
}

// ─── Scroll Reveal ────────────────────────────────────────────
function revealVisible() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight + 100 && r.bottom > 0) {
      el.classList.add('visible');
    }
  });
}

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px' });
  els.forEach(el => observer.observe(el));

  // Fallback: запускаем после загрузки всех ресурсов (включая Tailwind CDN)
  window.addEventListener('load', () => {
    revealVisible();
    // Также вешаем scroll-слушатель на случай если observer не сработал
    window.addEventListener('scroll', revealVisible, { passive: true });
  });
  setTimeout(revealVisible, 500);
}

// ─── Параллакс фоновых блобов ─────────────────────────────────
function initParallax() {
  const blobs = document.querySelectorAll('.parallax-blob');
  if (!blobs.length) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    blobs.forEach((blob, i) => {
      const speed = i % 2 === 0 ? 0.15 : 0.08;
      blob.style.transform = `translateY(${y * speed}px)`;
    });
  }, { passive: true });
}

// ─── Счётчики цифр ────────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.count-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.target, 10);
      const dur = 1800;
      const step = 16;
      const inc  = end / (dur / step);
      let   cur  = 0;
      const timer = setInterval(() => {
        cur += inc;
        if (cur >= end) { cur = end; clearInterval(timer); }
        el.textContent = Math.floor(cur) + (el.dataset.suffix || '');
      }, step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initQuizModal();
  initFAQ();
  initContactForm();
  initScrollToTop();
  initScrollReveal();
  initParallax();
  initCounters();

  // Inline quiz (в секции #diagnosis)
  const quizContainer = document.getElementById('quiz-content');
  const quizProgress  = document.getElementById('quiz-progress');
  if (quizContainer) {
    createQuiz(quizContainer, quizProgress);
  }
});
