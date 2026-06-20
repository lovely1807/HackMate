# HackMate - Hackathon Team Formation Platform

Full-stack application for finding teammates and forming teams for hackathons.

## Project Structure

```
HackMate/
├── Backend/    # Spring Boot REST API with MySQL & JWT
└── Frontend/   # React + Vite + Tailwind CSS
```

## Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

## Setup Instructions

### 1. MySQL Database Setup

Create a database named `hackmate` (or update `application.properties`):

```sql
CREATE DATABASE hackmate;
```

Update `Backend/src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### 2. Run Backend

```bash
cd Backend
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### 3. Run Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/{username}` - Get user by username
- `PUT /api/users/me` - Update current user profile
- `GET /api/users/search?skills=...` - Search users by skills

### Teams
- `POST /api/teams` - Create new team
- `GET /api/teams/{id}` - Get team details
- `GET /api/teams` - Get all teams
- `GET /api/teams/open` - Get open teams
- `GET /api/teams/search?skills=...` - Search teams by skills
- `POST /api/teams/{id}/join` - Join a team
- `POST /api/teams/{id}/leave` - Leave a team

## Features

- User Registration/Login with JWT Authentication
- User Profiles with Skills
- Search Teammates by Skills
- Create and Manage Teams
- Join Teams
- Responsive UI with Tailwind CSS
