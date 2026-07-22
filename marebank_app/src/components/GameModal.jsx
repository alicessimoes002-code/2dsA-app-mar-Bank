import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, Trophy, Flame, Check, XCircle, RotateCcw, Gamepad2, Clock } from "lucide-react";

const QUESTION_TIME = 7;

export default function GameModal({ challenge, onClose }) {
  let rawItems = [];
  try {
    rawItems = challenge.questions ? JSON.parse(challenge.questions) : [];
  } catch (e) {
    rawItems = [];
  }
  const isTrueFalse = rawItems.length > 0 && "isTrue" in rawItems[0];

  const [phase, setPhase] = useState("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [items, setItems] = useState(() => [...rawItems].sort(() => Math.random() - 0.5));

  const streakRef = useRef(0);
  const handleAnswerRef = useRef();

  const currentItem = items[currentIdx];
  const totalItems = items.length;

  function handleAnswer(choice) {
    if (feedback !== null) return;

    const currentStreak = streakRef.current;
    let isCorrect;
    if (isTrueFalse) {
      isCorrect = choice === currentItem.isTrue;
    } else {
      isCorrect = choice === currentItem.isNecessity;
    }

    if (choice === null) {
      setFeedback("timeout");
      streakRef.current = 0;
      setStreak(0);
    } else if (isCorrect) {
      const bonus = Math.min(currentStreak * 5, 30);
      setScore((s) => s + 10 + bonus);
      const newStreak = currentStreak + 1;
      streakRef.current = newStreak;
      setStreak(newStreak);
      setMaxStreak((m) => Math.max(m, newStreak));
      setFeedback("correct");
    } else {
      setFeedback("wrong");
      streakRef.current = 0;
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIdx + 1 < totalItems) {
        setCurrentIdx((i) => i + 1);
        setFeedback(null);
      } else {
        setPhase("result");
      }
    }, 1500);
  }

  handleAnswerRef.current = handleAnswer;

  useEffect(() => {
    if (phase !== "playing" || feedback !== null) return;
    const timeout = setTimeout(() => handleAnswerRef.current(null), QUESTION_TIME * 1000);
    return () => clearTimeout(timeout);
  }, [phase, feedback, currentIdx]);

  function startGame() {
    setItems([...rawItems].sort(() => Math.random() - 0.5));
    setPhase("playing");
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setFeedback(null);
    streakRef.current = 0;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 w-full max-w-md relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10">
          <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
        </button>

        {phase === "intro" && (
          <IntroPhase challenge={challenge} isTrueFalse={isTrueFalse} onStart={startGame} hasItems={totalItems > 0} />
        )}

        {phase === "playing" && currentItem && (
          <PlayingPhase
            currentItem={currentItem}
            currentIdx={currentIdx}
            totalItems={totalItems}
            score={score}
            streak={streak}
            feedback={feedback}
            isTrueFalse={isTrueFalse}
            onAnswer={handleAnswer}
          />
        )}

        {phase === "result" && (
          <ResultPhase score={score} maxStreak={maxStreak} xpReward={challenge.xp_reward} onReplay={startGame} onClose={onClose} />
        )}
      </motion.div>
    </div>
  );
}

function IntroPhase({ challenge, isTrueFalse, onStart, hasItems }) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-sky-200"
      >
        <Gamepad2 className="w-10 h-10 text-white" />
      </motion.div>
      <h2 className="text-xl font-bold text-slate-900 mt-4">{challenge.title}</h2>
      <p className="text-sm text-slate-400 mt-2">{challenge.description}</p>

      <div className="mt-6 p-4 rounded-2xl bg-slate-50 text-left">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Como jogar</p>
        <ul className="mt-2 space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            {isTrueFalse ? "Decida se cada afirmação é verdadeira ou falsa" : "Classifique cada item como Necessário ou Desejo"}
          </li>
          <li className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
            Você tem {QUESTION_TIME}s por item — seja rápido!
          </li>
          <li className="flex items-start gap-2">
            <Flame className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            Acerte em sequência para ganhar pontos de bônus
          </li>
        </ul>
      </div>

      <div className="mt-4 inline-flex items-center gap-1.5 text-amber-500 font-bold">
        <Zap className="w-5 h-5" /> +{challenge.xp_reward} XP ao concluir
      </div>

      {hasItems ? (
        <button
          onClick={onStart}
          className="w-full mt-6 bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-sky-200 hover:scale-[1.02] active:scale-95 transition-transform"
        >
          🎮 Jogar
        </button>
      ) : (
        <p className="mt-6 text-sm text-slate-400">Nenhum item disponível para este jogo ainda.</p>
      )}
    </div>
  );
}

