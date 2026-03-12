'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; style: string; emoji: string }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your ideal weekend vibe?",
    options: [
      { label: 'Casual & Comfortable', style: 'casual', emoji: '👕' },
      { label: 'Bold & Trendy', style: 'trendy', emoji: '🔥' },
      { label: 'Classic & Elegant', style: 'classic', emoji: '👔' },
      { label: 'Sporty & Active', style: 'sporty', emoji: '🏃' },
    ],
  },
  {
    id: 2,
    question: 'Pick a color palette that speaks to you',
    options: [
      { label: 'Neutrals & Earth Tones', style: 'casual', emoji: '🟤' },
      { label: 'Vibrant & Neon', style: 'trendy', emoji: '🟣' },
      { label: 'Monochrome & Navy', style: 'classic', emoji: '⚫' },
      { label: 'Bright & Energetic', style: 'sporty', emoji: '🟡' },
    ],
  },
  {
    id: 3,
    question: 'Your go-to outfit for a party?',
    options: [
      { label: 'Jeans & Cool Tee', style: 'casual', emoji: '👖' },
      { label: 'Statement Piece', style: 'trendy', emoji: '✨' },
      { label: 'Tailored Suit/Dress', style: 'classic', emoji: '🎩' },
      { label: 'Athleisure Look', style: 'sporty', emoji: '👟' },
    ],
  },
  {
    id: 4,
    question: 'Choose your ideal vacation style',
    options: [
      { label: 'Beach Casual', style: 'casual', emoji: '🏖️' },
      { label: 'Fashion Week Ready', style: 'trendy', emoji: '📸' },
      { label: 'European Tour Chic', style: 'classic', emoji: '🗼' },
      { label: 'Adventure Gear', style: 'sporty', emoji: '🎒' },
    ],
  },
];

const styleResults: Record<string, { title: string; desc: string; color: string }> = {
  casual: {
    title: 'Relaxed Casual',
    desc: 'You love comfort with style. Your look is effortless and always laid-back cool.',
    color: 'from-amber-500 to-orange-500',
  },
  trendy: {
    title: 'Trendsetter',
    desc: 'You stay ahead of the curve! Always rocking the latest looks and making statements.',
    color: 'from-pink-500 to-rose-500',
  },
  classic: {
    title: 'Timeless Classic',
    desc: 'Elegance is your middle name. You prefer sophisticated, enduring styles.',
    color: 'from-blue-500 to-indigo-500',
  },
  sporty: {
    title: 'Active Sporty',
    desc: 'Fitness meets fashion. You rock athleisure like nobody else!',
    color: 'from-green-500 to-emerald-500',
  },
};

export default function StyleQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleAnswer = (style: string) => {
    const newAnswers = [...answers, style];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    const styleCounts: Record<string, number> = {};
    answers.forEach((style) => {
      styleCounts[style] = (styleCounts[style] || 0) + 1;
    });
    const result = Object.entries(styleCounts).sort((a, b) => b[1] - a[1])[0][0];
    return styleResults[result];
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const handlePlayAgain = () => {
    resetQuiz();
    setHasPlayed(true);
  };

  if (!hasPlayed) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="gradient-blob-1 opacity-30" />
          <div className="gradient-blob-2 opacity-30" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Fun & Interactive
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Discover Your Style Personality
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Take our quick style quiz and unlock personalized fashion recommendations!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card p-8 md:p-10 text-center"
          >
            <div className="text-6xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Style Personality Quiz
            </h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Answer 4 quick questions and we'll reveal your unique style personality with curated product picks just for you!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setHasPlayed(true)}
              className="gradient-bg text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-glow hover:shadow-glow-lg transition-all"
            >
              Start Quiz ✨
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="gradient-blob-1 opacity-30" />
        <div className="gradient-blob-2 opacity-30" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="card p-8 md:p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-text-secondary">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
                <div className="flex gap-2">
                  {quizQuestions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx <= currentQuestion ? 'w-8 gradient-bg' : 'w-2 bg-text-secondary/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-8 text-center">
                {quizQuestions[currentQuestion].question}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {quizQuestions[currentQuestion].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.style)}
                    className="p-4 rounded-xl border border-text-secondary/20 hover:border-primary/50 bg-background hover:bg-primary/5 transition-all text-left group"
                  >
                    <span className="text-3xl mb-2 block">{option.emoji}</span>
                    <span className="text-text-primary font-medium group-hover:text-primary transition-colors">
                      {option.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 md:p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
              >
                <span className="text-5xl">🌟</span>
              </motion.div>

              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Your Style Personality
              </span>

              <h3 className={`text-3xl font-bold mb-4 bg-gradient-to-r ${getResult().color} bg-clip-text text-transparent`}>
                {getResult().title}
              </h3>

              <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
                {getResult().desc}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayAgain}
                  className="px-6 py-3 rounded-xl font-medium border border-primary/50 text-text-primary hover:bg-primary/10 transition-all"
                >
                  Play Again 🔄
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/men"
                  className="gradient-bg text-white px-6 py-3 rounded-xl font-semibold shadow-glow"
                >
                  Shop Now 🛍️
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
