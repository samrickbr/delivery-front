# SIGIN Delivery

Sistema de gerenciamento de pedidos para Delivery desenvolvido em Spring Boot + React.

---

# Objetivo

Controlar todo o fluxo operacional de um delivery, desde o recebimento do pedido até sua entrega ao cliente.

O sistema foi desenvolvido de forma modular para futuramente integrar-se ao ERP SIGIN.

---

# Tecnologias

## Backend

- Java 21
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Lombok

---

## Frontend

- React
- Vite
- Bootstrap 5
- Axios

---

# Fluxo Operacional

Cliente

↓

Balcão

↓

Produção

↓

Separação

↓

Entrega

↓

Histórico

---

# Fluxo de Status

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

Fluxos alternativos

EM_PRODUCAO
↓
PENDENTE
↓
EM_PRODUCAO

Qualquer etapa
↓
CANCELADO

---

# Estrutura Frontend

/pages

cliente/
balcao/
cozinha/
pizzaria/
entrega/

components/

PedidoCard
PedidoActions
OperacaoPedidos

services/

api.js
pedidoService.js

---

# Estrutura Backend

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

entity/

Pedido
PedidoItem
PedidoHistorico
Produto
Categoria
Setor

---

# Operações

## Balcão

Receber pedidos

Aprovar pedido

Cancelar pedido

Conferir pedido

Separar pedidos

Liberar para entrega

---

## Produção

Iniciar produção

Colocar pendência

Retomar produção

Finalizar produção

---

## Entrega

Receber pedidos separados

Sair para entrega

Confirmar entrega

Consultar histórico

---

# Atualização automática

Todas as telas operacionais realizam atualização automática a cada 10 segundos.

Futuramente será substituído por WebSocket.

---

# Próximas funcionalidades

- Melhorias no checklist de separação
- Impressão automática
- Painel de cozinha
- Painel TV
- WebSocket
- Controle de retirada no balcão
- Dashboard operacional
- Relatórios
- Integração completa com ERP SIGIN

---

# Documentação

Documentações disponíveis:

- docs
- docs\ARQUITETURA.md
- docs\COMPONENTS.md
- docs\FLUXO_OPERACIONAL.md
- docs\SPRINTS.md
- docs\TELAS.md