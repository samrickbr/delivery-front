import api from "./api";

function configOperacional() {
    const token = sessionStorage.getItem("operacionalToken");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

export async function listarFormasPagamento() {
    const response = await api.get("/formas-pagamento");

    return response.data;
}

export async function listarFormasPagamentoOperacional() {
    const response = await api.get("/formas-pagamento", configOperacional());

    return response.data;
}
