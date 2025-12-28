import React, { useState } from 'react';
import { Home } from 'lucide-react';

interface QuizProps {
  onComplete: (skinType: string) => void;
  onBack: () => void;
}

const QUIZ_QUESTIONS = [
  {
    question: 'How does your skin feel a few hours after cleansing?',
    options: [
      { text: 'Tight and flaky', value: 'dry', emoji: '🏜️' },
      { text: 'Shiny all over', value: 'oily', emoji: '✨' },
      { text: 'Shiny in T-zone, normal elsewhere', value: 'combination', emoji: '🎨' },
      { text: 'Comfortable and balanced', value: 'normal', emoji: '😊' },
      { text: 'Easily irritated or red', value: 'sensitive', emoji: '🌸' }
    ]
  },
  {
    question: 'How often do you experience breakouts?',
    options: [
      { text: 'Rarely or never', value: 'dry', emoji: '✨' },
      { text: 'Frequently, especially on forehead and nose', value: 'oily', emoji: '😓' },
      { text: 'Occasionally in T-zone', value: 'combination', emoji: '🎭' },
      { text: 'Sometimes, but manageable', value: 'normal', emoji: '👌' },
      { text: 'Products often cause reactions', value: 'sensitive', emoji: '💕' }
    ]
  },
  {
    question: 'How do your pores look?',
    options: [
      { text: 'Small and barely visible', value: 'dry', emoji: '🔍' },
      { text: 'Large and noticeable', value: 'oily', emoji: '👀' },
      { text: 'Larger in T-zone', value: 'combination', emoji: '🎨' },
      { text: 'Medium-sized', value: 'normal', emoji: '😌' },
      { text: 'Not sure, I focus more on redness', value: 'sensitive', emoji: '🌺' }
    ]
  },
  {
    question: 'How does your skin react to new products?',
    options: [
      { text: 'Gets flaky or peels', value: 'dry', emoji: '🍂' },
      { text: 'Becomes more oily', value: 'oily', emoji: '💧' },
      { text: 'Mixed reactions in different areas', value: 'combination', emoji: '🌗' },
      { text: 'Generally well', value: 'normal', emoji: '✅' },
      { text: 'Often stings or turns red', value: 'sensitive', emoji: '🔴' }
    ]
  },
  {
    question: 'By midday, how does your skin look?',
    options: [
      { text: 'Dull and rough', value: 'dry', emoji: '😴' },
      { text: 'Very shiny and greasy', value: 'oily', emoji: '🌟' },
      { text: 'Shiny T-zone, dry cheeks', value: 'combination', emoji: '🎪' },
      { text: 'Fresh and even', value: 'normal', emoji: '🌿' },
      { text: 'Blotchy or irritated', value: 'sensitive', emoji: '🌹' }
    ]
  }
];

const Quiz: React.FC<QuizProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const counts: { [key: string]: number } = {};
      newAnswers.forEach(answer => {
        counts[answer] = (counts[answer] || 0) + 1;
      });
      const maxCount = Math.max(...Object.values(counts));
      const skinType = Object.keys(counts).find(key => counts[key] === maxCount) || 'normal';
      onComplete(skinType);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 font-medium">Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
            <span className="text-sm text-pink-500 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-pink-100">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💭</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentQuestion.question}</h2>
            <p className="text-gray-500 font-light">Choose the option that best describes you</p>
          </div>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="text-gray-700 font-medium group-hover:text-gray-900">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-6 text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 mx-auto"
        >
          <Home className="w-4 h-4" />
          Back to home
        </button>
      </div>
    </div>
  );
};

export default Quiz;