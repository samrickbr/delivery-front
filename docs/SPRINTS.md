# Sprint 04

## Objetivo

Concluir o fluxo operacional completo do Delivery.

---

# Entregas da Sprint

## Backend

### Pedido

- Organização dos endpoints.
- Correção dos retornos de operação.
- Criação dos DTOs operacionais.
- Inclusão dos itens nas respostas.
- Inclusão do cliente nas respostas.
- Inclusão das observações.
- Inclusão do valor total.

---

### Novos Status

Implementado:

```
SEPARADO
```

Fluxo atualizado:

```
RECEBIDO

↓

APROVADO

↓

EM_PRODUCAO

↓

FINALIZADO

↓

SEPARADO

↓

SAIU_ENTREGA

↓

ENTREGUE
```

---

### Endpoints

Implementados ou ajustados

```
POST

/pedidos
```

```
GET

/pedidos

/pedidos/status/{status}

/pedidos/balcao

/pedidos/cozinha

/pedidos/cozinha-operacao

/pedidos/finalizados

/pedidos/entrega-operacao

/pedidos/entregues
```

```
PUT

/aprovar

/producao

/pendente

/finalizar

/cancelar

/liberar-entrega

/sair-entrega

/entregar
```

---

# Frontend

## PedidoCard

Padronizado.

Agora todas as telas utilizam o mesmo componente.

Exibe:

- Cliente
- Número
- Valor
- Itens
- Categoria
- Setor
- Observações
- Status

---

## Balcão

Separado em três etapas

```
Pedidos

Produção

Separação
```

---

## Produção

Fluxo completo

- iniciar produção
- pendência
- finalizar

---

## Entrega

Separada em duas abas

```
Separação

↓

Em entrega
```

---

## Histórico

Consulta de pedidos encerrados.

---

# Melhorias

- Organização do pedidoService.
- Comentários padronizados.
- Atualização automática.
- Componentização das ações.
- Correções de importação.
- Correção de endpoints.
- Correção dos DTOs.

---

# Pendências para Sprint 05

## Checklist de Separação

Itens deverão possuir confirmação individual.

Exemplo

```
☐ Pizza

☐ Lanche

☐ Coca

☐ Chocolate

☐ Molho

☐ Guardanapo

☐ Copo
```

Somente após todos marcados:

```
Liberar entrega
```

---

## Impressão

- Impressão de produção.
- Impressão de entrega.

---

## WebSocket

Substituir atualização de 10 segundos.

---

## Painel TV

Tela somente leitura.

---

## Controle por Item

Cada item poderá possuir status próprio.

Exemplo

```
Pizza

EM_PRODUCAO

Lanche

FINALIZADO
```

---

# Resultado

Sprint 04 concluiu o primeiro fluxo operacional completo do SIGIN Delivery.

A partir desta Sprint o sistema já é capaz de operar um delivery do recebimento do pedido até a confirmação da entrega.
