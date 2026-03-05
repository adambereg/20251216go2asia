## Blog Asia: staging import + verify

### Предпосылки
- **Markdown canon**: `content/blog/2026/*.md`
- **Hero media (R2)**: `blog/2026/<slug>/hero.jpg` в bucket `go2asia-media`

### Переменные окружения
- **staging DB**:
  - `STAGING_DATABASE_URL` (GitHub secret)
  - `ENVIRONMENT=staging`
- **media public base**:
  - `MEDIA_PUBLIC_BASE_URL` (желательно задать одинаково для staging/prod)

### Применить миграции (staging)

```bash
pnpm -C packages/db db:ddl:apply:staging
```

### Импортировать blog markdown → Neon

#### Dry-run (без записей в БД)

```bash
pnpm -C packages/db db:import:blog-md -- --dry-run
```

#### Apply (запись в БД)

```bash
pnpm -C packages/db db:import:blog-md -- --apply
```

#### Apply только одного поста

```bash
pnpm -C packages/db db:import:blog-md -- --apply --only-slug <slug>
```

### GitHub Actions (staging)
Workflow: `Import Blog Posts (staging)` (`.github/workflows/import-blog-staging.yml`)
- `apply_ddl`: применить миграции перед импортом
- `dry_run`: dry-run vs apply
- `only_slug`: импорт одного поста

### Проверка API (через Gateway)
Убедитесь, что `NEXT_PUBLIC_API_URL` указывает на staging gateway.

Примеры:

```bash
curl -s "$NEXT_PUBLIC_API_URL/v1/content/blog/posts?limit=5&sort=newest" | jq .
curl -s "$NEXT_PUBLIC_API_URL/v1/content/blog/posts?limit=5&sort=popular" | jq .
curl -s "$NEXT_PUBLIC_API_URL/v1/content/blog/posts?limit=5&sort=featured" | jq .
curl -s "$NEXT_PUBLIC_API_URL/v1/content/blog/posts?limit=5&q=bangkok" | jq .
curl -s "$NEXT_PUBLIC_API_URL/v1/content/blog/posts/<slug>" | jq .
```

Ожидаемое:
- `items[].heroUrl` не `null` (если `MEDIA_PUBLIC_BASE_URL` корректен и ключи в R2 по канону)
- `items[].tags` массив строк
- `items[].author.displayName` заполнен (если есть `author.display_name` во frontmatter; иначе будет дефолт)

### Проверка UI (PWA Shell)
- Лента: `/blog`
- Пост: `/blog/<slug>`

Ожидаемое:
- нет обращения к мокам (нет “MOCK DATA” бейджей/фоллбеков)
- hero отображается
- markdown рендерится безопасно (без raw HTML), блоки ```block type:list/table``` отображаются как list/table

