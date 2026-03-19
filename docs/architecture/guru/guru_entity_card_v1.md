# Guru Entity Card v1  
**Unified Card Contract для Guru Asia**

---

## 1. Purpose

**EntityCard v1** — это унифицированный контракт карточки, используемый в Guru Asia для отображения всех типов сущностей в едином nearby-интерфейсе.

Контракт решает задачу:

> **Нормализации разнородных доменных данных в единый формат для отображения, фильтрации и ранжирования**

---

## 2. Boundary

### Используется:
- guru-service (aggregation layer)
- frontend Guru (карта, список, карточки)
- ranking / filtering
- explainability UI

### Не используется:
- внутри доменных сервисов (Atlas, Pulse, Rielt и т.д.)
- как storage schema
- как canonical model доменов

> **EntityCard — это projection layer, а не domain model**

---

## 3. Entity Types

```ts
type EntityType =
  | 'place'
  | 'event'
  | 'listing'
  | 'partner'
  | 'quest'
  | 'pro'
  | 'blog_tag'
```

---

## 4. Core Contract (Base Fields)

```ts
type EntityCard = {
  id: string
  type: EntityType

  title: string
  subtitle?: string
  description?: string

  image_url?: string

  lat: number
  lng: number
  distance_m?: number

  city_id?: string
  country_id?: string

  tags?: string[]

  rating?: number
  price_level?: number

  is_verified?: boolean
  is_rf?: boolean

  is_open_now?: boolean
  starts_at?: string

  actions?: EntityAction[]

  explain?: ExplainBlock

  payload?: Record<string, any>
}
```

---

## 5. Explainability Block

```ts
type ExplainBlock = {
  reasons: ExplainReason[]
}

type ExplainReason =
  | 'nearby'
  | 'happening_now'
  | 'starting_soon'
  | 'verified'
  | 'popular'
  | 'recommended'
  | 'partner'
  | 'new'
```

---

## 6. Actions

```ts
type EntityAction = {
  type:
    | 'open'
    | 'navigate'
    | 'book'
    | 'view_in_atlas'
    | 'view_in_pulse'
    | 'view_in_rielt'
    | 'view_in_blog'
    | 'start_quest'
    | 'contact_pro'
    | 'open_partner'
  label: string
  deeplink: string
}
```

---

## 7. Geo Rules

- `lat` / `lng` — обязательны для всех entity, кроме `blog_tag`
- `distance_m` — вычисляется внутри `guru-service`
- Guru не владеет географией → **Atlas остаётся SSOT**
- В V1 запрещено создание параллельного geo-layer

---

## 8. Type-specific Extensions (payload)

### Place
```ts
payload = { category: string, address?: string }
```

### Event
```ts
payload = { ends_at?: string, venue?: string, price?: number, currency?: string }
```

### Listing
```ts
payload = { price: number, currency: string, rooms?: number, area_m2?: number }
```

### Partner
```ts
payload = { partner_id: string, offer?: string, voucher_available?: boolean }
```

### Quest
```ts
payload = { difficulty?: string, reward_points?: number }
```

### PRO
```ts
payload = { user_id: string, expertise?: string[], languages?: string[], contact_available?: boolean }
```

### Blog Tag
```ts
payload = { tag: string, level: 'city' | 'district' | 'street', deeplink: string }
```

---

## 9. Ranking Signals

- distance  
- time relevance  
- verified signals  
- partner signals  
- popularity (future)  

---

## 10. Graceful Degradation Rules

- отсутствие поля не является ошибкой
- допускается частичная карточка

---

## 11. Mapping

| Домен | Тип |
|------|-----|
| Atlas | place |
| Pulse | event |
| Rielt | listing |
| RF | partner |
| Quest | quest |
| Space | pro |
| Blog | blog_tag |

---

## 12. Out of Scope

- AI personalization  
- search  
- recommendations  
- payments  

---

## 13. Key Principle

> EntityCard — единый язык Guru

---

## 14. Versioning

- v1 — стабильный контракт  
- изменения → version bump  

---

## 15. Final Definition

> EntityCard v1 — унифицированный projection-контракт Guru
