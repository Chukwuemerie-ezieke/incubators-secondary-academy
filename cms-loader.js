/**
 * INCUSA CMS Loader — Shared CSV parser & fetch utility
 * Uses the same parseCSV pattern from discipleship.html
 * Developed by INCUSA ICT Department
 */

// ─── CSV Parser (same as discipleship.html) ───────────────────
function parseCSV(text) {
  const rows = [];
  let current = '', inQuote = false, row = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuote && text[i+1] === '"') { current += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      row.push(current.trim()); current = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuote) {
      if (ch === '\r' && text[i+1] === '\n') i++;
      row.push(current.trim()); rows.push(row); row = []; current = '';
    } else {
      current += ch;
    }
  }
  if (current || row.length) { row.push(current.trim()); rows.push(row); }
  return rows;
}

// ─── HTML Escaper ──────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Fetch CSV from Google Sheets and parse to objects ────────
async function fetchSheetData(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Fetch failed: ' + resp.status);
  const text = await resp.text();
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim());
  return rows.slice(1)
    .filter(r => r.length >= headers.length && r.some(cell => cell.trim()))
    .map(r => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (r[i] || '').trim(); });
      return obj;
    });
}

// ─── Google Drive URL converter ───────────────────────────────
function driveToDirectUrl(url) {
  if (!url) return '';
  // Handle /file/d/ID/view format
  const match = url.match(/\/file\/d\/([^\/]+)/);
  if (match) return 'https://drive.google.com/uc?export=view&id=' + match[1];
  // Handle id= param format
  const idMatch = url.match(/[?&]id=([^&]+)/);
  if (idMatch) return 'https://drive.google.com/uc?export=view&id=' + idMatch[1];
  return url;
}

// ─── Initials from name ───────────────────────────────────────
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

// ─── Show loading state ───────────────────────────────────────
function showLoading(containerId) {
  const el = document.getElementById(containerId);
  if (el) {
    el.innerHTML = '<div class="cms-loading"><div class="cms-loading__spinner"></div><p>Loading content&hellip;</p></div>';
  }
}

// ─── Show empty state ─────────────────────────────────────────
function showEmpty(containerId, message) {
  const el = document.getElementById(containerId);
  if (el) {
    el.innerHTML = '<p class="cms-empty">' + escHtml(message || 'No content available yet. Check back soon.') + '</p>';
  }
}
