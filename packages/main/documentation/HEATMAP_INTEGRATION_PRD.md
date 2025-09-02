# **Heatmap Integration PRD (Product Requirements Document)**
## *Enterprise-Grade Development Framework with Industry Best Practices*

## **Executive Summary**

Integration of a sophisticated capability heatmap visualization into the main Josoor application, enabling decision-makers to visualize organizational capabilities with dynamic overlays and filtering. The solution emphasizes **modular architecture**, **unified data structures**, and **enterprise-grade quality assurance practices** following industry best practices from leading software architecture patterns and Node.js development standards.

### **Key Architectural Principles Applied**
- ✅ **Clean Architecture**: Separation of concerns with distinct UI, Service, and Data layers
- ✅ **Domain-Driven Design**: Unified data contracts preventing debugging issues
- ✅ **Repository Pattern**: Service layer abstraction for data access
- ✅ **Error-First Development**: Comprehensive error handling and operational error classification
- ✅ **Specification Pattern**: Reusable filter logic with clear business rules
- ✅ **Unit of Work Pattern**: Transactional consistency across data operations

---

## **1. ENTERPRISE ARCHITECTURE FRAMEWORK**

### **1.1 Clean Architecture Implementation**

Following **Clean Architecture** principles from enterprise software patterns, our design implements clear boundaries and dependency inversion:

```
┌─────────────────────────────────────────────────────────────┐
│                 CLEAN ARCHITECTURE LAYERS                   │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer    │  Application Layer │  Domain Layer │
│  ┌─────────────────┐   │  ┌──────────────┐  │  ┌──────────┐ │
│  │ React           │   │  │ HeatmapUse   │  │  │ Domain   │ │
│  │ Components      │   │  │ Cases        │  │  │ Entities │ │
│  │ - Filter UI     │   │  │ - LoadData   │  │  │ - RAG    │ │
│  │ - Heatmap View  │   │  │ - Apply      │  │  │ - Cap.   │ │
│  │ - Controls      │   │  │   Filters    │  │  │ Hierarchy│ │
│  └─────────────────┘   │  └──────────────┘  │  └──────────┘ │
│  ┌─────────────────┐   │  ┌──────────────┐  │  ┌──────────┐ │
│  │ Error           │   │  │ Service      │  │  │ Value    │ │
│  │ Boundaries      │   │  │ Layer        │  │  │ Objects  │ │
│  │ - ErrorHandler  │   │  │ - Heatmap    │  │  │ - Filter │ │
│  │ - Fallback UI   │   │  │   Service    │  │  │   State  │ │
│  └─────────────────┘   │  └──────────────┘  │  └──────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure Layer                                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ External Dependencies                                   │ │
│  │ - Supabase Client    - Edge Functions                  │ │
│  │ - Database Layer     - Authentication                  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### **1.2 Repository Pattern Implementation**

Following **.NET Core repository patterns** from enterprise frameworks:

```typescript
// Abstract Repository Interface (Infrastructure Layer)
interface IHeatmapRepository {
  findCapabilityData(request: HeatmapDataRequest): Promise<HeatmapDataContract>;
  findOverlayConfig(): Promise<OverlayMetadata[]>;
}

// Concrete Repository Implementation
class SupabaseHeatmapRepository implements IHeatmapRepository {
  constructor(private supabaseClient: SupabaseClient) {}
  
  async findCapabilityData(request: HeatmapDataRequest): Promise<HeatmapDataContract> {
    const { data, error } = await this.supabaseClient.functions.invoke(
      'get-capability-heatmap-data', 
      { body: request }
    );
    
    if (error) throw new OperationalError('REPOSITORY_ERROR', error.message, error);
    return data;
  }
}

// Service Layer (Application Layer)
class HeatmapService {
  constructor(private repository: IHeatmapRepository) {}
  
  async loadCapabilityData(request: HeatmapDataRequest): Promise<HeatmapDataContract> {
    try {
      const data = await this.repository.findCapabilityData(request);
      return this.enrichWithIsDimmedFlags(data);
    } catch (error) {
      throw this.handleRepositoryError(error);
    }
  }
}
```

### **1.3 Specification Pattern for Filters**

Implementing **Specification Pattern** from enterprise DDD practices:

```typescript
// Abstract Specification
abstract class CapabilitySpecification {
  abstract isSatisfiedBy(capability: L3Capability): boolean;
  
  and(other: CapabilitySpecification): CapabilitySpecification {
    return new AndSpecification(this, other);
  }
  
  or(other: CapabilitySpecification): CapabilitySpecification {
    return new OrSpecification(this, other);
  }
}

// Concrete Specifications
class PolicyToolSpecification extends CapabilitySpecification {
  constructor(private allowedTools: string[]) { super(); }
  
  isSatisfiedBy(capability: L3Capability): boolean {
    if (this.allowedTools.length === 0) return true;
    return this.allowedTools.includes(capability.attributes.policy_tool_id || '');
  }
}

class DevelopmentStateSpecification extends CapabilitySpecification {
  constructor(private allowedStates: DevelopmentState[]) { super(); }
  
  isSatisfiedBy(capability: L3Capability): boolean {
    if (this.allowedStates.length === 0) return true;
    return this.allowedStates.includes(capability.attributes.development_state || 'Planned');
  }
}

// Usage in Service Layer
class FilterService {
  createSpecification(filters: FilterState): CapabilitySpecification {
    let specification = new AlwaysTrueSpecification();
    
    if (filters.policyTools.length > 0) {
      specification = specification.and(new PolicyToolSpecification(filters.policyTools));
    }
    
    if (filters.developmentStates.length > 0) {
      specification = specification.and(new DevelopmentStateSpecification(filters.developmentStates));
    }
    
    return specification;
  }
}
```

### **1.4 Development Phase Strategy**

Following **incremental development** and **quality gate** patterns from enterprise software development:

**Phase-Gate Model with Quality Assurance**:
1. **Phase 1**: Data Layer Foundation + Repository Pattern
2. **Phase 2**: Service Layer + Specification Pattern  
3. **Phase 3**: Core Heatmap Rendering + Error Boundaries
4. **Phase 4**: Overlay System + Performance Optimization
5. **Phase 5**: Filter System + UI Components
6. **Phase 6**: Integration Testing + Production Readiness

---

## **2. ENTERPRISE ERROR HANDLING FRAMEWORK**

### **2.1 Centralized Error Management**

Following **Node.js Best Practices** for error handling architecture:

```typescript
// Operational vs Programmer Error Classification
export class AppError extends Error {
  public readonly isOperational: boolean;
  public readonly statusCode: number;
  public readonly errorCode: string;

  constructor(errorCode: string, message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this);
  }
}

// Centralized Error Handler
class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    await this.logger.logError(err);
    await this.sendMetricsToMonitoring(err);
    await this.notifyAdminIfCritical(err);
  }

  public isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }
  
  private async sendMetricsToMonitoring(error: Error): Promise<void> {
    // Integration with monitoring services
    console.error(`[HEATMAP_ERROR] ${error.message}`, {
      timestamp: new Date().toISOString(),
      stack: error.stack,
      errorType: error.constructor.name
    });
  }
}

