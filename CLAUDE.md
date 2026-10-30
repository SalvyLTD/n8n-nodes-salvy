@AGENTS.md

# Salvy-specific rules

## Every UI-visible string is English

n8n's verification requires it, and the Salvy API writes its texts in Brazilian
Portuguese. Portuguese reaches the node from three places, each with its own
English map:

| Source                                               | English map                               | If an entry is missing                                   |
| ---------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| Operation and field descriptions in the OpenAPI spec | `scripts/i18n/descriptions.en.json`       | `node scripts/generate.mjs` fails and names the string   |
| Examples in the spec, used as field placeholders     | `scripts/i18n/examples.en.json`           | Passes through **silently**: check every new placeholder |
| Webhook event types from `GET /webhook-event-types`  | `nodes/SalvyTrigger/eventDescriptions.ts` | The event shows by name only, with no description        |

When the spec is refreshed or the API gains events, add the English entries in
the same change. Translate the meaning in plain English (names like "João da
Silva" become "John Smith"); data formats such as CPFs, phone numbers and dates
stay as they are.
