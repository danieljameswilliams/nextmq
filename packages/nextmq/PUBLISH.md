# Publishing NextMQ to npm

## Prerequisites

1. Make sure you're logged into npm:
   ```bash
   npm login
   ```

2. Ensure the package is built:
   ```bash
   npm run build
   ```

## Publishing

1. **Publish to npm** (from `packages/nextmq` directory):
   ```bash
   cd packages/nextmq
   npm publish
   ```
   
   This will automatically:
   - Run tests (`prepublishOnly` script)
   - Build the package
   - Publish to npm

2. **After publishing**, update the marketing app to use the published version:
   ```bash
   cd ../../apps/marketing
   npm install nextmq@latest
   ```

3. **Remove `transpilePackages`** from `apps/marketing/next.config.ts` since it's no longer needed:
   ```typescript
   const nextConfig: NextConfig = {
     reactCompiler: true,
     // transpilePackages: ["nextmq"], // No longer needed!
   };
   ```

4. **Test the build**:
   ```bash
   npm run build
   ```

## Updating Versions

When making changes:

1. Update version in `package.json`:
   ```bash
   npm version patch  # 0.1.0 -> 0.1.1
   npm version minor  # 0.1.0 -> 0.2.0
   npm version major  # 0.1.0 -> 1.0.0
   ```

2. Publish:
   ```bash
   npm publish
   ```

3. Update the marketing app:
   ```bash
   cd ../../apps/marketing
   npm install nextmq@latest
   ```

## Publishing a Beta/RC Version

```bash
npm version 0.2.0-beta.1
npm publish --tag beta
```

Then install with:
```bash
npm install nextmq@beta
```

