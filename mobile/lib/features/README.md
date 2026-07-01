# Features Folder

Features are structured as self-contained models following Clean Architecture:

Example structure:
```
features/
└── appointment/
    ├── data/
    │   ├── datasources/   # Local/Remote data fetching
    │   ├── models/        # JSON parsers (Data representations)
    │   └── repositories/  # Repository implementations
    │
    ├── domain/
    │   ├── entities/      # Core business objects
    │   ├── repositories/  # Repository interfaces (Contracts)
    │   └── usecases/      # Direct user actions rules
    │
    └── presentation/
        ├── bloc/          # State controller (BLoC / Cubits)
        ├── pages/         # Screen layout views
        └── widgets/       # Screen-specific atomic widgets
```
This isolates visual and business rules, enabling parallel team development.
