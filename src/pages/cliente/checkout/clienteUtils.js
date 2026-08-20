export function obterCliente() {
    try {
        return JSON.parse(sessionStorage.getItem("cliente")) || {};
    } catch {
        return {};
    }
}
