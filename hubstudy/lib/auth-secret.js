const getRandomString = () => {
  try {
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }
    if (globalThis.crypto?.getRandomValues) {
      const bytes = new Uint32Array(4);
      globalThis.crypto.getRandomValues(bytes);
      return Array.from(bytes).map((b) => b.toString(16)).join('');
    }
  } catch {
    // ignore and fallback below
  }
  return `hubstudy-${Math.random().toString(36).slice(2)}${Date.now()}`;
};

const generateFallbackSecret = () => {
  if (globalThis.__HUBSTUDY_AUTH_SECRET) {
    return globalThis.__HUBSTUDY_AUTH_SECRET;
  }
  const fallback = getRandomString();
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      'AUTH_SECRET não definido. Gerando segredo temporário apenas para esta instância. Defina AUTH_SECRET para garantir sessões persistentes.'
    );
  }
  globalThis.__HUBSTUDY_AUTH_SECRET = fallback;
  return fallback;
};

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (secret) {
    return secret;
  }
  return generateFallbackSecret();
}
