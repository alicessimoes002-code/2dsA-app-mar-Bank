
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { formatCurrency, formatDate } from "@/lib/finance";
import { Plus, Target, Trash2, TrendingUp, Gift, Calendar, Sparkles, X } from "lucide-react";

const cofreColors = [
  { name: "blue", gradient: "from-sky-400 to-blue-500", bg: "bg-sky-50" },
  { name: "green", gradient: "from-emerald-400 to-teal-500", bg: "bg-emerald-50" },
  { name: "purple", gradient: "from-purple-400 to-violet-500", bg: "bg-purple-50" },
  { name: "pink", gradient: "from-pink-400 to-rose-500", bg: "bg-pink-50" },
  { name: "orange", gradient: "from-orange-400 to-amber-500", bg: "bg-orange-50" },
];

export default function Cofres() {
  const [cofres, setCofres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [depositCofre, setDepositCofre] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [form, setForm] = useState({ name: "", goal_amount: "", target_date: "", color: "blue" });

  useEffect(() => {
    loadCofres();
  }, []);

  async function loadCofres() {
    try {
      const data = await base44.entities.Cofre.list("-updated_date", 50);
      setCofres(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    await base44.entities.Cofre.create({
      name: form.name,
      goal_amount: parseFloat(form.goal_amount),
      current_amount: 0,
      color: form.color,
      target_date: form.target_date || null,
      status: "active",
    });
    setForm({ name: "", goal_amount: "", target_date: "", color: "blue" });
    setShowForm(false);
    loadCofres();
  }

  async function handleDeposit(e) {
    e.preventDefault();
    const cofre = depositCofre;
    const newAmount = cofre.current_amount + parseFloat(depositAmount);
    await base44.entities.Cofre.update(cofre.id, {
      current_amount: newAmount,
      status: newAmount >= cofre.goal_amount ? "completed" : "active",
    });
    setDepositCofre(null);
    setDepositAmount("");
    loadCofres();
  }

  async function handleDelete(id) {
    await base44.entities.Cofre.delete(id);
    setCofres((prev) => prev.filter((c) => c.id !== id));
  }

  const totalSaved = cofres.reduce((s, c) => s + c.current_amount, 0);
  const totalGoal = cofres.reduce((s, c) => s + c.goal_amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 font-heading">Cofres</h1>
          <p className="text-sm text-slate-400 mt-1">Crie metas e poupe para realizar seus sonhos</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-sky-200 hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          Novo cofre
        </button>
      </div>

      {/* Summary */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
              <Gift className="w-4 h-4" /> Total poupado
            </div>
            <p className="text-3xl font-bold mt-2">{formatCurrency(totalSaved)}</p>
            <p className="text-sm text-slate-400 mt-1">de {formatCurrency(totalGoal)} em metas</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{totalGoal > 0 ? Math.round((totalSaved / totalGoal) * 100) : 0}%</p>
            <p className="text-xs text-slate-400">do total</p>
          </div>
        </div>
        <div className="mt-4 h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" style={{ width: `${totalGoal > 0 ? (totalSaved / totalGoal) * 100 : 0}%` }}></div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500" /> Criar novo cofre
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500">Nome da meta</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Nintendo Switch"
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Valor da meta (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.goal_amount}
                onChange={(e) => setForm({ ...form, goal_amount: e.target.value })}
                placeholder="0,00"
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Data alvo (opcional)</label>
              <input
                type="date"
                value={form.target_date}
                onChange={(e) => setForm({ ...form, target_date: e.target.value })}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Cor do cofre</label>
              <div className="mt-1 flex gap-2">
                {cofreColors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setForm({ ...form, color: c.name })}
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.gradient} ${form.color === c.name ? "ring-2 ring-offset-2 ring-slate-400" : ""}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-sky-200">
              Criar cofre
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-slate-100 text-slate-500 py-2.5 rounded-xl text-sm font-medium">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Cofres Grid */}
      {cofres.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cofres.map((cofre) => {
            const colorCfg = cofreColors.find((c) => c.name === cofre.color) || cofreColors[0];
            const percent = cofre.goal_amount > 0 ? Math.min((cofre.current_amount / cofre.goal_amount) * 100, 100) : 0;
            const isComplete = cofre.status === "completed";
            return (
              <div key={cofre.id} className="group relative rounded-3xl bg-white p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorCfg.gradient} flex items-center justify-center shadow-lg`}>
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{cofre.name}</h3>
                      {cofre.target_date && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(cofre.target_date)}
                        </p>
                      )}
                    </div>
                  </div>
                  {isComplete && <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">✓ Concluído</span>}
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-800">{formatCurrency(cofre.current_amount)}</span>
                    <span className="text-xs text-slate-400">de {formatCurrency(cofre.goal_amount)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${colorCfg.gradient} transition-all duration-700`} style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-bold text-slate-500">{Math.round(percent)}%</span>
                    <span className="text-xs text-slate-400">
                      Faltam {formatCurrency(Math.max(cofre.goal_amount - cofre.current_amount, 0))}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setDepositCofre(cofre)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Depositar
                  </button>
                  <button onClick={() => handleDelete(cofre.id)} className="px-4 bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <Target className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-sm font-medium">Você ainda não tem cofres</p>
          <p className="text-xs mt-1">Crie sua primeira meta de economia!</p>
        </div>
      )}

      {/* Deposit Modal */}
      {depositCofre && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDepositCofre(null)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleDeposit}
            className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Depositar no cofre</h3>
              <button type="button" onClick={() => setDepositCofre(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div>
              <p className="text-sm text-slate-400">Cofre: <span className="font-semibold text-slate-700">{depositCofre.name}</span></p>
              <p className="text-sm text-slate-400">Atual: <span className="font-semibold text-slate-700">{formatCurrency(depositCofre.current_amount)}</span></p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Quanto depositar? (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0,00"
                className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-lg font-bold text-center"
                autoFocus
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-sky-200">
              Confirmar depósito
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
