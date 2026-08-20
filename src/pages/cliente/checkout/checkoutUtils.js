export const TIPOS_RECEBIMENTO = {
    RETIRADA: "RETIRADA",
    ENTREGA: "ENTREGA"
};

export const FORMAS_PAGAMENTO = [
    {
        id: 1,
        nome: "PIX"
    },
    {
        id: 2,
        nome: "Cartão"
    },
    {
        id: 3,
        nome: "Dinheiro"
    }
];

export function formatarValor(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}
