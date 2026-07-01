# Features Directory

Features are organized into distinct folders (e.g., `patients`, `appointments`, `billing`).
Each feature folder should contain its own pages, specific components, and state logic:

Example:
```
patients/
├── components/      # Feature-specific components
├── pages/           # Pages belonging to this feature
├── hooks/           # Custom state hooks for this feature
└── patientsSlice.ts # State / Context hooks
```
This isolates code changes and increases scaling limits.
