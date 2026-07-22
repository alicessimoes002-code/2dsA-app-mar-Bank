import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { categoryConfig, categorizeTransaction, formatCurrency, formatDate } from "@/lib/finance";
import CategoryBadge from "@/components/CategoryBadge";
import { Plus, Search, Wallet, Trash2, TrendingUp, TrendingDown, Sparkles } from "lucide-react";

export default function Transacoes() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [form, setForm] = useState({ description: "", amount: "", type: "expense", category: "", date: new Date().toISOString().split("T")[0] });

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const data = await base44.entities.Transaction.list("-date", 100);
      setTransactions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleDescriptionChange(e) {
    const desc = e.target.value;
    setForm((f) => ({ ...f, description: desc, category: desc.length > 3 ? categorizeTransaction(desc) : f.category }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const category = form.category || categorizeTransaction(form.description);
    await base44.entities.Transaction.create({
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      category,
      date: form.date,
    });
    setForm({ description: "", amount: "", type: "expense", category: "", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
    loadTransactions();
  }

  async function handleDelete(id) {
    await base44.entities.Transaction.delete(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = t.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory === "all" || t.category === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [transactions, search, filterCategory]);

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

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
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 font-heading">Transações</h1>
          <p className="text-sm text-slate-400 mt-1">Acompanhe seus gastos com categorização automática</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-sky-200 hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          Nova
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white p-4 border border-slate-100">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> Entradas
          </div>
          <p className="text-lg lg:text-xl font-bold text-slate-900 mt-1">{formatCurrency(income)}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-100">
          <div className="flex items-center gap-2 text-rose-600 text-xs font-medium">
            <TrendingDown className="w-3.5 h-3.5" /> Saídas
          </div>
          <p className="text-lg lg:text-xl font-bold text-slate-900 mt-1">{formatCurrency(expenses)}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Wallet className="w-3.5 h-3.5" /> Saldo
          </div>
          <p className="text-lg lg:text-xl font-bold text-slate-900 mt-1">{formatCurrency(income - expenses)}</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sky-600">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">A categoria é detectada automaticamente pela descrição!</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500">Descrição</label>
              <input
                type="text"
                required
                value={form.description}
                onChange={handleDescriptionChange}
                placeholder="Ex: Lanche no McDonald's"
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0,00"
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Tipo</label>
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "expense" })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${form.type === "expense" ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  Gasto
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "income" })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${form.type === "income" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  Entrada
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Data</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
              />
            </div>
          </div>
          {form.category && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Categoria detectada:</span>
              <CategoryBadge config={categoryConfig[form.category]} />
            </div>
          )}
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-sky-200">
              Salvar transação
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-slate-100 text-slate-500 py-2.5 rounded-xl text-sm font-medium">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar transação..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-none text-sm font-medium text-slate-600"
        >
          <option value="all">Todas as categorias</option>
          {Object.entries(categoryConfig).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {filtered.map((tx) => {
              const cfg = categoryConfig[tx.category] || categoryConfig.outros;
              return (
                <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${cfg.light}`}>
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CategoryBadge config={cfg} />
                      <span className="text-xs text-slate-400">{formatDate(tx.date)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${tx.type === "income" ? "text-emerald-600" : "text-slate-800"}`}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(tx.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <Wallet className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">Nenhuma transação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
