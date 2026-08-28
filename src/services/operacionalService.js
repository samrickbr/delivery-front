import api from "./api";

function configOperacional() {
    const token = sessionStorage.getItem("operacionalToken");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

export async function loginOperacional(dados) {
    const response = await api.post("/operacional/login", dados);

    return response.data;
}

export async function buscarOperacionalAutenticado() {
    const response = await api.get("/operacional/me", configOperacional());

    return response.data;
}
