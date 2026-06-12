# Portal-Earn Backend

Backend API dla platformy Portal-Earn zbudowany z Express.js i PostgreSQL.

## 🚀 Uruchomienie

### Wymagania
- Node.js 18+
- PostgreSQL 14+

### Instalacja

```bash
npm install
cp .env.example .env
```

Edytuj `.env` z właściwymi wartościami:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=portal_earn
JWT_SECRET=your_secret_key
```

### Uruchomienie serwera

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Serwer będzie dostępny na `http://localhost:5000`

## 📚 API Endpoints

### Autentykacja

- `POST /api/auth/register` - Rejestracja nowego użytkownika
- `POST /api/auth/login` - Logowanie
- `POST /api/auth/logout` - Wylogowanie

### Ankiety

- `GET /api/surveys` - Lista wszystkich ankiet
- `GET /api/surveys/:id` - Szczegóły ankiety
- `POST /api/surveys/:id/submit` - Przesłanie odpowiedzi ankiety

### Gry

- `GET /api/games` - Lista wszystkich gier
- `GET /api/games/:id` - Szczegóły gry
- `POST /api/games/:id/complete` - Oznaczenie gry jako ukończonej

### Użytkownicy

- `GET /api/users/:id/profile` - Profil użytkownika
- `GET /api/users/:id/earnings` - Historia zarobków
- `PUT /api/users/:id/profile` - Aktualizacja profilu
- `GET /api/users/:id/history` - Historia aktywności

### Admin

- `GET /api/admin/users` - Lista wszystkich użytkowników
- `POST /api/admin/surveys` - Dodaj nową ankietę
- `POST /api/admin/games` - Dodaj nową grę
- `GET /api/admin/stats` - Statystyki platformy

## 🔐 Autentykacja

API używa JWT (JSON Web Tokens). Tokeny powinny być przesyłane w headerze:

```
Authorization: Bearer <token>
```

## 📝 Struktura projektu

```
src/
├── server.ts           # Główny plik serwera
├── routes/
│   ├── auth.ts        # Autentykacja
│   ├── surveys.ts     # Ankiety
│   ├── games.ts       # Gry
│   ├── users.ts       # Użytkownicy
│   └── admin.ts       # Admin
├── middleware/        # Middleware (auth, validation)
├── utils/            # Utility functions
└── config/           # Konfiguracja
```

## 🗄️ Baza danych

Witaj w PostgreSQL. Schemat bazy danych znajduje się w `/database/schema.sql`

## 🤝 Wkład

Zapraszamy pull requesty!