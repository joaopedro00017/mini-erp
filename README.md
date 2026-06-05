<div align="center">

# Mini-ERP

**Sistema de gestão empresarial full-stack com backend artesanal em Spring Boot e frontend moderno em Next.js.**

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.6-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📸 Demonstração (Screenshots)

> **Instrução para o desenvolvedor:** Para exibir as screenshots abaixo, crie uma pasta chamada `screenshots/` na **raiz** do projeto (ao lado das pastas `mini-erp/` e `mini-erp-front/`) e salve os seus prints com **exatamente** os nomes listados:
>
> | Nome do ficheiro | O que deve mostrar |
> |---|---|
> | `screenshots/dashboard.png` | Métricas e gráficos da página inicial (Dashboard) |
> | `screenshots/produtos-desktop.png` | Listagem e filtros de produtos em ecrãs grandes |
> | `screenshots/pedidos-mobile.png` | O modal/cards de pedidos responsivo simulado num telemóvel |

<table>
  <tr>
    <td align="center" width="50%">
      <strong>Dashboard</strong><br/><br/>
      <img src="screenshots/dashboard.png" alt="Dashboard com métricas e gráficos" width="100%"/>
    </td>
    <td align="center" width="50%">
      <strong>Gestão de Produtos (Desktop)</strong><br/><br/>
      <img src="screenshots/produtos-desktop.png" alt="Listagem e filtros de produtos" width="100%"/>
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <strong>Pedidos (Mobile)</strong><br/><br/>
      <img src="screenshots/pedidos-mobile.png" alt="Cards de pedidos em modo mobile" width="48%"/>
    </td>
  </tr>
</table>

---

## 📖 Sobre o Projeto

O **Mini-ERP** é um sistema de gestão empresarial completo desenvolvido como demonstração de competência técnica full-stack. O sistema abrange o ciclo de vida completo de um negócio: gestão de produtos com controlo de estoque, cadastro de clientes com CPF/CNPJ, criação de pedidos com cálculo automático de total e uma máquina de estados robusta (`RASCUNHO → PAGO / CANCELADO`), além de controlo de categorias.

A interface oferece suporte total a **Light Mode e Dark Mode**, é totalmente **responsiva** e foi construída com foco em acessibilidade e consistência visual.

---

## 🤖 Abordagem de Engenharia: IA Focada vs. Artesanato Manual

> Esta secção é fundamental para compreender as escolhas técnicas do projeto.

### Frontend — Produtividade Acelerada com IA

O uso de Inteligência Artificial foi **deliberadamente restrito e focado** ao ecossistema de Frontend. A IA atuou como uma ferramenta de **aceleração**, não de substituição de raciocínio, sendo utilizada para:

- **Prototipagem rápida** de layouts e estrutura de componentes em Next.js e TypeScript.
- **Consistência de temas** — garantindo que tokens de cores e classes do Tailwind CSS v4 se aplicassem corretamente tanto no Light quanto no Dark Mode.
- **Componentes acessíveis** via Shadcn/ui, como `AlertDialog` para ações destrutivas (ex: cancelar pedido) e `Sonner` para notificações não-intrusivas.
- **Adaptação cirúrgica de responsividade mobile**, como a conversão de tabelas pesadas em cards empilhados para ecrãs pequenos.

### Backend — 100% Artesanal e o Principal Foco de Avaliação

O verdadeiro coração técnico do projeto é o **Backend**. Todo o ecossistema em Java 21 com Spring Boot foi **desenvolvido de forma 100% manual**, sem assistência de IA, para demonstrar profundidade e solidez em:

- **Arquitetura em camadas** limpa: `Controller → Service → Repository → Domain`
- **Design Patterns**: DTO (Data Transfer Object) implementado com Java Records para Request/Response, separando completamente o contrato da API do modelo de persistência
- **Regras de negócio complexas**: validação transacional de estoque (com `@Transactional`), cálculo automático do valor total do pedido, e estorno de estoque no cancelamento
- **Máquina de estados**: um pedido só pode ser pago se estiver em `RASCUNHO`; um pedido cancelado não pode ser cancelado novamente — tudo protegido por `BusinessException`
- **Tratamento global de exceções** (`@RestControllerAdvice`) com respostas padronizadas para 5 categorias de erro
- **Segurança e configuração**: blindagem completa de credenciais via variáveis de ambiente e CORS centralizado

---

## 🛠️ Tecnologias Utilizadas

### Backend (`mini-erp/`)

| Tecnologia | Versão | Função |
|---|---|---|
| Java | 21 | Linguagem principal |
| Spring Boot | 4.0.6 | Framework base |
| Spring Web MVC | — | Camada de controllers REST |
| Spring Data JPA | — | Abstração de repositórios |
| Hibernate | — | ORM / mapeamento entidade-tabela |
| Spring Validation | — | Bean Validation (`@NotBlank`, `@Positive`, etc.) |
| PostgreSQL Driver | — | Conector JDBC para o banco de dados |
| Lombok | — | Eliminação de boilerplate (`@Data`, `@RequiredArgsConstructor`) |
| Maven | — | Gerenciamento de dependências e build |

### Frontend (`mini-erp-front/`)

