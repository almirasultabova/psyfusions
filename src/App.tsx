/**
 * App.tsx — PsyFusions
 * =====================
 * Главный компонент лендинга. Содержит все секции страницы.
 *
 * СЕКЦИИ (по порядку):
 *   1. Navbar        — фиксированная навигация
 *   2. Hero          — главный экран с CTA и фото
 *   3. Methodology   — методика работы (3 карточки)
 *   4. Diagnosis     — встроенный квиз-тест
 *   5. Requests      — с чем работает психолог (8 карточек)
 *   6. About         — биография и ценности
 *   7. Process       — как проходит работа (3 шага)
 *   8. Testimonials  — отзывы клиентов
 *   9. FAQ           — частые вопросы
 *  10. Diplomas      — образование и сертификаты
 *  11. Contact       — форма + мессенджеры
 *  12. Footer        — логотип и соцсети
 *
 * МОДАЛЬНЫЕ ОКНА:
 *   - Quiz modal     — квиз с диагностикой тревожности
 *   - Diploma lightbox — просмотр диплома
 *
 * ПЛАВАЮЩИЕ ЭЛЕМЕНТЫ:
 *   - Кнопка Telegram (внизу справа)
 *   - Кнопка "Наверх"
 */

import React, { useState, useEffect } from 'react';
import {
  Instagram,
  MessageCircle,
  Send,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Heart,
  Shield,
  Star,
  Clock,
  Calendar,
  Award,
  Users,
  Target,
  Zap,
  Brain,
  Sparkles,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Quiz from './components/Quiz';
import { CONFIG } from './config';

// ─── Переиспользуемые компоненты ─────────────────────────────────────────────

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Методика',   href: '#methodology' },
    { name: 'Диагностика', href: '#diagnosis' },
    { name: 'С чем работаю', href: '#requests' },
    { name: 'Обо мне',    href: '#about' },
    { name: 'Отзывы',     href: '#testimonials' },
    { name: 'FAQ',        href: '#faq' },
    { name: 'Дипломы',    href: '#diplomas' },
    { name: 'Контакты',   href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-brand-paper/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-serif text-xl">P</div>
          <span className="text-xl font-serif tracking-tight text-brand-primary">PsyFusions</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-brand-accent transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-brand-primary text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all"
          >
            Записаться
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-brand-primary" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-brand-paper border-b border-stone-100 p-8 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-serif text-brand-primary"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeading = ({ title, subtitle, centered = false }: { title: string; subtitle: string; centered?: boolean }) => (
  <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-4 block">
      {subtitle}
    </span>
    <h2 className="text-4xl md:text-6xl font-serif text-brand-primary leading-tight">
      {title}
    </h2>
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white p-10 rounded-[40px] border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 ${className}`}>
    {children}
  </div>
);

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function App() {
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [selectedDiploma, setSelectedDiploma] = useState<{ title: string; school: string; year: string; img: string } | null>(null);
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      name:    formData.get('name'),
      contact: formData.get('contact'),
      message: formData.get('message'),
      source:  'Main Contact Form',
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsContactSubmitted(true);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь через мессенджеры.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-paper text-brand-ink font-sans selection:bg-brand-primary selection:text-white scroll-smooth relative">
      <div className="fixed inset-0 grain-texture z-[100]" />
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[80%] bg-brand-secondary/50 blob-shape blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-brand-accent/5 blob-shape blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-brand-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent">
                Оксана Миру • Психолог • Гипнолог
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-light leading-[0.95] text-brand-primary mb-10">
              {CONFIG.name}, <br />
              <span className="italic text-brand-accent">{CONFIG.title}</span>
            </h1>
            <p className="text-xl text-stone-600 mb-12 leading-relaxed max-w-xl">
              {CONFIG.description}
            </p>

            <div className="flex flex-wrap gap-8 mb-12">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-serif text-brand-primary">{CONFIG.stats.hours}</div>
                <div className="text-[10px] text-stone-400 uppercase tracking-widest leading-tight font-bold">Часов <br />практики</div>
              </div>
              <div className="w-[1px] h-10 bg-stone-200" />
              <div className="flex items-center gap-3">
                <div className="text-3xl font-serif text-brand-primary">{CONFIG.stats.confidentiality}</div>
                <div className="text-[10px] text-stone-400 uppercase tracking-widest leading-tight font-bold">Конфиден-<br />циальность</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowDiagnosis(true)}
                className="bg-brand-primary text-white px-10 py-6 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                Пройти диагностику тревожности <Zap size={16} />
              </button>
              <a
                href="#contact"
                className="bg-white border border-stone-200 text-brand-primary px-10 py-6 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-brand-secondary transition-all flex items-center justify-center gap-3 group"
              >
                Бесплатная встреча (15 мин) <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/face${i}/100/100`} className="w-8 h-8 rounded-full border-2 border-brand-paper" alt="Client" referrerPolicy="no-referrer" />
                ))}
              </div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                <span className="text-brand-accent">●</span> Осталось 2 места на этой неделе
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 aspect-[3/4] rounded-[100px] overflow-hidden border-[16px] border-white shadow-2xl">
              <img
                src={CONFIG.images.hero}
                alt={CONFIG.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-accent/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-secondary rounded-full blur-3xl animate-pulse delay-700" />

            <div className="absolute bottom-20 -right-12 bg-white p-6 rounded-3xl shadow-xl z-20 max-w-[200px] border border-stone-100">
              <div className="flex items-center gap-2 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} className="text-brand-accent fill-brand-accent" size={12} />)}
              </div>
              <p className="text-[10px] text-stone-500 italic leading-relaxed">
                "После первой сессии я наконец-то смогла глубоко вздохнуть..."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Methodology ──────────────────────────────────────────── */}
      <section id="methodology" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Интегративный подход к глубинной трансформации"
            subtitle="Моя методика"
          />
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:translate-y-[-8px] transition-transform">
              <div className="w-14 h-14 bg-brand-secondary rounded-2xl flex items-center justify-center text-brand-primary mb-8">
                <Brain size={28} />
              </div>
              <h4 className="text-2xl font-serif mb-4 text-brand-primary">Гипноз и Транс</h4>
              <p className="text-stone-500 leading-relaxed">
                Работа с подсознанием напрямую. Позволяет обойти критический фильтр ума и найти корень проблемы там, где логика бессильна.
              </p>
            </Card>
            <Card className="bg-brand-primary text-white border-none hover:translate-y-[-8px] transition-transform">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-brand-accent mb-8">
                <Sparkles size={28} />
              </div>
              <h4 className="text-2xl font-serif mb-4">Арт-терапия</h4>
              <p className="text-stone-300 leading-relaxed">
                Мягкий способ выразить то, что сложно облечь в слова. Помогает прожить подавленные эмоции через творчество.
              </p>
            </Card>
            <Card className="bg-brand-secondary border-none hover:translate-y-[-8px] transition-transform">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-primary mb-8 shadow-sm">
                <Target size={28} />
              </div>
              <h4 className="text-2xl font-serif mb-4 text-brand-primary">Коучинг</h4>
              <p className="text-stone-500 leading-relaxed">
                Фокус на будущем и конкретных шагах. Когда состояние стабилизировано, мы строим новую стратегию жизни.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Diagnosis ────────────────────────────────────────────── */}
      <section id="diagnosis" className="py-32 bg-brand-paper">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            centered
            title="Экспресс-диагностика вашего состояния"
            subtitle="Тест"
          />
          <Quiz />
        </div>
      </section>

      {/* ── Requests ─────────────────────────────────────────────── */}
      <section id="requests" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            centered
            title="В каких ситуациях ко мне обращаются"
            subtitle="Если вы чувствуете, что вам нужна поддержка — вы можете сделать первый шаг уже сейчас."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Тревожность',   desc: 'Внутреннее напряжение и беспокойство.',       icon: <Shield /> },
              { title: 'Выгорание',     desc: 'Эмоциональное истощение и усталость.',        icon: <Zap /> },
              { title: 'Отношения',     desc: 'Сложности, разводы, расставания.',            icon: <Heart /> },
              { title: 'Самооценка',    desc: 'Поиск уверенности и ценности.',               icon: <Star /> },
              { title: 'Смыслы',        desc: 'Чувство пустоты и поиск пути.',               icon: <Target /> },
              { title: 'Психосоматика', desc: 'Телесные проявления эмоций.',                 icon: <Brain /> },
              { title: 'Кризисы',       desc: 'Жизненные перемены и тупики.',                icon: <Clock /> },
              { title: 'Поддержка',     desc: 'Когда просто нужен бережный диалог.',         icon: <MessageCircle /> },
            ].map((item, idx) => (
              <div key={idx}>
                <Card className="p-8 h-full hover:border-brand-accent/30 transition-all group">
                  <div className="w-12 h-12 bg-brand-secondary rounded-2xl flex items-center justify-center text-stone-400 group-hover:text-brand-accent transition-colors mb-6">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-serif mb-3 text-brand-primary">{item.title}</h4>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────── */}
      <section id="about" className="py-32 bg-brand-paper">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[60px] overflow-hidden">
                <img src={CONFIG.images.about} alt="Оксана Миру" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl -z-10" />
            </div>
            <div>
              <SectionHeading title="Оксана Миру" subtitle="Обо мне" />
              <div className="space-y-8 text-stone-600 leading-relaxed">
                <p className="text-xl font-serif text-brand-primary">
                  Практикующий психолог и гипнолог в Европе и Азии.
                </p>
                <p>
                  Помогаю справляться с внутренними кризисами, тревожными состояниями и находить путь к себе через глубокую работу с подсознанием.
                </p>
                <p>
                  В своей работе я использую интегративный подход, включая гипнотерапию, арт-терапию и работу с подсознательными установками.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-brand-secondary rounded-lg text-brand-primary"><Sparkles size={20} /></div>
                    <div>
                      <span className="font-bold block text-brand-primary">Бережность</span>
                      <span className="text-sm">Работа в комфортном для вас темпе.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-brand-secondary rounded-lg text-brand-primary"><Lock size={20} /></div>
                    <div>
                      <span className="font-bold block text-brand-primary">Конфиденциальность</span>
                      <span className="text-sm">Полная безопасность ваших историй.</span>
                    </div>
                  </div>
                </div>
                <p className="italic text-stone-500 border-l-2 border-brand-accent/30 pl-6 py-2">
                  «Моя задача — создать безопасное пространство, где человек может понять причины своего состояния и найти внутренние ресурсы для изменений».
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────── */}
      <section id="process" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <SectionHeading title="Как проходит работа" subtitle="Процесс" />
              <div className="space-y-12">
                {[
                  { step: '01', title: 'Знакомство',    desc: 'Бесплатная 15-минутная встреча для обсуждения вашего запроса и понимания, подходим ли мы друг другу.' },
                  { step: '02', title: 'Диагностика',   desc: 'Первая полноценная сессия, где мы глубоко исследуем проблему и ставим цели терапии.' },
                  { step: '03', title: 'Трансформация', desc: 'Основной этап работы с использованием гипноза, КПТ и других методов для достижения результата.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-8 group">
                    <span className="text-4xl font-serif text-stone-200 group-hover:text-brand-accent transition-colors">{item.step}</span>
                    <div>
                      <h4 className="text-xl font-serif mb-2 text-brand-primary">{item.title}</h4>
                      <p className="text-stone-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-brand-secondary rounded-[60px] p-12 aspect-square flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 grain-texture opacity-10" />
                <div className="text-center relative z-10">
                  <p className="text-3xl font-serif text-brand-primary italic leading-relaxed">
                    Глубоко. <br />
                    Бережно. <br />
                    По делу.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section id="testimonials" className="py-32 bg-brand-paper/50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading centered title="Истории изменений" subtitle="Отзывы" />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: 'Оксана помогла мне выйти из глубочайшего выгорания. После 5 сессий я снова почувствовала вкус к жизни и работе.',                  author: 'Мария, предприниматель' },
              { text: 'Метод гипноза оказался очень эффективным. Мы проработали страх публичных выступлений, который мучил меня годами.',                  author: 'Алексей, топ-менеджер' },
              { text: 'Очень бережный и профессиональный подход. Чувствуешь себя в полной безопасности с первой минуты.',                                  author: 'Елена, дизайнер' },
            ].map((item, idx) => (
              <div key={idx}>
                <Card className="bg-white h-full">
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-brand-accent fill-brand-accent" />)}
                  </div>
                  <p className="text-stone-600 italic mb-8 leading-relaxed">"{item.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-secondary rounded-full" />
                    <span className="text-sm font-bold text-brand-primary">{item.author}</span>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading centered title="Ответы на частые вопросы" subtitle="FAQ" />
          <div className="space-y-8">
            {[
              { q: 'Как проходит первая встреча?',
                a: 'Это бесплатная 15-минутная онлайн-встреча. Мы знакомимся, вы кратко описываете свой запрос, а я рассказываю, как именно мой подход может помочь в вашей ситуации. Это ни к чему вас не обязывает.' },
              { q: 'Сколько сессий мне понадобится?',
                a: 'Все индивидуально. Кому-то достаточно 1-2 встреч для решения точечного вопроса, но для глубокой трансформации и устойчивых изменений обычно требуется от 8 до 12 регулярных сессий.' },
              { q: 'Это конфиденциально?',
                a: 'Безусловно. Конфиденциальность — это фундамент психологической помощи. Все, что мы обсуждаем, остается строго между нами. Я следую этическому кодексу психолога.' },
              { q: 'Работаете ли вы онлайн?',
                a: 'Да, я провожу сессии онлайн (Zoom, WhatsApp, Telegram) для клиентов по всему миру. Это так же эффективно, как и очные встречи, и позволяет вам находиться в комфортной и безопасной для вас обстановке.' },
              { q: 'Что такое гипнолог и чем это отличается от магии?',
                a: 'Гипнолог — это специалист, использующий трансовые состояния для работы с подсознанием. Это научный метод, а не магия. Вы всегда остаетесь в сознании и контролируете процесс, просто ваше внимание направлено внутрь.' },
            ].map((item, idx) => (
              <div key={idx} className="border-b border-stone-100 pb-8 group">
                <h4 className="text-xl font-serif mb-4 text-brand-primary group-hover:text-brand-accent transition-colors">{item.q}</h4>
                <p className="text-stone-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Diplomas ─────────────────────────────────────────────── */}
      <section id="diplomas" className="py-32 bg-brand-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading centered title="Профессиональное образование" subtitle="Квалификация" />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { year: '2004', title: 'Педагогическое образование',   school: 'НПУ им. Драгоманова',          img: 'https://picsum.photos/seed/diploma1/800/1100' },
              { year: '2008', title: 'Психологическое образование',  school: 'Специалист по психологии',     img: 'https://picsum.photos/seed/diploma2/800/1100' },
              { year: '2024', title: 'Гипноз и Транс',               school: 'Повышение квалификации',       img: 'https://picsum.photos/seed/diploma3/800/1100' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDiploma(item)}
                className="bg-white p-10 rounded-[40px] border border-stone-100 flex flex-col items-center text-center hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/5 transition-colors" />
                <Award className="text-brand-accent mb-6 group-hover:scale-110 transition-transform" size={40} />
                <span className="text-brand-accent font-bold mb-2">{item.year}</span>
                <h4 className="text-xl font-serif mb-2 text-brand-primary">{item.title}</h4>
                <p className="text-stone-400 text-sm mb-6">{item.school}</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  Смотреть оригинал <ArrowUpRight size={12} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────── */}
      <section id="contact" className="py-32 bg-brand-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-white/5 blob-shape blur-3xl -rotate-12" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-6 block">
                Сделайте первый шаг
              </span>
              <h2 className="text-5xl md:text-7xl font-serif mb-12 leading-tight">
                Готовы начать <br /> <span className="italic text-brand-accent">трансформацию?</span>
              </h2>

              <div className="space-y-8">
                <a href={CONFIG.whatsapp} className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-accent transition-colors">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">WhatsApp</span>
                    <span className="text-xl font-serif">+32 467 81 04 22</span>
                  </div>
                </a>
                <a href={CONFIG.telegram} className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-accent transition-colors">
                    <Send size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Telegram</span>
                    <span className="text-xl font-serif">@psyfusions</span>
                  </div>
                </a>
                <a href={CONFIG.instagram} className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-accent transition-colors">
                    <Instagram size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Instagram</span>
                    <span className="text-xl font-serif">@psyfusions</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[60px] text-brand-ink shadow-2xl">
              <AnimatePresence mode="wait">
                {!isContactSubmitted ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="text-3xl font-serif mb-8 text-brand-primary">Оставить заявку</h3>
                    <form className="grid gap-6" onSubmit={handleContactSubmit}>
                      <div className="grid gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Ваше имя</label>
                        <input name="name" type="text" className="w-full p-4 bg-stone-50 rounded-xl outline-none focus:ring-2 ring-brand-accent/20 transition-all" required />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Телефон / Мессенджер</label>
                        <input name="contact" type="text" className="w-full p-4 bg-stone-50 rounded-xl outline-none focus:ring-2 ring-brand-accent/20 transition-all" required />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Краткий запрос</label>
                        <textarea name="message" className="w-full p-4 bg-stone-50 rounded-xl outline-none focus:ring-2 ring-brand-accent/20 transition-all h-32 resize-none" />
                      </div>
                      <button
                        disabled={isSubmitting}
                        className="w-full bg-brand-primary text-white py-6 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-brand-accent transition-all shadow-xl mt-4 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Отправка...' : 'Записаться на встречу'}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="w-20 h-20 bg-brand-secondary rounded-full flex items-center justify-center mx-auto mb-8 text-brand-accent">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-3xl font-serif mb-4 text-brand-primary">Заявка принята!</h3>
                    <p className="text-stone-500 leading-relaxed mb-8">
                      Спасибо за доверие. Оксана свяжется с вами в ближайшее время через указанный мессенджер.
                    </p>
                    <button
                      onClick={() => setIsContactSubmitted(false)}
                      className="text-xs font-bold uppercase tracking-widest text-brand-accent hover:underline"
                    >
                      Отправить еще одну заявку
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="py-12 bg-brand-paper border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-serif text-lg">P</div>
            <span className="text-lg font-serif tracking-tight text-brand-primary">PsyFusions</span>
          </div>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
            © 2024 {CONFIG.name}. Все права защищены.
          </p>
          <div className="flex gap-6">
            <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram className="text-stone-400 hover:text-brand-accent cursor-pointer transition-colors" size={18} />
            </a>
            <a href={CONFIG.telegram} target="_blank" rel="noopener noreferrer">
              <Send className="text-stone-400 hover:text-brand-accent cursor-pointer transition-colors" size={18} />
            </a>
            <a href={CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="text-stone-400 hover:text-brand-accent cursor-pointer transition-colors" size={18} />
            </a>
          </div>
        </div>
      </footer>

      {/* ── Floating Actions ─────────────────────────────────────── */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <motion.a
          href={CONFIG.telegram}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="w-14 h-14 bg-[#229ED9] text-white rounded-full flex items-center justify-center shadow-2xl"
        >
          <Send size={24} />
        </motion.a>
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="w-14 h-14 bg-white text-brand-primary rounded-full flex items-center justify-center shadow-2xl border border-stone-100"
        >
          <ArrowUpRight size={24} className="-rotate-45" />
        </motion.button>
      </div>

      {/* ── Quiz Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showDiagnosis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-primary/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl relative"
            >
              <button
                onClick={() => setShowDiagnosis(false)}
                className="absolute -top-12 right-0 text-white hover:text-brand-accent transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              >
                Закрыть <X size={16} />
              </button>
              <Quiz />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Diploma Lightbox ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedDiploma && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDiploma(null)}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-brand-primary/90 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-4xl w-full max-h-[90vh] relative bg-white rounded-[40px] overflow-hidden shadow-2xl cursor-default"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedDiploma(null)}
                className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-accent hover:text-white transition-all"
              >
                <X size={20} />
              </button>
              <div className="grid md:grid-cols-2 h-full">
                <div className="bg-stone-100 flex items-center justify-center p-8">
                  <img
                    src={selectedDiploma.img}
                    alt={selectedDiploma.title}
                    className="max-w-full max-h-[70vh] shadow-2xl rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-12 flex flex-col justify-center">
                  <span className="text-brand-accent font-bold mb-4">{selectedDiploma.year}</span>
                  <h3 className="text-3xl font-serif text-brand-primary mb-6">{selectedDiploma.title}</h3>
                  <p className="text-stone-500 mb-8 leading-relaxed">
                    Этот документ подтверждает квалификацию в области «{selectedDiploma.title}», полученную в {selectedDiploma.school}.
                    Оксана регулярно проходит супервизии и повышает квалификацию для обеспечения высшего стандарта психологической помощи.
                  </p>
                  <div className="flex items-center gap-4 p-4 bg-brand-secondary rounded-2xl">
                    <Award className="text-brand-accent" size={24} />
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">Верифицированный документ</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
