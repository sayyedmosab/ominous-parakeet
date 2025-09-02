# Builder.io Integration Setup

## Prerequisites

1. Create a Builder.io account at https://builder.io
2. Get your public API key from Builder.io dashboard
3. Install Builder.io dependencies:

```bash
npm install @builder.io/react @builder.io/sdk
```

## Integration Options

### Option 1: Custom Component Registration

Use `BuilderIntegration.tsx` to register your 3D component:

1. **In your main app file**, import the registration:
```tsx
import './components/BuilderIntegration';
```

2. **In Builder.io visual editor**:
   - Your "3D Rubik's Cube Animation" component will appear in the components panel
   - Drag and drop it into any page
   - Configure height, debug mode, and autoplay options

### Option 2: Headless CMS Integration

Use `BuilderPage.tsx` for content-driven pages:

1. **Create content models** in Builder.io:
   - Page title, description, hero text
   - Feature list with icons
   - Animation position settings

2. **Update your App.tsx**:
```tsx
import { BuilderPage } from './components/BuilderPage';

export default function App() {
  return <BuilderPage urlPath={window.location.pathname} />;
}
```

### Option 3: Hybrid Architecture

Use `App-Builder.tsx` for full integration:

1. **Install React Router**:
```bash
npm install react-router-dom
```

2. **Replace your App.tsx** with App-Builder.tsx content

3. **Configure routes**:
   - `/experience` - Pure 3D experience
   - `/` - Builder.io managed home page
   - `/about` - Builder.io managed about page
   - Dynamic pages handled by Builder.io

## Builder.io Configuration

### 1. API Key Setup

Replace `YOUR_BUILDER_PUBLIC_KEY` in the integration files with your actual key:

```tsx
builder.init('your-actual-public-key-here');
```

### 2. Content Models

Create these content models in Builder.io:

**Page Model**:
- `title` (Text)
- `description` (Long Text)
- `heroText` (Long Text)
- `callToAction` (Text)
- `showAnimation` (Boolean)
- `features` (List of Objects with title, description, icon)

**Component Registration**:
Your 3D component will automatically appear in the visual editor after registration.

### 3. Custom CSS for Builder.io

Add to your `globals.css`:

```css
/* Builder.io specific styles */
.builder-content {
  background: transparent;
}

.builder-3d-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* Hide debug info in Builder.io preview */
.builder-preview .fixed.top-4.right-4 {
  display: none;
}
```

## Deployment Considerations

### 1. Environment Variables

Create `.env` file:
```
VITE_BUILDER_PUBLIC_KEY=your-builder-public-key
VITE_BUILDER_PRIVATE_KEY=your-builder-private-key
```

### 2. Build Optimization

For production builds with Builder.io:

```bash
# Build with Builder.io optimizations
npm run build

# Ensure Three.js and Builder.io are properly bundled
```

### 3. Performance Tips

- Use `React.lazy()` for code splitting between 3D and Builder.io content
- Preload 3D assets on Builder.io managed pages
- Use Builder.io's image optimization for marketing content

## Usage Examples

### Marketing Landing Page (Builder.io)
```
/ -> Builder.io managed marketing page with embedded 3D component
```

### Pure 3D Experience
```
/experience -> Your full RubiksCubeExperience component
```

### Hybrid Content Pages
```
/about -> Builder.io content with optional 3D elements
/features -> Builder.io managed with custom 3D components
```

## Troubleshooting

### Common Issues:

1. **Three.js conflicts**: Use the single Three.js import pattern we fixed
2. **Builder.io preview**: 3D may not render in Builder.io preview - use preview mode
3. **Performance**: Large 3D scenes may slow Builder.io editor - use simplified previews

### Debug Mode:

Enable debug mode in your 3D component when using Builder.io:

```tsx
<BuilderRubiksCube enableDebug={true} />
```

This setup gives you the flexibility to use Builder.io for marketing content while preserving your sophisticated 3D experience exactly as designed.