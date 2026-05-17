# Connect Asia — API Contracts

> **Legacy/historical document (not runtime API SSOT).**
> Stage 6.5.3 reading guard: this file must not be treated as an active wallet, G2A, NFT, token, payout, withdrawal, or financial-account contract. Current Connect surfaces should use backend-backed read-only Points/referral/badge projections only.

Базовый префикс:
/api/connect

---

# 1. Points API

## GET /points/balance
Ответ:
{
  "points": 3500,
  "g2a_future": "future-only / hidden unless separately activated",
  "nft_future": "future-only / hidden unless separately activated"
}

## GET /points/history
Параметры: module, type, period  
Ответ: [...internal Points/activity entries...]

---

# 2. Levels API

### GET /levels
{
  "level": 12,
  "xp": 750,
  "xp_to_next": 1000
}

---

# 3. Achievements API

### GET /achievements  
### POST /achievements/claim (target wording only; backend authority required)

---

# 4. Missions API

### GET /missions  
### POST /missions/start  
### POST /missions/complete_step  
### POST /missions/finish  

---

# 5. Referral API

### GET /referrals  
### POST /referrals/invite  
### GET /referrals/stats  

---

# 6. Analytics API

### GET /analytics/points  
### GET /analytics/sources  
### GET /analytics/referrals  

---

# Error format

{
  "error": {
    "code": "POINTS_NOT_ENOUGH",
    "message": "Недостаточно Points"
  }
}
