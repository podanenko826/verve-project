# Verve

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js_22-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express_5-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma_6-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![AWS](https://img.shields.io/badge/AWS_Serverless-FF9900?style=flat&logo=amazonwebservices&logoColor=white)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Auth0](https://img.shields.io/badge/Auth0-EB5424?style=flat&logo=auth0&logoColor=white)](https://auth0.com/)


Verve is a full-stack event scheduling and management web application. It features an interactive calendar, event lifecycle tracking, real-time search, metrics dashboards, and user-scoped data access.

The system is hosted on an AWS serverless architecture (Lambda, API Gateway, S3, CloudFront) backed by a managed Supabase PostgreSQL instance, with local development supported via Docker and Nginx reverse proxying.

---

## Features

### Calendar and Event Management

- Interactive month, week, and day calendar views built with `@aldabil/react-scheduler` and `@mui/x-date-pickers`.
- Event creation, updates, and drag-and-drop rescheduling.
- Event lifecycle states: `OPEN`, `IN_PROGRESS`, `CLOSED`, and `ARCHIVED`.
- User data isolation: all event queries and mutations are scoped to the authenticated user's ID (`sub`).

<img width="2056" height="1126" alt="Screenshot 2026-10-16 at 18 52 47" src="https://github.com/user-attachments/assets/728efbc3-f163-4b7d-b17c-131e71e73e0c" />

### Dashboard and Search

- Overview metrics showing total active events, completed events, and 30-day activity trends.
- Upcoming events list with status toggles.
- Modal search filtering across event titles, descriptions, and date ranges.

<img width="2056" height="1126" alt="Screenshot 2026-10-16 at 18 49 53" src="https://github.com/user-attachments/assets/958696b5-5bd2-42e5-906b-fa8ed4a681bc" />

<img width="1711" height="627" alt="Screenshot 2026-10-16 at 18 50 35" src="https://github.com/user-attachments/assets/951becf6-9468-42e4-ab48-97883f373868" />

### Authentication and Access Control

- User authentication via Auth0 using OAuth 2.0 PKCE flow.
- Client-side Axios interceptor that attaches bearer tokens to all outgoing API requests.
- Backend JWT validation middleware (`express-oauth2-jwt-bearer`) verifying tokens against Auth0 JWKS keys.
- Automatic database user provisioning on request (`syncUser` middleware).
- Role-based authorization for administrative actions like permanent deletion (`requireRole('Admin')`).

### Landing Page

- Lightweight static landing page built with Vite.
- Dynamic origin detection that routes login and signup buttons correctly depending on whether the app is running under local development, Docker, or production CloudFront.

<img width="2040" height="1126" alt="Screenshot 2026-10-16 at 18 35 02" src="https://github.com/user-attachments/assets/18285193-c4b6-4546-825f-e076ab56c33a" />

---

## Architecture

The production setup runs without persistent virtual machines or container instances. Static assets are served from global edge caches, and the API executes on demand.

<img width="1394" height="866" alt="Screenshot 2026-10-25 at 16 29 00" src="https://github.com/user-attachments/assets/980f0294-214d-4eff-abfa-c29ebcb8d8e5" />

### Key Architecture Details

- **Frontend Delivery:** The React SPA and static landing page are stored in private S3 buckets and distributed through AWS CloudFront with automated cache invalidation on deployment.
- **Backend Compute:** Express application routes are adapted for AWS Lambda execution using `@vendia/serverless-express` and `serverless-http`, managed through Serverless Framework v4.
- **Database:** PostgreSQL on Supabase, using PgBouncer for transaction connection pooling to prevent connection exhaustion during Lambda scaling.
- **Engine Optimization:** The Lambda deployment package excludes development dependencies and unused Prisma binaries, retaining only the `rhel-openssl-3.0.x` query engine required for Amazon Linux 2023.

---

## Tech Stack

| Layer        | Tools                                                               |
| :----------- | :------------------------------------------------------------------ |
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS, Emotion, Material UI (MUI) |
| **Calendar** | `@aldabil/react-scheduler`, `@mui/x-date-pickers`, `date-fns`       |
| **Landing**  | HTML5, CSS3, JavaScript, Vite                                       |
| **Backend**  | Node.js 22 LTS, Express 5, TypeScript                               |
| **ORM & DB** | Prisma 6, PostgreSQL (Supabase)                                     |
| **Auth**     | Auth0 (`@auth0/auth0-react`, `express-oauth2-jwt-bearer`)           |
| **Cloud**    | AWS Lambda, API Gateway, S3, CloudFront                             |
| **DevOps**   | Docker, Docker Compose, Nginx, Serverless Framework v4, esbuild     |
| **CI / CD**  | GitHub Actions                                                      |

---

## Running Locally

You can run the project either using Docker Compose with local subdomains and SSL termination, or by launching the components directly via `npm run dev`.

### Prerequisites

- Node.js 22+
- npm
- Docker and Docker Compose (if running containerized)

---

### Option 1: Docker Compose with Nginx

This setup mirrors a multi-domain architecture locally:

- Landing: `https://localhost`
- Web App: `https://app.localhost`
- Backend API: `https://api.localhost`
- Database: `localhost:5432`

1. Clone the repository:

    ```bash
    git clone https://github.com/podanenko826/verve-project.git
    cd verve-project
    ```

2. Make sure `.env` files are configured in `backend/` and `frontend/` (see configuration section below).

3. Start all services:

    ```bash
    docker compose up --build
    ```

4. Open `https://localhost` or `https://app.localhost` in your browser.

---

### Option 2: Standalone Dev Servers

To run the processes directly on your host machine:

1. **Backend:**

    ```bash
    cd backend
    npm install
    npx prisma generate
    npm run dev
    # Runs on http://localhost:8080
    ```

2. **Frontend:**

    ```bash
    cd frontend
    npm install --legacy-peer-deps
    npm run dev
    # Runs on http://localhost:5173
    ```

3. **Landing:**
    ```bash
    cd landing
    npm install
    npm run dev
    # Runs on http://localhost:5174
    ```

---

## Environment Configuration

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/postgres"
AUTH0_AUDIENCE="https://<your-tenant>.us.auth0.com/api/v2/"
AUTH0_ISSUER_BASE_URL="https://<your-tenant>.us.auth0.com/"
```

### Frontend (`frontend/.env`)

```env
VITE_AUTH0_DOMAIN="<your-tenant>.us.auth0.com"
VITE_AUTH0_CLIENT_ID="<your-client-id>"
VITE_AUTH0_AUDIENCE="https://<your-tenant>.us.auth0.com/api/v2/"
VITE_API_URL="https://vc9l9n9pua.execute-api.eu-west-1.amazonaws.com/dev"
```

---

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment.

<img width="659" height="343" alt="Screenshot 2026-10-25 at 17 54 23" src="https://github.com/user-attachments/assets/77394d44-5fd8-41d0-97f8-50e1d8d35622" />

1. **Continuous Integration (`.github/workflows/ci.yml`):**
    - Runs on every push and pull request targeting `main`.
    - Validates dependencies and builds the landing page and frontend app.
    - Generates Prisma client types and runs `tsc --noEmit` on the backend.

2. **Continuous Deployment (`.github/workflows/cd.yml`):**
    - Runs automatically on merge to `main`.
    - **Backend:** Packages the application with esbuild, applies exclusions for devDependencies and unused binaries, and deploys to AWS Lambda and API Gateway via Serverless Framework.
    - **Frontend & Landing:** Compiles static bundles with environment variables, synchronizes files to their respective S3 buckets with `--delete`, and issues a `/*` invalidation request to CloudFront.

---

## API Endpoints

All endpoints except `/api/events/test` require a valid Auth0 JWT in the `Authorization: Bearer <token>` header.

| Method   | Route                 | Access        | Description                                  |
| :------- | :-------------------- | :------------ | :------------------------------------------- |
| `GET`    | `/api/events/test`    | Public        | Connectivity and environment check           |
| `GET`    | `/api/events`         | Authenticated | Fetch active events for the current user     |
| `GET`    | `/api/events/:id`     | Authenticated | Fetch a specific event by ID (user-isolated) |
| `POST`   | `/api/events`         | Authenticated | Create a new event                           |
| `PUT`    | `/api/events/:id`     | Authenticated | Update an existing event                     |
| `DELETE` | `/api/events/:id`     | Admin only    | Permanently delete an event                  |
| `GET`    | `/api/events/archive` | Authenticated | Fetch archived events for the current user   |

---

## Screenshots

| Section            | Preview                          |
| :----------------- | :------------------------------- |
| Calendar View      | <img width="2056" height="1126" alt="Screenshot 2026-10-25 at 17 56 06" src="https://github.com/user-attachments/assets/84325c9e-9193-4c97-8378-40de61e5c850" /> |
| Event Form         | <img width="704" height="614" alt="Screenshot 2026-10-25 at 17 57 00" src="https://github.com/user-attachments/assets/c764b213-abd4-4599-a37b-7cb04e307c64" /> |
| Event Details      | <img width="2056" height="1126" alt="Screenshot 2026-10-25 at 17 57 40" src="https://github.com/user-attachments/assets/a74a1b08-8d08-473e-ba99-a903274e5817" /> |
| Archive Management | <img width="2056" height="1126" alt="Screenshot 2026-10-25 at 17 59 19" src="https://github.com/user-attachments/assets/5cfe0fa6-3c74-47cb-a91d-bdf4198d7243" /> |
| Account Settings   | <img width="2056" height="1126" alt="Screenshot 2026-10-25 at 17 59 49" src="https://github.com/user-attachments/assets/b0201405-0969-44b9-8f1b-bbcaebdc5ebb" /> |

---

## License

ISC License.
