# Capsule Template

Status: `template`  
Use this structure for new Go2Asia AI context capsules.

## Metadata

```text
capsule_id:
status:
primary_domain:
primary_risk:
max_intended_size:
upstream_ssot:
last_verified_against:
```

## Purpose

State why the capsule exists in one or two sentences.

## Scope

Include only the domain and routing boundaries this capsule owns.

## Explicitly Excluded

List what this capsule must not authorize. Keep this section strict.

## Required Reads

Use paths only. Prefer 5-12 entries. Link to upstream SSOT rather than copying it.

## Required Roles

List only roles that should normally be attached for this domain.

## Downstream Consumers

List slice types, agents or workflows that should use the capsule.

## Attach When

List practical triggers.

## Do Not Attach When

List overload and scope-drift cases.

## Allowed / Read-Only / Forbidden Areas

Keep this as routing guidance, not implementation detail.

## Review Gates

Declare the review modes required when the capsule is used.

## Anti-Drift Rules

List short guardrails that prevent hallucinated semantics, overreach and cross-domain leakage.

## Stop Conditions

List conditions where the agent must stop and ask Orchestrator or owner for a narrower slice.
