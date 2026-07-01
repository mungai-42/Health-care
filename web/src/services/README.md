# Services Tier

Contains API client setups (e.g., Axios clients, interceptors) and endpoints definitions.
All server integrations must go here instead of directly inside UI code.

Example:
```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure JWT headers interceptors here.
```
