// Simple in-memory cache with TTL (in milliseconds)
// Usage:
//  const cache = new TTLCache();
//  cache.set(key, value, 15 * 60 * 1000);
//  const value = cache.get(key);
//  cache.has(key) -> boolean
//  cache.delete(key)
//  cache.clear()

export class TTLCache {
  constructor({sweepIntervalMs = 60_000} = {}) {
    this.store = new Map();
    this.sweeper = setInterval(() => this.#sweep(), sweepIntervalMs);
    this.sweeper.unref?.();
  }

  set(key, value, ttlMs) {
    const expiresAt = Date.now() + (ttlMs || 0);
    this.store.set(key, { value, expiresAt });
  }

  get(key) {
    const rec = this.store.get(key);
    if (!rec) return undefined;
    if (rec.expiresAt && rec.expiresAt < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return rec.value;
  }

  has(key) {
    const rec = this.store.get(key);
    if (!rec) return false;
    if (rec.expiresAt && rec.expiresAt < Date.now()) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  #sweep() {
    const now = Date.now();
    for (const [k, rec] of this.store.entries()) {
      if (rec.expiresAt && rec.expiresAt < now) this.store.delete(k);
    }
  }
}

// A shared cache instance for app-wide use
export const sharedCache = new TTLCache();
