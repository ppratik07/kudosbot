✅ Tech Stack (assumed for this example):
- Node.js + Express (backend)
- Bot Framework SDK
- Microsoft Teams Bot integration
- Supabase (PostgreSQL) (or a simple in-memory store for MVP)
- 
# 🎉 Kudos Bot for Microsoft Teams

A simple and fun Microsoft Teams bot that lets teammates give each other kudos and keeps track of who’s spreading the most positivity! 💜

## ✨ Features

- Give kudos using @KudosBot: `@KudosBot kudos @teammate for helping with the project!`
- Keep a leaderboard of top kudos receivers
- View your kudos count
- Admin reset kudos
- Logs for record keeping
- Easy integration with Microsoft Teams

## 📦 Setup

### 1. Clone the repository

```bash
git clone https://github.com/ppratik07/kudosbot.git
cd kudosbot
2. Install dependencies

npm install

3. Set up environment variables

PORT=3978
DATABASE_URL= postgres://localhost:27017/kudosbot
MICROSOFT_APP_ID=your_bot_app_id
MICROSOFT_APP_PASSWORD=your_bot_password

4. Run locally

npm start

