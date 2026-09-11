import {
  loadTransactions,
  saveTransactions,
  loadCofres,
  saveCofres,
  loadLessons,
  saveLessons,
  loadChallenges,
  saveChallenges,
  loadCardSettings,
  getStoredUser,
  setStoredUser,
  setAuthToken,
  clearAuthSession,
} from '@/lib/local-data';

export const localClient = {
  auth: {
    me: async () => {
      const user = getStoredUser();
      if (!user) throw { status: 401, message: 'Unauthenticated' };
      return user;
    },
    logout: () => {
      clearAuthSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
    redirectToLogin: () => {
      if (typeof window !== 'undefined') window.location.href = '/login';
    },
    loginViaEmailPassword: async (email, password) => {
      if (!email || !password) throw new Error('Email and password are required');
      const user = { id: Date.now(), email, name: email.split('@')[0], role: 'user' };
      setStoredUser(user);
      setAuthToken('local-demo-token');
      return user;
    },
    loginWithProvider: () => {
      if (typeof window !== 'undefined') window.location.href = '/';
    },
    register: async ({ email, password }) => {
      if (!email || !password) throw new Error('Email and password are required');
      return { email };
    },
    verifyOtp: async () => ({ access_token: 'local-demo-token' }),
    resendOtp: async () => {},
    resetPasswordRequest: async () => {},
    resetPassword: async () => {},
    setToken: async (token) => setAuthToken(token),
  },
  entities: {
    Transaction: {
      list: async () => loadTransactions(),
      create: async (payload) => {
        const items = await loadTransactions();
        const record = { id: Date.now(), ...payload };
        const next = [record, ...items];
        await saveTransactions(next);
        return record;
      },
      delete: async (id) => {
        const items = await loadTransactions();
        await saveTransactions(items.filter((item) => item.id !== id));
        return true;
      },
      update: async (id, payload) => {
        const items = await loadTransactions();
        const next = items.map((item) => (item.id === id ? { ...item, ...payload } : item));
        await saveTransactions(next);
        return next.find((item) => item.id === id);
      },
    },
    Cofre: {
      list: async () => loadCofres(),
      create: async (payload) => {
        const items = await loadCofres();
        const record = { id: Date.now(), ...payload };
        const next = [record, ...items];
        await saveCofres(next);
        return record;
      },
      update: async (id, payload) => {
        const items = await loadCofres();
        const next = items.map((item) => (item.id === id ? { ...item, ...payload } : item));
        await saveCofres(next);
        return next.find((item) => item.id === id);
      },
      delete: async (id) => {
        const items = await loadCofres();
        await saveCofres(items.filter((item) => item.id !== id));
        return true;
      },
    },
    AcademyLesson: {
      list: async () => loadLessons(),
      bulkCreate: async (items) => {
        await saveLessons(items);
        return items;
      },
      update: async (id, payload) => {
        const items = await loadLessons();
        const next = items.map((item) => (item.id === id ? { ...item, ...payload } : item));
        await saveLessons(next);
        return next.find((item) => item.id === id);
      },
    },
    Challenge: {
      list: async () => loadChallenges(),
      bulkCreate: async (items) => {
        await saveChallenges(items);
        return items;
      },
    },
    CardSetting: {
      list: async () => [await loadCardSettings()],
    },
  },
};
