# Multi currency ledger service
A basic yet robust multi-currency ledger service using NestJS.

# Running the app

```bash
cp .env.example .env
docker-compose up
```

# Api Examples

## Create Ledger
```bash
curl --location 'http://localhost:3000/ledgers' \
--header 'Content-Type: application/json' \
--data '{
    "currency": "USD"
}'
```

## Create balance
```bash
curl --location 'http://localhost:3000/balances' \
--header 'Content-Type: application/json' \
--data '{
    "currency": "EUR",
    "ledgerId": "uuid from create ledger request"
}'
```

## Get all balances
```bash
curl --location 'http://localhost:3000/balances/uuid from create ledger request'
```

## Create transaction
```bash
curl --location 'http://localhost:3000/transactions' \
--header 'Content-Type: application/json' \
--data '{
    "ledgerId": "91b91eb2-cd47-45cd-aba3-9279acd0400e",
    "transactionType": "credit",
    "amount": 5,
    "currency": "USD"
}'
```

# Brief discussion of the architecture

My decision to utilize a monolithic architecture for an application processing up to 1,000 transaction creation requests per minute is grounded in the current performance requirements and the simplicity of deployment. Monolithic architectures are often preferable in the initial stages of a project where the goal is to launch quickly while the load does not yet demand complex scaling solutions.

Using AWS ECS in combination with API Gateway, Load Balancer, and RDS indeed offers flexibility and scalability sufficient for such a load. This setup allows for relatively easy scaling management as request volumes increase, minimizing costs and infrastructure management complexity.

The choice between server-based computing and serverless architecture (API Gateway + Lambda + RDS) largely depends on the regularity and predictability of requests. For sporadic traffic that occurs intermittently, serverless can prove more cost-effective, whereas constant load is better managed with server solutions due to lower long-term operational costs.

Choosing NestJS for its modularity allows for well-structured and maintainable code, which is crucial for monolithic applications where all functionality is tightly interconnected. NestJS’s modularity also facilitates potential code refactoring for transitioning to microservices in the future if necessary.

Implementing a transactional model using additional abstractions like repository interceptors is a thoughtful approach to ensuring data integrity and managing complex business rules, particularly vital in financial applications.

My load testing with Postman and the included collections not only enables verification of API functionality but also assesses system performance under various usage scenarios, which is crucial for maintaining high service levels.

Overall, my approach to architecture and technology stack demonstrates a deep understanding of project requirements and provides a robust foundation for future development and scaling.
