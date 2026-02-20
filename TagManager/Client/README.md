# TagManager Backoffice Client

This is the frontend client for the TagManager package, built for Umbraco v17.

## Development

### Install dependencies
```bash
npm install
```

### Build for development (with watch mode)
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

The output will be generated in `../wwwroot/App_Plugins/TagManager/`

## Structure

- `src/api/` - API service layer and TypeScript types
- `src/dashboard/` - Main dashboard view
- `src/workspace/` - Tag editing workspace
- `src/manifest.ts` - Extension manifests
- `public/` - Static assets including umbraco-package.json

## Technology Stack

- **TypeScript** - Type-safe JavaScript
- **Lit** - Web components framework
- **Vite** - Build tool
- **UUI** - Umbraco UI library