function PlayingPhase({ currentItem, currentIdx, totalItems, score, streak, feedback, isTrueFalse, onAnswer }) {
  const lastBonus = Math.min((streak - 1) * 5, 30);
  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-400">{currentIdx + 1}/{totalItems}</span>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {streak >= 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-1 text-orange-500 font-bold"
              >
                <Flame className="w-4 h-4" />
                {streak}x
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Zap className="w-4 h-4" />
            {score}
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-5">
        <div
          key={`timer-${currentIdx}`}
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
          style={{
            animation: `timer-shrink ${QUESTION_TIME}s linear forwards`,
            animationPlayState: feedback !== null ? "paused" : "running",
          }}
        />
      </div>

      {/* Item card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25 }}
          className={`relative rounded-3xl p-8 text-center border-2 transition-colors ${
            feedback === "correct"
              ? "border-emerald-500 bg-emerald-50"
              : feedback === "wrong"
              ? "border-rose-500 bg-rose-50"
              : feedback === "timeout"
              ? "border-amber-500 bg-amber-50"
              : "border-slate-100 bg-slate-50"
          }`}
        >
          {isTrueFalse ? (
            <>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Verdadeiro ou Falso?</p>
              <p className="text-base font-bold text-slate-900 mt-3 leading-relaxed">{currentItem.statement}</p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">{currentItem.emoji}</div>
              <p className="text-base font-bold text-slate-900">{currentItem.description}</p>
            </>
          )}

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 pt-4 border-t border-slate-200"
              >
                {feedback === "correct" ? (
                  <p className="text-sm font-bold text-emerald-600 flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" /> Correto! +{10 + Math.max(lastBonus, 0)} pts
                  </p>
                ) : feedback === "timeout" ? (
                  <p className="text-sm font-bold text-amber-600 flex items-center justify-center gap-1.5">
                    <Clock className="w-4 h-4" /> Tempo esgotado!
                  </p>
                ) : (
                  <p className="text-sm font-bold text-rose-600 flex items-center justify-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    {isTrueFalse
                      ? `Resposta: ${currentItem.isTrue ? "Verdadeiro" : "Falso"}`
                      : `Era ${currentItem.isNecessity ? "Necessário" : "Desejo"}`}
                  </p>
                )}
                {currentItem?.explanation && (
                  <p className="text-xs text-slate-500 mt-2">{currentItem.explanation}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        {isTrueFalse ? (
          <>
            <button
              onClick={() => onAnswer(true)}
              disabled={feedback !== null}
              className="py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
            >
              ✓ Verdadeiro
            </button>
            <button
              onClick={() => onAnswer(false)}
              disabled={feedback !== null}
              className="py-4 rounded-2xl bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
            >
              ✗ Falso
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onAnswer(true)}
              disabled={feedback !== null}
              className="py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
            >
              👍 Necessário
            </button>
            <button
              onClick={() => onAnswer(false)}
              disabled={feedback !== null}
              className="py-4 rounded-2xl bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
            >
              👎 Desejo
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ResultPhase({ score, maxStreak, xpReward, onReplay, onClose }) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-xl shadow-amber-200"
      >
        <Trophy className="w-10 h-10 text-white" />
      </motion.div>
      <h2 className="text-xl font-bold text-slate-900 mt-4">Jogo concluído!</h2>

      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="p-3 rounded-2xl bg-slate-50">
          <p className="text-xs text-slate-400">Pontos</p>
          <p className="text-xl font-bold text-slate-900">{score}</p>
        </div>
        <div className="p-3 rounded-2xl bg-orange-50">
          <p className="text-xs text-slate-400">Maior sequência</p>
          <p className="text-xl font-bold text-orange-500">{maxStreak}x</p>
        </div>
        <div className="p-3 rounded-2xl bg-amber-50">
          <p className="text-xs text-slate-400">XP ganho</p>
          <p className="text-xl font-bold text-amber-500">{xpReward}</p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onReplay}
          className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Jogar de novo
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-sky-200"
        >
          Concluir
        </button>
      </div>
    </div>
  );
}
