# 🌍 Taste the World

> *"One recipe. One culture."*

A full-stack web application that lets you **spin a 3D globe** to discover and cook authentic, traditional recipes from over 60 countries. Powered by Spoonacular's recipe database with Groq AI as a fallback generator — every spin lands on a real dish from a real culture.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌐 **3D Globe** | Interactive Three.js globe with real Earth texture, atmosphere glow, starfield, and country pins |
| 🎲 **Spin the Globe** | Randomly selects a country and auto-fetches an authentic recipe |
| 🔍 **Country Selector** | Searchable dropdown with region filters across 60+ countries |
| 🍽️ **Meal Types** | Filter by Breakfast, Lunch, or Dinner |
| 🤖 **AI Fallback** | Groq LLaMA 3 generates culturally authentic recipes when Spoonacular has none |
| 💾 **Smart Cache** | MongoDB TTL cache (7 days) — repeat spins load instantly |
| 📖 **My Cookbook** | Save recipes to your personal collection |
| ⭐ **Favourites** | Star your favourite dishes for quick access |
| 🔐 **JWT Auth** | Secure register/login with bcrypt password hashing |
| 👤 **Guest Mode** | Browse and discover recipes without creating an account |
| 📱 **Responsive** | Full mobile support with a bottom tab navigation bar |

---

## 🖥️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|---|
| React | UI framework |
| Vite  | Build tool & dev server |
| Tailwind CSS  | Utility-first styling |
| Framer Motion | Animations & transitions |
| Three.js  | 3D globe rendering |
| Redux Toolkit  | Global state management |
| React Redux  | Redux React bindings |
| React Router  | Client-side routing |
| Axios  | HTTP client |

### Backend
| Technology | Purpose |
|---|---   ---|
| Node.js  | JavaScript runtime |
| Express  | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose  | MongoDB ODM |
| JSON Web Token | Auth tokens |
| bcryptjs | Password hashing |
| Groq SDK | AI recipe generation |
| Axios  | Spoonacular API client |
| Morgan | HTTP request logging |
| express-rate-limit | API rate limiting |

