# SEO & Deployment Guide

## ✅ Completed Tasks

### 1. Dynamic Routes Added
- `/movie/:id` - Individual movie pages with SEO metadata
- `/actors/:id` & `/actors/:name` - Actor detail pages
- `/genres/:genre` - Genre-filtered movie list

### 2. React-Helmet Integration
- Installed `react-helmet` for dynamic meta tag management
- Created `src/utils/SEO.jsx` with reusable SEO components:
  - `MovieSEO` - Meta tags for movie pages
  - `ActorSEO` - Meta tags for actor pages
  - `GenreSEO` - Meta tags for genre pages
  - `DefaultSEO` - Default home page meta tags

### 3. Open Graph Tags
- Updated `public/index.html` with:
  - Open Graph tags for social sharing
  - Twitter Card tags for Twitter sharing
  - Enhanced meta descriptions

### 4. SEO Files Created
- **sitemap.xml** - XML sitemap for search engines
- **robots.txt** - Crawler instructions and crawl rate limits

### 5. Vercel Configuration
- Created `vercel.json` for proper deployment routing
- SPA routing configured to serve index.html for all routes

---

## 📋 Next Steps: Deployment

### Option A: Deploy to Vercel (Recommended)

1. **Sign up at Vercel**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from project root**
   ```bash
   vercel
   ```
   - Connect your GitHub account
   - Select repository
   - Vercel will auto-detect React app
   - Production URL will be provided

3. **Set Environment Variables**
   ```bash
   vercel env add REACT_APP_TMDB_KEY
   ```
   - Enter your TMDB API key
   - Vercel will show your production URL

### Option B: Deploy to Netlify

1. **Sign up at Netlify**
2. **Create `netlify.toml`** in project root:
   ```toml
   [build]
   command = "npm run build"
   publish = "build"
   
   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

3. **Deploy**
   - Go to netlify.com
   - Connect GitHub repo
   - Deploy automatically

---

## 🔍 Google Search Console Setup

1. **Visit Google Search Console**
   - Go to: https://search.google.com/search-console

2. **Add Property**
   - Select "URL prefix"
   - Enter your deployed domain (e.g., `https://recomovie.vercel.app`)
   - Click "Continue"

3. **Verify Ownership**
   - Add DNS record (recommended for Vercel)
   - Or upload HTML verification file to public/

4. **Submit Sitemap**
   - Go to Sitemaps section
   - Add: `https://yourdomain.com/sitemap.xml`

5. **Monitor**
   - Check Performance tab for search queries
   - Fix crawl errors if any appear
   - Monitor indexing status

---

## 🎯 SEO Implementation Details

### Current SEO Tags

#### Home Page (`/`)
- Title: "Recomovie - Movie Recommendations & Reviews"
- Meta Description: "Discover movies, read reviews, and get personalized movie recommendations."

#### Movie Pages (`/movie/:id`)
- Dynamic title with movie name
- Movie poster as OG image
- Movie overview in description
- Canonical URL setup

#### Actor Pages (`/actors/:id`)
- Actor name as title
- Proper Open Graph type: "profile"
- Twitter card for sharing

#### Genre Pages (`/genres/:genre`)
- Genre name in title
- Pagination support in canonical URLs

---

## 🔗 Using SEO Components in Components

### Example: MovieInfo.jsx
```jsx
import { MovieSEO } from '../../utils/SEO';

function MovieInfo() {
  const { data } = useGetMovieQuery(id);
  
  return (
    <>
      {data?.title && (
        <MovieSEO
          title={data.title}
          description={data?.overview}
          image={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          movieId={id}
        />
      )}
      {/* Rest of component */}
    </>
  );
}
```

### Example: Actors.jsx
```jsx
import { ActorSEO } from '../../utils/SEO';

function Actors() {
  const { data: actor } = useGetActorQuery(id);
  
  return (
    <>
      {actor?.name && (
        <ActorSEO
          name={actor.name}
          description={actor?.biography || ''}
          image={`https://image.tmdb.org/t/p/w500/${actor?.profile_path}`}
          actorId={id}
        />
      )}
      {/* Rest of component */}
    </>
  );
}
```

---

## 📊 SEO Best Practices

### ✅ Do's
- Use descriptive, keyword-rich titles (50-60 chars)
- Keep meta descriptions under 160 characters
- Use proper heading hierarchy (h1, h2, h3...)
- Optimize images with alt text
- Use semantic HTML
- Ensure mobile responsiveness (already done with MUI)
- Use canonical URLs to avoid duplicates

### ❌ Don'ts
- Keyword stuffing in titles/descriptions
- Duplicate meta descriptions
- Oversized images without compression
- Missing alt text on images
- Heavy JavaScript without server-side rendering

---

## 🚀 Performance Tips

1. **Image Optimization**
   - Use TMDB image CDN (already done)
   - Consider next-gen formats (WebP)

2. **Code Splitting**
   - React Router provides lazy loading
   - Consider React.lazy() for large components

3. **Caching**
   - Vercel provides automatic caching
   - Set cache headers in vercel.json

4. **Core Web Vitals**
   - Monitor in Google Search Console
   - Optimize for LCP, FID, CLS

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Google Search Console Help**: https://support.google.com/webmasters
- **React-Helmet Docs**: https://github.com/nfl/react-helmet
- **Open Graph Protocol**: https://ogp.me/

---

## 🎉 Summary

Your Recomovie app is now:
- ✅ SEO-optimized with dynamic meta tags
- ✅ Ready for search engine indexing
- ✅ Configured for Vercel deployment
- ✅ Set up for Google Search Console
- ✅ Sharing-ready with Open Graph tags

**Next Action**: Deploy to Vercel and submit sitemap to Google Search Console!
