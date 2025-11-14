# Building Locally Before Deploying

## Why Production Builds Matter

**Important**: Always test production builds locally before deploying to Vercel!

### The Problem

- **Dev mode (`npm run dev`)**: Uses a more lenient bundler that handles workspace packages automatically
- **Production builds (`npm run build`)**: Uses Turbopack which is stricter and requires explicit configuration for workspace packages

### What Happened

When using workspace packages in a monorepo with Next.js, you need to explicitly tell Next.js to transpile them in production builds using `transpilePackages` in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  transpilePackages: ["nextmq"], // Required for workspace packages
};
```

This configuration is **only needed for production builds**, which is why:
- ✅ `npm run dev` works fine locally
- ❌ `npm run build` fails on Vercel (production builds)

## Testing Production Builds Locally

### Quick Test

```bash
# From the root directory
npm run build
```

This will:
1. Build all packages (including `nextmq`)
2. Build all apps (including `marketing`)
3. Catch production build errors before deploying

### Clean Build (No Cache)

If you suspect caching issues:

```bash
npm run build:clean
```

This forces a fresh build without using Turbopack cache.

### Before Pushing to Git

Always run a production build before pushing:

```bash
npm run build
```

Or use the prepush script:

```bash
npm run prepush
```

## Vercel Build Cache

If Vercel still shows errors after fixing the config:

1. **Clear Vercel's build cache**: In Vercel dashboard → Settings → Build & Development Settings → Clear Build Cache
2. **Or redeploy**: Push a new commit to trigger a fresh build

## Best Practices

1. ✅ Always run `npm run build` locally before pushing
2. ✅ Test production builds in CI/CD (GitHub Actions, etc.)
3. ✅ Add `transpilePackages` for all workspace packages
4. ✅ Document workspace dependencies in README

## Related Files

- `apps/marketing/next.config.ts` - Contains `transpilePackages` configuration
- `turbo.json` - Defines build dependencies (`dependsOn: ["^build"]`)

