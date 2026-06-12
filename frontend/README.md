# Portal-Earn Frontend

Frontend dla platformy Portal-Earn zbudowany z Next.js i React.

## 🚀 Uruchomienie

### Wymagania
- Node.js 18+
- npm lub yarn

### Instalacja

```bash
npm install
cp .env.example .env.local
```

Edytuj `.env.local` z właściwymi wartościami:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Uruchomienie

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Aplikacja będzie dostępna na `http://localhost:3000`

## 📁 Struktura projektu

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── (auth)/                 # Auth pages
│   ├── login/
│   └── register/
└── (dashboard)/            # Protected pages
    ├── dashboard/
    ├── surveys/
    ├── games/
    ├── profile/
    └── admin/

components/
├── Navbar.tsx
├── Sidebar.tsx
└── ...

lib/
├── api.ts                  # API functions
└── store.ts               # Zustand store
```

## 🎨 Styling

Projekt używa Tailwind CSS do stylowania. Konfiguracja znajduje się w `tailwind.config.ts`

## 🤝 Wkład

Zapraszamy pull requesty!