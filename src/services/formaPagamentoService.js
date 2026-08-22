import api from "./api";

export async function listarFormasPagamento() {
    const response = await api.get("/formas-pagamento");

    return response.data;
}
