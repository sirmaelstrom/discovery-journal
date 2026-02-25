# Operator Discovery Toolkit

A static, local-first web application for guided cognitive architecture discovery.

The toolkit walks a person through five phases:

1. Systems Mapping
2. Pattern Extraction
3. Failure Mode Analysis
4. Doctrine Derivation
5. System Alignment

The output is a print-ready/downloadable Cognitive Architecture Document based on the participant's own responses.

## Core Characteristics

- One-question-at-a-time guided flow
- Conversational, low-pressure pacing
- Local save/resume via browser `localStorage`
- Session import/export via JSON
- Print-ready and downloadable HTML artifact
- No backend, no database, no AI dependency in v1

## Stack

- Static HTML/CSS/JavaScript
- Playwright for end-to-end UI + accessibility tests
- ESLint + Prettier for code quality
- Husky + lint-staged for pre-commit checks (when repo is initialized with Git)

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm ci
npm run pw:install
```

### Run locally

```bash
npm run dev
```

Then open `http://127.0.0.1:4173`.

## Quality Commands

```bash
npm run lint
npm run format:check
npm run format
npm test
npm run test:ui
npm run test:headed
npm run test:report
```

## Pre-commit Hook

This project includes a Husky pre-commit hook that runs `lint-staged`.

- If `.git` exists, `npm install` / `npm ci` will run `npm run prepare` and install Husky hooks.
- If `.git` does not exist yet, setup is skipped safely.

## CI

GitHub Actions workflow: [ci.yml](.github/workflows/ci.yml)

Pipeline runs on push/PR:

1. `npm ci`
2. `npx playwright install --with-deps chromium`
3. `npm run lint`
4. `npm run format:check`
5. `npm test`

## Repository Layout

- `index.html` - app shell
- `styles.css` - visual design
- `app.js` - app state + phase flow logic
- `tests/` - Playwright specs (desktop, mobile, axe accessibility)
- `scripts/static-server.js` - local static server for dev/tests

## License

MIT
