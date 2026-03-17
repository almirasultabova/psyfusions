/**
 * Quiz.tsx — PsyFusions
 * ======================
 * Квиз-диагностика уровня тревожности.
 *
 * ШАГИ КВИЗА:
 *   intro       → знакомство и старт
 *   questions   → 7 вопросов с вариантами ответов
 *   calculating → анимация «обработки результатов»
 *   result      → итоговый уровень тревожности
 *   form        → форма для записи на консультацию
 *
 * ЛОГИКА ПОДСЧЁТА:
 *   Каждый ответ даёт 0-3 балла (индекс варианта).
 *   Итого: 0-7 → низкий, 8-14 → средний, 15+ → высокий.
 *
 * API:
 *   POST /api/contact — отправляет имя, контакт, score и результат.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Zap, Star, MessageCircle, Send } from 'lucide-react';
import { CONFIG } from '../config';

const questions = [
  { id: 1, text: "Как часто вы ощущаете внутреннее напряжение или тревогу?",
    options: ["почти никогда", "иногда", "довольно часто", "почти постоянно"] },
  { id: 2, text: "Бывает ли, что мысли не дают вам расслабиться или спокойно уснуть?",
    options: ["нет", "иногда", "часто", "почти каждую ночь"] },
  { id: 3, text: "Насколько легко вам расслабиться и почувствовать спокойствие?",
    options: ["легко", "иногда сложно", "чаще сложно", "почти невозможно"] },
  { id: 4, text: "Чувствуете ли вы эмоциональную усталость или выгорание?",
    options: ["нет", "иногда", "довольно часто", "постоянно"] },
  { id: 5, text: "Есть ли у вас ощущение, что вы «застряли» в сложной жизненной ситуации?",
    options: ["нет", "иногда возникает", "часто думаю об этом", "постоянно чувствую это"] },
  { id: 6, text: "Насколько вы довольны своим эмоциональным состоянием сейчас?",
    options: ["полностью доволен", "скорее доволен", "скорее не доволен", "совсем не доволен"] },
  { id: 7, text: "Если честно, насколько вам сейчас нужна поддержка?",
    options: ["не чувствую необходимости", "возможно, немного", "скорее нужна", "очень нужна"] },
];

const results = [
  {
    title: "Низкий уровень тревожности",
    desc:  "Ваше эмоциональное состояние сейчас относительно стабильное. Тем не менее иногда полезно обращать внимание на внутренние сигналы и заботиться о своём психологическом состоянии.",
  },
  {
    title: "Средний уровень тревожности",
    desc:  "Судя по ответам, вы часто испытываете внутреннее напряжение. Это может быть связано со стрессом, накопленной усталостью или жизненными обстоятельствами. Работа с психологом помогает быстрее разобраться с причинами таких состояний.",
  },
  {
    title: "Высокий уровень тревожности",
    desc:  "Ваши ответы показывают высокий уровень эмоционального напряжения. В таких состояниях человеку бывает сложно самостоятельно справиться с тревожными мыслями и внутренним напряжением. Психологическая поддержка может значительно облегчить состояние.",
  },
];

export default function Quiz() {
  const [step, setStep] = useState<'intro' | 'questions' | 'calculating' | 'result' | 'form'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getResult = () => {
    if (score <= 7)  return results[0];
    if (score <= 14) return results[1];
    return results[2];
  };

  const handleAnswer = (index: number) => {
    setScore(prev => prev + index);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('calculating');
      setTimeout(() => setStep('result'), 2000);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      name:    formData.get('name'),
      contact: formData.get('contact'),
      score,
      result: getResult().title,
      source: 'Quiz Form',
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const result = getResult();

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-stone-100 relative overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-brand-secondary">
        <motion.div
          className="h-full bg-brand-accent"
          initial={{ width: 0 }}
          animate={{ width: step === 'questions' ? `${((currentQuestion + 1) / questions.length) * 100}%` : '100%' }}
        />
      </div>

      <AnimatePresence mode="wait">

        {/* ── Intro ─── */}
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-brand-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary">
              <Zap size={32} />
            </div>
            <h3 className="text-3xl font-serif mb-4 text-brand-primary">
              Проверьте уровень тревожности и эмоционального напряжения
            </h3>
            <p className="text-stone-500 mb-4 leading-relaxed">
              Ответьте на несколько вопросов и узнайте, в каком состоянии сейчас находится ваша нервная система.
            </p>
            <p className="text-stone-400 text-sm mb-8">Диагностика займёт не больше 2 минут.</p>

            <div className="bg-brand-secondary/30 p-4 rounded-2xl mb-8 flex items-center gap-3 justify-center">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-6 h-6 rounded-full border-2 border-white" alt="User" referrerPolicy="no-referrer" />
                ))}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                Более 300 человек уже прошли эту диагностику
              </p>
            </div>

            <button
              onClick={() => setStep('questions')}
              className="w-full bg-brand-primary text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-3"
            >
              Начать тест <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {/* ── Questions ─── */}
        {step === 'questions' && (
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-4 block">
              Вопрос {currentQuestion + 1} из {questions.length}
            </span>
            <h3 className="text-2xl font-serif mb-8 text-brand-primary">
              {questions[currentQuestion].text}
            </h3>
            <div className="grid gap-3">
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="text-left p-5 rounded-2xl border border-stone-100 hover:border-brand-accent hover:bg-brand-secondary/30 transition-all text-stone-600 hover:text-brand-primary group flex items-center justify-between"
                >
                  <span>{option}</span>
                  <div className="w-6 h-6 rounded-full border border-stone-200 group-hover:border-brand-accent flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Calculating ─── */}
        {step === 'calculating' && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 border-4 border-brand-secondary border-t-brand-accent rounded-full animate-spin" />
            </div>
            <h3 className="text-xl font-serif text-brand-primary">Анализируем ваши ответы...</h3>
          </motion.div>
        )}

        {/* ── Result ─── */}
        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-block p-4 bg-brand-secondary rounded-full mb-6">
              <Star className="text-brand-accent fill-brand-accent" size={32} />
            </div>
            <h3 className="text-3xl font-serif mb-4 text-brand-primary">{result.title}</h3>
            <p className="text-stone-500 mb-10 leading-relaxed">{result.desc}</p>

            <div className="bg-stone-50 p-8 rounded-[32px] mb-8 text-left border border-stone-100">
              <p className="text-brand-primary font-serif text-lg mb-4">
                Если вы хотите разобраться с причинами своего состояния и почувствовать больше спокойствия — вы можете записаться на консультацию.
              </p>
              <p className="text-stone-500 text-sm italic">
                Иногда одного разговора достаточно, чтобы увидеть ситуацию по-новому.
              </p>
            </div>

            <button
              onClick={() => setStep('form')}
              className="w-full bg-brand-primary text-white py-6 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-xl"
            >
              Записаться на консультацию
            </button>
          </motion.div>
        )}

        {/* ── Form ─── */}
        {step === 'form' && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div key="quiz-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h3 className="text-2xl font-serif mb-6 text-brand-primary text-center">Оставьте контакты для записи</h3>
                  <form className="grid gap-4" onSubmit={handleFormSubmit}>
                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Имя</label>
                      <input
                        name="name"
                        type="text"
                        className="w-full p-5 rounded-2xl border border-stone-100 focus:border-brand-accent outline-none transition-all bg-stone-50"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Телефон или Telegram</label>
                      <input
                        name="contact"
                        type="text"
                        className="w-full p-5 rounded-2xl border border-stone-100 focus:border-brand-accent outline-none transition-all bg-stone-50"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-accent text-white py-6 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-brand-accent/90 transition-all shadow-lg mt-4 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Отправка...' : 'Записаться на консультацию'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="quiz-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-20 h-20 bg-brand-secondary rounded-full flex items-center justify-center mx-auto mb-8 text-brand-accent">
                    <Star size={40} className="fill-brand-accent" />
                  </div>
                  <h3 className="text-3xl font-serif mb-4 text-brand-primary">Заявка принята!</h3>
                  <p className="text-stone-500 leading-relaxed mb-8">
                    Спасибо! {CONFIG.name.split(' ')[0]} свяжется с вами в ближайшее время для уточнения деталей консультации.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-bold uppercase tracking-widest text-brand-accent hover:underline"
                  >
                    Вернуться назад
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-8 pt-8 border-t border-stone-100 flex justify-center gap-6">
              <MessageCircle className="text-stone-300" size={20} />
              <Send className="text-stone-300" size={20} />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