| Tecnologia | Versão | Função |
|---|---|---|
| Next.js | 16.2.6 | Framework React (App Router) |
| React | 19.2.4 | Biblioteca de UI |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | v4 | Estilização utility-first |
| Shadcn/ui | 4.8.3 | Componentes acessíveis e estilizáveis |
| Axios | 1.16.1 | Cliente HTTP para consumo da API |
| Sonner | 2.0.7 | Notificações toast |
| next-themes | 0.4.6 | Alternância Light/Dark Mode |
| Lucide React | — | Biblioteca de ícones SVG |

---

## 🏗️ Engenharia e Boas Práticas

### Arquitetura do Backend

```
mini-erp/src/main/java/com/soujoaopedro/mini_erp/
├── controller/      # Endpoints REST (Produto, Pedido, Cliente, Categoria)
├── service/         # Regras de negócio e transações
├── repository/      # Interfaces Spring Data JPA
├── domain/          # Entidades JPA e Enums
├── dto/             # Records de Request e Response (contrato da API)
├── exception/       # Hierarquia de exceções e GlobalExceptionHandler
└── config/          # CorsConfig (segurança de origem)
```

### Tratamento Global de Exceções

O `GlobalExceptionHandler` (`@RestControllerAdvice`) intercepta e padroniza **todas** as respostas de erro da API, retornando sempre um objeto `StandardError` com timestamp, status HTTP, título e mensagem.

| Exceção | Status HTTP | Cenário |
|---|---|---|
| `ResourceNotFoundException` | `404 Not Found` | Entidade não encontrada por ID |
| `BusinessException` | `422 Unprocessable Entity` | Regra de negócio violada (ex: estoque insuficiente) |
| `MethodArgumentNotValidException` | `400 Bad Request` | Falha na validação de campos do DTO |
| `DataIntegrityViolationException` | `400 Bad Request` | Violação de FK (ex: deletar categoria com produtos) |
| `Exception` | `500 Internal Server Error` | Fallback genérico — mensagem amigável, sem vazar stack traces |

### Blindagem de Dados Sensíveis

Nenhuma credencial é hardcoded no código-fonte. Todas as configurações sensíveis são lidas via variáveis de ambiente:

```properties
# application.properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:3000}
```

### CORS Centralizado

A política de CORS está em `CorsConfig.java`, lendo a lista de origens permitidas da variável `CORS_ALLOWED_ORIGINS`. Nenhum `@CrossOrigin` existe nos controllers, evitando configurações dispersas e inconsistentes.

### Boas Práticas no Frontend

- **Keys dinâmicas em seletores**: Chaves de componentes (`key`) atualizadas dinamicamente para forçar re-renderização e evitar bugs de cache visual em formulários.
- **`AlertDialog` para ações críticas**: Ações destrutivas (cancelar pedido) usam o componente `AlertDialog` do Shadcn, exigindo confirmação explícita do utilizador.
- **Variável de ambiente tipada**: `NEXT_PUBLIC_API_URL` centraliza a URL da API, com `.env.example` commitado como documentação e `.env.local` no `.gitignore`.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Java 21+
- Maven 3.x
- PostgreSQL rodando localmente (ou via Docker)
- Node.js 20+ e npm

---

### 1. Backend (Spring Boot)

**1.1. Configure o banco de dados PostgreSQL**

Crie um banco de dados no seu PostgreSQL:
```sql
CREATE DATABASE mini_erp;
```

**1.2. Configure as variáveis de ambiente**

No terminal (PowerShell) antes de executar o Maven, exporte as variáveis:

```powershell
$env:DB_URL      = "jdbc:postgresql://localhost:5432/mini_erp"
$env:DB_USERNAME = "seu_usuario_postgres"
$env:DB_PASSWORD = "sua_senha_postgres"
$env:CORS_ALLOWED_ORIGINS = "http://localhost:3000"
```

Ou crie um ficheiro `.env` e use uma ferramenta como `dotenv-maven-plugin` — mas a forma mais simples é exportar as variáveis na sessão atual do terminal.

**1.3. Execute o backend**

```bash
cd mini-erp
./mvnw spring-boot:run
```

O servidor iniciará em `http://localhost:8080`. O Hibernate criará as tabelas automaticamente no primeiro run (DDL automático via `spring.jpa.hibernate.ddl-auto`).

---

### 2. Frontend (Next.js)

**2.1. Configure a URL da API**

Dentro da pasta `mini-erp-front/`, crie o ficheiro `.env.local`:

```bash
# mini-erp-front/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**2.2. Instale as dependências e execute**

```bash
cd mini-erp-front
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:3000`.

---

## 🔌 Endpoints da API (Resumo)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/produtos` | Lista todos os produtos |
| `POST` | `/produtos` | Cadastra novo produto |
| `PUT` | `/produtos/{id}` | Atualiza um produto |
| `DELETE` | `/produtos/{id}` | Remove um produto |
| `GET` | `/pedidos` | Lista todos os pedidos |
| `POST` | `/pedidos` | Cria um pedido (valida estoque e calcula total) |
| `PATCH` | `/pedidos/{id}/pagar` | Avança pedido para `PAGO` |
| `PATCH` | `/pedidos/{id}/cancelar` | Cancela pedido e restaura estoque |
| `GET` | `/clientes` | Lista todos os clientes |
| `POST` | `/clientes` | Cadastra novo cliente |
| `GET` | `/categorias` | Lista todas as categorias |
| `POST` | `/categorias` | Cadastra nova categoria |

---

## 👤 Autor

Desenvolvido por **João Pedro**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/soujoaopedro)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/soujoaopedro)
