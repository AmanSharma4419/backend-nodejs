# Backend Arc

A production-grade Node.js Express application with TypeScript, PostgreSQL, and Knex migrations.

## Features

- TypeScript support
- Express.js with best practices
- PostgreSQL database with Knex migrations
- Security middleware (helmet, cors, rate limiting)
- Environment configuration
- ESLint and Prettier for code quality
- Development and production configurations
- Health check endpoint
- Error handling middleware

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your database credentials and other configurations

## Database Setup

1. Create a PostgreSQL database
2. Run migrations:
   ```bash
   npm run migrate
   ```
3. (Optional) Run seeds:
   ```bash
   npm run seed
   ```

## Development

Start the development server:
```bash
npm run dev
```

## Production

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback last migration
- `npm run migrate:make` - Create a new migration
- `npm run seed` - Run database seeds
- `npm run seed:make` - Create a new seed
- `npm test` - Run tests

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── app.ts          # Express application setup
└── server.ts       # Server entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC 