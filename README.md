# orbit2.0[README.md](https://github.com/user-attachments/files/23604302/README.md)
# 🪐 Orbit Pomodoro - Backend API

Backend API for Orbit Pomodoro Focus Timer application.

## Environment Variables

- `MONGODB_URI` - MongoDB Atlas connection string
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (production/development)

## Deployment

Deployed on Railway with MongoDB Atlas.

## API Endpoints

- `GET /` - Health check
- `GET /getTasks` - Get all tasks
- `GET /addTask?name=...&num=...` - Add new task
- `GET /updateTask?id=...&finish=...` - Update task progress
- `GET /deleteTask?id=...` - Delete a task
- `GET /deleteAll` - Delete all tasks
