import { useMemo, useState } from "react";

function obterCarrinhoInicial() {
    return [];
}

function useMiniPdvCarrinho() {
    const [carrinho, setCarrinho] = useState(obterCarrinhoInicial);

    const valorProdutos = useMemo(() => {
        return carrinho.reduce((total, item) => {
            return (
                total +
                Number(item.preco || 0) *
                    Number(item.quantidade || 0)
            );
        }, 0);
    }, [carrinho]);

    function adicionarProduto(produto) {
        setCarrinho((atual) => {
            const existente = atual.find(
                (item) => item.id === produto.id
            );

            if (existente) {
                return atual.map((item) =>
                    item.id === produto.id
                        ? {
                              ...item,
                              quantidade:
                                  Number(item.quantidade || 0) + 1,
                          }
                        : item
                );
            }

            return [
                ...atual,
                {
                    ...produto,
                    quantidade: 1,
                },
            ];
        });
    }

    function diminuirProduto(produto) {
        setCarrinho((atual) => {
            return atual
                .map((item) =>
                    item.id === produto.id
                        ? {
                              ...item,
                              quantidade:
                                  Number(item.quantidade || 0) - 1,
                          }
                        : item
                )
                .filter(
                    (item) =>
                        Number(item.quantidade || 0) > 0
                );
        });
    }

    function removerProduto(produtoId) {
        setCarrinho((atual) =>
            atual.filter((item) => item.id !== produtoId)
        );
    }

    function limparCarrinho() {
        setCarrinho([]);
    }

    return {
        carrinho,
        setCarrinho,
        valorProdutos,
        adicionarProduto,
        diminuirProduto,
        removerProduto,
        limparCarrinho,
    };
}

export default useMiniPdvCarrinho;
