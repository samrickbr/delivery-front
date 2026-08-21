import { useMemo, useState } from "react";
import { obterCarrinho, obterQuantidadeCarrinho } from "../cardapioUtils";

export function useCardapioCarrinho() {
    const [carrinho, setCarrinho] = useState(obterCarrinho);

    const quantidadeCarrinho = useMemo(() => obterQuantidadeCarrinho(carrinho), [carrinho]);

    function salvarCarrinho(novoCarrinho) {
        sessionStorage.setItem("carrinho", JSON.stringify(novoCarrinho));

        setCarrinho(novoCarrinho);

        window.dispatchEvent(new Event("carrinhoAtualizado"));
    }

    function adicionarProduto(produto) {
        const existente = carrinho.find((item) => item.id === produto.id);

        const novoCarrinho = existente
            ? carrinho.map((item) =>
                  item.id === produto.id
                      ? {
                            ...item,
                            quantidade: Number(item.quantidade || 0) + 1
                        }
                      : item
              )
            : [
                  ...carrinho,
                  {
                      ...produto,
                      quantidade: 1
                  }
              ];

        salvarCarrinho(novoCarrinho);
    }

    function diminuirProduto(produto) {
        const existente = carrinho.find((item) => item.id === produto.id);

        if (!existente) {
            return;
        }

        const quantidadeAtual = Number(existente.quantidade || 0);

        const novoCarrinho =
            quantidadeAtual <= 1
                ? carrinho.filter((item) => item.id !== produto.id)
                : carrinho.map((item) =>
                      item.id === produto.id
                          ? {
                                ...item,
                                quantidade: quantidadeAtual - 1
                            }
                          : item
                  );

        salvarCarrinho(novoCarrinho);
    }

    function obterQuantidadeProduto(produtoId) {
        const item = carrinho.find((produto) => produto.id === produtoId);

        return Number(item?.quantidade || 0);
    }

    return {
        carrinho,
        quantidadeCarrinho,
        adicionarProduto,
        diminuirProduto,
        obterQuantidadeProduto
    };
}
