# Fluxo Operacional Frontend SIGIN Delivery


# Visão geral

O frontend representa o fluxo operacional do delivery através de telas separadas por responsabilidade.


Fluxo principal:

Balcão
|
v
Produção
|
v
Entrega
|
v
Histórico



---

# 1. Recebimento do pedido


## Tela


/balcao



## Responsável

Operador do balcão.


## Processo


1. Visualiza novos pedidos.
2. Confere informações.
3. Aprova pedido.


Status inicial:



RECEBIDO



Após aprovação:



RECEBIDO → APROVADO



---

# 2. Separação por setor


Após aprovação, o pedido fica disponível para produção.


O frontend identifica o setor através dos itens:


Produto

↓

Categoria

↓

Setor


Exemplo:


Pedido:

- Pizza Calabresa
- X Salada


Direcionamento:


PIZZARIA:

- Pizza Calabresa


COZINHA:

- X Salada


---

# 3. Produção


## Tela Pizzaria

Rota atual:


/cozinha



Setor:


PIZZARIA



Operações:


### Iniciar produção



APROVADO → EM_PRODUCAO



### Colocar em espera



EM_PRODUCAO → PENDENTE



Necessário informar:

- motivo


### Retomar produção



PENDENTE → EM_PRODUCAO



### Finalizar



EM_PRODUCAO → FINALIZADO



---

# Tela Lanchonete


Rota:


/lanchonete



Setor:


COZINHA



Possui o mesmo fluxo operacional da produção.


---

# 4. Liberação para entrega


## Tela


/entrega



Após produção:


Status:


FINALIZADO



Operador realiza:


Enviar para entrega:



FINALIZADO → SAIU_ENTREGA



---

# 5. Confirmação de entrega


Após o entregador retornar:


Ação:



SAIU_ENTREGA → ENTREGUE



Pedido deixa fluxo operacional.


---

# 6. Histórico


## Tela


/entrega/historico



Objetivo:


Consulta de pedidos encerrados.


Status exibidos:


- FINALIZADO
- ENTREGUE
- CANCELADO


---

# 7. Cancelamento


Cancelamento pode ocorrer durante produção.


Fluxo:


Operador seleciona:



Cancelar



Sistema solicita:



Justificativa



Após confirmação:


Qualquer etapa permitida:



→ CANCELADO



---

# Atualização automática


As telas operacionais realizam atualização periódica.


Comportamento atual:


- carregamento inicial
- atualização automática a cada 10 segundos


Objetivo:

Manter operadores sincronizados.


---

# Pontos de evolução


## Tempo real

Substituir polling:


Atual:


setInterval()



Futuro:


WebSocket



---

## Operação mobile


Possibilitar:


- operador de cozinha usando celular
- pizzaiolo recebendo pedidos
- entregador atualizando status


---

## Fluxo com status por item


Evolução futura:


Atual:


Pedido
|
Status único



Futuro:


Pedido

├── Pizza
│ EM_PRODUCAO

└── Lanche
FINALIZADO



Objetivo:

Cada setor operar independente.