// Global Error Handlers
process.on('uncaughtException', (error: Error) => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason: any) => {
  throw reason; // Let uncaughtException handler deal with it
});
```

### **2.2 React Error Boundaries**

Following **React Error Boundary** patterns for UI resilience:

```typescript
// Error Boundary Component
class HeatmapErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    errorHandler.handleError(error);
    
    // Log additional React context
    console.error('React Error Boundary caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong with the heatmap.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage in Main Component
const JosoorExploreHeatmapPage: React.FC = () => {
  return (
    <HeatmapErrorBoundary>
      <SimpleHeader />
      <HeatmapContainer />
    </HeatmapErrorBoundary>
  );
};
```

### **2.3 Async Error Handling Patterns**

Implementing **async/await error handling** best practices:

```typescript
// Service Layer Error Handling
class HeatmapService {
  async loadData(request: HeatmapDataRequest): Promise<HeatmapDataContract> {
    try {
      const data = await this.repository.findCapabilityData(request);
      const processedData = await this.processData(data);
      return processedData;
    } catch (error) {
      // Log error with context
      await this.handleServiceError(error, { request });
      throw error; // Re-throw for higher-level handling
    } finally {
      // Cleanup resources
      await this.cleanupResources();
    }
  }

  private async handleServiceError(error: unknown, context: any): Promise<void> {
    if (error instanceof AppError) {
      // Operational error - expected scenarios
      this.logger.warn(`Operational error in HeatmapService`, { error, context });
    } else {
      // Programmer error - unexpected scenarios
      this.logger.error(`Unexpected error in HeatmapService`, { error, context });
    }
  }
}

// Component Error Handling
const HeatmapContainer: React.FC = () => {
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadData = async (request: HeatmapDataRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await heatmapService.loadData(request);
      setHeatmapData(data);
    } catch (err) {
      const appError = err instanceof AppError 
        ? err 
        : new AppError('UNEXPECTED_ERROR', 'An unexpected error occurred', 500, false);
      
      setError(appError);
      errorHandler.handleError(appError);
    } finally {
      setIsLoading(false);
    }
  };

  // Error UI
  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Heatmap</h3>
        <p>{error.message}</p>
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    );
  }

  return <HeatmapGrid data={heatmapData} />;
};
```

---

## **3. UNIFIED DATA STRUCTURE SPECIFICATION**

### **3.1 Domain-Driven Design Schemas**

Following **DDD Value Object** patterns for data integrity:

```typescript
// Domain Value Objects with Validation
class RAGStatus {
  private constructor(private readonly value: 'Red' | 'Amber' | 'Green') {}
  
  static create(value: string): RAGStatus {
    if (!['Red', 'Amber', 'Green'].includes(value)) {
      throw new AppError('INVALID_RAG_STATUS', `Invalid RAG status: ${value}`, 400);
    }
    return new RAGStatus(value as 'Red' | 'Amber' | 'Green');
  }
  
  getValue(): 'Red' | 'Amber' | 'Green' {
    return this.value;
  }
  
  equals(other: RAGStatus): boolean {
    return this.value === other.value;
  }
}

class CapabilityId {
  private constructor(private readonly value: string) {}
  
  static create(value: string): CapabilityId {
    if (!value || value.trim().length === 0) {
      throw new AppError('INVALID_CAPABILITY_ID', 'Capability ID cannot be empty', 400);
    }
    return new CapabilityId(value.trim());
  }
  
  getValue(): string {
    return this.value;
  }
}

// Master Data Contract - ALL modules MUST use this exact schema
interface HeatmapDataContract {
  capabilities: CapabilityHierarchy[];
  overlayConfig: OverlayMetadata[];
  metadata: ResponseMetadata;
}

interface CapabilityHierarchy {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  status: 'Red' | 'Amber' | 'Green';  // RAG Status (strongly typed)
  attributes: CapabilityAttributes;
  l2Capabilities: L2Capability[];
}

interface L2Capability {
  id: string;
  name: string;
  status: 'Red' | 'Amber' | 'Green';
  attributes: CapabilityAttributes;
  l3Capabilities: L3Capability[];
}

interface L3Capability {
  id: string;
  name: string;
  status: 'Red' | 'Amber' | 'Green';
  attributes: CapabilityAttributes;
}

// Unified attributes structure with comprehensive validation
interface CapabilityAttributes {
  // Overlay Data (numeric values for heatmap intensity)
  staff_needs?: number;                    // 0-100 scale
  budget_allocated?: number;               // Actual budget amount
  target_maturity_level?: number;          // 1-5 scale
  maturity_level?: number;                 // 1-5 scale
  strategic_objectives_count?: number;     // Count of objectives
  risk_score?: number;                     // 0-100 scale
  strategic_alignment_score?: number;      // 0-100 scale
  
  // Filter Data (for client-side filtering)
  policy_tool_id?: string;                 // Reference to policy tool
  development_state?: 'Planned' | 'Developing' | 'Active';
  
  // UI Control
  isDimmed?: boolean;                      // Controls visibility (auto-added if missing)
  
  // Future Features
  popupUrl?: string;                       // Detail drill-down URL
  popupWidth?: string;                     // Modal width
  popupHeight?: string;                    // Modal height
}

type DevelopmentState = 'Planned' | 'Developing' | 'Active';

interface OverlayMetadata {
  id: string;           // Must match CapabilityAttributes keys
  label: string;        // Human-readable name
  unit: string;         // Display unit ('%', 'k', ' count')
  icon: string;         // Icon identifier from ICONS registry
}

interface ResponseMetadata {
  totalCount: number;
  lastUpdated: string;  // ISO date string
  year?: number;
}
```

### **3.2 Zod Schema Validation**

Following **runtime type validation** best practices for data integrity:

```typescript
import { z } from 'zod';

// Comprehensive runtime validation schemas
const CapabilityAttributesSchema = z.object({
  staff_needs: z.number().min(0).max(100).optional(),
  budget_allocated: z.number().min(0).optional(),
  target_maturity_level: z.number().min(1).max(5).optional(),
  maturity_level: z.number().min(1).max(5).optional(),
  strategic_objectives_count: z.number().min(0).optional(),
  risk_score: z.number().min(0).max(100).optional(),
  strategic_alignment_score: z.number().min(0).max(100).optional(),
  policy_tool_id: z.string().optional(),
  development_state: z.enum(['Planned', 'Developing', 'Active']).optional(),
  isDimmed: z.boolean().optional(),
  popupUrl: z.string().url().optional(),
  popupWidth: z.string().optional(),
  popupHeight: z.string().optional()
}).strict(); // Prevent additional properties

const L3CapabilitySchema = z.object({
  id: z.string().min(1, 'Capability ID is required'),
  name: z.string().min(1, 'Capability name is required'),
  status: z.enum(['Red', 'Amber', 'Green']),
  attributes: CapabilityAttributesSchema
}).strict();

const L2CapabilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(['Red', 'Amber', 'Green']),
  attributes: CapabilityAttributesSchema,
  l3Capabilities: z.array(L3CapabilitySchema)
}).strict();

const CapabilityHierarchySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(['Red', 'Amber', 'Green']),
  attributes: CapabilityAttributesSchema,
  l2Capabilities: z.array(L2CapabilitySchema)
}).strict();

const OverlayMetadataSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  unit: z.string().min(1),
  icon: z.string().min(1)
}).strict();

const ResponseMetadataSchema = z.object({
  totalCount: z.number().min(0),
  lastUpdated: z.string().datetime(),
  year: z.number().optional()
}).strict();

const HeatmapDataContractSchema = z.object({
  capabilities: z.array(CapabilityHierarchySchema),
  overlayConfig: z.array(OverlayMetadataSchema),
  metadata: ResponseMetadataSchema
}).strict();

// Validation functions with detailed error reporting
export function validateHeatmapData(data: unknown): HeatmapDataContract {
  try {
    return HeatmapDataContractSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      
      throw new AppError(
        'SCHEMA_VALIDATION_FAILED',
        'Heatmap data validation failed',
        400,
        true,
        { validationErrors: errorDetails }
      );
    }
    throw error;
  }
}

