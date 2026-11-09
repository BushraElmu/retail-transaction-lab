# retail-transaction-lab

An interactive and reproducible learning environment for exploring how real retail applications process orders, maintain database correctness, and handle concurrent operations.

**Project Status:** Planning

### Purpose

The retail transaction lab is a small full-stack application designed to investigate the relationship between frontend interactions, backend orchestration, HTTP APIs, SQL execution, and PostgreSQL transactions.

The project prioritizes a highly observable system over feature breadth. Its central question is:

**How do retail applications preserve correct business states when multiple customers submit orders, database operations overlap, and failures occur?**

### Project Goals

1. Build a functioning frontend, backend, HTTP API, and PostgreSQL application.
2. Implement order processing using explicit SQL statements and database transactions.
3. Support one or two simulated customer sessions with configurable customer baskets and starting store inventory.
4. Demonstrate concurrent checkout behaviour and the prevention of inventory overselling.
5. Make execution observable through an Event Timeline, Transaction Inspector, and Database-State Inspector.
6. Provide a reproducible, cross-platform developmental environment using Docker and Docker Compose.
7. Document and fully understand the execution paths, architectural decisions, experiments, and engineering concepts encountered throughout this project.

### MVP Definition

#### **Database:** `PostgreSQL`
- Tables:
  - `inventory` - Available product quantities
  - `orders` - order headers, associated customer IDs, and order statuses
  - `order_items` - products and quantities associated with each order
- Run within a Temporary Docker Environment
- Supporting Configurable Data Persistence

#### **Frontend:** `TypeScript` and `React`
- Configurable starting store inventory
- Selection of one or two simulated customers from four available identities
- Configurable product baskets and quantities for each customer
- Submission of checkout requests through the backend API
- Viewing an Event Timeline of recorded execution stages
- Inspect Transaction operations, SQL statements, results, and outcomes
- INspect the three Database Tables and available recorded state observations

#### **Backend:** `Node.js`, `TypeScript`, and `Fastify`
- Expose HTTP API endpoints for checkout and lab operations
- Receive and validate purchase requests
- Execute Explicit Parameterized SQL using `node-postgres`
- Coordinate order creation and inventory updates within database transactions
- Preserve defined database and business invariants (constraints) during concurrent operations
- Record significant application and transaction events for inspection
- Checkout using conditional inventory updates within PostgreSQL's default Read Committed isolation level

#### **Environment:** `Docker` and `Docker Compose`
- Containerized PostgreSQL
- Reproducible full-stack environment
- Disposable experiment data

#### **Testing** 
- `TypeScript` type checking and automated application tests
- `PostgreSQL` integration tests for transaction correctness
- Concurrent checkout tests and invariant verification
- `Playwright` browser tests for important user workflows

### Documentation

**docs/PROJECT_GOALS.md** - Detailed requirements, scope, milestones, and acceptance criteria

### Reproducibility

The project aims to support MacOS, Windows, and Linux using documented dependencies, Docker Compose, and automated tests.

Environment setup and run instructions will be published when relevant components are implemented and verified.
