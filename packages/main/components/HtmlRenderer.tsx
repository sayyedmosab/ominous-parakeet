import React, { useMemo } from 'react';

interface HtmlRendererProps {
  html: string;
  basePath: string; // e.g. "/lessons/1.1/"
}

function rewriteRelativeUrls(html: string, basePath: string): string {
  try {
    // Remove all <script> tags for safety
    const withoutScripts = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');

    const parser = new DOMParser();
    const doc = parser.parseFromString(withoutScripts, 'text/html');

    const isExternal = (val: string) => /^(?:[a-z]+:)?\/\//i.test(val) || val.startsWith('data:');
    const toAbsolute = (val: string) => {
      try {
        const url = new URL(val, window.location.origin + (basePath.endsWith('/') ? basePath : basePath + '/'));
        return url.pathname + url.search + url.hash;
      } catch {
        return val;
      }
    };

    const elements: Element[] = Array.from(doc.querySelectorAll('[src], [href], source[srcset], img[srcset]'));
    elements.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      // src
      if (el.hasAttribute('src')) {
        const val = el.getAttribute('src') || '';
        if (val && !val.startsWith('/') && !isExternal(val)) {
          el.setAttribute('src', toAbsolute(val));
        }
      }
      // href (stylesheets/links)
      if (el.hasAttribute('href')) {
        const val = el.getAttribute('href') || '';
        if (val && !val.startsWith('#') && !val.startsWith('/') && !isExternal(val)) {
          el.setAttribute('href', toAbsolute(val));
        }
      }
      // srcset handling
      const srcsetAttr = el.getAttribute('srcset');
      if (srcsetAttr) {
        const parts = srcsetAttr.split(',').map(s => s.trim()).filter(Boolean).map(entry => {
          const [url, descriptor] = entry.split(/\s+/, 2);
          if (!url) return entry;
          if (url.startsWith('/') || isExternal(url)) return entry;
          const abs = toAbsolute(url);
          return descriptor ? `${abs} ${descriptor}` : abs;
        });
        el.setAttribute('srcset', parts.join(', '));
      }

      // Ensure <a> opens in new tab for safety
      if (tag === 'a') {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Inline style url(...) rewrites (basic)
    Array.from(doc.querySelectorAll<HTMLElement>('[style]')).forEach((el) => {
      const style = el.getAttribute('style') || '';
      const rewritten = style.replace(/url\(([^)]+)\)/g, (m, p1) => {
        const raw = String(p1).trim().replace(/^['"]|['"]$/g, '');
        if (raw.startsWith('/') || isExternal(raw)) return `url(${p1})`;
        const abs = toAbsolute(raw);
        return `url(${abs})`;
      });
      if (rewritten !== style) el.setAttribute('style', rewritten);
    });

    // Collect stylesheet links and inline styles from <head> and keep them
    const headFragments: string[] = [];
    const headNodes = doc.head ? Array.from(doc.head.querySelectorAll('link[rel="stylesheet"], style')) : [];
    headNodes.forEach((n) => {
      headFragments.push((n as HTMLElement).outerHTML);
    });

    const container = doc.body || doc;
    return `${headFragments.join('\n')}${container.innerHTML}`;
  } catch {
    return html;
  }
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ html, basePath }) => {
  const processed = useMemo(() => rewriteRelativeUrls(html, basePath), [html, basePath]);
  const fixCSS = `
    .html-prose table td p,
    .html-prose table td div,
    .html-prose table th p,
    .html-prose table th div,
    .html-prose table td .MsoNormal,
    .html-prose table th .MsoNormal {
      display: inline !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .html-prose table {
      border-collapse: collapse;
    }
    .html-prose table td,
    .html-prose table th {
      white-space: normal;
      vertical-align: middle;
    }
  `;
  return (
    <div className="html-prose prose max-w-none px-3" style={{ fontFamily: "Poppins, 'Noto Sans', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: fixCSS }} />
      <div dangerouslySetInnerHTML={{ __html: processed }} />
    </div>
  );
};

export default HtmlRenderer;
