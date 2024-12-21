import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCcw, Check, X } from 'lucide-react';

interface Question {
  num1: number;
  num2: number;
  options: number[];
  correctAnswer: number;
}

export function Game() {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 * num2;
    
    let options = [correctAnswer];
    while (options.length < 4) {
      const wrongAnswer = (Math.floor(Math.random() * 10) + 1) * (Math.floor(Math.random() * 10) + 1);
      if (!options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    options = options.sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      num1,
      num2,
      options,
      correctAnswer
    });
    setShowResult(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswer = (answer: number) => {
    if (!currentQuestion) return;
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    setShowResult(isCorrect);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setTimeout(generateQuestion, 1000);
    } else {
      setStreak(0);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
      <div className="flex justify-between items-center mb-8">
        <div className="text-lg font-semibold text-gray-700">
          Pontos: {score}
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={20} />
          <span className="text-lg font-semibold text-gray-700">
            Sequência: {streak}
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {currentQuestion.num1} × {currentQuestion.num2} = ?
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={showResult !== null}
              className={`
                p-4 text-xl font-bold rounded-lg transition-all transform hover:scale-105
                ${showResult === null 
                  ? 'bg-white border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50' 
                  : option === currentQuestion.correctAnswer && showResult
                  ? 'bg-green-500 text-white'
                  : option === currentQuestion.correctAnswer
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {showResult !== null && (
        <div className={`text-center mb-6 ${showResult ? 'text-green-500' : 'text-red-500'}`}>
          {showResult ? (
            <div className="flex items-center justify-center gap-2">
              <Check size={24} />
              <span className="text-lg font-semibold">Correto!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <X size={24} />
              <span className="text-lg font-semibold">
                Incorreto! A resposta era {currentQuestion.correctAnswer}
              </span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={generateQuestion}
        className="w-full py-3 px-6 bg-indigo-500 text-white rounded-lg font-semibold
          flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors"
      >
        <RefreshCcw size={20} />
        Nova Questão
      </button>
    </div>
  );
}