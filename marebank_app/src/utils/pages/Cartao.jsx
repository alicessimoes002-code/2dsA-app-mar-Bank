import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { formatCurrency, formatDate } from "@/lib/finance";
import AlertBanner from "@/components/AlertBanner";
import { CreditCard, Eye, EyeOff, Shield, TrendingDown, Wallet, Lock, Bell } from "lucide-react";

export default function Cartao() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [limit, setLimit] = useState(500);
  const [cardSettings, setCardSettings] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [data, settings] = await Promise.all([
          base44.entities.Transaction.list("-date", 50),
          base44.entities.CardSetting.list("-updated_date", 1),
        ]);
        setTransactions(data);
        if (settings.length > 0) {
          setCardSettings(settings[0]);
          setLimit(settings[0].monthly_limit || 500);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const cardExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const remaining = limit - cardExpenses;
  const usagePercent = limit > 0 ? Math.min((cardExpenses / limit) * 100, 100) : 0;
  const alertThreshold = cardSettings?.alert_threshold || 80;

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
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 font-heading">Cartão Mesada</h1>
        <p className="text-sm text-slate-400 mt-1">Controle seus gastos com limite gerenciado pelos responsáveis</p>
      </div>

      {/* Card */}
      <div className="max-w-md">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-sky-900 to-emerald-900 p-6 text-white shadow-2xl shadow-sky-900/20 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-sky-500/20 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl"></div>

          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-300 font-medium">MaréBank</p>
                <p className="text-lg font-bold mt-0.5">Cartão Mesada</p>
              </div>
              <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500"></div>
            </div>

            <div className="mt-8">
              <div className="w-10 h-8 rounded bg-yellow-400/30 border border-yellow-300/40 flex items-center justify-center">
                <div className="w-6 h-5 rounded-sm border border-yellow-300/60"></div>
              </div>
            </div>

            <p className="mt-4 text-lg font-mono tracking-widest">•••• •••• •••• 2026</p>

            <div className="flex items-end justify-between mt-6">
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Titular</p>
                <p className="text-sm font-semibold mt-0.5">JOVEM APRENDIZ</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Validade</p>
                <p className="text-sm font-semibold mt-0.5">07/29</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Limite disponível</p>
          <p className="text-2xl font-bold text-slate-900">
            {showBalance ? formatCurrency(remaining) : "••••"}
          </p>
        </div>
        <button onClick={() => setShowBalance(!showBalance)} className="p-3 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
          {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Usage */}
      <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Uso do mês</p>
              <p className="text-xs text-slate-400">{formatCurrency(cardExpenses)} de {formatCurrency(limit)}</p>
            </div>
          </div>
          <span className={`text-lg font-bold ${usagePercent > 80 ? "text-rose-500" : "text-slate-800"}`}>{Math.round(usagePercent)}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${usagePercent > 80 ? "bg-gradient-to-r from-rose-500 to-red-500" : "bg-gradient-to-r from-sky-500 to-emerald-500"}`}
            style={{ width: `${usagePercent}%` }}
          ></div>
        </div>
      </div>

      {/* Alerts */}
      {usagePercent > alertThreshold && (
        <AlertBanner type="warning" message={`Você já usou mais de ${alertThreshold}% do seu limite de mesada. Cuidado para não estourar o orçamento!`} />
      )}
      {usagePercent > 95 && (
        <AlertBanner type="error" message="Limite quase esgotado! Avise seu responsável para ajustar a mesada se necessário." />
      )}

      {/* Parental Control */}
      <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-slate-900 text-lg">Controle dos responsáveis</h2>
        </div>

        <div className="space-y-4">
          {/* Limit - locked, managed by parent */}
          <div className="p-4 rounded-2xl bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Limite mensal</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(limit)}</span>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-3 flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Definido por <span className="font-semibold text-slate-700">{cardSettings?.parent_name || "seu responsável"}</span>. Apenas o responsável pode alterar o limite pelo aplicativo dele.
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <Bell className="w-3 h-3" />
              O responsável é notificado quando o jovem atinge {alertThreshold}% do limite
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50">
              <div className="flex items-center gap-2 text-emerald-600">
                <Wallet className="w-4 h-4" />
                <span className="text-xs font-medium">Disponível</span>
              </div>
              <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(remaining)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50">
              <div className="flex items-center gap-2 text-rose-600">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-medium">Gasto</span>
              </div>
              <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(cardExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent card transactions */}
      <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
        <h2 className="font-bold text-slate-900 text-lg mb-4">Últimos gastos no cartão</h2>
        {transactions.filter((t) => t.type === "expense").length > 0 ? (
          <div className="divide-y divide-slate-50">
            {transactions.filter((t) => t.type === "expense").slice(0, 6).map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 py-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{tx.description}</p>
                  <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                </div>
                <span className="text-sm font-bold text-slate-800">{formatCurrency(tx.amount)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400">
            <CreditCard className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">Nenhum gasto no cartão ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
