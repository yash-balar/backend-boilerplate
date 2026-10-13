# Backend Project Instructions

## Setup and run

- Use Node.js and npm. From the backend project root, run `npm install` to install dependencies.
- The API needs a MySQL server and Redis. Start Docker Desktop (or another Docker Engine) before running Docker commands.
- Redis is provided by Docker Compose: run `docker compose up -d redis` to start it and `docker compose down` to stop it. The app connects to Redis at `127.0.0.1:6379`.
- MySQL is not included in `docker-compose.yml`; start a MySQL server separately and create the database configured below.
- Create a local `.env` file in the project root with `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_PORT` set to match your MySQL server. Do not commit credentials. `PORT` is optional and defaults to `3000`.
- Run the API with `npm start`. It uses `nodemon` and serves on the configured port.

## Development notes

- `npm test` is a placeholder that exits with an error; do not treat it as a working test suite.
- Do not add secrets or machine-specific configuration to tracked files. Keep local environment values in `.env`.
