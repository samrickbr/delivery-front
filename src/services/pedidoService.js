import api from "./api";

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