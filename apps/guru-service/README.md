# Guru Service (Step 9 constrained V1)

Nearby-first aggregation/BFF service.

V1 constraints:
- EntityCard v1 contract boundary
- Nearby endpoints only
- Rielt is the only real upstream source
- Atlas/Pulse/RF/Quest/Space/Blog adapters are explicit stubs
- Response meta exposes source activity (`sources_active`, `sources_stub`, `source_item_counts`)
- Upstream-safe query limit is capped to 50
- No Geo Layer, no AI, no search engine
