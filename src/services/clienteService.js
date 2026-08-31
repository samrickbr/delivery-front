import api from "./api";

function obterToken() {
    return sessionStorage.getItem("clienteToken");
}

function configOperacional() {
    const token = sessionStorage.getItem("operacionalToken");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
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

export async function criarEnderecoCliente(dados) {
    const response = await api.post("/cliente/me/enderecos", dados, configAutenticado());

    return response.data;
}

export async function buscarEnderecoCliente(enderecoId) {
    const response = await api.get(`/cliente/me/enderecos/${enderecoId}`, configAutenticado());

    return response.data;
}

export async function atualizarEnderecoCliente(enderecoId, dados) {
    const response = await api.put(`/cliente/me/enderecos/${enderecoId}`, dados, configAutenticado());

    return response.data;
}

export async function excluirEnderecoCliente(enderecoId) {
    await api.delete(`/cliente/me/enderecos/${enderecoId}`, configAutenticado());
}

export async function definirEnderecoPrincipalCliente(enderecoId) {
    const response = await api.put(`/cliente/me/enderecos/${enderecoId}/principal`, null, configAutenticado());

    return response.data;
}

export async function buscarClientesOperacional(busca = "") {
    const response = await api.get("/cliente", {
        ...configOperacional(),
        params: { busca }
    });

    return response.data;
}

export async function buscarEnderecosOperacional(clienteId) {
    const response = await api.get(`/cliente/${clienteId}/enderecos`, configOperacional());

    return response.data;
}

export async function cadastrarClienteOperacional(dados) {
    const response = await api.post("/cliente/operacional", dados, configOperacional());

    return response.data;
}

export async function cadastrarEnderecoOperacional(clienteId, dados) {
    const response = await api.post(`/cliente/${clienteId}/enderecos`, dados, configOperacional());

    return response.data;
}
