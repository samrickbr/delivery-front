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

### 2 Aprovação

Balcão verifica:

- itens
- pagamento
- observações
- disponibilidade


Pode:
✔ Aprovar
ou
✖ Cancelar

Alteração:
RECEBIDO
↓
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

Balcão mantém itens sem produção operacional.

Exemplos futuros:

- bebidas
- doces
- acessórios

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

### 6 Finalização

Cada setor finaliza seus próprios itens.

Quando todos os itens válidos estiverem:

- FINALIZADO
- CANCELADO

o pedido recebe:

FINALIZADO

e retorna para o Balcão.

---

# 7 Conferência


Após todos os setores finalizarem a produção:


FINALIZADO

↓

CONFERÊNCIA


Responsável:

Balcão


Valida:

- itens produzidos
- itens cancelados
- composição final do pedido


Resultado:


AGUARDANDO_SEPARACAO

---

# 8 Separação

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

# 9 Liberação

Pedido aparece para o Motoboy.

O Motoboy retira o pedido.

Ao clicar

"Sair para entrega"

Status

SAIU_ENTREGA

---

# 10 Entrega

Ao entregar ao cliente

Status

ENTREGUE

Pedido deixa o fluxo operacional.

---

# Cancelamento

Pode ocorrer em qualquer etapa permitida.

Status

# Cancelamento de itens

Itens podem ser cancelados individualmente:

- APROVADO
- PENDENTE
- EM_PRODUCAO
- FINALIZADO

↓

CANCELADO

O pedido continua ativo enquanto existirem itens válidos.

O pedido somente recebe:

CANCELADO

quando todos os itens estiverem cancelados.
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

AGUARDANDO_SEPARACAO

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

---

## Identificação do Cliente no Checkout

Fluxo público atual:

Cardápio
→ Carrinho
→ Identificação
→ Checkout
→ Pedido

Na etapa de Identificação existem dois caminhos:

### Novo cliente

- Nome completo
- CPF
- Telefone / WhatsApp
- E-mail
- Senha
- Confirmação da senha

O Front envia:

POST /cliente/cadastro

Após o cadastro bem-sucedido, os dados do cliente são armazenados na sessão e o usuário segue para o Checkout.

### Cliente existente

O cliente informa:

- CPF
- Senha

O Front envia:

POST /cliente/login

Após autenticação:

- token do cliente é armazenado em `sessionStorage`
- identificação do cliente é armazenada em `sessionStorage`
- usuário segue para o Checkout

## Checkout Delivery

Fluxo atual:

CARDÁPIO
↓
CARRINHO
↓
IDENTIFICAÇÃO
↓
CLIENTE AUTENTICADO
↓
ENDEREÇO
↓
TIPO DE RECEBIMENTO
↓
TAXA
↓
PAGAMENTO
↓
CHECKOUT PREPARADO
↓
AGUARDA INTEGRAÇÃO DEFINITIVA DO PEDIDO

### Identificação

O login do cliente utiliza:

POST /cliente/login

A resposta fornece:

- clienteId;
- tipo;
- token.

O Delivery Front mantém a sessão do cliente em sessionStorage.

A senha nunca é armazenada.

### Tipo de recebimento

O Checkout trabalha com:

- RETIRADA;
- ENTREGA.

RETIRADA:

- endereço não obrigatório;
- taxa de entrega igual a zero.

ENTREGA:

- endereço obrigatório;
- endereço representado por enderecoId;
- taxa fornecida pelo Backend.

### Valores

O Front não é autoridade para taxa de entrega.

O contrato definitivo utiliza:

- valorProdutos;
- taxaEntrega;
- valorTotal.

### Pagamentos

O domínio utiliza múltiplos pagamentos:

```json
{
  "pagamentos": [
    {
      "formaPagamentoId": 1,
      "valor": 50
    }
  ]
}
O Front valida a soma dos pagamentos para fins de UX.

A validação definitiva pertence ao Backend/Core.

Pedido

O Delivery Front NÃO envia o pedido definitivo nesta etapa.

A integração:

Delivery Front
↓
Delivery Back
↓
Core
↓
POST /pedidos

será concluída posteriormente, após o Delivery Back implementar a integração definitiva com o Core.

Fora desta etapa

Não implementar:

POST final do pedido;
troco;
gateway de pagamento;
chamada direta ao Core.