# Krishna Theeram: English wedding site for Srinivasa Bharadwaja & Deepika

    npm install
    npm run dev          # http://localhost:3000
    npm run build && npm start

- **Edit details:** `src/config/wedding.ts`. Empty phone, whatsapp and hashtag stay hidden.
- **RSVP storage is NOT configured by default.** Copy `.env.example` to `.env.local` and set `RSVP_STORAGE`.
  The built-in rate limiter is per server process; use a shared store if you run several instances.
- **Hosting:** needs a Node host such as Vercel. The existing GitHub Pages workflow cannot run the RSVP server.
- **Share image:** `public/og.jpg` is static; regenerate it if names or dates change.
- **Personal link:** `/?guest=Name`. **Elders:** `/simple`.
- **Sound:** original synthesised river and drum. Put licensed nadaswaram files in `public/` and set `wedding.audio`.
