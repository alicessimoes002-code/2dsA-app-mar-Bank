import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BookOpen, Trophy, Zap, Star, Clock, CheckCircle2, Lock, ArrowRight, X, Brain, Target, Gamepad2 } from "lucide-react";
import GameModal from "@/components/GameModal";

export default function Academy() {
  const [lessons, setLessons] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [tab, setTab] = useState("lessons");

  useEffect(() => {
    async function loadData() {
      try {
        const [lessonData, challengeData] = await Promise.all([
          base44.entities.AcademyLesson.list("order", 50),
          base44.entities.Challenge.list("-updated_date", 20),
        ]);
        if (lessonData.length === 0) {
          await seedLessons();
          const reloaded = await base44.entities.AcademyLesson.list("order", 50);
          setLessons(reloaded);
        } else {
          setLessons(lessonData);
        }
        if (challengeData.length === 0) {
          await seedChallenges();
          const reloaded = await base44.entities.Challenge.list("-updated_date", 20);
          setChallenges(reloaded);
        } else {
          setChallenges(challengeData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function seedLessons() {
    await base44.entities.AcademyLesson.bulkCreate([
      { title: "O que é dinheiro?", description: "Aprenda os conceitos básicos sobre dinheiro e sua função.", content: "O dinheiro é um meio de troca usado para adquirir bens e serviços. Ele facilita as transações e permite que as pessoas comprem o que precisam sem precisar trocar produtos diretamente. Entender o valor do dinheiro é o primeiro passo para a educação financeira.", category: "basico", level: "iniciante", duration_minutes: 5, xp_reward: 50, icon: "BookOpen", order: 1, is_completed: false },
      { title: "Diferença entre needs e wants", description: "Necessidades vs. desejos: como priorizar seus gastos.", content: "Necessidades são coisas essenciais para viver: comida, moradia, saúde. Desejos são coisas que gostaríamos de ter, mas não são essenciais. Saber a diferença ajuda a tomar decisões financeiras mais conscientes e evitar gastos impulsivos.", category: "consumo_consciente", level: "iniciante", duration_minutes: 7, xp_reward: 60, icon: "BookOpen", order: 2, is_completed: false },
      { title: "Como criar um orçamento", description: "Aprenda a planejar seus gastos mensais.", content: "Um orçamento é um plano de como você vai gastar seu dinheiro. Comece listando suas entradas (mesada, presente) e divida em categorias: necessidades (50%), desejos (30%) e poupança (20%). Revise mensalmente e ajuste conforme necessário.", category: "planejamento", level: "intermediario", duration_minutes: 10, xp_reward: 80, icon: "BookOpen", order: 3, is_completed: false },
      { title: "Poupança: o hábito que enriquece", description: "Por que poupar e como começar a economizar.", content: "Poupar é separar uma parte do seu dinheiro para o futuro. Mesmo pequenas quantias, guardadas com regularidade, crescem ao longo do tempo. Comece com 10% da sua mesada e aumente gradativamente. Use os cofres do MaréBank para suas metas!", category: "poupanca", level: "intermediario", duration_minutes: 8, xp_reward: 70, icon: "BookOpen", order: 4, is_completed: false },
      { title: "Juros compostos: a magia do tempo", description: "Entenda como o dinheiro cresce ao longo do tempo.", content: "Juros compostos são quando você ganha juros sobre os juros. Por exemplo: R$ 100 a 10% ao ano vira R$ 110 no primeiro ano, e no segundo ano você ganha 10% sobre R$ 110 = R$ 121. Quanto mais cedo você começar, mais o dinheiro cresce!", category: "investimento", level: "avancado", duration_minutes: 12, xp_reward: 100, icon: "BookOpen", order: 5, is_completed: false },
      { title: "Investimentos para iniciantes", description: "Primeiros passos no mundo dos investimentos.", content: "Investir é colocar seu dinheiro para trabalhar. Existem várias opções: poupança (mais segura), CDB, Tesouro Direto e fundos. Comece pela poupança enquanto aprende, e procure renda fixa para o primeiro investimento. Sempre pesquise antes de investir!", category: "investimento", level: "avancado", duration_minutes: 15, xp_reward: 120, icon: "BookOpen", order: 6, is_completed: false },
    ]);
  }

  async function seedChallenges() {
    await base44.entities.Challenge.bulkCreate([
      {
        title: "Quiz: Básico de Dinheiro",
        description: "Teste seus conhecimentos sobre o básico de dinheiro.",
        type: "quiz",
        xp_reward: 100,
        difficulty: "facil",
        icon: "Brain",
        status: "available",
        questions: JSON.stringify([
          { question: "O que é uma necessidade?", options: ["Um videogame", "Comida e moradia", "Roupas de marca", "Doces"], answer: 1 },
          { question: "Qual é a regra 50-30-20?", options: ["50% desejos, 30% necessidades, 20% poupar", "50% necessidades, 30% desejos, 20% poupar", "50% poupar, 30% desejos, 20% necessidades", "50% necessidades, 30% poupar, 20% desejos"], answer: 1 },
          { question: "O que é poupança?", options: ["Gastar tudo", "Separar dinheiro para o futuro", "Emprestar dinheiro", "Comprar à prazo"], answer: 1 },
        ]),
      },
      {
        title: "Quiz: Consumo Consciente",
        description: "Você sabe diferenciar necessidades de desejos?",
        type: "quiz",
        xp_reward: 150,
        difficulty: "medio",
        icon: "Brain",
        status: "available",
        questions: JSON.stringify([
          { question: "Qual é um exemplo de desejo?", options: ["Conta de água", "Ingresso de cinema", "Material escolar", "Alimentação"], answer: 1 },
          { question: "Antes de comprar, você deve:", options: ["Comprar por impulso", "Avaliar se precisa mesmo", "Pedir emprestado", "Ignorar o preço"], answer: 1 },
          { question: "Gasto impulsivo é:", options: ["Planejado", "Compra sem pensar", "Sempre necessário", "Econômico"], answer: 1 },
        ]),
      },
      {
        title: "Meta: Economize R$ 50",
        description: "Desafio de poupar R$ 50 em uma semana.",
        type: "meta",
        xp_reward: 200,
        difficulty: "medio",
        icon: "Target",
        status: "available",
        questions: JSON.stringify([]),
      },
      {
        title: "Caça aos Gastos",
        description: "Classifique cada item como necessidade ou desejo!",
        type: "jogo",
        xp_reward: 250,
        difficulty: "dificil",
        icon: "Gamepad2",
        status: "available",
        questions: JSON.stringify([
          { description: "Tênis de marca R$ 350", isNecessity: false, emoji: "👟", explanation: "Roupas de marca são desejos, não necessidades" },
          { description: "Material escolar", isNecessity: true, emoji: "📚", explanation: "Essencial para os estudos" },
          { description: "Ingresso de cinema", isNecessity: false, emoji: "🎬", explanation: "Cinema é lazer, um desejo" },
          { description: "Conta de água", isNecessity: true, emoji: "💧", explanation: "Água é essencial para viver" },
          { description: "Hambúrguer gourmet", isNecessity: false, emoji: "🍔", explanation: "Comer fora é um desejo" },
          { description: "Remédio para dor", isNecessity: true, emoji: "💊", explanation: "Saúde é uma necessidade" },
          { description: "Assinatura Netflix", isNecessity: false, emoji: "📺", explanation: "Streaming é entretenimento" },
          { description: "Passagem de ônibus", isNecessity: true, emoji: "🚌", explanation: "Transporte para escola é necessário" },
          { description: "Console de videogame", isNecessity: false, emoji: "🎮", explanation: "Videogame é lazer" },
          { description: "Alimentação básica", isNecessity: true, emoji: "🍚", explanation: "Comida é essencial" },
        ]),
      },
      {
        title: "Verdadeiro ou Falso",
        description: "Responda rápido: a afirmação é verdade ou mentira?",
        type: "jogo",
        xp_reward: 300,
        difficulty: "medio",
        icon: "Gamepad2",
        status: "available",
        questions: JSON.stringify([
          { statement: "Poupar 10% da mesada é um bom hábito", isTrue: true, explanation: "Pequenas quantias fazem diferença!" },
          { statement: "Juros compostos aceleram o crescimento do dinheiro", isTrue: true, explanation: "Juros sobre juros = crescimento exponencial" },
          { statement: "Comprar parcelado no cartão sempre é mais barato", isTrue: false, explanation: "Pode haver juros no parcelamento" },
          { statement: "Necessidades vêm antes de desejos", isTrue: true, explanation: "Priorize o essencial" },
          { statement: "Gastar tudo que recebe é sinal de sucesso", isTrue: false, explanation: "Poupar é sinal de responsabilidade" },
          { statement: "Um orçamento ajuda a controlar gastos", isTrue: true, explanation: "Planejar é fundamental" },
          { statement: "Empréstimos nunca têm juros", isTrue: false, explanation: "Empréstimos sempre têm juros" },
          { statement: "Investir faz o dinheiro crescer", isTrue: true, explanation: "O dinheiro trabalha por você" },
        ]),
      },
    ]);
  }

  async function completeLesson(lesson) {
    await base44.entities.AcademyLesson.update(lesson.id, { is_completed: true });
    setLessons((prev) => prev.map((l) => (l.id === lesson.id ? { ...l, is_completed: true } : l)));
    setActiveLesson(null);
  }

  const completedCount = lessons.filter((l) => l.is_completed).length;
  const totalXP = lessons.filter((l) => l.is_completed).reduce((s, l) => s + l.xp_reward, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 font-heading flex items-center gap-2">
          <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">MaréBank Academy</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Aprenda finanças de forma divertida e ganhe XP!</p>
      </div>

      {/* XP Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-sky-500/20 blur-3xl"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Seu progresso</p>
                <p className="text-xl font-bold">Nível 3 · {totalXP} XP</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{completedCount}/{lessons.length}</p>
            <p className="text-xs text-slate-400">lições</p>
          </div>
        </div>
        <div className="mt-4 h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" style={{ width: `${lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0}%` }}></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setTab("lessons")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === "lessons" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
        >
          <BookOpen className="w-4 h-4" />
          Lições
        </button>
        <button
          onClick={() => setTab("challenges")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === "challenges" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
        >
          <Trophy className="w-4 h-4" />
          Desafios
        </button>
      </div>

      {/* Lessons */}
      {tab === "lessons" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((lesson, idx) => {
            const isLocked = idx > 0 && !lessons[idx - 1]?.is_completed;
            return (
              <div
                key={lesson.id}
                onClick={() => !isLocked && setActiveLesson(lesson)}
                className={`rounded-3xl p-6 border transition-all ${isLocked ? "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed" : "bg-white border-slate-100 shadow-sm hover:shadow-lg cursor-pointer hover:-translate-y-1"}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${lesson.is_completed ? "bg-emerald-50" : "bg-gradient-to-br from-sky-500 to-emerald-500"}`}>
                    {isLocked ? <Lock className="w-5 h-5 text-slate-400" /> : lesson.is_completed ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <BookOpen className="w-6 h-6 text-white" />}
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Zap className="w-3 h-3" />
                    {lesson.xp_reward}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mt-4">{lesson.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{lesson.description}</p>
                <div className="flex items-center gap-3 mt-4">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {lesson.duration_minutes} min
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-medium text-slate-500 capitalize">{lesson.level}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Challenges */}
      {tab === "challenges" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((ch) => {
            const iconMap = { Brain, Target, Gamepad2 };
            const Icon = iconMap[ch.icon] || Trophy;
            const diffColors = { facil: "bg-emerald-50 text-emerald-600", medio: "bg-amber-50 text-amber-600", dificil: "bg-rose-50 text-rose-600" };
            return (
              <div
                key={ch.id}
                onClick={() => setActiveChallenge(ch)}
                className="rounded-3xl p-6 bg-white border border-slate-100 shadow-sm hover:shadow-lg cursor-pointer hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${diffColors[ch.difficulty]}`}>
                    {ch.difficulty}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mt-4">{ch.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{ch.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Zap className="w-3 h-3" />
                    {ch.xp_reward} XP
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-sky-600">
                    Começar
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lesson Modal */}
      {activeLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setActiveLesson(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <button onClick={() => setActiveLesson(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{activeLesson.title}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs text-slate-400"><Clock className="w-3 h-3" />{activeLesson.duration_minutes} min</span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-500"><Zap className="w-3 h-3" />{activeLesson.xp_reward} XP</span>
              <span className="text-xs text-slate-400 capitalize">· {activeLesson.level}</span>
            </div>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">{activeLesson.content}</p>
            {!activeLesson.is_completed ? (
              <button onClick={() => completeLesson(activeLesson)} className="w-full mt-6 bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-sky-200 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Concluir lição (+{activeLesson.xp_reward} XP)
              </button>
            ) : (
              <div className="w-full mt-6 bg-emerald-50 text-emerald-600 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Lição concluída!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Challenge / Game Modal */}
      {activeChallenge && activeChallenge.type === "jogo" && (
        <GameModal challenge={activeChallenge} onClose={() => setActiveChallenge(null)} />
      )}
      {activeChallenge && activeChallenge.type !== "jogo" && (
        <ChallengeModal challenge={activeChallenge} onClose={() => setActiveChallenge(null)} />
      )}
    </div>
  );
}

function ChallengeModal({ challenge, onClose }) {
  const questions = challenge.questions ? JSON.parse(challenge.questions) : [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  function handleAnswer(idx) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[currentIdx].answer) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  const iconMap = { Brain, Target, Gamepad2 };
  const Icon = iconMap[challenge.icon] || Trophy;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl p-8 w-full max-w-lg">
        {questions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center mx-auto">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-4">{challenge.title}</h2>
            <p className="text-sm text-slate-400 mt-2">{challenge.description}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-amber-500 font-bold">
              <Zap className="w-4 h-4" />+{challenge.xp_reward} XP ao concluir
            </div>
            <button onClick={onClose} className="w-full mt-6 bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-sky-200">
              Entendido!
            </button>
          </div>
        ) : finished ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-4">Desafio concluído!</h2>
            <p className="text-3xl font-bold text-slate-900 mt-2">{score}/{questions.length}</p>
            <p className="text-sm text-slate-400 mt-1">Você acertou {score} de {questions.length} perguntas</p>
            <div className="mt-4 inline-flex items-center gap-1 text-amber-500 font-bold text-lg">
              <Zap className="w-5 h-5" />+{challenge.xp_reward} XP
            </div>
            <button onClick={onClose} className="w-full mt-6 bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-sky-200">
              Fechar
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-sky-600" />
                <span className="text-sm font-bold text-slate-800">{challenge.title}</span>
              </div>
              <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="flex gap-1.5 mb-6">
              {questions.map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= currentIdx ? "bg-sky-500" : "bg-slate-200"}`}></div>
              ))}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{questions[currentIdx].question}</h3>
            <div className="space-y-2 mt-4">
              {questions[currentIdx].options.map((opt, idx) => {
                const isCorrect = idx === questions[currentIdx].answer;
                const isSelected = selected === idx;
                let style = "border-slate-200 hover:border-sky-400 hover:bg-sky-50";
                if (selected !== null) {
                  if (isCorrect) style = "border-emerald-500 bg-emerald-50";
                  else if (isSelected) style = "border-rose-500 bg-rose-50";
                  else style = "border-slate-200 opacity-50";
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium text-slate-700 transition-all ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {selected !== null && (
              <button onClick={next} className="w-full mt-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-sky-200">
                {currentIdx + 1 < questions.length ? "Próxima pergunta" : "Ver resultado"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