### External APIs
| API | Purpose |
|---|---|
| [Spoonacular](https://spoonacular.com/food-api) | Primary recipe source |
| [Groq AI (LLaMA 3)](https://console.groq.com) | AI fallback recipe generator |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Managed cloud database |

### Hosting
| Service | What it hosts |
|---|---|
| [Render](https://render.com) | Backend API server |
| [Render](https://render.com) | Frontend static site |

---


## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB Atlas** account and cluster
- A **Spoonacular** API key → [spoonacular.com/food-api](https://spoonacular.com/food-api)
- A **Groq** API key → [console.groq.com](https://console.groq.com)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/taste-the-world.git
cd taste-the-world
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Fill in `server/.env`:

```env
NODE_ENV=development
PORT=5000

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/taste-the-world?retryWrites=true&w=majority

# JWT — use a long random string in production
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Spoonacular API key
SPOONACULAR_API_KEY=your_spoonacular_api_key_here
SPOONACULAR_BASE_URL=https://api.spoonacular.com

# Groq API key
GROQ_API_KEY=your_groq_api_key_here

# Allowed frontend origin (no trailing slash)
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev      # Development (nodemon)
npm start        # Production
```

The API will be available at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd client
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Fill in `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev      # Development server → http://localhost:5173
npm run build    # Production build
npm run preview  # Preview production build locally
```

---

## 🔌 API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Create a new account |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `POST` | `/api/auth/logout` | ✅ | Logout hint (client-side) |

**Register / Login request body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "savedRecipes": []
  }
}
```

---

### Recipes — `/api/recipes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/recipes/fetch` | Optional | Fetch recipe for a country + meal type |
| `GET` | `/api/recipes/countries` | ❌ | List all 60+ supported countries |
| `GET` | `/api/recipes/random` | ❌ | Get a random country (Spin the Globe) |
| `GET` | `/api/recipes/recently-spun` | ❌ | Last fetched recipes |

**Fetch recipe:**
```
GET /api/recipes/fetch?country=Thailand&mealType=breakfast
```

**Response:**
```json
{
  "success": true,
  "fromCache": false,
  "recipe": {
    "title": "Khao Tom (Thai Rice Soup)",
    "country": "Thailand",
    "mealType": "breakfast",
    "image": "https://...",
    "description": "A warm and comforting rice soup...",
    "readyInMinutes": 35,
    "servings": 2,
    "difficulty": "easy",
    "ingredients": [
      { "name": "jasmine rice", "amount": 0.5, "unit": "cup", "original": "½ cup jasmine rice" }
    ],
    "steps": [
      { "number": 1, "instruction": "Rinse the rice and drain." }
    ],
    "tips": ["Best enjoyed fresh with fresh ginger."],
    "source": "spoonacular"
  }
}
```

---

### Users — `/api/users` *(all protected)*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/profile` | Full user profile |
| `POST` | `/api/users/save-recipe` | Save recipe to cookbook |
| `GET` | `/api/users/saved-recipes` | List saved recipes (filterable) |
| `DELETE` | `/api/users/saved-recipes/:id` | Remove from cookbook |
| `PATCH` | `/api/users/saved-recipes/:id/favorite` | Toggle ⭐ favourite |
| `PATCH` | `/api/users/preferences` | Update meal preferences |
| `PATCH` | `/api/users/spin-history` | Log a country spin |

---

## 🗺️ App Flow

```
Open App
    │
    ▼
/login ──────────────────────────────────────────┐
    │                                             │
    ├── Sign In (email + password) ───────────┐  │
    ├── Continue as Guest ────────────────┐   │  │
    └── Create Account → /signup ─────┐  │   │  │
                                      │  │   │  │
/signup ── Register ──────────────────┘  │   │  │
                                         │   │  │
                    ┌────────────────────┘   │  │
                    │    ┌───────────────────┘  │
                    ▼    ▼                       │
              / (Home Page)                      │
                    │                            │
          ┌─────────┼──────────┐                │
          ▼         ▼          ▼                │
       /spin    /cookbook  /favorites            │
                 (auth)      (auth) ─────────────┘
```

---

## 🧠 Recipe Fetching Logic

```
Request: GET /api/recipes/fetch?country=X&mealType=Y
         │
         ▼
   Check MongoDB cache
   (country + mealType, not expired)
         │
    ┌────┴────┐
  Hit ✅    Miss ❌
    │          │
    │          ▼
    │    Call Spoonacular API
    │    (cuisine filter + meal type)
    │          │
    │     ┌────┴──────┐
    │   Found ✅   Empty ❌
    │     │             │
    │     │             ▼
    │     │       Call Groq AI
    │     │       (LLaMA 3 prompt)
    │     │             │
    │     ▼             ▼
    │   Parse & normalise recipe
    │     │
    │     ▼
    │   Save to MongoDB cache (TTL 7 days)
    │     │
    └─────┴──► Return recipe to client
```

---

## 🔒 Security

- **Passwords** hashed with `bcryptjs` (salt rounds: 12)
- **JWTs** signed with `HS256`, expire in 7 days
- **Rate limiting** on all routes (auth: 20 req/15 min, recipes: 30 req/min, global: 500 req/15 min)
- **CORS** restricted to configured `CLIENT_URL` origin
- **Helmet** headers via Express defaults
- **Input validation** on all user-submitted fields
- **MongoDB injection** protection via Mongoose schema typing

---

## 🌐 Deployment on Render

### Backend (Web Service)

| Setting | Value |
|---|---|
| **Root Directory** | `server` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Node Version** | `18` |

Add all variables from `server/.env` under **Environment Variables** in the Render dashboard.

### Frontend (Static Site)

| Setting | Value |
|---|---|
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

Add this environment variable:

```
VITE_API_URL=https://your-backend-name.onrender.com/api
```

---

## 🌍 Supported Countries (60+)

| Region | Countries |
|---|---|
| **Asia** | Japan, China, India, Thailand, Vietnam, South Korea, Indonesia, Malaysia, Philippines, Singapore, Bangladesh, Pakistan, Sri Lanka, Nepal, Myanmar, Cambodia |
| **Middle East** | Turkey, Lebanon, Iran, Saudi Arabia, Egypt, Israel, Iraq, Jordan |
| **Africa** | Morocco, Ethiopia, Nigeria, Ghana, Kenya, South Africa, Senegal, Tanzania |
| **Europe** | Italy, France, Spain, Greece, Germany, Portugal, UK, Ireland, Netherlands, Belgium, Sweden, Norway, Denmark, Finland, Poland, Russia, Hungary, Switzerland, Austria |
| **Americas** | Mexico, Brazil, Argentina, Peru, Colombia, Cuba, Jamaica, Venezuela, Chile, Canada, United States |
| **Oceania** | Australia, New Zealand |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m 'Add your feature'`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ for the hackathon

**🌍 Taste the World — Spin the Globe, Cook the World.**

*"Food is a passport to the heart of a culture."*

</div>
