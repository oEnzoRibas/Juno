# Architecture diagrams

**Status:** Proposed supporting sketches from JUNO-0001. See the authoritative editable architecture diagrams and the visual documentation standard. Use C4 concepts for context, containers, components and deployment. Use sequences and entity relationships for process and data views. [C4 diagrams](https://c4model.com/diagrams) · [Mermaid reference](https://mermaid.js.org/intro/) · [GitHub diagram rendering](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)

## System context

Members and scoped administrators use Juno. Optional providers supply authorized contribution, learning and document references.

```mermaid
flowchart LR
    Person[Member or administrator] --> Juno[Juno platform]
    Juno <--> GitHub[GitHub and GitHub Projects]
    Juno --> YouTube[YouTube]
    Juno <--> SharePoint[Microsoft SharePoint]
```

## Containers and deployment

A self-hosted ingress routes browser traffic. The browser and API may share an origin. The API retains one modular backend, with a separate worker and object storage only where justified. All private data services stay behind the ingress.

```mermaid
flowchart LR
    Browser[Browser] -->|HTTPS| Edge[Public ingress]
    subgraph Host[Candidate self-hosted deployment]
        Edge --> Web[Web frontend]
        Edge --> API[Modular API]
        API --> DB[(Relational database)]
        API -.-> Files[(Private object storage)]
        Worker[Optional worker] -.-> DB
        Worker -.-> Files
    end
```

## Components

Presentation coordinates authenticated inputs with policy and application use cases. Use cases call domain functions and ports. Adapters implement those ports and contain database and provider details.

```mermaid
flowchart LR
    HTTP[Presentation routes] --> Access[Identity and authorization]
    HTTP --> UseCase[Application use cases]
    UseCase --> Access
    UseCase --> Domain[Domain invariants]
    UseCase --> Ports[Persistence and integration ports]
    Adapters[Infrastructure adapters] -->|Implement| Ports
    Adapters --> Services[Database and external services]
```

## Authentication, authorization and tenant isolation

After validating a session, the server resolves the requested tenant, checks active membership and action scope, and uses a restricted database role with transaction-scoped tenant context. Neither an explicit object ID nor a signed-in session grants tenant access.

```mermaid
sequenceDiagram
    actor Member
    participant API
    participant Policy
    participant Store
    Member->>API: Send authenticated request and tenant selector
    API->>API: Verify session and resolve tenant
    API->>Policy: Check actor, active membership, action and resource
    alt Denied
        API-->>Member: Return policy-defined denial
    else Authorized
        API->>Store: Open transaction under restricted role and tenant context
        Store->>Store: Check row policy and constraints
        Store-->>API: Return authorized result
        API-->>Member: Return scoped response
    end
```

## Data relationships

Identity is global. Tenant memberships bind identities to organizations. Projects, accounts and ledger entries use tenant-scoped relationships. The logical model omits implementation-specific columns.

```mermaid
erDiagram
    IDENTITY ||--o{ MEMBERSHIP : holds
    TENANT ||--o{ MEMBERSHIP : contains
    TENANT ||--o{ PROJECT : owns
    MEMBERSHIP ||--o{ PROJECT_ASSIGNMENT : receives
    PROJECT ||--o{ PROJECT_ASSIGNMENT : groups
    MEMBERSHIP ||--o{ CURRENCY_ACCOUNT : owns
    CURRENCY_ACCOUNT ||--o{ LEDGER_ENTRY : records
```

## GitHub integration and domain events

The adapter validates signatures and installation mapping before durable intake. An approved activity crosses an internal contract into recognition. Provider delivery deduplication and reward idempotency cover different boundaries.

```mermaid
flowchart LR
    GitHub[GitHub delivery] --> Verify[Verify signature and installation scope]
    Verify --> Intake[Persist tenant-scoped intake and delivery ID]
    Intake --> Map[Map and validate activity]
    Map --> Event[Record qualifying event and optional outbox]
    Event --> Score[Apply tenant rule version]
    Score --> Award[Persist idempotent award and explanation]
```

## Reports and challenges

Report submission and challenge evidence have distinct eligibility and reviewer checks. Only a committed qualifying decision is eligible for recognition.

```mermaid
flowchart LR
    Draft[Draft report] --> Report[Submit report]
    Enroll[Enroll in challenge] --> Challenge[Submit evidence]
    Report --> Review[Authorized review in tenant scope]
    Challenge --> Review
    Review -->|Reject| Feedback[Record decision and feedback]
    Review -->|Approve| Outcome[Commit decision and qualifying outcome]
    Outcome --> Recognition[Evaluate recognition rules]
```

## Currency transactions and reward redemption

An authorized use case checks balance, inventory and idempotency in a single transaction. The proposed path shows a debit at approval. Reservation policy remains open. Eligible cancellations use compensating entries.

```mermaid
flowchart LR
    Request[Authorized redemption] --> Lookup[Check idempotency key]
    Lookup -->|Existing matching request| Prior[Return recorded outcome]
    Lookup -->|New request| Tx[Check authoritative balance and stock in transaction]
    Tx -->|Insufficient| Deny[Reject without changing balance or stock]
    Tx -->|Available| Commit[Commit ledger debit, stock and redemption]
    Commit --> Fulfill[Fulfill reward]
    Commit --> Reverse[Eligible cancellation records compensation]
```

Review against the [architecture proposal](overview.md), [tenancy requirements](tenancy.md), [integration design](../integrations/README.md), and [business rules](../product/gamification.md). Update each view when an accepted ADR or implementation changes the represented behavior.
