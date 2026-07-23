import api from "./api";

export async function iniciarProducao(id) {
    return api.put(`/pedidos/${id}/producao`);
}

export async function finalizar(id) {
    return api.put(`/pedidos/${id}/finalizar`);
}

export async function colocarPendente(id, motivo) {
    return api.put(`/pedidos/${id}/pendente`, {
        motivo
    });
}

export async function cancelar(id) {
    return api.put(`/pedidos/${id}/cancelar`);
}
