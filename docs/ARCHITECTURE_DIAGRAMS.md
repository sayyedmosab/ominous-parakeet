# Architecture Diagrams

## System Overview

```mermaid
graph TB
    Main[Main Application<br/>packages/main/]
    Dash[Dashboard<br/>packages/dashboard/]
    Heat[Heatmap<br/>packages/heatmap/]
    Chat[Chatbot<br/>packages/chatbot/]
    Arch[Architect<br/>packages/architect/]
    Weather[Weathermap<br/>packages/weathermap/]
    Supa[Supabase<br/>Database & Realtime]
    Shared[Shared Resources<br/>components/, hooks/, data/]
    
    Main --> Dash
    Main --> Heat
    Main --> Chat
    Main --> Arch
    Main --> Weather
    Main --> Shared
    
    Dash --> Supa
    Heat --> Supa
    Chat --> Supa
    Arch --> Supa
    Weather --> Supa
    Dash --> Shared
    Heat --> Shared
    Chat --> Shared
    Arch --> Shared
    Weather --> Shared
    
    classDef main fill:#e1f5fe,stroke:#01579b
    classDef service fill:#f3e5f5,stroke:#7b1fa2
    classDef data fill:#e8f5e8,stroke:#2e7d32
    classDef shared fill:#fff3e0,stroke:#f57c00
    
    class Main main
    class Dash,Heat,Chat,Arch,Weather service
    class Supa data
    class Shared shared
```

## Data Flow Sequence

```mermaid
sequenceDiagram
    participant User as Business Leader
    participant Main as Main App
    participant Package as Micro-frontend
    participant Shared as Shared Resources
    participant Supabase as Supabase
    participant AI as AI Services

    User->>Main: Access transformation platform
    Main->>Shared: Load shared components & utilities
    Main->>Package: Load specific micro-frontend
    Package->>Shared: Utilize shared functionality
    Package->>Supabase: Request assessment data
    Supabase-->>Package: Return real-time data
    Package->>AI: Request AI insights (optional)
    AI-->>Package: Return analysis & recommendations
    Package-->>User: Render interactive interface
```

## Monorepo Structure

```mermaid
graph TD
    Root[Workspace Root<br/>/workspaces/twintech/]
    
    subgraph Packages [Micro-frontend Packages]
        Main[packages/main/<br/>Orchestrator]
        Dash[packages/dashboard/<br/>Metrics & KPIs]
        Heat[packages/heatmap/<br/>Capability Assessment]
        Chat[packages/chatbot/<br/>AI Consulting]
        Arch[packages/architect/<br/>LMS Framework]
        Weather[packages/weathermap/<br/>Weather Heatmaps]
    end
    
    subgraph Shared [Shared Resources]
        Comp[components/<br/>Reusable Components]
        Hooks[hooks/<br/>Custom Hooks]
        Data[data/<br/>Types & Constants]
    end
    
    subgraph Docs [Documentation]
        ArchDoc[docs/ARCHITECTURE.md]
        Diagrams[docs/ARCHITECTURE_DIAGRAMS.md]
    end
    
    Root-->Packages
    Root-->Shared
    Root-->Docs
    
    Main-->Comp
    Main-->Hooks
    Main-->Data
    Dash-->Comp
    Dash-->Hooks
    Heat-->Comp
    Chat-->Comp
    Arch-->Comp
```

## Deployment Architecture

```mermaid
graph LR
    subgraph Frontend [Frontend Deployment]
        Vercel[Vercel/Netlify]
    end
    
    subgraph Backend [Backend Services]
        Supabase[Supabase Cloud<br/>PostgreSQL + Realtime]
    end
    
    subgraph Packages [Deployed Packages]
        MainDeploy[Main App Deployment]
        DashDeploy[Dashboard Deployment]
        HeatDeploy[Heatmap Deployment]
        ChatDeploy[Chatbot Deployment]
        ArchDeploy[Architect Deployment]
        WeatherDeploy[Weathermap Deployment]
    end
    
    subgraph Development [Development Environment]
        Local[Local Development<br/>Hot-reload enabled]
        Monorepo[Monorepo Structure<br/>Shared dependencies]
    end
    
    Vercel-->MainDeploy
    Vercel-->DashDeploy
    Vercel-->HeatDeploy
    Vercel-->ChatDeploy
    Vercel-->ArchDeploy
    Vercel-->WeatherDeploy
    
    MainDeploy-->Supabase
    DashDeploy-->Supabase
    HeatDeploy-->Supabase
    ChatDeploy-->Supabase
    ArchDeploy-->Supabase
    WeatherDeploy-->Supabase
    
    Local-->Monorepo
```

## Technology Stack

```mermaid
graph LR
    subgraph Frontend [Frontend Technologies]
        React[React 18+]
        TS[TypeScript]
        Vite[Vite]
        CSS[CSS Modules]
    end
    
    subgraph Backend [Backend Technologies]
        SupabaseTech[Supabase]
        PostgreSQL[PostgreSQL]
        Realtime[Realtime Subscriptions]
        Auth[Authentication]
    end
    
    subgraph Deployment [Deployment]
        VercelTech[Vercel/Netlify]
        CDN[Content Delivery Network]
        CI[CI/CD Pipelines]
    end
    
    subgraph Development [Development Tools]
        MonorepoTool[Monorepo Management]
        HotReload[Hot Reload]
        Linting[ESLint/Prettier]
    end
    
    React-->TS
    TS-->Vite
    Vite-->CSS
    
    SupabaseTech-->PostgreSQL
    SupabaseTech-->Realtime
    SupabaseTech-->Auth
    
    VercelTech-->CDN
    VercelTech-->CI
    
    MonorepoTool-->HotReload
    HotReload-->Linting
```

## Key Integration Points

```mermaid
graph LR
    subgraph DataFlow [Data Flow Integration]
        API[Supabase API]
        Realtime[Realtime Updates]
        AuthSync[Authentication Sync]
    end
    
    subgraph UIIntegration [UI Integration]
        Components[Shared Components]
        Styles[Consistent Styling]
        Navigation[Unified Navigation]
    end
    
    subgraph BusinessLogic [Business Logic Integration]
        Assessment[Assessment Data]
        Insights[Business Insights]
        Learning[Learning Content]
    end
    
    API-->Realtime
    Realtime-->AuthSync
    
    Components-->Styles
    Styles-->Navigation
    
    Assessment-->Insights
    Insights-->Learning
    
    classDef integration fill:#bbdefb,stroke:#1976d2
    class API,Realtime,AuthSync,Components,Styles,Navigation,Assessment,Insights,Learning integration
```

## Legend

- **Main Application**: Central orchestrator (blue)
- **Micro-frontend Packages**: Specialized functionality (purple)
- **Backend Services**: Data storage and realtime (green)
- **Shared Resources**: Reusable code across packages (orange)
- **Integration Points**: Connection and data flow points (light blue)

---

*Diagrams created: 2025-08-24*
*Use these diagrams in conjunction with ARCHITECTURE.md*