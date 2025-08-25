# Day 1-15: Diagnose Your Starting Point

Diagnose Your Starting Point (Days 1-15): Use the Public Sector Complexity Index (CI) to analyze your portfolio and identify a single, critical objective for your 90-day sprint. This provides a data-driven basis for prioritization.  
Diagnose Your Starting Point using the Public Sector Complexity Index (CI)

#### **A Transformation Complexity Index**

In sector-wide public transformation programs—where ministries, authorities, and agencies must evolve together—the challenge is not just the ambition of change, but its complexity. Until now, there has been no structured, quantifiable way to assess that complexity before execution begins.

This proposal introduces a Public Sector Complexity Index (CI)—a simple, scalable formula designed to do just that. It allows program leaders and transformation designers to measure the true burden of change across a multi-entity ecosystem.

##### Complexity Index (CI): Final Formula

CI=∑WiSiEiB

Where:

| Symbol | Meaning | Scale |
| ----- | :---- | :---- |
| Wi | Strategic weight or importance of entity ( i ) amongst others (how much of the sector transformation relies on the entity) | % weight out of the whole |
| Si | Severity of transformation required for entity ( i ) (1–5 scale) | 1 – Manageable 5 – New entity |
| Ei | Number of non-established external stakeholders entity ( i ) must coordinate with (never worked with before) | Count |
| B | Baseline manageable number of external dependencies (sector-specific) | Avg of 5 |
| ( x_i ) | ( x_i = \frac{E_i}{B} ) | Ratio |

##### What It Captures

This single weighted-average formula collapses three dimensions of transformation into one score:

4. **Internal disruption** — how deep each entity’s change is.  
5. **Strategic role** — how central each entity is to the sector’s mission.  
6. **External coordination** — how many other players each entity must engage with.

Each entity’s individual transformation burden is scaled based on its real-world coordination load. The output is a single number that reflects the system-wide complexity of execution.

##### Example

| Entity | Weight (( w_i )) | Severity (( s_i )) | External Links (( E_i )) | ( x_i = \frac{E_i}{B} ) | Contribution (( w_i \cdot s_i \cdot x_i )) |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Ministry A | 5 | 5 | 15 | 1.5 | 37.5 |
| Regulator B | 3 | 4 | 10 | 1.0 | 12.0 |
| Operator C | 2 | 2 | 4 | 0.4 | 1.6 |
| Support Unit D | 1 | 1 | 2 | 0.2 | 0.2 |

\[ \text{Total Weighted Contribution} = 37.5 + 12.0 + 1.6 + 0.2 = 51.3 \] \[ \text{Total Weight} = 5 + 3 + 2 + 1 = 11 \] \[ \text{CI} = \frac{51.3}{11} = 4.66 \]

This CI of 4.66 reflects the overall complexity of the transformation. But it also opens the door to something deeper.

##### Beyond the Average: Diagnostic Insights

After computing the CI, each entity’s normalized complexity score can be calculated:

 Normalized Complexityi= si\fracEiB

Comparing this against the system-wide average (CI) reveals outliers—entities whose burden is disproportionately high. This flags potential issues in the operating model design.

##### What to Do with Outliers:

- **Too high?** Consider breaking apart roles, delegating delivery, or spinning off entities (e.g., create an authority or SOE).  
- **Too low?** Consider absorbing adjacent responsibilities to improve efficiency.

##### Why It Matters

This Complexity Index is more than a metric. It’s a planning instrument, early-warning signal, and design aid that lets public-sector leaders:

- Quantify and compare transformation efforts before they begin.  
- Spot operating model overload before failure.  
- Redesign ecosystem roles and delivery logic to normalize transformation load.

It brings clarity to an area too often driven by guesswork—and gives transformation offices the numbers they need to act.

#### **Mapping to Archetype and Practices**

Your complexity profile determines your transformation archetype and toolkit.

| Complexity Profile | Transformation Archetype | Practice Approach |
| :---- | :---- | :---- |
| Low on all axes | Localized/Focused | Traditional project management |
| Moderate (2 axes high) | Holistic/Entity-wide | Standard portfolio tools |
| High on 3-4 axes | Value Chain/Integrated | Capability architecture, cross-team |
| All axes high | Sector Maestro/Systemic | Full architecture, portfolio, change management |

When you land in the “Sector Maestro”/high complexity zone, you must use the full suite of advanced practices—capability-based architecture, outcome-based planning, strategic portfolio management, and more.
