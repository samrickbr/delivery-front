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

src/components/PedidoActions
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

As páginas seguem o padrão:

Page

↓

Componentes

↓

Services

↓

API

Exemplo:

Cozinha.jsx

↓

PedidoCard

↓

PedidoActions

↓

pedidoService

↓

Backend

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

Estado global

Atual:

useState
useEffect

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