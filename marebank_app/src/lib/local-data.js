const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

const readJSON = (key, fallback) => {
  const storage = getStorage();
  if (!storage) return fallback;

  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Could not read local storage key ${key}:`, error);
    return fallback;
  }
};

const writeJSON = (key, value) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(key, JSON.stringify(value));
};

export const localStorageKeys = {
  transactions: 'marebank_transactions',
  cofres: 'marebank_cofres',
  lessons: 'marebank_lessons',
  challenges: 'marebank_challenges',
  cardSettings: 'marebank_card_settings',
  authUser: 'marebank_auth_user',
  authToken: 'marebank_auth_token',
};

export const defaultTransactions = [
  { id: 1, description: 'Salário', amount: 3200, type: 'income', category: 'salario', date: '2026-09-01' },
  { id: 2, description: 'Mercado', amount: 420, type: 'expense', category: 'alimentacao', date: '2026-09-03' },
  { id: 3, description: 'Cinema', amount: 90, type: 'expense', category: 'lazer', date: '2026-09-04' },
  { id: 4, description: 'Freelance', amount: 650, type: 'income', category: 'freelance', date: '2026-09-08' },
  { id: 5, description: 'Transporte', amount: 120, type: 'expense', category: 'transporte', date: '2026-09-09' },
];

export const defaultCofres = [
  { id: 1, name: 'Viagem', goal_amount: 2000, current_amount: 800, color: 'blue', target_date: '2026-12-15', status: 'active' },
  { id: 2, name: 'Notebook', goal_amount: 3500, current_amount: 1500, color: 'green', target_date: '2026-10-30', status: 'active' },
];

export const defaultLessons = [
  { id: 1, title: 'O que é dinheiro?', description: 'Aprenda os conceitos básicos sobre dinheiro e sua função.', content: 'O dinheiro é um meio de troca...', category: 'basico', level: 'iniciante', duration_minutes: 5, xp_reward: 50, icon: 'BookOpen', order: 1, is_completed: true },
  { id: 2, title: 'Diferença entre needs e wants', description: 'Necessidades vs. desejos: como priorizar seus gastos.', content: 'Necessidades e desejos...', category: 'consumo_consciente', level: 'iniciante', duration_minutes: 7, xp_reward: 60, icon: 'BookOpen', order: 2, is_completed: false },
  { id: 3, title: 'Como criar um orçamento', description: 'Aprenda a planejar seus gastos mensais.', content: 'Um orçamento...', category: 'planejamento', level: 'intermediario', duration_minutes: 10, xp_reward: 80, icon: 'BookOpen', order: 3, is_completed: false },
];

export const defaultChallenges = [
  {
    id: 1,
    title: 'Quiz: Básico de Dinheiro',
    description: 'Teste seus conhecimentos sobre o básico de dinheiro.',
    type: 'quiz',
    xp_reward: 100,
    difficulty: 'facil',
    icon: 'Brain',
    status: 'available',
    questions: JSON.stringify([
      { question: 'O que é uma necessidade?', options: ['Um videogame', 'Comida e moradia', 'Roupas de marca', 'Doces'], answer: 1 },
      { question: 'Qual é a regra 50-30-20?', options: ['50% desejos, 30% necessidades, 20% poupar', '50% necessidades, 30% desejos, 20% poupar', '50% poupar, 30% desejos, 20% necessidades', '50% necessidades, 30% poupar, 20% desejos'], answer: 1 },
    ]),
  },
];

export const loadTransactions = async () => {
  return readJSON(localStorageKeys.transactions, defaultTransactions);
};

export const saveTransactions = async (transactions) => {
  writeJSON(localStorageKeys.transactions, transactions);
  return transactions;
};

export const loadCofres = async () => {
  return readJSON(localStorageKeys.cofres, defaultCofres);
};

export const saveCofres = async (cofres) => {
  writeJSON(localStorageKeys.cofres, cofres);
  return cofres;
};

export const loadLessons = async () => {
  return readJSON(localStorageKeys.lessons, defaultLessons);
};

export const saveLessons = async (lessons) => {
  writeJSON(localStorageKeys.lessons, lessons);
  return lessons;
};

export const loadChallenges = async () => {
  return readJSON(localStorageKeys.challenges, defaultChallenges);
};

export const saveChallenges = async (challenges) => {
  writeJSON(localStorageKeys.challenges, challenges);
  return challenges;
};

export const loadCardSettings = async () => {
  return readJSON(localStorageKeys.cardSettings, { monthly_limit: 500, alert_threshold: 80, parent_name: 'Responsável' });
};

export const saveCardSettings = async (settings) => {
  writeJSON(localStorageKeys.cardSettings, settings);
  return settings;
};

export const getStoredUser = () => {
  const user = readJSON(localStorageKeys.authUser, null);
  return user;
};

export const setStoredUser = (user) => {
  writeJSON(localStorageKeys.authUser, user);
};

export const getAuthToken = () => {
  const storage = getStorage();
  return storage ? storage.getItem(localStorageKeys.authToken) : null;
};

export const setAuthToken = (token) => {
  const storage = getStorage();
  if (!storage) return;
  if (token) {
    storage.setItem(localStorageKeys.authToken, token);
  } else {
    storage.removeItem(localStorageKeys.authToken);
  }
};

export const clearAuthSession = () => {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(localStorageKeys.authToken);
  storage.removeItem(localStorageKeys.authUser);
};
