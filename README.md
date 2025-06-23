# Instagram Media Downloader API (Next.js / Vercel)

## 📦 Features

- `/api/reel?url=...` → Download Instagram Reel video URL
- `/api/post?url=...` → Download images/videos from a post
- `/api/profile?username=...` → Get HD profile picture

## 🚀 Deploy on Vercel

1. Push this folder to GitHub.
2. Import into [vercel.com](https://vercel.com) as a project.
3. Done! Use your domain like:

```
https://your-deployment-url.vercel.app/api/reel?url=https://www.instagram.com/reel/XXXX
```

## 📂 Folder Structure

```
/pages/api/reel.js
/pages/api/post.js
/pages/api/profile.js
/vercel.json
```

## 🔐 Notes

- This API uses scraping — it may break if Instagram updates layout.
- Add proxy if using heavily.