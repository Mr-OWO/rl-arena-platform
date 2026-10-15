# RL-Arena-Platform: Full-Stack RLHF Model Evaluation & Elo Leaderboard Dashboard

[![CI](https://github.com/Mr-OWO/rl-arena-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/Mr-OWO/rl-arena-platform/actions)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack, enterprise-grade preference collection and evaluation platform for Reinforcement Learning from Human Feedback (RLHF) and model alignment. Features split-pane blind and open evaluations, live syntax-highlighted code diffing, multi-dimensional rubric scoring, real-time Elo rating computation, and statistical inter-annotator agreement metrics (Cohen's Kappa & Fleiss' Kappa).

---

## 🏛️ System Architecture

```
                    +------------------------------------------+
                    |           React 18 Workspace             |
                    |  - Split-Pane Model A vs B Comparison    |
                    |  - 1-5 Dimensional Rubric Sliders        |
                    |  - Technical Chain-of-Thought Rationale  |
                    +--------------------+---------------------+
                                         | REST / WebSocket
                                         v
                    +------------------------------------------+
                    |          NestJS Modular Backend          |
                    +----+------------------+------------------+
                         |                  |
            +------------+---+     +--------+--------+     +---+--------------+
            |  AuthModule    |     | ModelsModule    |     | EvaluationsModule|
            | - RBAC Sessions|     | - Catalog Store |     | - Dynamic Elo    |
            | - Lead / Rater |     | - Active Elo    |     | - Cohen's Kappa  |
            +----------------+     +-----------------+     | - Fleiss' Kappa  |
                                                           +--------+---------+
                                                                    |
                                                                    v
                                                           +------------------+
                                                           | PostgreSQL Store |
                                                           | - Judgments      |
                                                           | - Elo History    |
                                                           +------------------+
```

---

## 🚀 Key Features

- **Split-Pane Evaluation Workspace:** Side-by-side comparison of candidate completions with code formatting and real-time rating controls.
- **Dynamic Elo Rating Engine:** Computes updated Elo ratings on every pairwise judgment using the Bradley-Terry model ($K=32$).
- **Inter-Annotator Agreement (IAA):**
  - **Cohen's Kappa ($\kappa$):** Pairwise reliability metric calculating agreement above chance between independent evaluators.
  - **Fleiss' Kappa ($\kappa_F$):** Multi-rater consensus telemetry across arbitrary annotator cohorts.
- **Modular NestJS Architecture:** Strict separation of concerns with `AuthModule`, `ModelsModule`, and `EvaluationsModule` with DTO validation and Jest unit tests.
- **Containerized Orchestration:** Single-command `docker-compose.yml` spinning up PostgreSQL, NestJS API, and React frontend.

---

## 📦 Quick Start with Docker Compose

```bash
git clone https://github.com/Mr-OWO/rl-arena-platform.git
cd rl-arena-platform
docker-compose up --build
```

- **Frontend Workspace:** `http://localhost:3000`
- **NestJS API Service:** `http://localhost:4000`
- **Postgres Database:** `localhost:5432`

---

## 🧪 Testing Backend

```bash
cd backend
npm install
npm test
```

---

## 👤 Author
**Wisdom Ogechi Owabor**
- Full-Stack Software Engineer & Python AI Systems Specialist
- Portfolio: [wisdomowabor.online](https://wisdomowabor.online)
- GitHub: [@Mr-OWO](https://github.com/Mr-OWO)
