import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { categoryConfig, formatCurrency, formatDate, categoryColors } from "@/lib/finance";
import CategoryBadge from "@/components/CategoryBadge";
import SpendingChart from "@/components/SpendingChart";
import AlertBanner from "@/components/AlertBanner";
import { TrendingUp, TrendingDown, Plus, ArrowUpRight, Target, Zap, Wallet } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [cofres, setCofres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [txs, savedCofres] = await Promise.all([
          base44.entities.Transaction.list("-date", 50),
          base44.entities.Cofre.list("-updated_date", 10),
        ]);
        setTransactions(txs);
        setCofres(savedCofres);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;
  const monthlyLimit = 500;
  const spentPercent = monthlyLimit > 0 ? Math.min((expenses / monthlyLimit) * 100, 100) : 0;

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const recentTransactions = transactions.slice(0, 5);
  const activeCofres = cofres.filter((c) => c.status === "active").slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">Bem-vindo de volta 👋</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 font-heading">Seu resumo financeiro</h1>
        </div>
        <button
          onClick={() => navigate("/transacoes")}
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-sky-200 hover:shadow-xl hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nova transação
        </button>
      </div>

      {/* Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-sky-500/20 blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-emerald-500/20 blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300 font-medium">Saldo Atual</span>
              <Wallet className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-3xl font-bold mt-2">{formatCurrency(balance)}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="flex-1">
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  Entradas
                </div>
                <p className="text-sm font-semibold mt-0.5">{formatCurrency(income)}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 text-rose-400 text-xs font-medium">
                  <TrendingDown className="w-3 h-3" />
                  Saídas
                </div>
                <p className="text-sm font-semibold mt-0.5">{formatCurrency(expenses)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Limit */}
        <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">Limite de Gastos</span>
            <span className="text-xs font-semibold text-slate-400">Mensal</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {formatCurrency(expenses)} <span className="text-sm font-normal text-slate-400">/ {formatCurrency(monthlyLimit)}</span>
          </p>
          <div className="mt-3 h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${spentPercent > 80 ? "bg-gradient-to-r from-rose-500 to-red-500" : "bg-gradient-to-r from-sky-500 to-emerald-500"}`}
              style={{ width: `${spentPercent}%` }}
            ></div>
          </div>
          <p className={`text-xs font-medium mt-2 ${spentPercent > 80 ? "text-rose-500" : "text-slate-400"}`}>
            {spentPercent > 80 ? "⚠ Você atingiu " + Math.round(spentPercent) + "% do seu limite!" : Math.round(spentPercent) + "% usado este mês"}
          </p>
        </div>

        {/* XP / Level */}
        <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-500 p-6 text-white relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-20">
            <Zap className="w-16 h-16" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">MaréBank Academy</span>
            </div>
            <p className="text-2xl font-bold mt-2">Nível 3</p>
            <p className="text-sm text-white/80 mt-1">350 XP acumulados</p>
            <button
              onClick={() => navigate("/academy")}
              className="mt-4 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            >
              Continuar aprendendo
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {spentPercent > 80 && <AlertBanner type="warning" message="Você está quase no limite de gastos mensal. Que tal revisar suas despesas?" />}

      {/* Charts + Cofres */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Gastos por categoria</h2>
              <p className="text-sm text-slate-400">Distribuição dos seus gastos</p>
            </div>
          </div>
          {Object.keys(expensesByCategory).length > 0 ? (
            <SpendingChart data={expensesByCategory} />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Wallet className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">Nenhum gasto registrado ainda</p>
            </div>
          )}
        </div>

        {/* Cofres */}
        <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 text-lg">Meus Cofres</h2>
            <button onClick={() => navigate("/cofres")} className="text-sky-600 text-xs font-semibold hover:underline">Ver todos</button>
          </div>
          {activeCofres.length > 0 ? (
            <div className="space-y-4">
              {activeCofres.map((cofre) => {
                const percent = cofre.goal_amount > 0 ? Math.min((cofre.current_amount / cofre.goal_amount) * 100, 100) : 0;
                return (
                  <div key={cofre.id} className="p-4 rounded-2xl bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{cofre.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500">{Math.round(percent)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500" style={{ width: `${percent}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      {formatCurrency(cofre.current_amount)} de {formatCurrency(cofre.goal_amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Target className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">Crie sua primeira meta!</p>
              <button onClick={() => navigate("/cofres")} className="mt-3 text-sky-600 text-xs font-semibold">Criar cofre</button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 text-lg">Transações recentes</h2>
          <button onClick={() => navigate("/transacoes")} className="text-sky-600 text-xs font-semibold hover:underline">Ver todas</button>
        </div>
        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {recentTransactions.map((tx) => {
              const cfg = categoryConfig[tx.category] || categoryConfig.outros;
              return (
                <div key={tx.id} className="flex items-center gap-4 py-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${cfg.light}`}>
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <CategoryBadge config={cfg} />
                      <span className="text-xs text-slate-400">{formatDate(tx.date)}</span>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tx.type === "income" ? "text-emerald-600" : "text-slate-800"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400">
            <p className="text-sm">Nenhuma transação ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
