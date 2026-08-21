export function obterCarrinho() {
    try {
        return JSON.parse(sessionStorage.getItem("carrinho")) || [];
    } catch {
        return [];
    }
}

export function obterQuantidadeCarrinho(carrinho) {
    return carrinho.reduce((total, item) => total + Number(item.quantidade || 0), 0);
}

export function formatarValor(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

export function obterCategoria(produto) {
    if (!produto?.categoria) {
        return null;
    }

    if (typeof produto.categoria === "string") {
        return produto.categoria;
    }

    return produto.categoria.nome || produto.categoria.nomeCategoria || null;
}

export function obterCategorias(produtos) {
    const categorias = produtos.map(obterCategoria).filter(Boolean);

    return ["TODOS", ...Array.from(new Set(categorias))];
}