// Type guards for runtime type checking
export function isCapabilityHierarchy(obj: unknown): obj is CapabilityHierarchy {
  try {
    CapabilityHierarchySchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}
```

### **3.3 Module Interface Contracts**

Following **Interface Segregation Principle** for clean dependencies:

```typescript
// Database Module Interface
interface DatabaseModule {
  fetchCapabilityData(request: HeatmapDataRequest): Promise<HeatmapDataResponse>;
}

interface HeatmapDataRequest {
  year?: number;
  limit?: number;
  offset?: number;
}

interface HeatmapDataResponse {
  success: boolean;
  data?: HeatmapDataContract;
  error?: ErrorDetails;
}

// Service Module Interface  
interface HeatmapService {
  loadData(request: HeatmapDataRequest): Promise<HeatmapDataContract>;
  applyFilters(data: HeatmapDataContract, filters: FilterState): HeatmapDataContract;
  processOverlayData(data: HeatmapDataContract): HeatmapDataContract;
}

// UI Module Interface
interface HeatmapUI {
  renderHeatmap(data: HeatmapDataContract, config: HeatmapUIConfig): void;
  updateFilters(filters: FilterState): void;
  updateOverlays(selectedOverlays: string[]): void;
}
```

---

## **3. DATABASE DESIGN**

### **3.1 Edge Function Specification**

**Function Name**: `get-capability-heatmap-data`

**Authentication**: 
- Uses Supabase RLS (Row Level Security)
- Validates user session token
- Applies organization-level data access controls

**Request Schema**:
```typescript
interface EdgeFunctionRequest {
  year?: number;        // Optional year filter
  limit?: number;       // Pagination limit (default: 100)
  offset?: number;      // Pagination offset (default: 0)
}
```

**Response Schema**:
```typescript
interface EdgeFunctionResponse {
  success: boolean;
  data?: HeatmapDataContract;  // Uses master schema
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### **3.2 Database Query Pattern**

```sql
-- Edge function implementation pattern
WITH hierarchical_capabilities AS (
  SELECT 
    c1.id as l1_id,
    c1.name as l1_name,
    c1.rag_status as l1_status,
    c1.attributes as l1_attributes,
    c2.id as l2_id,
    c2.name as l2_name,
    c2.rag_status as l2_status,
    c2.attributes as l2_attributes,
    c3.id as l3_id,
    c3.name as l3_name,
    c3.rag_status as l3_status,
    c3.attributes as l3_attributes
  FROM capabilities c1
  LEFT JOIN capabilities c2 ON c2.parent_id = c1.id AND c2.level = 2
  LEFT JOIN capabilities c3 ON c3.parent_id = c2.id AND c3.level = 3
  WHERE c1.level = 1
    AND ($1::integer IS NULL OR EXTRACT(YEAR FROM c1.created_at) = $1)
  ORDER BY c1.sort_order, c2.sort_order, c3.sort_order
  LIMIT $2 OFFSET $3
)
SELECT json_build_object(
  'capabilities', json_agg(/* hierarchical structure */),
  'overlayConfig', (SELECT json_agg(row_to_json(o)) FROM overlay_configs o WHERE o.active = true),
  'metadata', json_build_object(
    'totalCount', (SELECT COUNT(*) FROM capabilities WHERE level = 1),
    'lastUpdated', NOW(),
    'year', $1
  )
);
```

---

## **4. UI COMPONENT ARCHITECTURE**

### **4.1 Component Hierarchy**

```
JosoorExploreHeatmapPage
├── SimpleHeader
├── Frame (Controls Section)
│   ├── TextBlock (Introduction)
│   ├── YearSelector
│   ├── FetchButton
│   └── LoadingIndicator
├── Frame (Filter Section) 
│   ├── PolicyToolFilters
│   ├── DevelopmentStateFilters
│   └── HealthFilters
├── Frame (Heatmap Section)
│   ├── OverlayControls
│   ├── HeatmapContainer (FROM EXISTING CODE)
│   │   ├── CapabilityHeatmap
│   │   ├── HeatmapGrid
│   │   ├── Cell (with isDimmed support)
│   │   ├── WeatherHeatmapOverlay (with isDimmed exclusion)
│   │   └── Tooltip
│   └── HeatmapLegend
```

### **4.2 New Component Specifications**

#### **4.2.1 YearSelector Component**
```typescript
interface YearSelectorProps {
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
  availableYears: number[];
}
```

#### **4.2.2 PolicyToolFilters Component**
```typescript
interface PolicyToolFiltersProps {
  selectedTools: string[];
  onToolsChange: (tools: string[]) => void;
}

// Hardcoded options (per requirements)
const POLICY_TOOLS = [
  'Policy Tool 1.0',
  'Policy Tool 2.0', 
  'Policy Tool 3.0'
];
```

#### **4.2.3 DevelopmentStateFilters Component**
```typescript
interface DevelopmentStateFiltersProps {
  selectedStates: DevelopmentState[];
  onStatesChange: (states: DevelopmentState[]) => void;
}

const DEVELOPMENT_STATES: DevelopmentState[] = ['Planned', 'Developing', 'Active'];
```

#### **4.2.4 HealthFilters Component**
```typescript
interface HealthFiltersProps {
  selectedHealth: HealthState[];
  onHealthChange: (health: HealthState[]) => void;
}

type HealthState = 'Healthy' | 'At Risk' | 'Distressed';
// Maps to: Green, Amber, Red respectively
```

### **4.3 Modified Existing Components**

#### **4.3.1 Cell Component Modification**
```typescript
// ADD: isDimmed support
const Cell: React.FC<CellProps> = ({ data, onCellClick, overlayConfig, tooltipType }) => {
  const isDimmed = data.attributes.isDimmed === true;
  
  return (
    <div className={`relative group h-full w-full ${isDimmed ? 'opacity-30 pointer-events-none' : ''}`}>
      {/* Existing cell content unchanged */}
    </div>
  );
};
```

#### **4.3.2 WeatherHeatmapOverlay Modification**
```typescript
// ADD: Skip dimmed cells in overlay rendering
const drawBlob = (cell: any, cx: number, cy: number, radius: number) => {
    if (cell.attributes.isDimmed === true) return; // Skip dimmed cells
    
    // Existing logic unchanged
    const totalValue = selectedOverlays.reduce((acc, key) => 
        acc + (Number(cell.attributes[key]) || 0), 0
    );
    // ... rest unchanged
};
```

---

## **5. SERVICE LAYER DESIGN**

### **5.1 HeatmapService Module**

```typescript
class HeatmapService {
  private supabase: SupabaseClient;
  
  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  // Module 1: Data Loading
  async loadData(request: HeatmapDataRequest): Promise<HeatmapDataContract> {
    const { data, error } = await this.supabase.functions.invoke(
      'get-capability-heatmap-data', 
      { body: request }
    );
    
    if (error) throw new HeatmapError('DATA_FETCH_FAILED', error.message);
    if (!data.success) throw new HeatmapError(data.error.code, data.error.message);
    
    return this.processRawData(data.data);
  }

  // Module 2: Data Processing
  private processRawData(rawData: HeatmapDataContract): HeatmapDataContract {
    return {
      ...rawData,
      capabilities: this.ensureIsDimmedAttribute(rawData.capabilities)
    };
  }

  // Module 3: Filter Logic
  applyFilters(data: HeatmapDataContract, filters: FilterState): HeatmapDataContract {
    return {
      ...data,
      capabilities: data.capabilities.map(l1 => this.applyFiltersToCapability(l1, filters))
    };
  }

  // Module 4: Utility Functions
  private ensureIsDimmedAttribute(capabilities: CapabilityHierarchy[]): CapabilityHierarchy[] {
    return capabilities.map(l1 => ({
      ...l1,
      attributes: { ...l1.attributes, isDimmed: l1.attributes.isDimmed ?? false },
      l2Capabilities: l1.l2Capabilities.map(l2 => ({
        ...l2,
        attributes: { ...l2.attributes, isDimmed: l2.attributes.isDimmed ?? false },
        l3Capabilities: l2.l3Capabilities.map(l3 => ({
          ...l3,
          attributes: { ...l3.attributes, isDimmed: l3.attributes.isDimmed ?? false }
        }))
      }))
    }));
  }
}
```

### **5.2 FilterService Module**

```typescript
interface FilterState {
  policyTools: string[];
  developmentStates: DevelopmentState[];
  healthStates: HealthState[];
}

class FilterService {
  // AND logic: capability must match ALL selected criteria
  static matchesFilters(capability: L3Capability, filters: FilterState): boolean {
    // Policy tool filter
    if (filters.policyTools.length > 0) {
      if (!filters.policyTools.includes(capability.attributes.policy_tool_id || '')) {
        return false;
      }
    }

    // Development state filter
    if (filters.developmentStates.length > 0) {
      if (!filters.developmentStates.includes(capability.attributes.development_state || 'Planned')) {
        return false;
      }
    }

    // Health filter (maps to RAG status)
    if (filters.healthStates.length > 0) {
      const healthMapping = { 'Green': 'Healthy', 'Amber': 'At Risk', 'Red': 'Distressed' };
      const currentHealth = healthMapping[capability.status];
      if (!filters.healthStates.includes(currentHealth as HealthState)) {
        return false;
      }
    }

    return true;
  }

  // Aggregation logic: L2 visible only if ANY L3 is visible
  static aggregateL2Visibility(l2: L2Capability, filters: FilterState): boolean {
    return l2.l3Capabilities.some(l3 => this.matchesFilters(l3, filters));
  }

  // Aggregation logic: L1 visible only if ANY L2 is visible  
  static aggregateL1Visibility(l1: CapabilityHierarchy, filters: FilterState): boolean {
    return l1.l2Capabilities.some(l2 => this.aggregateL2Visibility(l2, filters));
  }
}
```

---

## **6. DEVELOPMENT METHODOLOGY**

### **6.1 Module Development Sequence**

#### **Phase 1: Database Foundation (Week 1)**
```
□ Create edge function with unified schema
□ Test database queries and response format
□ Validate authentication and RLS
□ Create mock data for testing
□ Lock: Database interface and data schema
```

#### **Phase 2: Service Layer (Week 1-2)**
```
□ Implement HeatmapService class
□ Add data loading and processing
□ Add isDimmed attribute injection
□ Create comprehensive unit tests
□ Lock: Service interfaces and data transformation
```

#### **Phase 3: Core Heatmap (Week 2)**
```
□ Port heatmap components (AS-IS from existing code)
□ Add isDimmed support to Cell and WeatherOverlay
□ Create basic page layout with year selector
□ Test basic rendering with mock data
□ Lock: Core heatmap rendering without filters
```

#### **Phase 4: Overlay System (Week 2-3)**
```
□ Configure overlay metadata
□ Test overlay selection and rendering
□ Validate tooltip integration
□ Performance testing with large datasets
□ Lock: Overlay functionality
```

#### **Phase 5: Filter System (Week 3)**
```
□ Implement filter UI components
□ Add FilterService logic
□ Test aggregation rules (L3→L2→L1)
□ Validate AND logic across filter types
□ Lock: Filter functionality
```

#### **Phase 6: Integration & Polish (Week 4)**
```
□ Add page to navigation
□ Error handling and loading states
□ Responsive design testing
□ Performance optimization
□ Final QA and documentation
```

### **6.2 Enterprise Testing Strategy**

Following **Testing Pyramid** and **AAA Pattern** from Node.js best practices:

#### **6.2.1 Unit Testing with AAA Pattern**
```typescript
// Arrange-Act-Assert Pattern Implementation
describe('HeatmapService', () => {
  describe('loadData', () => {
    test('When valid request provided, should return validated data contract', async () => {
      // Arrange
      const mockRequest: HeatmapDataRequest = { year: 2025, limit: 50 };
      const mockRepositoryData = createMockHeatmapData();
      const mockRepository = {
        findCapabilityData: jest.fn().mockResolvedValue(mockRepositoryData)
      };
      const service = new HeatmapService(mockRepository);

      // Act
      const result = await service.loadData(mockRequest);

      // Assert
      expect(result).toMatchObject({
        capabilities: expect.any(Array),
        overlayConfig: expect.any(Array),
        metadata: expect.objectContaining({
          totalCount: expect.any(Number),
          lastUpdated: expect.any(String)
        })
      });
      expect(mockRepository.findCapabilityData).toHaveBeenCalledWith(mockRequest);
      
      // Verify all capabilities have isDimmed attribute
      result.capabilities.forEach(l1 => {
        expect(l1.attributes).toHaveProperty('isDimmed');
        l1.l2Capabilities.forEach(l2 => {
          expect(l2.attributes).toHaveProperty('isDimmed');
          l2.l3Capabilities.forEach(l3 => {
            expect(l3.attributes).toHaveProperty('isDimmed');
          });
        });
      });
    });

    test('When repository throws error, should wrap in operational error', async () => {
      // Arrange
      const mockRequest: HeatmapDataRequest = { year: 2025 };
      const repositoryError = new Error('Database connection failed');
      const mockRepository = {
        findCapabilityData: jest.fn().mockRejectedValue(repositoryError)
      };
      const service = new HeatmapService(mockRepository);

      // Act & Assert
      await expect(service.loadData(mockRequest))
        .rejects
        .toThrow(AppError);
    });
  });
});

// Filter Service Testing with Specification Pattern
describe('FilterService', () => {
  describe('createSpecification', () => {
    test('When multiple filters provided, should create AND specification', () => {
      // Arrange
      const filters: FilterState = {
        policyTools: ['Policy Tool 1.0'],
        developmentStates: ['Active'],
        healthStates: ['Healthy']
      };
      const mockCapability = createMockL3Capability({
        policy_tool_id: 'Policy Tool 1.0',
        development_state: 'Active'
      });
      mockCapability.status = 'Green'; // Maps to 'Healthy'

      // Act
      const specification = FilterService.createSpecification(filters);
      const result = specification.isSatisfiedBy(mockCapability);

      // Assert
      expect(result).toBe(true);
    });

    test('When capability does not match all filters, should return false', () => {
      // Arrange
      const filters: FilterState = {
        policyTools: ['Policy Tool 1.0'],
        developmentStates: ['Active'],
        healthStates: ['Healthy']
      };
      const mockCapability = createMockL3Capability({
        policy_tool_id: 'Policy Tool 2.0', // Different policy tool
        development_state: 'Active'
      });
      mockCapability.status = 'Green';

      // Act
      const specification = FilterService.createSpecification(filters);
      const result = specification.isSatisfiedBy(mockCapability);

      // Assert
      expect(result).toBe(false);
    });
  });
});
```

#### **6.2.2 Integration Testing**
```typescript
// End-to-End Integration Tests
describe('Heatmap Integration Flow', () => {
  let testServer: TestServer;
  let supabaseClient: SupabaseClient;

  beforeAll(async () => {
    testServer = await setupTestServer();
    supabaseClient = createTestSupabaseClient();
  });

  afterAll(async () => {
    await testServer.close();
  });

  beforeEach(async () => {
    await seedTestDatabase();
  });

  test('Should complete full heatmap workflow: load → filter → overlay', async () => {
    // Arrange
    const heatmapService = new HeatmapService(new SupabaseHeatmapRepository(supabaseClient));
    const filterService = new FilterService();

    // Act 1: Load data
    const initialData = await heatmapService.loadData({ year: 2025 });

    // Assert 1: Data structure is valid
    expect(validateHeatmapData(initialData)).toBeTruthy();

    // Act 2: Apply filters
    const filters: FilterState = {
      policyTools: ['Policy Tool 1.0'],
      developmentStates: ['Active'],
      healthStates: ['Healthy']
    };
    const filteredData = await heatmapService.applyFilters(initialData, filters);

    // Assert 2: Filtered data has correct isDimmed flags
    const visibleCapabilities = getVisibleCapabilities(filteredData);
    expect(visibleCapabilities.length).toBeGreaterThan(0);

    // Act 3: Process overlay data
    const overlayData = await heatmapService.processOverlayData(filteredData);

    // Assert 3: Overlay data is ready for rendering
    expect(overlayData.overlayConfig).toContainEqual(
      expect.objectContaining({
        id: 'staff_needs',
        label: 'Staff Needs',
        unit: '%'
      })
    );
  });
});
```

#### **6.2.3 Component Testing with React Testing Library**
```typescript
// Component Tests Following React Best Practices
describe('HeatmapContainer Component', () => {
  const mockHeatmapService = {
    loadData: jest.fn(),
    applyFilters: jest.fn(),
    processOverlayData: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should display loading state while fetching data', async () => {
    // Arrange
    mockHeatmapService.loadData.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    // Act
    render(
      <HeatmapContainer heatmapService={mockHeatmapService} />
    );

    // Assert
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('Should display error message when data loading fails', async () => {
    // Arrange
    const errorMessage = 'Failed to load heatmap data';
    mockHeatmapService.loadData.mockRejectedValue(
      new AppError('DATA_LOAD_FAILED', errorMessage, 500)
    );

    // Act
    render(
      <HeatmapContainer heatmapService={mockHeatmapService} />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /fetch data/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('Should render heatmap grid when data is loaded successfully', async () => {
    // Arrange
    const mockData = createMockHeatmapData();
    mockHeatmapService.loadData.mockResolvedValue(mockData);

    // Act
    render(
      <HeatmapContainer heatmapService={mockHeatmapService} />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /fetch data/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('heatmap-grid')).toBeInTheDocument();
    });
  });
});

// Error Boundary Testing
describe('HeatmapErrorBoundary', () => {
  test('Should catch component errors and display fallback UI', () => {
    // Arrange
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    render(
      <HeatmapErrorBoundary>
        <ThrowError />
      </HeatmapErrorBoundary>
    );

    // Assert
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();

    // Cleanup
    consoleSpy.mockRestore();
  });
});
```

#### **6.2.4 Performance Testing**
```typescript
// Performance Benchmarks and Monitoring
describe('Heatmap Performance Tests', () => {
  test('Should load large dataset within performance budget', async () => {
    // Arrange
    const startTime = performance.now();
    const largeDataset = createLargeHeatmapDataset(1000); // 1000 capabilities
    const heatmapService = new HeatmapService(mockRepository);

    // Act
    await heatmapService.loadData({ limit: 1000 });
    const endTime = performance.now();

    // Assert
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(2000); // Max 2 seconds
  });

  test('Should apply filters within performance budget', async () => {
    // Arrange
    const data = createLargeHeatmapDataset(500);
    const filters: FilterState = {
      policyTools: ['Policy Tool 1.0'],
      developmentStates: ['Active'],
      healthStates: ['Healthy']
    };

    // Act
    const startTime = performance.now();
    await heatmapService.applyFilters(data, filters);
    const endTime = performance.now();

    // Assert
    const filterTime = endTime - startTime;
    expect(filterTime).toBeLessThan(300); // Max 300ms
  });

  test('Should render overlay within performance budget', async () => {
    // Arrange
    const canvas = createMockCanvas();
    const data = createMockHeatmapData();

    // Act
    const startTime = performance.now();
    renderWeatherOverlay(canvas, data, ['staff_needs']);
    const endTime = performance.now();

    // Assert
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(100); // Max 100ms
  });
});
```

#### **6.2.5 Test Data Factories**
```typescript
// Test Data Factory Pattern for Consistent Testing
class HeatmapTestDataFactory {
  static createMockL3Capability(overrides: Partial<CapabilityAttributes> = {}): L3Capability {
    return {
      id: `l3-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Test L3 Capability',
      status: 'Green',
      attributes: {
        staff_needs: 75,
        budget_allocated: 100000,
        policy_tool_id: 'Policy Tool 1.0',
        development_state: 'Active',
        isDimmed: false,
        ...overrides
      }
    };
  }

  static createMockL2Capability(l3Count: number = 3): L2Capability {
    return {
      id: `l2-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Test L2 Capability',
      status: 'Amber',
      attributes: {
        staff_needs: 60,
        budget_allocated: 500000,
        isDimmed: false
      },
      l3Capabilities: Array.from({ length: l3Count }, () => 
        this.createMockL3Capability()
      )
    };
  }

  static createMockHeatmapData(): HeatmapDataContract {
    return {
      capabilities: [
        {
          id: 'l1-strategy',
          name: 'Strategic Planning',
          status: 'Green',
          attributes: {
            staff_needs: 80,
            budget_allocated: 2000000,
            isDimmed: false
          },
          l2Capabilities: [
            this.createMockL2Capability(2),
            this.createMockL2Capability(3)
          ]
        }
      ],
      overlayConfig: [
        {
          id: 'staff_needs',
          label: 'Staff Needs',
          unit: '%',
          icon: 'StaffIcon'
        }
      ],
      metadata: {
        totalCount: 1,
        lastUpdated: new Date().toISOString(),
        year: 2025
      }
    };
  }
}
```

---

## **7. ENTERPRISE QUALITY ASSURANCE FRAMEWORK**

### **7.1 Code Quality Standards with Industry Best Practices**

#### **7.1.1 TypeScript Strict Configuration**
```json
// tsconfig.json - Following enterprise TypeScript standards
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

#### **7.1.2 ESLint Configuration with Security Rules**
```json
// .eslintrc.json - Enterprise security and quality standards
{
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking",
    "eslint:recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    // Error Prevention
    "prefer-const": "error",
    "no-var": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    
    // TypeScript Specific
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    
    // Security Rules (following Node.js best practices)
    "no-new-func": "error",
    "no-script-url": "error",
    "no-return-await": "error",
    
    // Code Organization
    "max-complexity": ["error", { "max": 10 }],
    "max-depth": ["error", { "max": 4 }],
    "max-lines-per-function": ["error", { "max": 50 }]
  }
}
```

#### **7.1.3 Performance Monitoring and Benchmarks**
```typescript
// Performance monitoring following industry standards
class PerformanceMonitor {
  private static readonly PERFORMANCE_BUDGETS = {
    INITIAL_LOAD: 2000,      // Max 2s for initial data load
    FILTER_APPLICATION: 300,  // Max 300ms for filter updates  
    OVERLAY_TOGGLE: 200,     // Max 200ms for overlay changes
    MEMORY_USAGE: 50000000,  // Max 50MB memory footprint
    CANVAS_RENDER: 100       // Max 100ms for overlay rendering
  };

  static async measureAsyncOperation<T>(
    operation: () => Promise<T>,
    operationName: string,
    budgetMs: number
  ): Promise<T> {
    const startTime = performance.now();
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0;

    try {
      const result = await operation();
      const endTime = performance.now();
      const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      const duration = endTime - startTime;
      const memoryDelta = endMemory - startMemory;

      // Log performance metrics
      console.info(`[PERFORMANCE] ${operationName}`, {
        duration: `${duration.toFixed(2)}ms`,
        budget: `${budgetMs}ms`,
        budgetMet: duration <= budgetMs,
        memoryDelta: `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`
      });

      // Alert if performance budget exceeded
      if (duration > budgetMs) {
        console.warn(`[PERFORMANCE_WARNING] ${operationName} exceeded budget: ${duration}ms > ${budgetMs}ms`);
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      console.error(`[PERFORMANCE_ERROR] ${operationName} failed after ${endTime - startTime}ms`, error);
      throw error;
    }
  }

  // Usage in service layer
  static async monitorDataLoad(
    operation: () => Promise<HeatmapDataContract>
  ): Promise<HeatmapDataContract> {
    return this.measureAsyncOperation(
      operation,
      'HeatmapDataLoad',
      this.PERFORMANCE_BUDGETS.INITIAL_LOAD
    );
  }

  static async monitorFilterApplication(
    operation: () => Promise<HeatmapDataContract>
  ): Promise<HeatmapDataContract> {
    return this.measureAsyncOperation(
      operation,
      'FilterApplication',
      this.PERFORMANCE_BUDGETS.FILTER_APPLICATION
    );
  }
}

// Usage in HeatmapService
class HeatmapService {
  async loadData(request: HeatmapDataRequest): Promise<HeatmapDataContract> {
    return PerformanceMonitor.monitorDataLoad(async () => {
      const data = await this.repository.findCapabilityData(request);
      return this.processData(data);
    });
  }

  async applyFilters(data: HeatmapDataContract, filters: FilterState): Promise<HeatmapDataContract> {
    return PerformanceMonitor.monitorFilterApplication(async () => {
      return this.performFilterOperation(data, filters);
    });
  }
}
```

### **7.2 Comprehensive Data Validation Framework**

#### **7.2.1 Multi-Layer Validation Strategy**
```typescript
// Layer 1: Edge Function Input Validation
const EdgeFunctionRequestSchema = z.object({
  year: z.number().int().min(2020).max(2030).optional(),
  limit: z.number().int().min(1).max(1000).default(100),
  offset: z.number().int().min(0).default(0)
}).strict();

// Layer 2: Database Response Validation
const DatabaseResponseSchema = z.object({
  success: z.boolean(),
  data: HeatmapDataContractSchema.optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional()
  }).optional()
}).refine(
  data => data.success === true ? !!data.data : !!data.error,
  { message: "Success responses must include data, error responses must include error" }
);

