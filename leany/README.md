# Tech Test Leany

## Requirements

```
Utilizar Nest.JS (https://docs.nestjs.com/)

Criar uma API (CRUD) completa.

Implementar relações entre entidades: 1x1, 1xN, NxN.

Realizar o mapeamento e isolamento de Entidades e DTOs.

Seguir o padrão MVC (ou arquitetura em camadas similar):

Validação de permissões em middlewares/decorators ou na camada de controller.

Lógica e regras de negócio nos serviços (Services).

Conexões e operações com banco de dados na camada de repositórios (Repositories).

Subir um banco de dados local utilizando Docker e conectar ao backend.

Fornecer um README.md claro com instruções para iniciar o projeto e o banco de dados, além de quaisquer outros comentários relevantes.

Documentar a API utilizando Swagger (OpenAPI).

Implementar gerenciamento de permissões e aplicar validação via middleware/decorators.

Toda entrada de DTO via API deve ser validada e tratada (atributo a atributo, tanto atributos presentes quanto tipos).

Nenhuma entidade do banco de dados deve transitar para fora da camada de repositório (ex: para serviços ou controllers).

Realizar uma integração externa para consulta de CEP e disponibilizá-la como um serviço interno na API.

Disponibilizar um serviço de pesquisa à PokeAPI com capacidade de filtros e paginação.

```

## Author

Otávio Baziewicz Filho

## Requirements

- PNPM ^9
- Docker
- Node lts/iron (20)

## Project setup

1. Make use of the correct node version. If you have `nvm` you can run:

```bash
$ nvm use
```

2. Install dependencies

```bash
$ pnpm install
```

## Running the project locally

This command starts the entire development environment without the need to manually configure environment variables.

```bash
$ pnpm dev:docker
```

## OpenApi documentation path

In order to see the documentation, follow the link below:

[http://localhost:3000/api-spec](http://localhost:3000/api-spec)

## Missing implementations

Some of the requirements were not implemented due time restrictions

- Auth
- User listing endpoint
- Cep route as internal endpoint

## Questions

### Arquitetura Geral, Banco de Dados e Camadas

```
Qual banco de dados você utilizou e por quê? Como você configurou o Docker para ele? (Q3 original)
Como você estruturou as camadas da sua aplicação (Controller, Service, Repository)? Como garantiu a separação de responsabilidades e o fluxo de dados entre elas? (Q4 original)
```

- Decidi utilizar o mongodb como banco de dados pela rapidez em criar tanto os modelos quanto as entidades, além do que o gerenciamento da ferramenta é mais rápido para um cenário com restrição grande de tempo. A aplicação está estruturada seguindo padrões de DDD, Clean Architecture e Ports and Adapters. As camadas estão separadas da seguinte forma: A pasta domain contém todas as definições de entidades e DTO utilizados pela aplicação. Na pasta application, os inbound(casos de uso, onde ocorre a orquestração do domínio e execução das regras de negócio) e outbound(definição das interfaces de conexão com serviços externos) ports estão definidos. Na pasta infrastructure todas as implementações que lidam com recursos externos e frameworks específicos, essas implementações são chamadas de adapters na arquitetura hexagonal (ports and adapters). E finalmente na pasta interface são implementadas as conexões entre o mundo externo (api nesse caso) e os inbound ports da aplicação (casos de uso).

### Entidades, DTOs e Isolamento de Dados

```
Como você implementou o mapeamento e o isolamento entre Entidades (do banco) e DTOs (de tráfego na API)? Onde essa lógica reside?
Como você garantiu que as entidades do banco de dados não "vazassem" para fora da camada de repositório (ou seja, não são retornadas diretamente por serviços ou controllers)?
```

- Os modelos de banco de dados e as entidades (que são mapeadas e também utilizadas como DTOs) mudam por motivos diferentes e também são utilizadas para fins diferentes. Os modelos de banco refletem a progressão do esquema do banco de dados e está localizado somente na camada de repositório da aplicação `mongo-user-repository`. Lá dentro esse modelo é mapeado para a entidade `User` e é passado a diante dentro dos casos de uso. O contrato que garante o isolamento dos modelos são os `ports` de repositório, no caso o `UserRepository`.

### Validação de Dados e Gerenciamento de Permissões

```
Como você implementou a validação de dados de entrada (DTOs) em suas rotas? Quais atributos e tipos você validou e quais ferramentas ou abordagens utilizou?
Como você implementou o gerenciamento e a validação de permissões (ex: em middlewares, decorators)? Explique a lógica de permissão que você aplicou.
```

- Todos os casos de uso e entidades executam validações de `schemas` na construção de novas instâncias e na execução de métodos que tratam dados do cliente. A validação dos casos de uso está sendo feita com um decorator customizado `validateInput` que executa um parse do input da função do caso de uso e levanta uma excessão automaticamente caso exista alguma inconsistência.

- Não implementei autenticação nem autorização pela restrição de tempo, mas a ideia seria ter um modelo misto entre RBAC e ABAC, com um número definido de `roles`, sendo elas implementadas a nível de código (sem necessidade de guardar no banco de dados). A tratativa de autenticação seria feita através de tokens JWT para `Principals do tipo usuário` e através de assinatura de IAM para `Principals do tipo Service` (representando serviços internos).

- A lógica de autorização seria implementada através dos mecanismos que o Nest providencia a nível de rotas, mas verificações mais detalhadas seriam feitas através da extensão do decorator de validação e da injeção do `Principal` no contexto das requisições.

### Integrações Externas (CEP e PokeAPI)

```
Qual foi sua abordagem para a integração com a API de consulta de CEP? Como ela foi disponibilizada como um serviço interno?
Como você implementou o serviço de pesquisa à PokeAPI, incluindo filtros e paginação? Quais foram os principais desafios ou decisões interessantes nessa integração?
```

- O serviço de consulta de CEP não foi protegido com autenticação por questões de tempo, mas ficaria restrito através do `Principal doo tipo Service` com autenticação via assinatura para garantir que o acesso fosse feito em um contrato de confiança entre a api e outra aplicação de servidor.

- O serviço de consulta à PokeAPI foi implementado com paginação, porém sem filtros. Essa api é interessante pois ela pode levar a problemas de performance se não for consumida de maneira correta. Para amenizar o número de consultas e melhorar a performance geral, implementei uma camada de cache com o `Redis`, evitando a necessidade de consumir rotas específicas de pokemons constantemente, dado que os dados são estáticos. Vale lembrar que o sistema de cache também foi implementado na rota de CEP.
