# Static hosting and editing

This frontend is now designed to build into static files only. It has no Django/API dependency at runtime.

## Where content lives

All catalogue and page content is in `content/site.json`. Every product, category and banner has Uzbek (`uz`), Russian (`ru`) and English (`en`) values. The shared interface wording is in `dictionaries/uz.json`, `dictionaries/ru.json` and `dictionaries/en.json`.

The starter content is intentionally a visual placeholder because the local Django database contains no records. Before removing the old live server, export its API data into `content/site.json`; do not delete the live server until that is done.

## Editor

After deployment, visit `/admin`. The included Decap CMS lets authorised people add product images and edit the multilingual catalogue in the browser. It commits the edits to Git and your host publishes the new static site automatically.

For Netlify, use its Git Gateway/Identity settings, invite editors, and keep `backend.name: git-gateway` in `public/admin/config.yml`. If the default branch is not `main`, change the `branch` value there. The three dictionary JSON files remain ordinary Git files, so they can be edited in GitHub's web editor until a tailored dictionary screen is added.

## Deploy on Netlify

1. Push this project to GitHub.
2. Create a Netlify site from that repository.
3. Set **Base directory** to `frontend`, **Build command** to `npm run build`, and **Publish directory** to `frontend/out` (or `out` when the base directory is already applied by the UI).
4. Add your domain and enable Netlify Identity and Git Gateway.
5. Open `https://your-domain/admin`, invite an editor, and start adding content.

The output directory is `frontend/out`. It can also be uploaded to Cloudflare Pages, GitHub Pages, or any normal static-file host; `/admin` login then needs a GitHub OAuth/Git Gateway configuration.

## Contact form

With `formEndpoint` empty, the contact form opens the visitor's mail application, which needs no service. To receive messages without email software, add a form provider endpoint (for example Formspree) to `formEndpoint`; this does not add a backend to this project.
