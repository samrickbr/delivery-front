# Telas SIGIN Delivery


# Visão geral

O frontend possui telas operacionais separadas por função dentro do fluxo do delivery.


Fluxo atual:


Balcão

↓

Produção

↓

Entrega

↓

Histórico


---

# Tela Balcão


Rota:
/balcao



## Objetivo

Tela responsável pelo recebimento e aprovação dos pedidos.


## Funcionalidades


### Listagem de pedidos

Exibe pedidos com status:


- RECEBIDO


Informações exibidas:

- cliente
- valor total
- itens


---

### Aprovar pedido

Ação:
APROVAR


Comportamento:

- envia aprovação para API
- altera status do pedido
- libera produção


Fluxo:
RECEBIDO → APROVADO


---

# Tela Produção Pizzaria


Rota atual:
/cozinha


Observação:

O nome da rota é histórico.

Atualmente representa o setor:
PIZZARIA


## Objetivo

Permitir operação dos produtos relacionados ao setor PIZZARIA.


## Funcionalidades


### Filtro por categoria

Permite visualizar:

- todos
- categorias específicas


Exemplo:

- Pizzas Doces


---

### Ações disponíveis


Pedido aprovado:

Produzir
Cancelar
Espera


Pedido em produção:

Finalizar
Espera


Pedido pendente:

Retomar
Cancelar


---

# Tela Produção Lanchonete


Rota:
/lanchonete


## Objetivo

Operação do setor:
COZINHA


Responsável por produtos:

- lanches
- demais produtos do setor cozinha


Funcionalidades:

- visualizar pedidos
- iniciar produção
- colocar pendente
- finalizar produção


---

# Tela Entrega


Rota:
/entrega



## Objetivo

Controlar pedidos após produção.


## Funcionalidades


Visualiza pedidos:


- FINALIZADO
- SAIU_ENTREGA


Ações:


Enviar entrega:


SAIU_ENTREGA



Confirmar entrega:


ENTREGUE



---

# Tela Histórico


Rota:


/entrega/historico



## Objetivo

Consulta de pedidos encerrados.


Exibe:


- FINALIZADO
- ENTREGUE
- CANCELADO


---

# Tela Pedido Teste


Rota:


/pedidoteste



## Objetivo

Tela auxiliar utilizada para testes do fluxo.


Funcionalidades:


- carregar produtos
- adicionar itens
- informar cliente
- criar pedido


Utilizada durante desenvolvimento para validar:


Balcão

↓

Produção

↓

Entrega


---

# Componentes utilizados


## PedidoCard

Responsável pela exibição visual do pedido.


Exibe:

- cliente
- status
- itens
- valores


---

## PedidoActions

Responsável pelas ações operacionais.


Exemplos:

- aprovar
- produzir
- finalizar
- cancelar
- colocar pendente


---

## Dialogs


Componentes:


ConfirmDialog

InputDialog


Utilizados para:


- confirmação de ações
- entrada de justificativas
- motivos operacionais


---

# Evoluções futuras


## Mobile operacional

Criar versão adaptada para celular:


Exemplos:

- operador cozinha
- pizzaiolo
- entrega


---

## Tempo real

Substituir atualização periódica por:


- WebSocket
- notificações instantâneas


---

## Usuários

Cada tela deverá respeitar:


- usuário
- setor
- permissão