// Layer 3: Service Layer Validation
class ValidationService {
  static validateRequest(request: unknown): HeatmapDataRequest {
    try {
      return EdgeFunctionRequestSchema.parse(request);
    } catch (error) {
      throw new AppError(
        'INVALID_REQUEST',
        'Request validation failed',
        400,
        true,
        { validationError: error }
      );
    }
  }

  static validateCapabilityData(data: unknown): HeatmapDataContract {
    try {
      const validated = HeatmapDataContractSchema.parse(data);
      
      // Additional business rule validation
      this.validateBusinessRules(validated);
      
      return validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(
          'SCHEMA_VALIDATION_FAILED',
          'Data schema validation failed',
          500,
          false,
          { 
            validationErrors: error.errors,
            receivedData: typeof data === 'object' ? Object.keys(data as object) : typeof data
          }
        );
      }
      throw error;
    }
  }

  private static validateBusinessRules(data: HeatmapDataContract): void {
    // Business Rule 1: Every L1 capability must have at least one L2
    data.capabilities.forEach(l1 => {
      if (l1.l2Capabilities.length === 0) {
        throw new AppError(
          'BUSINESS_RULE_VIOLATION',
          `L1 capability '${l1.name}' must have at least one L2 capability`,
          422,
          true
        );
      }
    });

    // Business Rule 2: Overlay configs must match available attribute keys
    const availableOverlayKeys = new Set<string>();
    data.capabilities.forEach(l1 => {
      l1.l2Capabilities.forEach(l2 => {
        l2.l3Capabilities.forEach(l3 => {
          Object.keys(l3.attributes).forEach(key => {
            if (typeof l3.attributes[key as keyof CapabilityAttributes] === 'number') {
              availableOverlayKeys.add(key);
            }
          });
        });
      });
    });

    data.overlayConfig.forEach(overlay => {
      if (!availableOverlayKeys.has(overlay.id)) {
        throw new AppError(
          'OVERLAY_CONFIG_MISMATCH',
          `Overlay config '${overlay.id}' does not match any available attribute keys`,
          422,
          true,
          { availableKeys: Array.from(availableOverlayKeys) }
        );
      }
    });
  }
}
```

### **7.3 Error Monitoring and Observability**

#### **7.3.1 Comprehensive Error Classification**
```typescript
// Error classification following operational vs programmer error patterns
export enum ErrorCategories {
  // Operational Errors (Expected, recoverable)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  
  // Programmer Errors (Unexpected, should cause alerts)
  NULL_REFERENCE_ERROR = 'NULL_REFERENCE_ERROR',
  TYPE_ERROR = 'TYPE_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  INVARIANT_VIOLATION = 'INVARIANT_VIOLATION'
}

