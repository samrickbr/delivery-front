import { useState } from "react";
import { CarrinhoContext } from "./CarrinhoContext";

export function CarrinhoProvider({ children }) {
    const [itens, setItens] = useState([]);

    function adicionarProduto(produto) {
        setItens((atual) => {
            const existente = atual.find((item) => item.id === produto.id);

            if (existente) {
                return atual.map((item) =>
                    item.id === produto.id
                        ? {
                              ...item,
                              quantidade: item.quantidade + 1
                          }
                        : item
                );
            }

            return [
                ...atual,
                {
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    quantidade: 1
                }
            ];
        });
    }

    function removerProduto(id) {
        setItens((atual) => atual.filter((item) => item.id !== id));
    }

    function limparCarrinho() {
        setItens([]);
    }

    const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

    return (
        <CarrinhoContext.Provider
            value={{
                itens,
                adicionarProduto,
                removerProduto,
                limparCarrinho,
                total
            }}
        >
            {children}
        </CarrinhoContext.Provider>
    );
}
