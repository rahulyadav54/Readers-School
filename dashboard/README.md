# Dashboard Sub-Architecture

This directory contains standalone components, mockup states, utility configurations, and local types specific to the Reader's School Dashboard modules.

## Structural Strategy
- `components/`: Specific visual panels or charts (separate from global UI elements).
- `mocks/`: Analytics and performance data arrays used by Recharts during development.
- `types.ts`: Local typescript contracts describing dashboard metric widgets.

Keeping these specific assets isolated here rather than mixing them into global directories ensures long-term scalability and clean separation of concerns.
