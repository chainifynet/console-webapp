export const CACHE_KEY_PREFIX = "@@auth0spajs@@";

export const sessionStorageCache = {
  set: (key: string, entry: any) => {
    sessionStorage.setItem(key, JSON.stringify(entry));
  },

  get: (key: string) => {
    const json = window.sessionStorage.getItem(key);

    if (!json) return;

    try {
      // noinspection UnnecessaryLocalVariableJS
      const payload = JSON.parse(json);

      return payload;
    } catch (e) {
      // noinspection UnnecessaryReturnStatementJS
      return;
    }
  },

  remove: (key: string) => {
    sessionStorage.removeItem(key);
  },

  allKeys: () => Object.keys(window.sessionStorage).filter((key) => key.startsWith(CACHE_KEY_PREFIX)),
};
