# Database Setup

## PostgreSQL Schema

Baza danych dla Portal-Earn zawiera następujące tabele:

### Tabele główne

1. **users** - Dane użytkowników
2. **surveys** - Ankiety
3. **survey_responses** - Odpowiedzi na ankiety
4. **games** - Gry i oferty
5. **user_game_completions** - Ukończone gry
6. **user_earnings** - Historia zarobków użytkowników

## Uruchomienie schematu

### Opcja 1: Docker Compose

```bash
docker-compose up -d
```

Schemat będzie automatycznie załadowany podczas inicjalizacji kontenera.

### Opcja 2: Ręczne uruchomienie

```bash
psql -U postgres -h localhost -d portal_earn -f schema.sql
```

## Seed Data (Opcjonalnie)

Aby dodać przykładowe dane do bazy:

```bash
psql -U postgres -h localhost -d portal_earn -f seed.sql
```