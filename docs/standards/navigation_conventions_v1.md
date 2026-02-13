## Navigation Conventions v1 (Tag & Category Navigation)

**Статус**: standard v1  
**Область**: все модули (Atlas, Pulse, Blog, Guru, Rielt, …)  
**Цель**: универсальное правило навигации по тегам и категориям через URL-параметры.

См. также:
- `docs/standards/search_conventions_v1.md`
- `docs/modules/atlas/category_axis_v1.md`

---

## Принцип

**Любой клик по тегу или категории в UI должен вести на соответствующий листинг с уже активированным фильтром через URL.**

Это правило распространяется на все модули Go2Asia (Atlas/Pulse/Blog/Guru/Rielt…).

---

## Правило навигации

### 1. Формирование ссылок

Использовать утилиты из `apps/go2asia-pwa-shell/modules/atlas/utils/navigation.ts`:

- **`buildTagLink(module, tag, subModule?, additionalParams?)`**
  - Формирует ссылку с параметром `tags=<tag>` (CSV формат)
  - Пример: `/atlas/places?tags=cafe&kind=business`

- **`buildCategoryLink(module, categoryKey, subModule?, additionalParams?)`**
  - Формирует ссылку с параметром `categoryKey=<key>`
  - Пример: `/atlas/places?categoryKey=food_drink&kind=business`

### 2. Чтение параметров из URL

**Любой listing-экран должен:**

1. Читать параметры из URL при первом рендере:
   - `categoryKey` → инициализировать фильтр категории
   - `tags` (CSV) → парсить и инициализировать фильтр тегов
   - `kind` → инициализировать фильтр типа (если применимо)
   - Другие параметры согласно `search_conventions_v1.md`

2. Применять фильтры из URL к выдаче:
   - Фильтрация может быть client-side (если API не поддерживает)
   - Но фильтры должны быть активны сразу при загрузке страницы

3. Синхронизировать изменения фильтров обратно в URL:
   - При изменении фильтров пользователем обновлять URL через `router.replace()`
   - Сохранять остальные активные фильтры в URL

### 3. Пример реализации (Atlas Places)

```typescript
// Чтение параметров из URL
const searchParams = useSearchParams();
const categoryKey = searchParams.get('categoryKey') || '';
const tagsParam = searchParams.get('tags') || '';
const tags = tagsParam 
  ? new Set(tagsParam.split(',').map(t => t.trim()).filter(Boolean))
  : new Set<string>();

// Инициализация state из URL
const [selectedCategory, setSelectedCategory] = useState(categoryKey);
const [selectedTags, setSelectedTags] = useState(tags);

// Синхронизация state → URL
const updateURLWithFilters = (filters) => {
  const params = new URLSearchParams();
  if (filters.categoryKey) params.set('categoryKey', filters.categoryKey);
  if (filters.tags?.size > 0) params.set('tags', Array.from(filters.tags).join(','));
  router.replace(`/atlas/places?${params.toString()}`, { scroll: false });
};
```

---

## Требования к модулям

### Atlas

- **Places**: поддерживает `categoryKey`, `tags` (CSV), `kind`, `countryId`, `cityId`
- **Guides**: (планируется) поддерживает `categoryKey`, `tags`
- **Themes**: (планируется) поддерживает `categoryKey`

### Pulse

- (Планируется) поддерживает `categoryKey`, `tags` для событий

### Blog

- (Планируется) поддерживает `categoryKey`, `tags` для статей

### Guru / Rielt

- (Планируется) поддерживает соответствующие фильтры через URL

---

## Чек-лист для реализации

При добавлении навигации по тегам/категориям в новый модуль:

- [ ] Используются `buildTagLink()` / `buildCategoryLink()` для формирования ссылок
- [ ] Listing-экран читает параметры из URL при первом рендере
- [ ] Фильтры применяются к выдаче сразу при загрузке страницы
- [ ] Изменения фильтров синхронизируются обратно в URL
- [ ] Соответствует формату параметров из `search_conventions_v1.md`:
  - `tags=tag1,tag2` (CSV)
  - `categoryKey=<key>`
  - `kind=<type>` (если применимо)

---

## Примеры использования

### В карточке Place/Showplace

```typescript
// Категория
<CategoryBadge categoryKey={getCategoryKeyFromTags(data.tags)} kind={data.kind} />

// Теги
<TagRow tags={data.tags} kind={data.kind} />
```

### В листинге Places

```typescript
// Чтение из URL
const searchParams = useSearchParams();
const categoryKey = searchParams.get('categoryKey') || '';
const tagsParam = searchParams.get('tags') || '';

// Применение фильтров
const filteredPlaces = places.filter(place => {
  if (categoryKey) {
    const placeCategory = getCategoryKeyFromTags(place.tags);
    if (placeCategory !== categoryKey) return false;
  }
  if (tags.size > 0) {
    return Array.from(tags).some(tag => place.tags.includes(tag));
  }
  return true;
});
```

---

## Версионирование

- **v1**: текущая версия (URL как источник истины, синхронизация state ↔ URL)
- **v2**: (планируется) поддержка сохранения фильтров в localStorage, deep linking с полным state
