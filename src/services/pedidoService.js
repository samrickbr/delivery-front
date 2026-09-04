import api from "./api";

/* ==========================================================
   AUTENTICAÇÃO
========================================================== */

function configCliente() {
    const token = sessionStorage.getItem("clienteToken");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

function configOperacional() {
    const token = sessionStorage.getItem("operacionalToken");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

/* ==========================================================
   CLIENTE
========================================================== */

export async function criarPedido(data) {
    return api.post("/pedidos", data, configCliente());
}

export async function criarPedidoOperacional(data) {
    return api.post("/pedidos", data, configOperacional());
}

export async function buscarPedido(id) {
    return api.get(`/pedidos/${id}`, configOperacional());
}

export async function buscarPedidoCliente(id) {
    return api.get(`/pedidos/${id}`, configCliente());
}

export async function listarMeusPedidos() {
    return api.get("/pedidos/meus", configCliente());
}

/* ==========================================================
   BALCÃO
========================================================== */

export async function listarBalcao() {
    return api.get("/pedidos/balcao", configOperacional());
}

export async function adicionarItemPedido(pedidoId, produtoId, quantidade) {
    return api.post(
        `/pedidos/${pedidoId}/itens`,
        {
            produtoId,
            quantidade
        },
        configOperacional()
    );
}

export async function alterarQuantidadeItemPedido(pedidoId, itemId, quantidade) {
    return api.put(
        `/pedidos/${pedidoId}/itens/${itemId}/quantidade`,
        {
            quantidade
        },
        configOperacional()
    );
}

export async function removerItemPedido(pedidoId, itemId) {
    return api.delete(`/pedidos/${pedidoId}/itens/${itemId}`, configOperacional());
}

export async function aprovarPedido(id) {
    return api.put(`/pedidos/${id}/aprovar`, null, configOperacional());
}

export async function cancelarPedido(id, setor, justificativa) {
    return api.put(`/pedidos/${id}/cancelar/${setor}`, { justificativa }, configOperacional());
}

export async function enviarCozinha(id, setor) {
    return api.put(`/pedidos/${id}/iniciar-producao/${setor}`, null, configOperacional());
}

export async function separarPedido(id) {
    return api.put(`/pedidos/${id}/separar`, null, configOperacional());
}

export async function cancelarItens(id, setor, itens, justificativa) {
    return api.put(
        `/pedidos/${id}/cancelar-itens/${setor}`,
        {
            itens,
            justificativa
        },
        configOperacional()
    );
}

export async function cancelarPedidoCompleto(id, justificativa) {
    return api.put(`/pedidos/${id}/cancelar-completo`, { justificativa }, configOperacional());
}

/* ==========================================================
   LIBERAR PARA ENTREGA / RETIRADA
========================================================== */

export async function conferirPedido(id) {
    return api.put(`/pedidos/${id}/conferir`, null, configOperacional());
}

export async function liberarEntrega(id, itens) {
    return api.put(`/pedidos/${id}/liberar-entrega`, { itens }, configOperacional());
}

/* ==========================================================
   COZINHA / PRODUÇÃO
========================================================== */

export async function listarCozinha(setor) {
    return api.get(`/pedidos/cozinha?setor=${setor}`, configOperacional());
}

export async function colocarPendente(id, setor, motivo) {
    return api.put(`/pedidos/${id}/pendente/${setor}`, { motivo }, configOperacional());
}

export async function iniciarProducao(id, setor) {
    return api.put(`/pedidos/${id}/iniciar-producao/${setor}`, null, configOperacional());
}

export async function finalizarPedido(id, setor) {
    return api.put(`/pedidos/${id}/finalizar/${setor}`, null, configOperacional());
}

export async function listarFinalizados() {
    return api.get("/pedidos/finalizados", configOperacional());
}

/* ==========================================================
   ENTREGA
========================================================== */

export async function listarEntrega() {
    return api.get("/pedidos/entrega", configOperacional());
}

export async function listarEntregaOperacao() {
    return api.get("/pedidos/operacao/entrega", configOperacional());
}

export async function sairEntrega(id) {
    return api.put(`/pedidos/${id}/sair-entrega`, null, configOperacional());
}

export async function entregarPedido(id) {
    return api.put(`/pedidos/${id}/entregar`, null, configOperacional());
}

export async function listarEntregues() {
    return api.get("/pedidos/entregues", configOperacional());
}

/* ==========================================================
   RETIRADA
========================================================== */

export async function listarRetirada() {
    return api.get("/pedidos/retirada", configOperacional());
}

/* ==========================================================
   GERAL
========================================================== */

export async function listarPedidos() {
    return api.get("/pedidos", configOperacional());
}

export async function listarPedidosAbertos() {
    return api.get("/pedidos/abertos", configOperacional());
}

export async function listarPorStatus(status) {
    return api.get(`/pedidos/status/${status}`, configOperacional());
}

/* ==========================================================
   SEPARAÇÃO
========================================================== */

export async function listarSeparacao() {
    return api.get("/pedidos/separacao", configOperacional());
}

/* ==========================================================
   FATURAMENTO
========================================================== */

export async function adicionarPagamentoPedido(pedidoId, pagamento) {
    return api.post(`/pedidos/${pedidoId}/pagamentos`, pagamento, configOperacional());
}

export async function faturarPedido(pedidoId) {
    return api.post(`/pedidos/${pedidoId}/faturar`, null, configOperacional());
}
