# 🚀 Pause Frontend Deployment

## Automatic Deployment Status

This frontend is configured for automatic deployment to Vercel.

### Deployment Triggers

- **Production**: Push to `main` branch
- **Preview**: Push to `develop` or `claude/**` branches
- **Pull Requests**: Automatic preview deployment with comments

### Current Configuration

- **Platform**: Vercel
- **Framework**: Next.js 14
- **Region**: Seoul (icn1)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Deployment Workflow

Every push to tracked branches automatically triggers:
1. GitHub Actions workflow (`.github/workflows/vercel-deploy.yml`)
2. Node.js 18 setup
3. Dependencies installation (`npm install`)
4. Vercel environment pull
5. Next.js build (`vercel build`)
6. Deployment to Vercel
7. Deployment status update

### View Deployments

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Actions**: https://github.com/joshweb83/Pause/actions

---

Last updated: 2025-11-04
Auto-deployment: ✅ Enabled
