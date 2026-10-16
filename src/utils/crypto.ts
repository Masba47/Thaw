/**
 * Cryptographic utility functions for Thaw
 * Computes authentic SHA-256 digests in-browser using Web Cryptography API
 */

export async function computeSHA256(data: File | ArrayBuffer | string): Promise<string> {
  let buffer: ArrayBuffer;
  if (typeof data === 'string') {
    buffer = new TextEncoder().encode(data).buffer;
  } else if (data instanceof File) {
    buffer = await data.arrayBuffer();
  } else {
    buffer = data;
  }

  const digestBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(digestBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a realistic Avalanche transaction hash (0x + 64 hex chars)
 */
export function generateAvalancheTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Generate a simulated Avalanche address
 */
export function generateAvalancheAddress(prefix = '0x'): string {
  const chars = '0123456789abcdef';
  let addr = prefix;
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
}

/**
 * Format hash for compact display
 */
export function truncateHash(hash: string, start = 8, end = 6): string {
  if (!hash) return '';
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

/**
 * Format bytes to readable string (KB, MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format date nicely with language support
 */
export function formatDate(isoString: string, lang: 'es' | 'en' = 'es'): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(lang === 'es' ? 'es-CL' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

/**
 * Format deadline with relative days notice and language support
 */
export function getDeadlineInfo(
  deadlineIso: string, 
  lang: 'es' | 'en' = 'es'
): { label: string; isOverdue: boolean; daysRemaining: number } {
  try {
    const now = new Date();
    const target = new Date(deadlineIso);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const days = Math.abs(diffDays);
      return {
        label: lang === 'es' 
          ? `Vencido por ${days} día${days === 1 ? '' : 's'}`
          : `Overdue by ${days} day${days === 1 ? '' : 's'}`,
        isOverdue: true,
        daysRemaining: diffDays,
      };
    } else if (diffDays === 0) {
      return { 
        label: lang === 'es' ? 'Vence hoy' : 'Due today', 
        isOverdue: false, 
        daysRemaining: 0 
      };
    } else {
      return {
        label: lang === 'es'
          ? `${diffDays} día${diffDays === 1 ? '' : 's'} restante${diffDays === 1 ? '' : 's'}`
          : `${diffDays} day${diffDays === 1 ? '' : 's'} remaining`,
        isOverdue: false,
        daysRemaining: diffDays,
      };
    }
  } catch {
    return { label: deadlineIso, isOverdue: false, daysRemaining: 0 };
  }
}
