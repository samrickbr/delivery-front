import { useMemo, useState } from "react";
import { buscarEnderecosOperacional } from "../../../services/clienteService";

function useMiniPdv() {
    const [cliente, setCliente] = useState(null);
    const [endereco, setEndereco] = useState(null);
    const [enderecos, setEnderecos] = useState([]);

    const [pedidoId, setPedidoId] = useState(null);

    const [tipoRecebimento, setTipoRecebimento] = useState("RETIRADA");

    const [carregando, setCarregando] = useState(false);

    const [carregandoEnderecos, setCarregandoEnderecos] = useState(false);

    const [erro, setErro] = useState("");
    const [erroEnderecos, setErroEnderecos] = useState("");

    async function carregarEnderecosCliente(clienteId) {
        try {
            setCarregandoEnderecos(true);
            setErroEnderecos("");

            const dados = await buscarEnderecosOperacional(clienteId);

            setEnderecos(Array.isArray(dados) ? dados : dados?.content || []);
        } catch (error) {
            console.error("Erro ao carregar endereços do cliente.", error);

            setEnderecos([]);

            setErroEnderecos("Não foi possível carregar os endereços do cliente.");
        } finally {
            setCarregandoEnderecos(false);
        }
    }

    function selecionarCliente(novoCliente) {
        setCliente(novoCliente);
        setEndereco(null);
        setEnderecos([]);
        setErroEnderecos("");

        setTipoRecebimento("RETIRADA");
    }

    async function definirEntrega() {
        setTipoRecebimento("ENTREGA");

        if (!cliente?.id) {
            setEnderecos([]);
            setEndereco(null);
            return;
        }

        await carregarEnderecosCliente(cliente.id);
    }

    function definirRetirada() {
        setTipoRecebimento("RETIRADA");
        setEndereco(null);
    }

    function selecionarEndereco(novoEndereco) {
        setEndereco(novoEndereco);
    }

    async function carregarPedido(pedido, clienteRecuperado = null) {
        if (!pedido) {
            setPedidoId(null);
            return;
        }

        const clienteDoPedido =
            clienteRecuperado ||
            (pedido.clienteId
                ? {
                      id: pedido.clienteId,
                      nome: pedido.clienteNome || pedido.cliente || "Cliente",
                      telefone: pedido.clienteWhatsapp || pedido.telefone || ""
                  }
                : null);
        const tipoPedido = pedido.tipoRecebimento || "RETIRADA";

        setPedidoId(pedido.id ?? null);
        setCliente(clienteDoPedido);
        setEndereco(pedido.endereco ?? null);
        setEnderecos([]);
        setTipoRecebimento(tipoPedido);
        setErro("");
        setErroEnderecos("");

        if (tipoPedido === "ENTREGA" && clienteDoPedido?.id) {
            await carregarEnderecosCliente(clienteDoPedido.id);
        }
    }

    function limparVenda() {
        setPedidoId(null);
        setCliente(null);
        setEndereco(null);
        setEnderecos([]);

        setTipoRecebimento("RETIRADA");

        setErro("");
        setErroEnderecos("");

        setCarregando(false);
        setCarregandoEnderecos(false);
    }

    const podeFinalizar = useMemo(() => {
        if (tipoRecebimento === "ENTREGA" && !endereco) {
            return false;
        }

        return true;
    }, [tipoRecebimento, endereco]);

    return {
        pedidoId,

        cliente,
        endereco,
        enderecos,

        tipoRecebimento,

        carregando,
        carregandoEnderecos,

        erro,
        erroEnderecos,

        podeFinalizar,

        selecionarCliente,
        selecionarEndereco,

        definirEntrega,
        definirRetirada,

        carregarPedido,
        limparVenda,

        setCarregando,
        setErro
    };
}

export default useMiniPdv;
