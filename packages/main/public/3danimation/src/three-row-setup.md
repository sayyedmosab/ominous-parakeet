# Three-Row Layout Setup with Builder.io

## Quick Setup for Nav-Content-Footer Layout

### 1. Install Dependencies
```bash
npm install @builder.io/react @builder.io/sdk react-router-dom
```

### 2. Register Components
Import the registration in your main app:

```tsx
// In App.tsx or main.tsx
import './components/BuilderIntegration';
```

### 3. Builder.io Account Setup
1. Create account at https://builder.io
2. Get your public API key
3. Replace `YOUR_BUILDER_PUBLIC_KEY` in the files

### 4. Create Your Three-Row Page in Builder.io

#### Step 1: Page Structure
```
┌─────────────────────────────────────────────┐
│ 🧭 NAVIGATION SECTION                       │
│ • Add: Logo, Menu items, CTA button         │
│ • Height: auto                              │
│ • Background: white/dark theme              │
└─────────────────────────────────────────────┘
│ 📖 CONTENT SECTION                          │
│ • Add: Hero text, features, etc.            │
│ • DRAG: "3D Rubik's Cube (Framed)" here     │
│ • Configure: height=600px, style=rounded    │
│ • Add: More content below                   │
└─────────────────────────────────────────────┘
│ 🦶 FOOTER SECTION                           │
│ • Add: Copyright, links, contact info       │
│ • Height: auto                              │
│ • Background: dark/light theme              │
└─────────────────────────────────────────────┘
```

#### Step 2: Configure 3D Component
When you drag the "3D Rubik's Cube (Framed)" component:

**Settings Panel:**
- **Height**: `600px` (good for content sections)
- **Width**: `100%` (responsive)
- **Container Style**: `rounded` (professional)
- **Enable Debug**: `false` (clean for users)
- **Auto Play**: `true` (demo scroll)
- **Show Scroll Hint**: `true` (helps users understand)

### 5. App.tsx Setup Options

#### Option A: Pure Builder.io (Recommended for Three-Row)
```tsx
import { BuilderComponent, builder } from '@builder.io/react';
import './components/BuilderIntegration';

builder.init('YOUR_BUILDER_PUBLIC_KEY');

export default function App() {
  return (
    <BuilderComponent model="page" />
  );
}
```

#### Option B: Hybrid with Builder.io Pages
```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BuilderComponent, builder } from '@builder.io/react';
import { RubiksCubeExperience } from './components/RubiksCubeExperience';
import './components/BuilderIntegration';

builder.init('YOUR_BUILDER_PUBLIC_KEY');

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Builder.io managed pages with three-row layout */}
        <Route path="/" element={<BuilderComponent model="page" />} />
        <Route path="/about" element={<BuilderComponent model="page" />} />
        
        {/* Optional: Pure 3D experience page */}
        <Route path="/experience" element={
          <div className="size-full bg-black">
            <RubiksCubeExperience />
          </div>
        } />
      </Routes>
    </Router>
  );
}
```

### 6. Example Three-Row Layout in Builder.io

#### Navigation Section:
- **Component**: Section
- **Settings**: `bg-white border-b py-4`
- **Content**: Logo + Menu + CTA Button

#### Content Section:
- **Component**: Section  
- **Settings**: `py-20 px-4`
- **Content**: 
  - Hero Text Block
  - **Your 3D Component** (height: 600px)
  - Features Grid
  - Call-to-Action

#### Footer Section:
- **Component**: Section
- **Settings**: `bg-gray-900 text-white py-12`
- **Content**: Copyright + Links + Contact

### 7. Advanced Configuration

#### Custom Frame Sizes by Section:
- **Hero sections**: `height="80vh"` (large showcase)
- **Content sections**: `height="600px"` (contained demo)  
- **Feature sections**: `height="400px"` (compact preview)

#### Responsive Breakpoints:
- **Desktop**: Full 600px height
- **Tablet**: 400px height (automatic via CSS)
- **Mobile**: 300px height (automatic via CSS)

### 8. User Experience Flow

1. **User visits your site** → See Builder.io three-row layout
2. **Navigation** → Builder.io managed nav with your branding
3. **Content area** → Scroll to see 3D animation in frame
4. **Animation interaction** → Mouse rotation + scroll within frame
5. **More content** → Builder.io managed features/text below
6. **Footer** → Builder.io managed footer with links

### 9. Benefits of This Approach

✅ **Professional Layout**: Builder.io handles site structure  
✅ **Contained Animation**: 3D fits perfectly in content sections  
✅ **No Performance Issues**: Animation only loads when visible  
✅ **Easy Content Updates**: Non-technical team can update text/layout  
✅ **Responsive Design**: Works on all devices  
✅ **SEO Friendly**: Builder.io handles meta tags and structure  

### 10. Troubleshooting

**Animation not showing?**
- Check Builder.io component registration
- Verify API key is correct
- Ensure component is dragged into content area

**Performance issues?**
- Use framed version (not fullscreen) in content sections
- Enable autoPlay only for demo purposes
- Consider lazy loading for below-fold content

**Styling conflicts?**
- The framed component is self-contained
- Uses Tailwind classes that don't conflict
- Dark theme animation works on any background

This setup gives you the perfect three-row website with your sophisticated 3D animation contained beautifully within the content section!