import api from "./api";

/* ==========================================================
   CLIENTE
========================================================== */

export async function criarPedido(data) {
    return api.post("/pedidos", data);
}

export async function buscarPedido(id) {
    return api.get(`/pedidos/${id}`);
}

/* ==========================================================
   BALCÃO
========================================================== */

export async function listarBalcao() {
    return api.get("/pedidos/balcao");
}

export async function aprovarPedido(id) {
    return api.put(`/pedidos/${id}/aprovar`);
}

export async function cancelarPedido(id, justificativa) {
    return api.put(`/pedidos/${id}/cancelar`, {
        justificativa
    });
}

export async function enviarCozinha(id) {
    return api.put(`/pedidos/${id}/producao`);
}

export async function separarPedido(id) {
    return api.put(`/pedidos/${id}/separar`);
}

// =====================================
// LIBERAR PARA ENTREGA
//
// Após separação do balcão
// FINALIZADO -> LIBERADO_ENTREGA
// =====================================

export async function liberarEntrega(id) {
    return api.put(`/pedidos/${id}/liberar-entrega`);
}

/* ==========================================================
   COZINHA / PRODUÇÃO
========================================================== */

export async function listarCozinha(setor) {
    return api.get(`/pedidos/cozinha?setor=${setor}`);
}

export async function colocarPendente(id, motivo) {
    return api.put(`/pedidos/${id}/pendente`, {
        motivo
    });
}

export async function iniciarProducao(id) {
    return api.put(`/pedidos/${id}/producao`);
}

export async function finalizarPedido(id) {
    return api.put(`/pedidos/${id}/finalizar`);
}

export async function listarFinalizados() {
    return api.get("/pedidos/finalizados");
}

/* ==========================================================
   ENTREGA
========================================================== */

export async function listarEntregaOperacao() {
    return api.get("/pedidos/entrega-operacao");
}

export async function sairEntrega(id) {
    return api.put(`/pedidos/${id}/sair-entrega`);
}

export async function entregarPedido(id) {
    return api.put(`/pedidos/${id}/entregar`);
}

export async function listarEntregues() {
    return api.get("/pedidos/entregues");
}

/* ==========================================================
   GERAL
========================================================== */

export async function listarPedidos() {
    return api.get("/pedidos");
}

// =====================================
// BUSCAR PEDIDOS POR STATUS
// =====================================

export async function listarPorStatus(status) {
    return api.get(`/pedidos/status/${status}`);
}

// =======================================
// SEPARAÇÃO
// =======================================

export async function listarSeparacao() {
    return api.get("/pedidos/entrega-operacao");
}