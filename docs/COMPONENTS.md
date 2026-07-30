# Componentes SIGIN Delivery


# Visão geral

Os componentes do frontend foram criados para reutilização entre as telas operacionais.

A arquitetura atual mantém regras de interface próximas aos componentes responsáveis.


---

# Layout


Local:
src/components/layout



## Responsabilidade

Componente responsável pela estrutura principal da aplicação.


Inclui:

- menu de navegação
- área principal das páginas
- estrutura visual comum


Utilizado por todas as rotas.


---

# PedidoCard


Local:


src/components/pedido/PedidoCard



## Responsabilidade

Componente responsável pela exibição visual de um pedido.


Apresenta:


- cliente
- status
- valor total
- itens do pedido
- informações operacionais


Recebe:

```javascript
pedido

Exemplo:

<PedidoCard pedido={pedido}>
    ...
</PedidoCard>
PedidoActions

Local:

src/components/pedido/PedidoActions
Responsabilidade

Centraliza as ações disponíveis para alteração de status do pedido.

Ações atuais:

Produção
iniciar produção

Status:

APROVADO → EM_PRODUCAO
Finalização
finalizar pedido

Status:

EM_PRODUCAO → FINALIZADO
Pendência
colocar pedido em espera

Status:

EM_PRODUCAO → PENDENTE

Obrigatório:

motivo
Cancelamento

Fluxo:

Usuário informa justificativa.

Envia para API:

PUT /pedidos/{id}/cancelar

Obrigatório:

motivo do cancelamento
ConfirmDialog

## Cancelamento


Possui dois fluxos:


Cancelamento de itens:

- cancela produtos específicos
- mantém pedido ativo enquanto existirem itens válidos


Cancelamento completo:

- cancela todo pedido
- altera status geral para CANCELADO

Local:

src/components/ConfirmDialog
Responsabilidade

Modal genérico de confirmação.

Utilizado para ações que necessitam confirmação do usuário.

Exemplos:

iniciar produção
finalizar pedido

Recebe:

título
mensagem
ação confirmar
ação cancelar
InputDialog

Local:

src/components/InputDialog
Responsabilidade

Modal genérico para entrada de texto.

Utilizado para ações que precisam de informação adicional.

Exemplos:

motivo pendência
observações

Recebe:

título
mensagem
placeholder
callback confirmação
Serviços

Local:

src/services
api.js

Responsável por configurar comunicação HTTP.

Responsabilidades:

URL base
cliente Axios
interceptações futuras
pedidoService

Responsável pelas chamadas relacionadas aos pedidos.

Exemplos:

iniciar produção
finalizar
colocar pendente
aprovar
Padrão atual

## PedidoHistorico


Local:

src/components/pedido/


Responsabilidade:

Exibir rastreamento operacional do pedido.


Apresenta:

- ação
- setor
- usuário
- data/hora
- descrição

As páginas seguem o padrão:

Page

↓

Componentes

↓

Services

↓

API

Exemplo:

Cozinha.jsx / Pizzaria.jsx

↓

PedidoCard

↓

PedidoActions

↓

pedidoService

↓

Backend

## Conferência

Responsável:

Balcão


Fluxo:

FINALIZADO → AGUARDANDO_SEPARACAO


Endpoint:

PUT /pedidos/{id}/conferir

## Separação

Responsável:

Balcão


Fluxo:

AGUARDANDO_SEPARACAO → SEPARADO


Endpoint:

PUT /pedidos/{id}/liberar-entrega

Pontos de evolução
Separar ações por domínio

Atual:

PedidoActions

centraliza todas as ações.

Futuro:

PedidoProducaoActions

PedidoEntregaActions

PedidoBalcaoActions

Motivo:

Cada setor possui responsabilidades diferentes.

## Estado da aplicação


Atual:

Estado local utilizando:

- useState
- useEffect


Utilizado para:

- pedidos carregados
- filtros de abas
- checklist de separação
- modais

Futuro:

Avaliar:

Context API
Zustand
Redux
Componentes mobile

Criar componentes adaptáveis:

PedidoCardMobile
PedidoActionMobile
TelaOperacaoMobile

Objetivo:

Permitir uso em celular/tablet.