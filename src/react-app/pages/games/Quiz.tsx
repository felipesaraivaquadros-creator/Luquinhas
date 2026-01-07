import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Home, Trophy, RotateCcw } from 'lucide-react';
import { quizQuestions } from '@/shared/content';

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleAnswerClick = (answerIndex: number) => {
    if (answered) return;

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    if (answerIndex === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
  };

  if (showResult) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <Trophy className="w-24 h-24 mx-auto mb-6 text-luquinhas-yellow" />
            <h1 className="text-5xl font-bold text-luquinhas-green mb-4">
              Parabéns!
            </h1>
            <p className="text-3xl text-gray-700 mb-8">
              Você acertou {score} de {quizQuestions.length} perguntas
            </p>
            <div className="text-6xl font-bold text-luquinhas-blue mb-8">
              {percentage}%
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="btn-primary flex items-center gap-2"
              >
                <RotateCcw className="w-6 h-6" />
                Jogar Novamente
              </button>
              <button
                onClick={() => navigate('/activities')}
                className="btn-secondary flex items-center gap-2"
              >
                <Home className="w-6 h-6" />
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 text-luquinhas-blue hover:text-luquinhas-blue-dark"
          >
            <Home className="w-6 h-6" />
            <span className="font-semibold">Voltar</span>
          </button>
          <h1 className="text-4xl font-bold text-luquinhas-green">
            Quiz
          </h1>
          <div className="text-xl font-bold text-luquinhas-blue">
            {currentQuestion + 1}/{quizQuestions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
          <div
            className="bg-luquinhas-green h-4 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="card">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {question.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correctAnswer;
              const isSelected = index === selectedAnswer;
              
              let bgColor = 'bg-white hover:bg-gray-50';
              if (answered) {
                if (isCorrect) {
                  bgColor = 'bg-green-100 border-green-500';
                } else if (isSelected && !isCorrect) {
                  bgColor = 'bg-red-100 border-red-500';
                }
              } else if (isSelected) {
                bgColor = 'bg-luquinhas-blue-light';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={answered}
                  className={`w-full p-6 rounded-2xl border-4 text-left text-xl font-semibold transition-all ${bgColor} ${
                    !answered ? 'hover:scale-102 cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {answered && (
            <button
              onClick={handleNext}
              className="btn-primary w-full"
            >
              {isLastQuestion ? 'Ver Resultado' : 'Próxima Pergunta'}
            </button>
          )}
        </div>

        {/* Score */}
        <div className="text-center mt-6 text-2xl font-bold text-luquinhas-blue">
          Pontuação: {score}
        </div>
      </div>
    </div>
  );
}