export class HeatmapError extends AppError {
  constructor(
    category: ErrorCategories,
    message: string,
    statusCode: number = 500,
    context?: Record<string, any>
  ) {
    const isOperational = [
      ErrorCategories.VALIDATION_ERROR,
      ErrorCategories.AUTHENTICATION_ERROR,
      ErrorCategories.AUTHORIZATION_ERROR,
      ErrorCategories.NETWORK_ERROR,
      ErrorCategories.RATE_LIMIT_ERROR
    ].includes(category);

    super(category, message, statusCode, isOperational);
    this.context = context;
  }
}

// Centralized error handler with monitoring integration
class ErrorMonitoringService {
  private static instance: ErrorMonitoringService;
  
  static getInstance(): ErrorMonitoringService {
    if (!this.instance) {
      this.instance = new ErrorMonitoringService();
    }
    return this.instance;
  }

  async handleError(error: Error, context?: Record<string, any>): Promise<void> {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      name: error.name,
      context: context || {},
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    };

    if (error instanceof HeatmapError) {
      errorInfo.category = error.errorCode;
      errorInfo.isOperational = error.isOperational;
      errorInfo.statusCode = error.statusCode;
      
      if (error.isOperational) {
        console.warn(`[OPERATIONAL_ERROR] ${error.errorCode}:`, errorInfo);
      } else {
        console.error(`[PROGRAMMER_ERROR] ${error.errorCode}:`, errorInfo);
        // In production, send alerts for programmer errors
        await this.sendAlertToMonitoring(errorInfo);
      }
    } else {
      console.error('[UNEXPECTED_ERROR]:', errorInfo);
      await this.sendAlertToMonitoring(errorInfo);
    }
    
