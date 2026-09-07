# RAVINDU RAVISARA // PORTFOLIO

Cinematic full-stack developer portfolio — black + ice-blue engineering identity.
Backend: **Node.js + Express + MongoDB (Mongoose)** · Frontend: **HTML + Tailwind CSS v4 + vanilla JavaScript**
(React intentionally not used here — the hero design requires a fully custom,
single-scene cinematic implementation per the design brief).

## Structure

```
ravindu-portfolio/
├── server.js                  # Express entry — serves API + static frontend
├── package.json
├── .env.example               # copy to .env
├── server/
│   ├── config/db.js           # MongoDB connection (graceful degradation)
│   ├── models/Project.js      # Project schema
│   ├── models/Message.js      # Contact message schema
│   ├── routes/projects.js     # GET /api/projects, GET /api/projects/:code
│   ├── routes/contact.js      # POST /api/contact (+ rate limiting)
│   ├── middleware/errorHandler.js
│   └── seed/seedProjects.js   # seed script
└── client/
    ├── index.html             # hero + about + projects + skills + contact
    ├── css/tailwind.css       # Tailwind source: components, responsive rules, effects
    ├── css/style.css          # generated stylesheet (included for static hosting)
    ├── data/projects.json     # editable project list used by the project section
    ├── js/main.js             # grid, word reveal, cursor spotlight, project rendering
    └── assets/
        ├── ravindu-portrait.jpg   # cinematic hero portrait
        └── ravindu-photo.png      # real photograph (About section)
```

## Run

```bash
# 1. install dependencies
npm install

# 2. configure environment
cp .env.example .env        # set MONGO_URI (local MongoDB or Atlas)

# 3. seed projects (optional — client projects are read from JSON)
npm run seed

# 4. start
npm start                   # http://localhost:5000
# or, with server auto-reload:
npm run dev
```

The contact form sends email through SMTP. Copy the SMTP values from `.env.example`
into `.env`; for Gmail, enable 2-Step Verification and use a Google App Password
as `SMTP_PASS`, not your regular Gmail password. `CONTACT_EMAIL` is the inbox that
receives portfolio messages.

The Express server serves the client from `/client` and the API under `/api`.

## API

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| GET    | /api/health          | health check                       |
| GET    | /api/projects        | list of projects (ordered)         |
| GET    | /api/projects/:code  | single project (e.g. PROJECT_01)   |
| POST   | /api/contact         | store contact message `{name,email,message}` |

## Frontend behaviour

- Reads project cards from `client/data/projects.json`; edit that file to add
  or update projects without changing the renderer.
- The contact form offers a `mailto:` fallback when the API is unreachable.
- Cursor spotlight (`#tech-reveal`) activates on fine-pointer devices only;
  disabled under `prefers-reduced-motion` and on touch.
- Fully responsive: desktop grid scene → stacked mobile composition.

## Editing

- Swap `client/assets/ravindu-portrait.jpg` to change the hero portrait.
- Wire `VIEW RESUME ↗` to a real PDF in `js/main.js` (section 8).
- Add/edit projects in `client/data/projects.json`. The JSON fields are
  `title`, `category`, `description`, `tech`, `highlight`, and `url`.

## Tailwind CSS

All client component styles are authored in `client/css/tailwind.css` using
Tailwind `@apply` utilities, including responsive layouts, pseudo-elements,
hover/focus states, and JavaScript-controlled states. Exact values are retained
with arbitrary utilities. Custom properties and animation keyframes remain CSS
so the existing timing, masks, parallax, and reduced-motion effects are preserved.
The existing class names remain the component API and JavaScript hooks.

Tailwind Preflight is intentionally omitted to preserve the original browser
styles for typography, controls, and images. See the [Tailwind Preflight documentation](https://tailwindcss.com/docs/preflight#disabling-preflight).
The existing reset is included in the component layer. Tailwind also scans
`client/index.html` and `client/js/main.js`, so utility classes can be used
in both static markup and generated project cards. Keep utility names complete
in JavaScript strings so Tailwind can detect them.

```bash
npm run build       # compile the production stylesheet
npm run watch:css   # watch styles/HTML/JS when using a separate static server
npm run dev         # initial CSS build + CSS watcher + Express auto-reload
```

`npm start` builds CSS automatically before starting Express. Use `npm run watch:css`
in a second terminal while editing Tailwind styles. Install development
dependencies during the build stage; after building, a production server can run
`node server.js` without the Tailwind CLI. For static hosting, publish `client/`
after `npm run build`. The generated `style.css` is included, so opening or serving
the frontend does not require a browser CDN or runtime CSS compiler.

Edit `tailwind.css`, then rebuild; do not hand-edit the generated `style.css`.

## Verification

Run `npx playwright install chromium` once, then `npm test`. Browser checks cover
desktop/tablet/mobile layouts, project expansion, the mobile menu, entrance and
hover effects, contact status styling, and reduced motion. Tests use a local static
server and mock contact submissions; they do not send messages or need MongoDB.
