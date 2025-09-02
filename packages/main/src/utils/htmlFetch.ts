function normalizeWeirdChars(s: string): string {
  // Fix common mis-decoded sequences
  // 1) EF BF BD (UTF-8 for U+FFFD) decoded as Latin-1 => "ï¿½"
  s = s.replace(/\u00EF\u00BF\u00BD/g, '"');
  // 2) Actual U+FFFD inside the stream – map to better guesses
  // between alphanumerics -> apostrophe
  s = s.replace(/([\p{L}\p{N}])\uFFFD([\p{L}\p{N}])/gu, '$1’$2');
  // standalone -> double quote
  s = s.replace(/\uFFFD/g, '"');
  return s;
}

export async function fetchHtmlWithEncoding(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const buffer = await res.arrayBuffer();

    const readHead = (enc: string) => new TextDecoder(enc as any, { fatal: false }).decode(buffer.slice(0, Math.min(4096, buffer.byteLength)));
    const headLatin1 = readHead('iso-8859-1');

    const findCharset = (s: string): string | null => {
      const m1 = s.match(/<meta[^>]*charset=["']?([^\s"'>]+)/i);
      if (m1 && m1[1]) return m1[1].toLowerCase();
      const m2 = s.match(/<meta[^>]*http-equiv=["']content-type["'][^>]*content=["'][^"']*charset=([^"'>\s]+)/i);
      if (m2 && m2[1]) return m2[1].toLowerCase();
      return null;
    };

    let enc = findCharset(headLatin1);
    if (enc) {
      if (enc === 'utf8') enc = 'utf-8';
      if (enc === 'latin1') enc = 'iso-8859-1';
    }

    const decode = (encoding: string) => new TextDecoder(encoding as any, { fatal: false }).decode(buffer);

    if (enc) {
      try {
        return normalizeWeirdChars(decode(enc));
      } catch {
        // fall through to heuristic
      }
    }

    const utf8 = decode('utf-8');
    const hasReplacement = /\uFFFD/.test(utf8);
    const hasCp1252Artifacts = /Ã.|â€™|â€œ|â€\x9d|â€”|â€“/.test(utf8);

    if (hasReplacement || hasCp1252Artifacts) {
      try {
        const cp1252 = decode('windows-1252');
        const countFFFD = (s: string) => (s.match(/\uFFFD/g) || []).length;
        const cp1252Norm = normalizeWeirdChars(cp1252);
        const utf8Norm = normalizeWeirdChars(utf8);
        if (countFFFD(cp1252Norm) < countFFFD(utf8Norm)) return cp1252Norm;
        // Try windows-1256 (Arabic locales) as a last resort
        try {
          const cp1256 = normalizeWeirdChars(decode('windows-1256'));
          if (countFFFD(cp1256) < countFFFD(utf8Norm)) return cp1256;
        } catch {}
        return utf8Norm;
      } catch {
        return normalizeWeirdChars(utf8);
      }
    }

    return normalizeWeirdChars(utf8);
  } catch {
    return null;
  }
}