    // Log to external monitoring service (e.g., Sentry, LogRocket)
    await this.logToExternalService(errorInfo);
  }

  private async sendAlertToMonitoring(errorInfo: any): Promise<void> {
    // Integration with monitoring services
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 ALERT - Programmer Error Detected:', errorInfo);
      return;
    }
    
    // In production, integrate with monitoring services like:
    // - Sentry for error tracking
    // - Slack for immediate alerts
    // - PagerDuty for critical errors
  }

  private async logToExternalService(errorInfo: any): Promise<void> {
    // External logging service integration
    try {
      // Example: Send to monitoring endpoint
      if (typeof fetch !== 'undefined') {
        await fetch('/api/monitoring/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorInfo)
        });
      }
    } catch (loggingError) {
      console.error('Failed to log to external service:', loggingError);
    }
  }
}
```

### **7.4 Code Organization and Architecture Validation**

#### **7.4.1 Architecture Decision Records (ADR)**
Following **ADR best practices** for documenting architectural decisions:

```markdown
# ADR-001: Heatmap Data Flow Architecture

## Status
Accepted

## Context
The heatmap integration requires processing hierarchical capability data with dynamic filtering and overlay visualization. We need to choose between:
1. Server-side filtering with real-time queries
2. Client-side filtering with cached data
3. Hybrid approach with intelligent caching

## Decision
We will implement **client-side filtering with cached data** using the `isDimmed` attribute pattern.

## Consequences
**Positive:**
- Faster filter interactions (sub-200ms response)
- Reduced server load and database queries
- Better offline capability
- Simplified caching strategy

**Negative:**
- Initial larger payload size
- Memory usage considerations for large datasets
- Potential data staleness

## Implementation
- Use `isDimmed` boolean flags for UI control
- Implement Specification pattern for filter logic
- Add performance monitoring for memory usage
- Implement data refresh strategies
```

#### **7.4.2 Module Boundary Validation**
```typescript
// Architecture boundary enforcement
class ArchitectureBoundaryValidator {
  // Prevent direct database access from UI layer
  static validateLayerAccess(callerModule: string, targetModule: string): void {
    const layerHierarchy = {
      'ui': ['service', 'domain'],
      'service': ['repository', 'domain'],
      'repository': ['database'],
      'domain': []
    };

    const allowedTargets = layerHierarchy[callerModule as keyof typeof layerHierarchy] || [];
    
    if (!allowedTargets.includes(targetModule)) {
      throw new HeatmapError(
        ErrorCategories.INVARIANT_VIOLATION,
        `Architecture violation: ${callerModule} cannot directly access ${targetModule}`,
        500,
        { callerModule, targetModule, allowedTargets }
      );
    }
  }
}

// Usage in dependency injection
class ServiceContainer {
  private services = new Map<string, any>();

  register<T>(key: string, service: T, layer: string): void {
    // Validate service follows architectural constraints
    this.validateServiceArchitecture(service, layer);
    this.services.set(key, service);
  }

  private validateServiceArchitecture(service: any, layer: string): void {
    // Ensure services only depend on allowed layers
    const dependencies = this.extractDependencies(service);
    dependencies.forEach(dep => {
      ArchitectureBoundaryValidator.validateLayerAccess(layer, dep.layer);
    });
  }
}
```
  development_state: z.enum(['Planned', 'Developing', 'Active']).optional(),
  isDimmed: z.boolean().optional()
});

const HeatmapDataSchema = z.object({
  capabilities: z.array(CapabilityHierarchySchema),
  overlayConfig: z.array(OverlayMetadataSchema),
  metadata: ResponseMetadataSchema
});

// Validate data at service boundaries
export function validateHeatmapData(data: unknown): HeatmapDataContract {
  return HeatmapDataSchema.parse(data);
}
```

