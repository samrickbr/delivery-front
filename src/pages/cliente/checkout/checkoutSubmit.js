import { criarPedido } from "../../../services/pedidoService";

export async function enviarPedido(pedido) {
    const response = await criarPedido(pedido);

    return response.data;
}
