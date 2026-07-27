# Fluxo Operacional SIGIN Delivery

# Objetivo

Este documento define o fluxo operacional oficial do SIGIN Delivery.

Qualquer alteração no sistema deve respeitar este fluxo.

---

# Participantes

## Cliente

Responsável por montar e enviar o pedido.

---

## Balcão

Responsável por:

- conferir o pedido
- aprovar
- cancelar
- separar todos os itens
- liberar para entrega

Também é responsável pelos itens que não passam pela cozinha:

- bebidas
- doces
- chocolates
- acessórios
- guardanapos
- molhos
- copos
- canudos

---

## Cozinha

Responsável por:

- lanches
- porções
- pratos

---

## Pizzaria

Responsável por:

- pizzas

---

## Motoboy

Responsável por:

- retirar pedidos liberados
- informar saída
- confirmar entrega

---

# Fluxo Oficial

## 1 Recebimento

Cliente envia pedido.

Status

RECEBIDO

Tela

Balcão

---

## 2 Conferência

Balcão verifica:

- itens
- pagamento
- observações
- disponibilidade

Pode:

✔ Aprovar

ou

✖ Cancelar

Status

APROVADO

---

## 3 Produção

Após aprovado, os setores visualizam apenas seus próprios itens.

Exemplo

Pedido

- Pizza
- X Salada
- Coca
- Chocolate

Pizzaria recebe

- Pizza

Cozinha recebe

- X Salada

Balcão mantém

- Coca
- Chocolate

---

## 4 Produção iniciada

Quando o setor começar a produzir:

Status

EM_PRODUCAO

---

## 5 Pendência

Caso exista algum problema:

Status

PENDENTE

Obrigatório informar motivo.

Depois pode retornar para

EM_PRODUCAO

---

## 6 Finalização

Ao concluir todos os itens daquele setor:

Status

FINALIZADO

O pedido retorna automaticamente ao Balcão.

---

# 7 Separação

O Balcão monta o pedido completo.

Nesta etapa será utilizado um checklist.

Exemplo

☐ Pizza

☐ X Salada

☐ Coca

☐ Chocolate

☐ Guardanapos

☐ Molhos

☐ Copos

☐ Canudos

Todos os itens devem estar marcados.

Somente então o sistema permite liberar o pedido.

Status

SEPARADO

---

# 8 Liberação

Pedido aparece para o Motoboy.

O Motoboy retira o pedido.

Ao clicar

"Sair para entrega"

Status

SAIU_ENTREGA

---

# 9 Entrega

Ao entregar ao cliente

Status

ENTREGUE

Pedido deixa o fluxo operacional.

---

# Cancelamento

Pode ocorrer em qualquer etapa permitida.

Status

CANCELADO

Sempre exige justificativa.

---

# Fluxo dos Status

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

Fluxo alternativo

EM_PRODUCAO

↓

PENDENTE

↓

EM_PRODUCAO

Cancelamento

↓

CANCELADO

---

# Regras

- Cada setor visualiza apenas seus próprios itens.
- O Balcão visualiza o pedido completo.
- O Balcão é responsável pela montagem final.
- O Motoboy nunca altera pedidos.
- Nenhum pedido pode ir para entrega sem checklist completo.
- O checklist será obrigatório na etapa de Separação.
- Toda alteração de status deve registrar data e hora.