### **7.3 Performance Monitoring**

#### **Performance Benchmarks**
```typescript
// Performance testing requirements
const PERFORMANCE_TARGETS = {
  initialLoad: 2000,      // Max 2s for initial data load
  filterApplication: 300,  // Max 300ms for filter updates
  overlayToggle: 200,     // Max 200ms for overlay changes
  memoryUsage: 50,        // Max 50MB memory footprint
  canvasRender: 100       // Max 100ms for overlay rendering
};
```

#### **Error Monitoring**
```typescript
// Comprehensive error handling
class HeatmapError extends Error {
  constructor(
    public code: string,
    message: string,
    public context?: any
  ) {
    super(message);
    this.name = 'HeatmapError';
  }
}

// Error boundaries and logging
export function handleHeatmapError(error: HeatmapError): void {
  console.error(`[HEATMAP_ERROR] ${error.code}: ${error.message}`, error.context);
  // Send to monitoring service
}
```

---

## **8. CONTEXT7 INTEGRATION & DOCUMENTATION FRAMEWORK**

### **8.1 AI-Readable Documentation Structure**

Following **documentation best practices** for AI assistance and knowledge management:

```typescript
/**
 * @fileoverview Heatmap Integration Module - Enterprise Implementation
 * @module HeatmapIntegration
 * @version 1.0.0
 * @since 2025-01-23
 * 
 * @description
 * Enterprise-grade capability heatmap visualization for Josoor application.
 * Implements Clean Architecture, Domain-Driven Design, and comprehensive
 * error handling following industry best practices.
 * 
 * @architecture
 * ```
 * ┌─ Presentation Layer (React Components)
 * ├─ Application Layer (Use Cases & Services)  
 * ├─ Domain Layer (Entities & Value Objects)
 * └─ Infrastructure Layer (Database & External APIs)
 * ```
 * 
 * @keyPatterns
 * - Repository Pattern: Data access abstraction
 * - Specification Pattern: Reusable filter logic
 * - Error-First Design: Comprehensive error handling
 * - Performance Monitoring: Built-in performance budgets
 * 
 * @dataFlow
 * 1. User Interaction → React Components (Presentation)
 * 2. Component → HeatmapService.loadData() (Application)
 * 3. Service → Repository.findData() (Infrastructure)
 * 4. Repository → Supabase Edge Function (External)
 * 5. Response → Data Validation → UI Rendering
 * 
 * @performanceBudgets
 * - Initial Load: <2000ms
 * - Filter Application: <300ms  
 * - Overlay Toggle: <200ms
 * - Memory Usage: <50MB
 * 
 * @errorHandling
 * - Operational Errors: Expected, logged, graceful degradation
 * - Programmer Errors: Unexpected, alerted, may crash process
 * - UI Errors: Caught by Error Boundaries, fallback UI
 * 
 * @testingStrategy
 * - Unit Tests: Service logic, utilities (>95% coverage)
 * - Integration Tests: End-to-end workflows
 * - Component Tests: React components with RTL
 * - Performance Tests: Benchmark validation
 * 
 * @dependencies
 * - React 18+ (UI Framework)
 * - TypeScript 5+ (Type Safety)
 * - Supabase (Database & Auth)
 * - Zod (Runtime Validation)
 * - Jest + RTL (Testing)
 * 
 * @security
 * - Row Level Security (RLS) via Supabase
 * - Input validation at all boundaries
 * - Error message sanitization
 * - Performance budgets prevent DoS
 */

/**
 * @namespace HeatmapDomain
 * @description Core domain entities and value objects
 */
export namespace HeatmapDomain {
  /**
   * @interface HeatmapDataContract
   * @description Master data structure - ALL modules must use this exact schema
   * 
   * @example
   * ```typescript
   * const data: HeatmapDataContract = {
   *   capabilities: [{
   *     id: 'l1-strategy',
   *     name: 'Strategic Planning', 
   *     status: 'Green',
   *     attributes: { staff_needs: 85, isDimmed: false },
   *     l2Capabilities: [...]
   *   }],
   *   overlayConfig: [{
   *     id: 'staff_needs',
   *     label: 'Staff Needs',
   *     unit: '%',
   *     icon: 'StaffIcon'
   *   }],
   *   metadata: {
   *     totalCount: 45,
   *     lastUpdated: '2025-01-23T10:30:00Z'
   *   }
   * };
   * ```
   */
  export interface HeatmapDataContract {
    capabilities: CapabilityHierarchy[];
    overlayConfig: OverlayMetadata[];
    metadata: ResponseMetadata;
  }
}

/**
 * @namespace HeatmapServices
 * @description Application layer services implementing use cases
 */
export namespace HeatmapServices {
  /**
   * @class HeatmapService
   * @description Main service for heatmap data operations
   * 
   * @example
   * ```typescript
   * const service = new HeatmapService(repository);
   * 
   * // Load data with performance monitoring
   * const data = await service.loadData({ year: 2025 });
   * 
   * // Apply filters using Specification pattern
   * const filtered = await service.applyFilters(data, {
   *   policyTools: ['Policy Tool 1.0'],
   *   developmentStates: ['Active']
   * });
   * ```
   * 
   * @throws {HeatmapError} When data validation fails
   * @throws {HeatmapError} When repository operations fail
   */
  export class HeatmapService implements IHeatmapService {
    // Implementation details...
  }
}
```

### **8.2 Context7 Query Reference Guide**

**Common Development Queries and Solutions:**

```typescript
/**
 * @context7Guide Heatmap Development Reference
 * 
 * Q: "How do I add a new overlay metric to the heatmap?"
 * A: Follow these steps:
 * 1. Add metric to CapabilityAttributes interface (types.ts)
 * 2. Update Zod schema for validation (validation.ts)  
 * 3. Modify edge function to return metric in attributes
 * 4. Add overlay config entry with matching id
 * 5. Test overlay selection and weather rendering
 * 
 * Example:
 * ```typescript
 * // 1. Add to interface
 * interface CapabilityAttributes {
 *   risk_assessment_score?: number; // 0-100 scale
 * }
 * 
 * // 2. Update schema
 * const CapabilityAttributesSchema = z.object({
 *   risk_assessment_score: z.number().min(0).max(100).optional()
 * });
 * 
 * // 3. Add overlay config
 * const overlayConfig = [{
 *   id: 'risk_assessment_score',
 *   label: 'Risk Assessment',
 *   unit: '',
 *   icon: 'RiskIcon'
 * }];
 * ```
 * 
 * Q: "How do I modify the filter logic?"
 * A: Use the Specification pattern:
 * 1. Create new specification class extending CapabilitySpecification
 * 2. Implement isSatisfiedBy method with filter logic
 * 3. Add to FilterService.createSpecification method
 * 4. Test with various filter combinations
 * 
 * Example:
 * ```typescript
 * class BudgetRangeSpecification extends CapabilitySpecification {
 *   constructor(private minBudget: number, private maxBudget: number) { super(); }
 *   
 *   isSatisfiedBy(capability: L3Capability): boolean {
 *     const budget = capability.attributes.budget_allocated || 0;
 *     return budget >= this.minBudget && budget <= this.maxBudget;
 *   }
 * }
 * ```
 * 
 * Q: "How do I debug heatmap rendering issues?"
 * A: Follow this debugging checklist:
 * 1. Open browser DevTools console
 * 2. Check for JavaScript errors or warnings
 * 3. Verify data schema matches CapabilityAttributes
 * 4. Inspect network requests to edge function
 * 5. Test overlay calculations in WeatherHeatmapOverlay
 * 6. Validate canvas drawing logic in drawBlob function
 * 7. Check performance monitoring logs for budget violations
 * 
 * Q: "How do I add error handling for a new component?"
 * A: Follow error handling patterns:
 * 1. Wrap component in Error Boundary if needed
 * 2. Use try-catch with async operations
 * 3. Classify errors as operational vs programmer
 * 4. Log errors with context using ErrorMonitoringService
 * 5. Provide fallback UI for error states
 * 
 * Q: "How do I test the filter aggregation logic?"
 * A: Use the AAA testing pattern:
 * ```typescript
 * test('When L3 capabilities filtered, L2 visibility aggregates correctly', () => {
 *   // Arrange
 *   const mockL2 = createMockL2Capability();
 *   const filters = { policyTools: ['Policy Tool 1.0'] };
 *   
 *   // Act  
 *   const isVisible = FilterService.aggregateL2Visibility(mockL2, filters);
 *   
 *   // Assert
 *   expect(isVisible).toBe(true);
 * });
 * ```
 */

const CONTEXT7_TROUBLESHOOTING = {
  "Performance Issues": {
    symptoms: "Slow loading, UI lag, memory warnings",
    debugging: [
      "Check performance monitoring logs",
      "Profile memory usage in DevTools",
      "Validate data size vs performance budgets",
      "Test with smaller datasets"
    ],
    solutions: [
      "Implement virtual scrolling for large datasets",
      "Add pagination to edge function",
      "Optimize canvas rendering",
      "Add data caching layer"
    ]
  },
  
  "Filter Not Working": {
    symptoms: "Capabilities not dimming, wrong visibility",
    debugging: [
      "Verify filter state updates",
      "Check Specification pattern implementation", 
      "Validate isDimmed flag assignment",
      "Test individual filter criteria"
    ],
    solutions: [
      "Review FilterService.matchesFilters logic",
      "Check aggregation from L3→L2→L1",
      "Verify filter state propagation",
      "Add filter debugging logs"
    ]
  },
  
  "Data Loading Errors": {
    symptoms: "Network errors, schema validation failures",
    debugging: [
      "Check edge function response format",
      "Validate Supabase authentication",
      "Review network requests in DevTools",
      "Test with mock data"
    ],
    solutions: [
      "Verify edge function deployment",
      "Check RLS policies in Supabase",
      "Update data validation schemas",
      "Add retry logic for network failures"
    ]
  }
};
```

