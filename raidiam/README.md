# Consents API - Junior/Mid-Level Engineer Case 2025

- Author: **Otávio Baziewicz Filho**

- MindMap [FigJam Mind Map](https://www.figma.com/board/BNGn82bcbwAc4JTpknEkJb/Raidiam-Technical-Task?node-id=0-1&p=f&t=VeiX9d8NMZ7Zj6lO-0)

- Video: [docs/mind-map.mp4](docs/mind-map.mp4)

This project implements the [Consents API Specification](docs/consentsAPI.yaml) following this [Case Instructions](docs/Case%20Instructions.pdf) manual.

## Project organization

The project is organized as a pnpm monorepo, even with just one service implemented this approach provides extensibility and also an isolated infrastructure as code implementation for defining the service deployment.

- **.github** (Github actions workflow files)
- **infra** (Infrastructure as code definitions)
- **packages/consents** (Consents api source code)
- (other general config files)

The consents service is implemented in **Java** with the **Micronaut** framework and the infrastructure as code is implemented in **Typescript (Node.js)** with the **SST** framework.

The consents service is organized following a **Domain Driven Design** and **Hexagonal Architecture (formally Ports and Adapters)** pattern. The folders structure is:

- **domain**: The innermost layer of the service, where entities and dtos are defined. The resources defined here should not depend on any other external service or specific implementation.
- **application**: The orchestration layer and the boundary of application business rules. Here all the use cases are defined and also the _Outbound Ports_, i.e. the interfaces with external services.
- **infrastructure**: The layer where the interfaces with external services are implemented properly. Those implementations are named _Adapters_.
- **controller**: It is at this layer that the application's use cases are connected with external services, such as API endpoints. It is also here that dependencies are injected through the use cases (In Micronaut, this is done automatically). Analogous to _Outbound Ports_ in the application layer, this layer contains _Inbound ports_.

> The implementation of database access is implemented with reactive streams in order to optimize the threads of the application and avoid blocking the main thread with IO operations.
>
> The service is stateless, and the shape of the stored data is unique to a user. Therefore, concurrency issues are not expected as a downside of non-blocking operations.

## Development setup

### What you will need

1. JDK 21 so you can run the consents service
2. IDE with great java support. I'm using VSCode and there is a set of recommended extensions i've provided in the [extensions.json](.vscode/extensions.json) file so your VSCode will suggest automatically
3. Node.js 20 (lts/iron). I recommend installing node through [NVM](https://github.com/nvm-sh/nvm).
4. [Pnpm 9](https://pnpm.io/installation).

Both step **3** and **4** are optional and must be followed only if you want to interact with the infrastructure definition.

### Consents service startup

With jdk 21 installed correctly you can use the `gradlew` script to start the project running:

```shell
cd packages/consents
./gradlew run
```

It starts the development server exposed in the port 8080 of your local network: [http://localhost:8080](http://localhost:8080).

### Infrastructure setup

This setup requires more configuration but gives you the full set of possibilities to interact with the project and also to deploy the project from your machine.

Make sure you have all the required tools and follow the steps:

1. Install Node.js Dependencies:

   ```shell
   pnpm install
   ```

2. Configure an AWS local profile

   Get a credential pair for an AWS account and add the following lines to the `~/.aws/credentials` file:

   ```toml
   [YOUR_PROFILE_NAME]
   aws_access_key_id=####################
   aws_secret_access_key=########################################
   ```

   You can check the minimum account permissions [here](https://sst.dev/docs/iam-credentials), but for making the process easier in this context you can assign the `AdministratorAccess` policy.

3. Duplicate the `.env.example` file and rename it to match a **STAGE** name of your preference. E.g: `.env.production`. Fill in the environment variables:

   - **AWS_PROFILE**: The name of the AWS Profile you've created before.
   - **CONSENTS_MONGODB_URI**: The Mongodb server uri.
   - **CONSENTS_PROXY_TYPE**: [API_GATEWAY_VPC_LINK or APPLICATION_LOAD_BALANCER (default)] The deployment option (It will be explained later in this documentation).

4. You are all set!

### Deployment to AWS

Now you have your local environment configured properly, you can check the deployment process by running the following command:

```shell
pnpm sst deploy --stage=STAGE
```

> Make sure you have an environment variable file with the same name of the stage
>
> E.g: for the production stage
>
> - environment file: `.env.production`
> - deployment command: `pnpm sst deploy --stage=production`

## Infrastructure

The main reason the repository is organized like that is to provide **Infrastructure as Code** to the service. The **SST** is a **Node.js** framework to create full stack applications connecting application artifacts and cloud resources out of the box. It supports multiple cloud providers through **Pulumi** and the open source side of **Terraform**.

All infrastructure components used in this project are provided by AWS and I've provided two deployment options through a feature flag so the application can be deployed differently depending on the environment characteristics.

Other than that the production environment relies on a external **MongoDB** server to store to act as a data repository.

You can check the infrastructure definition here:

- [Environment Variables](infra/env.ts)
- [Consents Service](infra/consents.ts)
- [Main file](sst.config.ts)

### Deployment Options

#### 1. ECS Cluster on Fargate + Api Gateway HTTP

This is the best option for environments where the service receives a small amount of requests, because of the pricing model, it will be cheaper compared to the other option. The Api Gateway acts as a proxy to the ECS Cluster through a VPC Link and the the billing will be mostly related to ECS config, since Api gateway are paid per request and there is also a great free tier.

#### 2. ECS Cluster on Fargate + Application Load Balancer

This is a great option for large scale environments, since a great part of the load balancer cost is recurrent and it also has better configuration options for security and customized routing rules.

## Deployment build

The service deployment build process outputs a `Docker` image containing a `Native executable` generated with `GraalVM` jvm. Native images are not a silver bullet because of the reflecting configuration overhead in some cases, but for this project it makes the container initialization blazing fast!

The `Dockerfile` is generated dynamically with the micronaut gradle plugin.

- [Consents IaC Image Build](infra/consents.ts#L21)

## Security concerns

The service specification does not include authentication, so all the service api endpoints are publicly open. It is a PoC service and for production scenarios it is not recommended and should at least run in a private network (VPC).

Other than that, some best practices are implemented to improve the overall security of the service.

- **Data Validation**: Implemented using Micronaut and Jakarta annotations.
- **Body Maximum Payload Size**: It is fixed to at most 5Mb, since the requests are small and it reduces the attack surface.
- **CORS**: The cors configuration is allowed in the service implementation. It is usually configured in a proxy layer (Application Load Balancer, Api Gateway, etc.), so it is fine like that.

## Tests

Micronaut provides a dependency injection system out of the box and combined with the hexagonal architecture made the process of writing tests across responsibility layers straightforward.

The test files are organized following the same folder organization as the service implementation.

For the **Domain** and **Application** layers, unit tests are implemented using a stateful **In memory** version of the database repository. Those layers implement the core business contracts and are not aware of specific infrastructure implementations, so it is not necessary to run with external components.

In the **Infrastructure** layer, integration tests are implemented. Those are key to validate the boundaries of the application since they interact with external components. E.g: The [MongodbConsentRepositoryTest.java](packages/consents/src/test/java/worgho2/consents/infrastructure/MongodbConsentRepositoryTest.java) depends on a mongodb server to run (Micronaut handles the startup of the test container), and it validates all the queries the application uses.

The **Controller** layer is also covered with integration tests. For those tests, the **rest-assured** library was chosen because it provides a syntax sugar to write http tests. Those tests are important because they ensure compliance with the service shape specification.

### Running tests

In order to run the tests, make sure you have already configured your development environment. After that you can run the following commands:

From the repository root you can use the **pnpm** script:

```shell
pnpm test
```

It runs the `./gradlew build` in the `packages/consents` folder.

If you want to run only the tests, without the entire build, run:

```shell
cd packages/consents
./gradlew test
```

## Development workflow

By the context of this project, where the service specializes in a few domains and the public facing API is not versioned, a trunk based development workflow is good to maintain.

Features can be developed in separated branches and merged back, or even directly in the main branch if they are atomic and will keep the code in a working state.

It is also recommended in this case to use the **Squash and Merge** strategy on merges to keep a linear commit history. (Easy to maintain, but not a silver bullet for bigger scenarios).

## Continuous Integration

Once new commits (tags or pr updates) are pushed to a branch, a **Github Actions CI Workflow** starts. It is responsible for running the entire build process, including the tests, providing a short report.

- [.github/workflows/ci.yml](.github/workflows/ci.yml)

## Continuous Deployment

The deployment of the application automation strategy follows the chosen development workflow. It depends on **semantic commit messages** to automatically create **Release Pull Requests** for changes commit to the main branch following the **Semantic Versioning Standard**.

Once a **Release Pull Request** is merged back to the main branch, a new version tag is created and the deployment process starts.

The **Github Actions RELEASE Workflow** relies on the Google's **Release Please** library and can be found here:

- [.github/workflows/release.yml](.github/workflows/release.yml)

## Workarounds

- [micronaut-test-resources/issues/785](https://github.com/micronaut-projects/micronaut-test-resources/issues/785) The default version of the testing library **io.micronaut.test-resources** is not working properly in the Github Actions environment. (This issue is being reported since micronaut version 4.7.x) **In order to make it work, it was necessary to manually bump its version to 2.7.2.**

## Deployment showcase

I've deployed the service in AWS to showcase the implemented service in a production environment. The service api endpoint can be accessed here:

- [https://a0alb1o2r4.execute-api.us-east-1.amazonaws.com](https://a0alb1o2r4.execute-api.us-east-1.amazonaws.com)

The source code is also hosted in my github account as a private repository, reach me out so I can give you access if you want to take a look in the commits, workflow runs and configs!
