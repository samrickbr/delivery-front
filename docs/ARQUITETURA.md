# Arquitetura Frontend SIGIN Delivery


## Visão geral

O frontend do SIGIN Delivery é uma aplicação web responsável pela interface operacional do sistema.

Ele realiza comunicação com o backend através de API REST.


---

# Tecnologias utilizadas


- React
- Vite
- React Router
- Axios
- Bootstrap


---

# Estrutura atual


## Pages

Responsáveis pelas telas completas da aplicação.


Estrutura atual:


src/pages

- balcao
- cozinha
- lanchonete
- entrega
- pedido
- historico


---

## Components

Componentes reutilizáveis.


Exemplos:


- Layout
- PedidoCard
- PedidoActions
- ConfirmDialog
- InputDialog


---

## Services

Responsável pela comunicação com backend.


Estrutura:


src/services


Exemplo:

api.js


Responsável por:

- configuração Axios
- URL base
- chamadas HTTP


---

# Rotas atuais


## /balcao

Tela operacional do balcão.


Responsável por:

- visualizar pedidos recebidos
- aprovar pedidos


---

## /cozinha

Tela de produção.


Observação:

A rota possui nome histórico, porém atualmente representa a operação PIZZARIA.


Responsável por:

- visualizar pedidos do setor
- iniciar produção
- colocar pendente
- finalizar produção


---

## /lanchonete

Tela de produção do setor COZINHA.


Responsável por:

- visualizar pedidos do setor
- acompanhar produção


---

## /entrega

Tela de entrega.


Responsável por:

- visualizar pedidos liberados
- enviar para entrega
- confirmar entrega


---

## /entrega/historico

Histórico operacional.


Responsável por:

- consultar pedidos encerrados


---

# Fluxo frontend


Balcão

↓

Aprovação

↓

Produção por setor

↓

Entrega

↓

Histórico


---

# Atualização dos dados


As telas operacionais utilizam atualização automática periódica.


Comportamento atual:

- busca inicial ao abrir tela
- atualização automática a cada 10 segundos


---

# Estado da aplicação


Atualmente o controle de estado é realizado dentro dos componentes através de:

- useState
- useEffect


Não existe ainda:

- Redux
- Context API
- gerenciamento global de estado


---

# Evoluções futuras


- autenticação de usuários
- telas responsivas para celular
- notificações em tempo real
- WebSocket
- PWA
- modo operador por setor