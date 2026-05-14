# Live Demo and Video Links

## Links

| | |
|---|---|
| **Live demo** | https://clausecompass.netlify.app/ |
| **GitHub repo** | https://github.com/iamsameershaik/legal-queue-copilot |
| **Video walkthrough** | https://drive.google.com/file/d/1glA6a2GmQRi32N1jdMaqJXCDnUl7dNwb/view |

---

## Netlify deploy notes

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: `public/_redirects` → `/* /index.html 200`
- No environment variables required for the demo (Supabase client gracefully falls back to localStorage when keys are absent)
- If deploying with Supabase: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Netlify environment variables

---
