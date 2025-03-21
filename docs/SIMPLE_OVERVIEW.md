# Simple Overview of Our Backend Application

## 1. Basic Request Flow
```mermaid
graph LR
    A[User] -->|Makes Request| B[Security Check]
    B -->|If Safe| C[Check Input Data]
    C -->|If Valid| D[Process Request]
    D -->|Get/Save Data| E[(Database)]
    D -->|Send Back| F[Response to User]
    
    style A fill:#f9f,stroke:#333
    style E fill:#bbf,stroke:#333
    style F fill:#bfb,stroke:#333
```

## 2. Project Folder Structure Explained
```mermaid
graph TD
    Root[Backend App] --> Config[config: Settings]
    Root --> Controllers[controllers: Handle Requests]
    Root --> Routes[routes: Define URLs]
    Root --> Services[services: Business Logic]
    Root --> Models[models: Database Tables]
    Root --> Utils[utils: Helper Functions]
    
    style Root fill:#f9f,stroke:#333
    style Controllers fill:#bbf,stroke:#333
    style Services fill:#bfb,stroke:#333
    style Models fill:#fbb,stroke:#333
```

## 3. Sign Up Process
```mermaid
sequenceDiagram
    participant User
    participant App
    participant Security
    participant Database

    User->>App: Sign Up Request
    App->>Security: Check Data Safety
    Security->>App: Data is Safe
    App->>Database: Save User Info
    Database->>App: User Created
    App->>User: Welcome! Here's your token
```

## 4. Login Process
```mermaid
sequenceDiagram
    participant User
    participant App
    participant Security
    participant Database

    User->>App: Login Request
    App->>Security: Check Password
    Security->>Database: Find User
    Database->>Security: User Found
    Security->>App: Password Correct
    App->>User: Here's your access token
```

## 5. Security Features
```mermaid
graph TD
    Request[Incoming Request] --> Rate[Check Request Limit]
    Rate --> Headers[Add Security Headers]
    Headers --> Clean[Clean Input Data]
    Clean --> Check[Check User Permission]
    Check --> Process[Process Request]
    
    style Request fill:#f9f,stroke:#333
    style Process fill:#bfb,stroke:#333
```

## 6. Error Handling
```mermaid
graph TD
    Error[Error Happens] --> Type{What Type?}
    Type -->|Wrong Input| A[Tell User to Fix Input]
    Type -->|Not Logged In| B[Ask User to Login]
    Type -->|Server Problem| C[Show Friendly Message]
    
    style Error fill:#f99,stroke:#333
    style A fill:#9f9,stroke:#333
    style B fill:#99f,stroke:#333
    style C fill:#f9f,stroke:#333
```

## Key Points in Simple Terms:

1. **Security First**
   - Checks every request for safety
   - Protects against bad requests
   - Keeps user data safe

2. **Data Handling**
   - Validates all input data
   - Stores data safely in database
   - Sends back clean responses

3. **User Management**
   - Handles sign up and login
   - Keeps track of user sessions
   - Protects user information

4. **Error Management**
   - Catches all problems
   - Shows helpful error messages
   - Keeps app running smoothly

## How to Run the App

1. Start the app:
   ```bash
   npm run dev
   ```

2. The app will:
   - Start on port 3000
   - Connect to database
   - Be ready for requests

3. Available Routes:
   - Sign up: POST /api/auth/signup
   - Login: POST /api/auth/login
   - Health check: GET /health 