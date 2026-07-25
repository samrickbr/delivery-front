import api from "./api";

// CLIENTE / PEDIDO

export async function criarPedido(data) {
    return api.post("/pedidos", data);
}

export async function buscarPedido(id) {
    return api.get(`/pedidos/${id}`);
}

export async function listarPedidos() {
    return api.get("/pedidos");
}

// BALCÃO

export async function listarBalcao() {
    return api.get("/delivery/balcao/pedidos");
}

export async function aceitarPedido(id) {
    return api.put(`/delivery/balcao/${id}/aceitar`);
}

export async function enviarCozinha(id) {
    return api.put(`/delivery/balcao/${id}/cozinha`);
}

export async function cancelarPedido(id) {
    return api.put(`/delivery/balcao/${id}/cancelar`);
}

export async function colocarPendente(id, motivo) {
    return api.put(`/delivery/balcao/${id}/pendente`, {
        motivo
    });
}

// COZINHA

export async function listarCozinha() {
    return api.get("/pedidos/cozinha");
}

export async function iniciarProducao(id) {
    return api.put(`/pedidos/${id}/producao`);
}

export async function finalizar(id) {
    return api.put(`/pedidos/${id}/finalizar`);
}

// ENTREGA

export async function listarEntrega() {
    return api.get("/pedidos/entrega");
}

export async function saiuParaEntrega(id) {
    return api.put(`/pedidos/${id}/saiu-entrega`);
}

// Lanchonete / Operação

export async function listarLanchonete() {
    return api.get("/pedidos/lanchonete");
}
