# retail-transaction-lab - Project Goals

### 1. Primary Objective

Build a reproducible, browser-based, and full-stack retail transaction exploration lab that demonstrates how a frontend, backend, HTTP API, and PostgreSQL database cooperate to process and execute business operations. The lab will use real database transactions and will provide visibility into their execution, outcomes, and the resulting operational data. We also intend on making the system's execution observable, controllable, reproducible, and explainable.

### 2. Functional Requirements

#### 2.1 Customer Configuration
- Provide four predefined fictional customer identies
- Support one or two customer sessions
- Prevent both sessions from representing the same customer identity

#### 2.2 Product and Inventory Configuration
- Provide a small predefined product catalog
- Allow starting store inventory quantities to be configured as well
- Provide a default starting store inventory
- Represent available inventory in PostgreSQL
- Prevent available inventory quantities from becoming negative

#### 2.3 Shopping baskets
- Each customer session must support selecting possibly multiple products from the catalog and specifying their quantiies
- Reviewing the basket before submission
- Submitting the basket through the backend API

#### 2.4 Checkout Processing
- Receive and validate submitted purchase requests
- Resolve the customer identity
- Check and reserve inventory through conditional SQL updates
- Insert order headers and associated order items
- Execute all database changes required for one order within a single transaction
- Commit only when all required operations succeed.
- Rollback unsuccessful and/or failed transactions
- Return an accurate checkout result to the frontend
- Fail the entire checkout if any required item cannot be reserved without leaving partial commited order data or inventory reservations.

#### 2.5 Concurrent execution
- Support two independent and simultaneous checkout requests
- Permit the requests to overlap in execution
- Preserve database correctness when requets compete for the same inventory
- Report the outcome of each request independently
- Demonstrate that onle one customer can reserve a final available unit when both request it

#### 2.6 Execute Observability

Event Timeline:
- Record significant application and transaction execution stages
- Distinguish events associated between the two customers
- Show when SQL operations are submitted and when their results become available
- Show succesful completion, rejection, commit, and rollback outcomes.
- Allow recorded events to be reviewed after execution

Transaction Inspector:
- Display relevant SQL statementsd and parameters.
- Display returned values, affected row counts, and errors where applicable

Database-State Inspector:
- Display the inventory, order, and order_items tables
- Show the starting and final commited states
- Display the intermediate observations when recorded by the backend

### 3. Reproducibility Requirements

- Version-controlled source code and configuration
- A documented Node.js and package-manager environment
- Committed dependency lockfile
- Defined PostgreSQL version
- Versioned database migrations
- Temporary PostgreSQL execution through Docker
- Configurable preservation or deletion of database storage
- Automated PostgreSQL integration tests
- A documented Docker Compose workflow
- Cross-platform setup instructions for MacOS, Windows, and Linux (*this must be verified before its claimed as tested*)

### 4. Developmental Milestones

| Stage | Milestone |
|---|---|
| 0 | Repo, Docs, foundational architecture |
| 1 | Initial TypeScript and React frontend |
| 2 | First Node.js backend and HTTP API |
| 3 | Containerized PostgreSQL, database schema, and SQL access |
| 4 | Working transcational checkout |
| 5 | Two-customer concurrency and basic execution inspection - MVP |
| 6 | Full-stack containerization and reproducibility hardening |
