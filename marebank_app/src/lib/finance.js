export const categoryConfig = {
  alimentacao: { label: "Alimentação", icon: "UtensilsCrossed", color: "bg-orange-500", light: "bg-orange-50 text-orange-600" },
  transporte: { label: "Transporte", icon: "Bus", color: "bg-blue-500", light: "bg-blue-50 text-blue-600" },
  lazer: { label: "Lazer", icon: "Gamepad2", color: "bg-purple-500", light: "bg-purple-50 text-purple-600" },
  educacao: { label: "Educação", icon: "GraduationCap", color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-600" },
  saude: { label: "Saúde", icon: "HeartPulse", color: "bg-rose-500", light: "bg-rose-50 text-rose-600" },
  compras: { label: "Compras", icon: "ShoppingBag", color: "bg-pink-500", light: "bg-pink-50 text-pink-600" },
  tecnologia: { label: "Tecnologia", icon: "Smartphone", color: "bg-cyan-500", light: "bg-cyan-50 text-cyan-600" },
  outros: { label: "Outros", icon: "Wallet", color: "bg-slate-500", light: "bg-slate-50 text-slate-600" },
};

export const categoryKeywords = {
  alimentacao: ["ifood", "lanche", "almoco", "janta", "cafe", "pizza", "hamburguer", "restaurante", "mercadinho", "padaria", "acai", "doces", "comida", "refeicao", "lanchonete", "snack", "food"],
  transporte: ["uber", "99", "onibus", "metro", "taxi", "combustivel", "gasolina", "estacionamento", "pedagio", "bilhete unico", "passagem"],
  lazer: ["cinema", "netflix", "jogo", "balada", "festa", "show", "ingresso", "parque", "bowling", "streaming", "spotify", "discord"],
  educacao: ["livro", "curso", "escola", "faculdade", "material", "apostila", "udemy", "alura", "coursera"],
  saude: ["farmacia", "remedio", "medico", "dentista", "academia", "suplemento", "vitamina"],
  compras: ["amazon", "mercado livre", "shopee", "shein", "roupa", "tenis", "sapato", "magalu", "loja", "shopping"],
  tecnologia: ["app", "assinatura", "google play", "apple", "iphone", "celular", "fone", "notebook", "software"],
  outros: [],
};

export function categorizeTransaction(description) {
  const desc = description.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((kw) => desc.includes(kw))) {
      return category;
    }
  }
  return "outros";
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

export const categoryColors = {
  alimentacao: "#f97316",
  transporte: "#3b82f6",
  lazer: "#a855f7",
  educacao: "#10b981",
  saude: "#f43f5e",
  compras: "#ec4899",
  tecnologia: "#06b6d4",
  outros: "#64748b",
};
