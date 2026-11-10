---
name: test-driven-development
description: "Use when the user requests test-first work or the implementer/QA selects a meaningful automated regression check for a behavioral change."
---

# Test-first regression work — harness edition

Adapted from obra/superpowers under MIT. See [notice](../../THIRD_PARTY_NOTICES.md). Selection follows the harness risk policy, not a blanket requirement to test every edit.

1. Choose one observable acceptance case or original bug trigger. Exercise the public behavior with realistic inputs and only unavoidable mocks; avoid tests that merely repeat implementation details.
2. Add the smallest useful regression test and run it against the prior behavior. Confirm the failure is the intended missing/incorrect behavior rather than setup, syntax or environment failure. Existing code and unrelated work stay intact; use an isolated fixture or patch when a before/after comparison is needed.
3. Implement the smallest authorized correction, rerun the test and relevant affected checks, then refactor only within scope while results stay green. QA may design or run checks; production edits return to the implementer.
4. Record the actual failing and passing outcomes with content identity. If only a post-change pass was observed, call it a passing check rather than a demonstrated regression detector. Unavailable execution stays NOT_RUN. Low-impact wording/layout work uses focused verification instead of artificial test suites.

