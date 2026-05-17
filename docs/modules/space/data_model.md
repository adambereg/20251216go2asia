# Space Asia — Data Model

Stage 6.5.3 reading guard: Space data model is a social/module planning artifact, not wallet, token, NFT, payout, or financial-account design. Points/G2A/NFT-style fields must be read as deferred Connect/economy projections unless runtime-backed elsewhere.

## 1. User
- id
- username
- avatar_url
- role: traveler | expat | pro | business
- level
- xp
- points_projection (Connect-owned internal Points summary)
- g2a_future_projection (future-only; not current balance)
- badge_ids[] / nft_future_ids[] (badges now; NFT future-only)
- referral_code
- referred_by?
- created_at

---

## 2. Post
- id
- author_id
- type: text | photo | gallery | poll | repost | guide | event | place | quest_progress
- text
- media_urls[]
- poll_options[]
- poll_results[]
- referenced_entity_id? (place/event/quest/article)
- target_type? (only for type=repost): blog_post | place | event | partner | quest | listing
- target_id? (only for type=repost): string
- created_at
- updated_at
- visibility: public | friends | private
- tags[]

### Repost (Post.type = `repost`)

Репост — это отдельный пост Space, который ссылается на исходный объект экосистемы и является точкой обсуждения (social-first). Inline-комментарии “под объектами” модулей (Blog/Atlas/Pulse/RF/Rielt) не используются — обсуждение идёт через репост и комментарии к нему в Space.

- author_id — автор репоста
- target_type — тип исходного объекта (`blog_post` | `place` | `event` | `partner` | `quest` | `listing`)
- target_id — идентификатор исходного объекта
- text (optional) — контекст/мнение автора
- created_at / updated_at

---

## 3. FeedItem
Материал, который появляется в персональной ленте.

- id
- post_id
- reason: my_post | liked | friend_post | system_recommend | quest_completed | voucher_purchase
- created_at

---

## 4. Reaction
- id  
- post_id  
- user_id  
- type: like | love | wow | angry | info  
- created_at

---

## 5. Comment
- id
- post_id
- user_id
- text
- media?
- created_at

Примечание: комментарии существуют только на объектах Space (пост/репост), а не “под” исходными объектами контентных модулей.

---

## 6. Achievement
- id
- user_id
- type
- points_reward
- achieved_at

Примеры:
- “Первый пост”
- “Взял 10 квестов”
- “100 лайков на посте”

---

## 7. Badges / Future NFT Compatibility
- id
- owner_id
- title
- description
- icon_url
- rarity: common | rare | epic | legendary
- earned_at

Current reading: off-chain badge / achievement. NFT ownership, mint, burn, transfer and wallet semantics are future-only.

---

## 8. Referral
- id
- inviter_id
- friend_id
- points_reward_user (internal Points recognition where runtime-backed)
- points_reward_friend (internal Points recognition where runtime-backed)
- created_at

---

## 9. Notification
- id
- user_id
- type: like | comment | follow | reward | quest_complete | voucher | system
- text
- entity_id?
- created_at

---

## 10. Voucher (интеграция RF)
- id
- user_id
- partner_id
- points_used_internal (internal utility only; not payment or payout)
- expires_at
- is_used

---

## 11. QuestProgress (интеграция Quest Asia)
- id
- user_id
- quest_id
- completed_steps
- status
