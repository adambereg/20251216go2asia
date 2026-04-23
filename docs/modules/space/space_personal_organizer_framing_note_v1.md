# Space Asia Framing Note — Dashboard-first Space, Trip-first Organizer

## Status

Accepted / Clarification for planning v1

## Context

В предыдущем planning pass `Personal Organizer` был правильно разобран как отдельный travel workspace внутри `Space Asia`, но при этом возник риск слишком доминирующей интерпретации его роли.

Если этот риск не снять явно, `Space Asia` можно начать читать как будто весь модуль должен эволюционировать в trip-first planner shell. Это неверно и опасно, потому что размывает идентичность `Space` как более широкого личного и социального пространства пользователя внутри экосистемы Go2Asia.

Такой перекос опасен по трём причинам:

- он ослабляет dashboard-first природу `Space Asia`;
- он начинает подчинять social/personal sections логике Organizer;
- он создаёт риск, что future planning и architecture решения будут проектировать весь `Space` вокруг trip planning, а не вокруг более широкого personal/social hub.

## Decision

- `Space Asia` остаётся dashboard-first personal/social module.
- `Personal Organizer` является отдельной trip-first section inside `Space Asia`.
- `Personal Organizer` не переопределяет модуль `Space Asia`.
- `Personal Organizer` не заменяет `Dashboard`, `Communities`, `Feed`, `Posts`, `Saved`, `Activity`.
- Trip-first логика применяется локально к внутренней структуре `Personal Organizer`, а не ко всему модулю `Space`.
- `Space Asia` должен сохранять роль личного кабинета / личного пространства / social hub пользователя внутри Go2Asia.

## UX / IA Implication

- `Personal Organizer` должен жить внутри `Space Asia` как отдельная primary section / tab.
- Это отдельный пользовательский контур внутри `Space`, но только один из разделов `Space`, а не новый центр всего модуля.
- `Space` должен сохранять более широкую dashboard-first personal/social структуру.
- `Dashboard` остаётся основной входной поверхностью `Space`.
- `Saved` остаётся самостоятельным разделом глобального сохранённого слоя.
- `Activity` остаётся самостоятельным разделом и не поглощается Organizer автоматически.
- `Communities`, `Feed` и `Posts` сохраняют собственную роль и не становятся вторичными проекциями Organizer.

## Planning Implication

- Все дальнейшие planning / architecture / frontend решения должны исходить из иерархии `Space Asia` > `Personal Organizer`.
- При внедрении Organizer нельзя превращать весь модуль `Space` в planner shell.
- Organizer должен встраиваться в уже существующую dashboard-first природу `Space`, а не подменять её.
- Внутренний trip-first UX Organizer должен проектироваться как локальный режим внутри `Space`, а не как новая идентичность всего модуля.
- При корректировке navigation, shell и implementation slices нужно сохранять баланс между personal/social surfaces `Space` и отдельным Organizer contour.

## Relation to Existing Docs

- Этот framing note не отменяет `docs/modules/space/go_2_asia_personal_organizer_ssot_v_1.md`.
- Этот framing note не отменяет `docs/modules/space/Placement-of-Personal-Organizer-inside-Space-Asia.md`.
- Он уточняет правильную продуктовую иерархию между `Space Asia` и `Personal Organizer`.
- `Personal Organizer SSOT` продолжает определять внутреннюю продуктовую логику Organizer.
- `Placement-of-Personal-Organizer-inside-Space-Asia` продолжает определять то, что Organizer должен жить внутри `Space` как отдельная primary section.
- Этот документ дополнительно фиксирует, что `Space Asia` в целом остаётся dashboard-first personal/social module, а trip-first относится только к Organizer.
