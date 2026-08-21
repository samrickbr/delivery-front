import api from "./api";

function obterToken() {
    return sessionStorage.getItem("clienteToken");
}

function configAutenticado() {
    const token = obterToken();

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

export async function buscarClienteAutenticado() {
    const response = await api.get("/cliente/me", configAutenticado());

    return response.data;
}

export async function buscarEnderecosCliente() {
    const response = await api.get("/cliente/me/enderecos", configAutenticado());

    return response.data;
}
