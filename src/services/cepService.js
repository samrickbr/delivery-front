import axios from "axios";

export async function buscarCep(cep) {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
        throw new Error("CEP deve conter 8 dígitos.");
    }

    const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (response.data.erro) {
        throw new Error("CEP não encontrado.");
    }

    return response.data;
}
