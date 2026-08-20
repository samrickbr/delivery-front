import { useMemo, useState } from "react";

function obterCarrinho() {
    try {
        return JSON.parse(sessionStorage.getItem("carrinho")) || [];
    } catch {
        return [];
    }
}

export function useCheckoutCarrinho() {
    const [carrinho, setCarrinho] = useState(obterCarrinho);

    const valorProdutos = useMemo(() => {
        return carrinho.reduce((total, item) => {
            return total + Number(item.preco || 0) * Number(item.quantidade || 0);
        }, 0);
    }, [carrinho]);

    return {
        carrinho,
        setCarrinho,
        valorProdutos
    };
}
