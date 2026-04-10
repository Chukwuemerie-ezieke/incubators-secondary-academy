#!/usr/bin/env python3
"""
Script to add cookie consent banner and privacy policy footer link to all HTML files.
"""

import os
import re

HTML_FILES = [
    'index.html',
    'about.html',
    'academics.html',
    'discipleship.html',
    'boarding.html',
    'gallery.html',
    'events.html',
    'admissions.html',
    'contact.html',
    'alumni.html',
]

BASE_DIR = '/home/user/workspace/incubators-academy'

COOKIE_BANNER = '''
<!-- Cookie Consent Banner -->
<div id="cookieConsent" class="cookie-banner" style="display:none;">
  <div class="cookie-banner__inner">
    <p>This website uses cookies for analytics to improve your experience. <a href="privacy-policy.html">Learn more</a></p>
    <div class="cookie-banner__buttons">
      <button onclick="acceptCookies()" class="cookie-btn cookie-btn--accept">Accept</button>
      <button onclick="declineCookies()" class="cookie-btn cookie-btn--decline">Decline</button>
    </div>
  </div>
</div>
<script>
  function acceptCookies(){localStorage.setItem('incusa_cookies','accepted');document.getElementById('cookieConsent').style.display='none';}
  function declineCookies(){localStorage.setItem('incusa_cookies','declined');document.getElementById('cookieConsent').style.display='none';window['ga-disable-G-HYCDGKH4ZX']=true;}
  if(!localStorage.getItem('incusa_cookies')){document.getElementById('cookieConsent').style.display='block';}
  else if(localStorage.getItem('incusa_cookies')==='declined'){window['ga-disable-G-HYCDGKH4ZX']=true;}
</script>
'''

FOOTER_OLD = '<p>&copy; 2026 The Incubators Secondary Academy. All rights reserved.</p>'
FOOTER_NEW = '<p>&copy; 2026 The Incubators Secondary Academy. All rights reserved.<a href="privacy-policy.html" style="color: rgba(255,255,255,0.5); margin-left: 12px; font-size: 0.75rem;">Privacy Policy</a></p>'

results = []

for fname in HTML_FILES:
    fpath = os.path.join(BASE_DIR, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    changes = []

    # 1. Add cookie banner before </body>
    if '<!-- Cookie Consent Banner -->' not in content:
        content = content.replace('</body>', COOKIE_BANNER + '</body>')
        changes.append('added cookie banner')
    else:
        changes.append('cookie banner already present')

    # 2. Add privacy policy link in footer
    if 'privacy-policy.html' not in content or FOOTER_OLD in content:
        if FOOTER_OLD in content:
            content = content.replace(FOOTER_OLD, FOOTER_NEW)
            changes.append('added privacy policy footer link')
        else:
            changes.append('WARNING: footer copyright line not found')
    else:
        changes.append('privacy link already present')

    if content != original:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        results.append(f'  UPDATED {fname}: {", ".join(changes)}')
    else:
        results.append(f'  NO CHANGE {fname}: {", ".join(changes)}')

print('Results:')
for r in results:
    print(r)
print('\nDone.')
