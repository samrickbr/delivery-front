export function obterNumeroPedido(pedido) {
    const numero = pedido?.numero ?? pedido?.numeroPedido ?? pedido?.numeroComercial ?? pedido?.numeroPedidoComercial;

    return String(numero ?? "").trim() || "-";
}
