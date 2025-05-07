import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageCacheService {
  
  // Default cache expiration time (5 minutes)
  private defaultExpirationMs = 5 * 60 * 1000;
  
  constructor() { }

  /**
   * Set an item in localStorage with expiration
   * @param key The cache key
   * @param value The value to store
   * @param expirationMs Time in milliseconds until the item expires (default: 5 minutes)
   */
  set<T>(key: string, value: T, expirationMs: number = this.defaultExpirationMs): void {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now() + expirationMs
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Get an item from localStorage if it exists and hasn't expired
   * @param key The cache key
   * @returns The cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      
      if (!item) {
        return null;
      }
      
      const entry: CacheEntry<T> = JSON.parse(item);
      
      // Check if entry has expired
      if (Date.now() > entry.timestamp) {
        // Remove expired item
        this.remove(key);
        return null;
      }
      
      return entry.value;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage
   * @param key The cache key
   */
  remove(key: string): void {
    try {
      localStorage.setItem(key, '');
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Clear all cached items
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Remove all expired items from localStorage
   */
  cleanExpired(): void {
    try {
      // Get all keys in localStorage
      const keys = Object.keys(localStorage);
      
      // Check each key
      for (const key of keys) {
        // Try to parse the item
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const entry = JSON.parse(item);
            
            // If it has our expected format and has expired
            if (entry && entry.timestamp && Date.now() > entry.timestamp) {
              this.remove(key);
            }
          }
        } catch {
          // If it's not JSON or doesn't match our format, ignore it
          continue;
        }
      }
    } catch (error) {
      console.error('Error cleaning expired items:', error);
    }
  }
}