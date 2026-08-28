import { useMemo, useState } from "react";
import { buscarEnderecosCliente } from "../../../services/clienteService";

function useMiniPdv() {
    const [cliente, setCliente] = useState(null);
    const [endereco, setEndereco] = useState(null);
    const [enderecos, setEnderecos] = useState([]);

    const [tipoRecebimento, setTipoRecebimento] =
        useState("RETIRADA");

    const [carregando, setCarregando] =
        useState(false);

    const [carregandoEnderecos, setCarregandoEnderecos] =
        useState(false);

    const [erro, setErro] = useState("");
    const [erroEnderecos, setErroEnderecos] =
        useState("");

    async function carregarEnderecosCliente() {
        try {
            setCarregandoEnderecos(true);
            setErroEnderecos("");

            const dados =
                await buscarEnderecosCliente();

            setEnderecos(
                Array.isArray(dados)
                    ? dados
                    : dados?.content || []
            );
        } catch (error) {
            console.error(
                "Erro ao carregar endereços do cliente.",
                error
            );

            setEnderecos([]);

            setErroEnderecos(
                "Não foi possível carregar os endereços do cliente."
            );
        } finally {
            setCarregandoEnderecos(false);
        }
    }

    function selecionarCliente(novoCliente) {
        setCliente(novoCliente);
        setEndereco(null);
        setEnderecos([]);
        setErroEnderecos("");

        // Toda nova seleção começa como retirada.
        setTipoRecebimento("RETIRADA");
    }

    async function definirEntrega() {
        setTipoRecebimento("ENTREGA");

        await carregarEnderecosCliente();
    }

    function definirRetirada() {
        setTipoRecebimento("RETIRADA");
        setEndereco(null);
    }

    function selecionarEndereco(novoEndereco) {
        setEndereco(novoEndereco);
    }

    function limparVenda() {
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
        if (
            tipoRecebimento === "ENTREGA" &&
            !endereco
        ) {
            return false;
        }

        return true;
    }, [
        tipoRecebimento,
        endereco
    ]);

    return {
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

        limparVenda,

        setCarregando,
        setErro
    };
}

export default useMiniPdv;
