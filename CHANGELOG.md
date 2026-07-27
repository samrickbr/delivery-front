# Changelog - SIGIN Delivery Frontend

## 22/07/2026

### Tela Cozinha

Implementado:

- Listagem de pedidos
- Cards de pedidos
- Ações por status
- Modal confirmação
- Modal entrada de motivo
- Controle de espera
- Aba pedidos finalizados

### Componentes

Criado:

- ConfirmDialog
- InputDialog
- PedidoActions

# Changelog Frontend SIGIN Delivery


## [0.1.0] - Sprint Delivery Inicial


# Adicionado


## Estrutura inicial React


Implementada aplicação frontend utilizando:


- React
- Vite
- React Router
- Axios
- Bootstrap


---

# Navegação


Criado layout principal com navegação entre módulos.


Rotas implementadas:


- /balcao
- /cozinha
- /lanchonete
- /entrega
- /entrega/historico
- /pedidoteste


---

# Telas operacionais


## Balcão


Implementado:


- visualização de pedidos recebidos
- aprovação de pedidos


---

## Produção


Implementado:


- tela operacional por setor
- atualização automática
- filtros por categoria
- ações de produção


Ações:


- iniciar produção
- colocar pendente
- retomar produção
- finalizar produção
- cancelar pedido


---

## Entrega


Implementado:


- visualização de pedidos liberados
- saída para entrega
- confirmação de entrega


---

## Histórico


Implementado:


- consulta de pedidos encerrados


---

# Componentização


Criados componentes reutilizáveis:


## PedidoCard


Responsável pela apresentação dos pedidos.


## PedidoActions


Responsável pelas ações operacionais.


## ConfirmDialog


Confirmação de ações.


## InputDialog


Entrada de informações adicionais.


---

# Integração API


Implementada comunicação com backend através de Axios.


Integrações:


- criação de pedido
- aprovação
- produção
- pendência
- cancelamento
- entrega


---

# Tela de testes


Criada tela auxiliar:

/pedidoteste



Objetivo:


Validar fluxo completo:


Pedido

↓

Balcão

↓

Produção

↓

Entrega


---

# Ajustes realizados


## Filtro por setor


Implementado direcionamento dos pedidos conforme setor operacional.


Exemplo:


PIZZARIA:

- pizzas


COZINHA:

- lanches


---

## Cancelamento


Adicionado fluxo:


- solicitar justificativa
- confirmar cancelamento
- enviar informação para backend


---

## Atualização automática


Telas operacionais passaram a atualizar pedidos automaticamente.


---

# Pontos conhecidos


## Nome da rota cozinha


Atual:


/cozinha



Representa atualmente:


PIZZARIA



Futuro:

Renomear ou criar rota específica.


---

## Status por item


Ainda não implementado no frontend.


---

## Responsividade mobile


Próxima evolução:


- telas adaptadas para celular
- operadores por setor
- uso em tablets


---

# Próximas evoluções


- acesso mobile
- autenticação
- permissões por setor
- WebSocket
- notificações em tempo real
- melhorias de UX operacional

# Changelog

## Sprint 4 — Fluxo Operacional Delivery

### Backend

- Criação do endpoint de Balcão
- Criação do endpoint de Separação
- Criação do endpoint de Entrega Operacional
- Novo status:
  - SEPARADO
- Liberação de pedidos para entrega
- Ajuste dos mapeamentos PedidoOperacaoResponse
- Inclusão dos itens do pedido nas respostas do balcão e entrega
- Correção dos fluxos de produção e entrega

---

### Frontend

## Balcão

Implementadas três etapas operacionais:

- 📥 Pedidos
- ⏳ Produção
- 📦 Separação

Fluxo:

RECEBIDO
↓
APROVADO
↓
EM_PRODUCAO
↓
FINALIZADO
↓
SEPARADO

---

## Cozinha

Implementado fluxo:

APROVADO
↓
EM_PRODUCAO

Permite:

- iniciar produção
- colocar pendência
- finalizar

---

## Entrega

Nova tela dividida em duas abas:

📦 Separação

- pedidos separados
- aguardando motoboy

🚚 Em entrega

- pedidos em rota
- confirmação de entrega

Fluxo:

SEPARADO
↓
SAIU_ENTREGA
↓
ENTREGUE

---

## PedidoCard

Padronização completa do componente.

Agora todas as telas utilizam:

- itens
- cliente
- observações
- valor
- status
- ações específicas

---

## Serviços

pedidoService organizado por blocos:

- Cliente
- Balcão
- Produção
- Entrega
- Histórico

Comentários adicionados.

---

## Melhorias

- Atualização automática das telas
- Componentização das ações
- Organização do fluxo operacional
- Base preparada para checklist de separação