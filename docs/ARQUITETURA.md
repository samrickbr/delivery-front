# Arquitetura do SIGIN Delivery

## Objetivo

Definir a organização do projeto para manter um padrão durante todo o desenvolvimento.

---

# Backend

```
controller
        ↓
service
        ↓
repository
        ↓
database
```

O fluxo sempre deve seguir essa ordem.

O Controller nunca acessa o Repository diretamente.

---

## Estrutura

```
controller/

PedidoController

service/

PedidoService

repository/

PedidoRepository

mapper/

PedidoMapper

dto/

Request
Response
OperacaoResponse
BalcaoResponse
EntregaResponse

entity/

Pedido
PedidoItem
PedidoHistorico
Produto
Categoria
Setor
```
pedidohistorico/

service/

PedidoHistoricoService

repository/

PedidoHistoricoRepository

---

# Frontend

```
Pages
        ↓
Components
        ↓
Services
        ↓
API
        ↓
Backend
```

---

## Estrutura

```
src

pages/

cliente/
balcao/
cozinha/
lanchonete/
entrega/

balcao/

Responsável por:

- recebimento
- aprovação
- conferência
- separação

components/

pedido/

PedidoCard.jsx
PedidoActions.jsx
OperacaoPedidos.jsx

services/

api.js

pedidoService.js

App.jsx
```

---

# Organização dos Services

Todos os services devem seguir o mesmo padrão.

Exemplo:

```javascript
// ===============================
// CLIENTE
// ===============================

...

// ===============================
// BALCÃO
// ===============================

...

// ===============================
// PRODUÇÃO
// ===============================

...

// ===============================
// ENTREGA
// ===============================

...

// ===============================
// HISTÓRICO
// ===============================
```

Nunca deixar funções misturadas.

# Regra de comunicação


Componentes e páginas nunca devem chamar Axios diretamente.


Toda comunicação com backend deve passar pelos services.


Exemplo:


PedidoCard

↓

pedidoService.js

↓

api.js

↓

Backend

---

# Organização dos Components

Sempre que possível:

```
Page

↓

Componente

↓

Subcomponente
```

Exemplo

```
Entrega

↓

PedidoCard

↓

PedidoActions
```

---

# Organização dos Status


Fluxo principal:


RECEBIDO

↓

APROVADO

↓

EM_PRODUCAO

↓

FINALIZADO

↓

AGUARDANDO_SEPARACAO

↓

SEPARADO

↓

SAIU_ENTREGA

↓

ENTREGUE


Fluxos alternativos:


PENDENTE

CANCELADO

# Status do pedido x Status do item


O pedido possui um status geral.


Cada PedidoItem possui seu próprio status operacional.


Exemplo:


Pedido:

FINALIZADO


Itens:


Pizza Calabresa

FINALIZADO


X Salada

CANCELADO


O pedido somente avança quando todos os itens válidos concluírem sua etapa.

---

# Atualização automática

Todas as telas operacionais:

- atualização inicial
- atualização automática
- intervalo de 10 segundos

Futuramente:

WebSocket

---

# Padrões

## Backend

- Controller pequeno
- Service concentra regras
- Repository apenas consultas
- Mapper faz conversões
- DTO nunca contém regra de negócio

---

## Frontend

- Pages apenas organizam telas.
- Components exibem informações.
- Services fazem chamadas HTTP.
- API centraliza configuração do Axios.

---

# Convenções

## Arquivos

PascalCase

```
PedidoCard.jsx
```

---

## Funções

camelCase

```
carregarPedidos()
```

---

## Comentários

Sempre separar funções em blocos.

Exemplo

```javascript
// ================================
// ENTREGA
// ================================
```

---

# Objetivo futuro

O Delivery será apenas um módulo do ERP SIGIN.

Toda arquitetura deve ser reaproveitável para:

- Delivery
- Caixa
- Estoque
- Financeiro
- Compras
- Produção
- Administração
