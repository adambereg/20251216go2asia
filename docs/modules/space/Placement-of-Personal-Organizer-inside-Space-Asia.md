# Placement of Personal Organizer inside Space Asia

Status
Accepted for v1
Decision
Personal Organizer размещается внутри модуля Space Asia как отдельная primary section / tab.
Он не должен быть спрятан внутри feed, profile, saved или другой вторичной секции.
Внутри Space Asia Organizer должен существовать как самостоятельный пользовательский контур с собственной внутренней навигацией и собственным UX-режимом.

---

## Why this decision is made

Personal Organizer по своей природе является не просто функцией сохранения, а личным travel workspace пользователя.
Он работает с:
•	поездками, 
•	saved-to-trip logic, 
•	задачами, 
•	напоминаниями, 
•	планом по дням, 
•	картой, 
•	маршрутным контекстом, 
•	AI-подсказками, 
•	действиями в ходе поездки. 
Это уже отдельный режим пользовательского поведения, принципиально отличный от:
•	чтения ленты, 
•	просмотра постов, 
•	социальных взаимодействий, 
•	общения, 
•	общего сохранённого контента. 
Если встроить Organizer как маленький блок внутрь обычного интерфейса Space, он потеряет ясность и будет создавать когнитивный шум.

---

## Product interpretation

Space Asia — это личное и социальное пространство пользователя.
Personal Organizer — это личное пространство его поездок внутри этого пространства.
Именно поэтому Organizer логично “паркуется” в Space Asia, но должен жить там как самостоятельная секция, а не как вторичная функция.
Короткая формулировка:
Personal Organizer — это личный travel workspace внутри Space Asia.

---

## UX implication

На верхнем уровне Space Asia для Organizer должна существовать отдельная вкладка / отдельный вход первого уровня.
Пример допустимой логики верхнего уровня:
•	Feed 
•	Saved 
•	Organizer 
•	Profile 
или, если saved layer частично поглощается Organizer:
•	Feed 
•	Organizer 
•	Connections 
•	Profile 
Внутри самого Organizer допускается собственная навигация второго уровня, например:
•	Overview 
•	Trips 
•	Saved 
•	Plan 
•	Map 
•	Tasks 
•	AI 

---

## Boundary clarification

Нужно различать:
1. Global Saved inside Space
Общий пользовательский слой сохранённого.
2. Organizer trip context
Контекст конкретных поездок и действий внутри них.
Это не одно и то же.
Следовательно:
•	общий saved layer может жить в Space, 
•	Organizer использует его как источник, 
•	но внутри Organizer формируется отдельная логика: add to trip, trip status, plan, tasks, reminders, map, next step. 

---

## Architectural implication

Это решение означает следующее:
•	Organizer не выделяется в отдельный top-level module экосистемы, 
•	Organizer остаётся частью Space Asia, 
•	но внутри Space получает собственный navigation contour, 
•	собственную information architecture, 
•	и собственный trip-first UX. 

---

##Final statement

Personal Organizer должен быть размещён внутри Space Asia как отдельная primary section / tab, потому что он представляет собой самостоятельный личный контур управления поездками и требует отдельного навигационного, продуктового и UX-пространства.

