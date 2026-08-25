import api from "./api";

/* ==========================================================
   AUTENTICAÇÃO
========================================================== */

function configAutenticado() {
    const token = sessionStorage.getItem("clienteToken");

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
    return api.post("/pedidos", data, configAutenticado());
}

export async function buscarPedido(id) {
    return api.get(`/pedidos/${id}`, configAutenticado());
}

export async function listarMeusPedidos() {
    return api.get("/pedidos/meus", configAutenticado());
}

/* ==========================================================
   BALCÃO
========================================================== */

export async function listarBalcao() {
    return api.get("/pedidos/balcao", configAutenticado());
}

export async function aprovarPedido(id) {
    return api.put(`/pedidos/${id}/aprovar`, null, configAutenticado());
}

export async function cancelarPedido(id, setor, justificativa) {
    return api.put(`/pedidos/${id}/cancelar?setor=${setor}`, { justificativa }, configAutenticado());
}

export async function enviarCozinha(id) {
    return api.put(`/pedidos/${id}/producao`, null, configAutenticado());
}

export async function separarPedido(id) {
    return api.put(`/pedidos/${id}/separar`, null, configAutenticado());
}

export async function cancelarItens(id, setor, itens, justificativa) {
    return api.put(
        `/pedidos/${id}/cancelar-itens?setor=${setor}`,
        {
            itens,
            justificativa
        },
        configAutenticado()
    );
}

export async function cancelarPedidoCompleto(id, justificativa) {
    return api.put(`/pedidos/${id}/cancelar-completo`, { justificativa }, configAutenticado());
}

/* ==========================================================
   LIBERAR PARA ENTREGA
========================================================== */

export async function conferirPedido(id) {
    return api.put(`/pedidos/${id}/conferir`, null, configAutenticado());
}

export async function liberarEntrega(id, itens) {
    return api.put(`/pedidos/${id}/liberar-entrega`, { itens }, configAutenticado());
}

/* ==========================================================
   COZINHA / PRODUÇÃO
========================================================== */

export async function listarCozinha(setor) {
    return api.get(`/pedidos/cozinha?setor=${setor}`, configAutenticado());
}

export async function colocarPendente(id, setor, motivo) {
    return api.put(`/pedidos/${id}/pendente?setor=${setor}`, { motivo }, configAutenticado());
}

export async function iniciarProducao(id, setor) {
    return api.put(`/pedidos/${id}/producao?setor=${setor}`, null, configAutenticado());
}

export async function finalizarPedido(id, setor) {
    return api.put(`/pedidos/${id}/finalizar?setor=${setor}`, null, configAutenticado());
}

export async function listarFinalizados() {
    return api.get("/pedidos/finalizados", configAutenticado());
}

/* ==========================================================
   ENTREGA
========================================================== */

export async function listarEntregaOperacao() {
    return api.get("/pedidos/entrega-operacao", configAutenticado());
}

export async function sairEntrega(id) {
    return api.put(`/pedidos/${id}/sair-entrega`, null, configAutenticado());
}

export async function entregarPedido(id) {
    return api.put(`/pedidos/${id}/entregar`, null, configAutenticado());
}

export async function listarEntregues() {
    return api.get("/pedidos/entregues", configAutenticado());
}

/* ==========================================================
   GERAL
========================================================== */

export async function listarPedidos() {
    return api.get("/pedidos", configAutenticado());
}

export async function listarPorStatus(status) {
    return api.get(`/pedidos/status/${status}`, configAutenticado());
}

/* ==========================================================
   SEPARAÇÃO
========================================================== */

export async function listarSeparacao() {
    return api.get("/pedidos/entrega-operacao", configAutenticado());
}