### **8.3 Architecture Decision Records (ADR) for Context7**

```markdown
# Architecture Decision Records Index

## ADR-001: Client-Side Filtering Strategy
**Status:** Accepted  
**Decision:** Use client-side filtering with isDimmed flags
**Context:** Need balance between performance and server load
**Consequences:** Faster interactions, larger initial payload

## ADR-002: Repository Pattern Implementation  
**Status:** Accepted
**Decision:** Abstract data access via IHeatmapRepository interface
**Context:** Enable testing and future data source changes
**Consequences:** Cleaner testing, dependency inversion

## ADR-003: Error Classification System
**Status:** Accepted  
**Decision:** Distinguish operational vs programmer errors
**Context:** Need appropriate error handling and monitoring
**Consequences:** Better error recovery, targeted alerting

## ADR-004: Specification Pattern for Filters
**Status:** Accepted
**Decision:** Use Specification pattern for composable filter logic
**Context:** Complex filter combinations and business rules
**Consequences:** Reusable filters, easier testing

## ADR-005: Performance Monitoring Integration
**Status:** Accepted
**Decision:** Built-in performance budgets and monitoring
**Context:** Ensure consistent user experience
**Consequences:** Proactive performance management, debugging data
```

### **8.4 Development Workflow for AI Assistance**

```typescript
/**
 * @developmentWorkflow Context7 Integration Points
 * 
 * 1. REQUIREMENTS ANALYSIS
 *    - Reference this PRD for architectural decisions
 *    - Check ADRs for design rationale
 *    - Review performance budgets and constraints
 * 
 * 2. IMPLEMENTATION PLANNING
 *    - Follow phase-gate development model
 *    - Implement Repository pattern for data access
 *    - Use Specification pattern for filter logic
 *    - Add comprehensive error handling
 * 
 * 3. CODE DEVELOPMENT
 *    - Follow TypeScript strict mode configuration
 *    - Implement AAA testing pattern
 *    - Add performance monitoring
 *    - Document with JSDoc for Context7
 * 
 * 4. TESTING STRATEGY
 *    - Unit tests for business logic (>95% coverage)
 *    - Integration tests for workflows
 *    - Component tests with React Testing Library
 *    - Performance tests for budget validation
 * 
 * 5. DEPLOYMENT READINESS
 *    - Schema validation passes
 *    - Error boundaries implemented
 *    - Performance budgets met
 *    - Documentation complete
 */

// Context7 can reference these patterns for consistent development
export const CONTEXT7_DEVELOPMENT_PATTERNS = {
  serviceImplementation: `
    class NewService implements INewService {
      constructor(private repository: IRepository) {}
      
      async performOperation(): Promise<Result> {
        try {
          // Performance monitoring
          return await PerformanceMonitor.measure(async () => {
            // Validation
            const validated = ValidationService.validate(input);
            
            // Business logic
            const result = await this.repository.findData(validated);
            
            // Return processed result
            return this.processResult(result);
          }, 'OperationName', BUDGET_MS);
        } catch (error) {
          await ErrorMonitoringService.handleError(error);
          throw error;
        }
      }
    }
  `,
  
  componentImplementation: `
    const NewComponent: React.FC<Props> = ({ data, onAction }) => {
      const [error, setError] = useState<AppError | null>(null);
      const [loading, setLoading] = useState(false);
      
      const handleAction = async () => {
        try {
          setLoading(true);
          setError(null);
          await onAction();
        } catch (err) {
          const appError = err instanceof AppError ? err : 
            new AppError('UNEXPECTED_ERROR', 'Operation failed');
          setError(appError);
        } finally {
          setLoading(false);
        }
      };
      
      if (error) return <ErrorDisplay error={error} />;
      if (loading) return <LoadingIndicator />;
      
      return <div>Component content</div>;
    };
  `,
  
  testImplementation: `
    describe('ComponentName', () => {
      test('When valid input provided, should perform expected behavior', async () => {
        // Arrange
        const mockProps = createMockProps();
        const mockService = createMockService();
        
        // Act
        render(<Component {...mockProps} service={mockService} />);
        await user.click(screen.getByRole('button', { name: /action/i }));
        
        // Assert
        expect(mockService.performAction).toHaveBeenCalledWith(expectedInput);
        expect(screen.getByText('Success message')).toBeInTheDocument();
      });
    });
  `
};
```

---

## **9. DELIVERABLES & TIMELINE**

### **9.1 Phase Deliverables**

| Phase | Duration | Deliverables | Quality Gates |
|-------|----------|--------------|---------------|
| Phase 1 | Week 1 | Edge function, schema validation, mock data | 100% test coverage, schema compliance |
| Phase 2 | Week 1-2 | HeatmapService, FilterService, unit tests | All service tests pass, no type errors |
| Phase 3 | Week 2 | Core heatmap rendering, basic UI | Visual regression tests pass |
| Phase 4 | Week 2-3 | Overlay system, performance optimization | <2s load time, smooth interactions |
| Phase 5 | Week 3 | Filter UI, aggregation logic | Filter logic tests pass |
| Phase 6 | Week 4 | Integration, polish, documentation | E2E tests pass, ready for production |

### **9.2 Success Criteria**

- ✅ **Functional**: All user stories implemented and tested
- ✅ **Performance**: <2s initial load, <300ms filter updates
- ✅ **Quality**: 95%+ test coverage, no critical bugs
- ✅ **Maintainability**: Clean modular architecture, comprehensive documentation
- ✅ **Integration**: Seamless integration with existing Josoor navigation

---

## **10. RISK MITIGATION**

### **10.1 Technical Risks**

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data schema changes | High | Lock schema early, use validation |
| Performance with large datasets | Medium | Implement pagination, virtual scrolling |
| Filter logic complexity | Medium | Comprehensive unit testing, modular design |
| Canvas rendering issues | Low | Fallback to CSS-based overlays |

### **10.2 Project Risks**

| Risk | Impact | Mitigation |
|------|--------|------------|
| Requirements changes | High | Modular architecture, clear interfaces |
| Integration conflicts | Medium | Early integration testing, feature flags |
| Timeline pressure | Medium | MVP-first approach, incremental delivery |

---

This comprehensive PRD provides the foundation for high-quality, maintainable code that can be developed incrementally with confidence. Each module can be built, tested, and locked independently while maintaining system integrity through the unified data structure.
