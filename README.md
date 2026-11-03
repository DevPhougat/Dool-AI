# DOOL AI

All Your Everyday Tools. One Happy Place.

Next.js (App Router) + TypeScript + Tailwind + Framer Motion + Supabase.

## Status: Phase 5 complete (accounts, database, admin)

52 working tools (34 browser, 18 AI), plus: email sign-up and login, password reset, profiles,
favorites, recently used, a personal dashboard, feedback, newsletter, and an admin dashboard.
Next: Phase 6 (about, contact, privacy and terms pages, sitemap and robots, polish, deployment
guide). Those four pages still 404 until then.

Everything works without Supabase except accounts, favorites, feedback, newsletter and admin,
which show a clear "not set up" message. With Supabase, the tool list, categories and homepage
text come from the database; if the database is empty or unreachable the built-in data is used.

## Supabase setup

1. Create a project at supabase.com. In *Project Settings > API* copy the project URL and the
   `anon` public key into `.env.local`:

        NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
        NEXT_PUBLIC_SUPABASE_ANON_KEY=...

   No service-role key is used anywhere. Never put one in this project.
2. Create the tables and security rules. Open *SQL editor* and run, in this order, the contents of:
   `supabase/migrations/20261101000001_schema.sql`, `...000002_security.sql`, `...000003_functions.sql`
   (or use the Supabase CLI: `supabase link` then `supabase db push`).
3. Add the starter data: run `supabase/seed.sql` in the SQL editor. It is safe to run again
   (existing rows are never overwritten). To regenerate it from `src/data`: `npm run seed:generate`.
4. *Authentication > URL configuration*: set **Site URL** to your site (`http://localhost:3000` while
   developing) and add `http://localhost:3000/auth/callback` and `https://YOUR-DOMAIN/auth/callback`
   to **Redirect URLs**. Sign-in emails and password resets send people back through that address.
5. *Authentication > Providers > Email*: keep "Confirm email" on for a public site. Consider raising
   the minimum password length to 8 to match the forms. Supabase's built-in email sender is limited;
   set up your own SMTP for a real launch.
6. Make yourself an admin. Sign up on the site first, then run this in the SQL editor:

        update public.profiles set role = 'admin'
        where id = (select id from auth.users where email = 'you@example.com');

   Roles can only be changed here, never through the website or API. Admin pages check the role on
   the server, and the database checks it again.
7. Restart `npm run dev`. Visit `/signup`, then `/admin`.

**What the database protects:** every table has Row Level Security. People can only read and change
their own favorites, history and profile (and can't change their own role). Anyone can read published
tools, categories and homepage text. Visitors can add a feedback message or a newsletter address but
cannot read either back. Only admins can change content, read feedback and subscribers, or see stats.

**Adding a tool:** use *Admin > Tools > Add tool* for its listing, then build its interface:
a client tool needs a component in `src/components/tools/impl/` registered in
`src/components/tools/registry.ts`; an AI tool needs a schema in `src/lib/ai/schema.ts` and a prompt in
`src/lib/ai/prompts.ts`. Until then its page says "not ready yet".

**Known limits:** "Most used" counts tool-page visits (anyone can trigger them, so it's a rough signal).
Feedback and newsletter endpoints are rate limited in memory per server instance. For strict limits
and CAPTCHA on public forms, add a shared store such as Upstash Redis.

## AI API configuration

AI tools call `POST /api/ai`, which runs on the server. API keys are read from environment
variables there and are never sent to the browser. Prompts also live only on the server
(`src/lib/ai/prompts.ts`); the browser sends field values, not instructions.

1. Create an API key with Anthropic or OpenAI.
2. Add to `.env.local` (and to your Vercel project's environment variables):

        AI_PROVIDER=anthropic            # or openai
        ANTHROPIC_API_KEY=...            # or OPENAI_API_KEY=...
        AI_MODEL=                        # optional, see below

3. Restart `npm run dev` / redeploy.

Without a key, every AI tool shows a clear "not set up" message with these steps. Nothing is faked.

- **Models:** defaults are `claude-haiku-5-5` (Anthropic) and `gpt-4o-mini` (OpenAI). Model names
  change; confirm the exact name in your provider's console and set `AI_MODEL` if needed. Newer
  OpenAI reasoning-style models (`o*`, `gpt-5*`) are sent without a temperature setting.
- **Costs and limits:** the AI provider charges you per request, and has its own rate limits. This
  site does not promise unlimited use. Each visitor (by IP) is limited to `AI_PER_MINUTE_LIMIT`
  (default 8) and `AI_DAILY_LIMIT` (default 40) requests. The limiter is in memory, so on
  Vercel each serverless instance counts separately. Use a shared store (for example Upstash Redis)
  and per-account limits (Phase 5) for strict control.
- **Privacy:** text is sent from your server to the AI provider to get a result. It is not saved
  to this site's database. Check your provider's data policy and mention it in your privacy page.
- **Adding a vendor:** implement `AiProvider` in `src/lib/ai/provider.ts` and add a case to `getProvider`.
- **Adding an AI tool:** add it to `src/data/tools.ts` (kind "ai"), a schema in `src/lib/ai/schema.ts`,
  a prompt in `src/lib/ai/prompts.ts`, and a line in `src/components/tools/registry.ts`.

### Licensing: read before launch
`@imgly/background-removal` is licensed under AGPL-3.0. Using it in a closed-source commercial site
needs either a commercial license from IMG.LY or publishing your site's source under the AGPL.
Its AI model also downloads from IMG.LY's CDN the first time a visitor uses the tool. To avoid both,
remove `src/components/tools/impl/BackgroundRemover.tsx`, its registry line and the dependency,
or swap in a model you are licensed to use. Everything else uses permissive licenses (MIT/Apache).

### Browser support notes
- PDF to JPG and Strong PDF compression use pdf.js 4, which needs a recent browser (Chrome 119+,
  Firefox 121+, Safari 17.4+). Older browsers show an error message.
- Very large images can exceed a phone's canvas limit; the tools then show a "too large" message.
- Saving WebP needs a browser that can encode it (not older Safari). The tools say so and suggest JPG.

Next: Phase 4 (AI tools: 18 tools, provider adapter, rate limiting), Phase 5 (Supabase, accounts,
admin), Phase 6 (SEO files, polish, deployment guide). Unbuilt AI tools show a "not ready yet" page.
Pages for about, contact, privacy, terms, login, signup, dashboard, favorites and recent still 404.

## Run locally

    npm install
    cp .env.example .env.local
    npm run dev          # http://localhost:3000
    npm run typecheck
    npm run lint
    npm run build

## Customize the look
All colors are RGB triplets in `src/app/globals.css` (`:root`). Tailwind reads them from there.
