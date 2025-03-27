# Journal Backend API

A secure and scalable Node.js backend for a journaling application. Built with Express, Prisma, and MySQL.

## 🚀 Features

- User registration and login with JWT
- Create, read, update, delete journal entries
- Categorize entries
- Analytics endpoints:
  - Daily word count
  - Entry heatmap
  - Category summary
  - Sentiment analysis using OpenAI
- Fully tested with Jest and Supertest

## 🛠️ Tech Stack

- Node.js + Express
- Prisma ORM + MySQL
- JWT Authentication
- OpenAI API for sentiment
- Jest for testing

## 📦 Installation

```bash
git clone https://github.com/your-username/journal-backend.git
cd journal-backend
npm install

## 🔑 Setup

1. Create a `.env` file in the root directory:

```env
PORT=4000
DB_URL="mysql://username:password@localhost:3306/journal"
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-api-key"
```

2. Run the development server:

```bash
npm run dev
```

## 📦 API Documentation

## 📦 API Endpoints

Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login and get JWT
GET	/auth/me	Get profile
GET	/entries	List user entries
POST	/entries	Create new entry
GET	/categories	List categories
POST	/categories	Create category
GET	/summary/heatmap	Entry heatmap data
GET	/summary/wordcount	Daily word counts
GET	/summary/categories	Entry count by category
GET	/summary/sentiment	Overall sentiment





