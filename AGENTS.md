# Repository Guidelines

## Stack

ShopLedger is a Node.js application using Express 4 and `body-parser`. It serves a browser UI from `public/` and persists application data in the JSON file `data/db.json`. Server code uses CommonJS modules and ES5-style JavaScript.

## Module Map

- `server.js` configures Express, serves `public/`, and mounts the API.
- `routes/` contains HTTP handlers for products, orders, customers, and reports.
- `lib/` contains the business logic used by routes, including inventory, pricing, tax, coupons, ledger, reporting, and JSON-store helpers.
- `config.js` defines application configuration such as the port.
- `public/index.html`, `public/js/app.js`, and `public/css/style.css` implement the browser interface.
- `data/db.json` is the local application data file.

## Commands

- `npm ci` installs the exact dependencies recorded in `package-lock.json`.
- `npm start` starts the application with `node server.js`; use the local URL printed in the console.
- `npm test` currently exits with an error: this repository has no configured test runner or committed automated test suite.

## Change Rules

- Write characterization tests before changing existing behavior. Capture the current behavior first, including edge cases relevant to the ticket.
- Change only the module the ticket concerns. Do not refactor adjacent routes, library modules, UI files, or configuration as incidental cleanup.
- Tests must never read from, write to, reset, or otherwise touch `data/db.json`. Use isolated in-memory fixtures or temporary test data outside that file.
- Add no dependencies. Work with the packages and built-in Node.js functionality already available in the repository.
