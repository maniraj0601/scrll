# Research tooling (Apify MCP)

How `ux-competitor-research` (and anyone doing manual competitive research) gets real, current
evidence instead of relying on marketing copy or stale training data — plus the tradeoff that comes
with it. Read this before scraping anything, not after.

## What's configured

`.mcp.json` registers Apify's hosted MCP server:

```json
{
  "mcpServers": {
    "apify": {
      "type": "http",
      "url": "https://mcp.apify.com",
      "headers": { "Authorization": "Bearer ${APIFY_TOKEN}" }
    }
  }
}
```

This is inert until you set `APIFY_TOKEN` in your own environment — a fresh machine without it set
just doesn't have a working Apify connection (Claude Code shows a warning, nothing else breaks).
Get a token from [apify.com](https://apify.com) (free account includes ~$5/month of platform usage)
and `export APIFY_TOKEN=...` in your shell, or set it in `.claude/settings.local.json` (machine-
local, never committed).

Once connected, the agent discovers tools dynamically — use `ToolSearch` with a query like
`"apify instagram"` or `"apify search actors"` to find and load them, same as any other deferred
tool in this environment. Apify's store has thousands of community "Actors" (scrapers/automations)
covering Instagram, Pinterest, TikTok, Google Search, and most other sites `ux-competitor-research`
cares about — this is why it's registered as an MCP server rather than a disposable script like the
Playwright pattern in `docs/AGENT_MODEL_ROUTING.md`: the value here is *dynamic discovery* across a
catalog neither of us can hardcode in advance, which a static script can't replicate. If you already
know you only ever want one specific Actor, you can pin the server to just that tool and cut the
discovery overhead: append `?tools=apify/instagram-scraper` to the `url` above.

## The Instagram example

Apify's `instagram-scraper` Actor (and several more specialized Instagram Actors in their store)
returns structured post/profile data: captions, like/comment counts, media URLs, timestamps. For
this project that's useful for exactly one thing: grounding `docs/UI_UX_RESEARCH.md` in what's
actually posted and how it's actually presented, instead of a competitor's own marketing
description of their feature.

## Cost

Connecting is free. Running an Actor bills your Apify account at that Actor's own rate, drawn from
your account's balance (the free tier is roughly $5/month of platform usage). Pass `maxItems` or
`maxTotalChargeUsd` in the call to cap what a single run can cost — do this by default for anything
exploratory, not just for a known-expensive run.

## The tradeoff you're accepting — read this before using it

Instagram's Terms of Use prohibit automated scraping/data collection without Meta's permission.
Apify's own documentation doesn't mention this, and running their Instagram Actor doesn't ask you to
confirm you've read Instagram's terms — that omission doesn't make it compliant. Concretely:

- This is a **ToS violation**, not a gray area about the underlying data being public. Scraping
  public posts is sometimes legally distinguishable from unauthorized-access law in some
  jurisdictions (see *hiQ v. LinkedIn* in the US), but that's a separate question from breaching
  Instagram's own terms, which is a contract question regardless of jurisdiction.
- Practical exposure for this project's use case (occasional, low-volume, internal design research,
  never republishing scraped content) is low, but not zero — Meta has pursued both account
  enforcement and legal action against larger scraping operations.
- Use a throwaway/non-primary account's token if you're at all concerned about enforcement touching
  an account that matters to you, keep volume low, and never store or republish scraped Instagram
  content in this repo (`docs/UI_UX_RESEARCH.md` should capture *findings* — "the active filter
  reveals an intensity slider on second tap" — not reproduced captions, images, or video).

If that tradeoff isn't acceptable for your situation, don't set `APIFY_TOKEN` — every other part of
`ux-competitor-research` (WebSearch, WebFetch, manually reading public posts) still works without it.

## Why not the same approach for every research need

Apify's dynamic-actor-discovery case is the exception, not the new default. For anything where you
already know exactly what automation you need (a one-off browser check, a specific API call), a
disposable script via Bash stays cheaper and simpler — see
[docs/AGENT_MODEL_ROUTING.md](AGENT_MODEL_ROUTING.md)'s "prefer CLI/scripts over MCP servers"
section. Don't register a new MCP server for a need a script already covers.
