# Space Saved and Organizer Intake Note v1

## Status

Accepted for product framing and planning

## Context

После stabilizing passes по `Space Asia` и `Personal Organizer` стало важно явно зафиксировать relationship между global `Saved` и trip-first логикой `Organizer`.

Без этого возникает риск неправильной интерпретации:

- будто внутри Organizer нужен второй полноценный saved-layer;
- будто `Saved` и `Organizer` являются двумя равноправными хранилищами одного и того же;
- будто add-to-trip должен создавать отдельную planner-side saved library.

Такой drift вреден сразу в трёх измерениях:

- он размывает UX clarity между shortlist и trip context;
- он плодит двойную правду в модели данных;
- он усложняет future implementation без реальной продуктовой пользы.

## Decision

- `Space / Saved` является единым global saved layer пользователя внутри `Space`.
- `Organizer` не владеет отдельным duplicate saved layer.
- `Organizer` использует global `Saved` как intake / source layer.
- Trip context внутри `Organizer` не равен второму saved storage; это trip-specific link/context поверх global saved reference.
- Действия `Add to trip`, `Create trip from this`, `Link to trip` по умолчанию означают: global save + trip link.
- Если объект уже сохранён глобально, add-to-trip подтверждает existing global save и добавляет trip link.
- Remove-from-trip не означает remove-from-global-Saved.

## UX Implication

- Пользователь сохраняет объект один раз в global `Saved`.
- Внутри `Organizer` объект не должен читаться как второй saved-object; он должен читаться как объект, привязанный к конкретной поездке.
- Внутри `Organizer` допустим intake view, `from saved` view или `available saved` view, но не второй равноправный saved storage.
- `Saved` остаётся местом общего shortlist / storage of interest.
- `Organizer` остаётся местом, где часть saved-объектов получает trip-specific meaning: trip membership, status, note, task linkage и дальнейшее execution context.

## Data / Model Implication

- Базовая модель должна читаться как `global saved reference` + `trip-specific link/context`.
- `Trip item` лучше трактовать как link/projection в контексте конкретной поездки, а не как вторую независимую копию saved-object.
- Нужны отдельные действия:
- `remove from trip`
- `unsave globally`
- Remove from trip затрагивает только trip context.
- Global unsave является отдельным пользовательским действием и не должен происходить как неявный побочный эффект remove-from-trip.

## Relation to Existing Docs

- Этот note уточняет relationship между global `Saved` и `Organizer`.
- Он не отменяет `docs/modules/space/go_2_asia_personal_organizer_ssot_v_1.md`.
- Он не отменяет `docs/modules/space/space_personal_organizer_framing_note_v1.md`.
- Он не отменяет `docs/modules/space/Placement-of-Personal-Organizer-inside-Space-Asia.md`.
- Он должен читаться совместно с `docs/modules/space/personal_organizer_implementation_plan_v1.md` и `docs/modules/space/space_frontend_shell_alignment_before_organizer_v1.md`.
