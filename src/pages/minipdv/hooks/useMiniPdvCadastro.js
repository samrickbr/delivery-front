import { useCallback, useState } from "react";

import { cadastrarEnderecoOperacional } from "../../../services/clienteService";

function useMiniPdvCadastro({ cliente, selecionarCliente, selecionarEndereco, carregarEnderecosCliente }) {
    const [cadastroClienteAberto, setCadastroClienteAberto] = useState(false);
    const [cadastroEnderecoAberto, setCadastroEnderecoAberto] = useState(false);

    const abrirCadastroCliente = useCallback(() => {
        setCadastroClienteAberto(true);
    }, []);

    const fecharCadastroCliente = useCallback(() => {
        setCadastroClienteAberto(false);
    }, []);

    const abrirCadastroEndereco = useCallback(() => {
        if (cliente?.id) {
            setCadastroEnderecoAberto(true);
        }
    }, [cliente]);

    const fecharCadastroEndereco = useCallback(() => {
        setCadastroEnderecoAberto(false);
    }, []);

    const salvarCliente = useCallback(
        async (novoCliente) => {
            selecionarCliente(novoCliente);
        },
        [selecionarCliente]
    );

    const salvarEndereco = useCallback(
        async (dados) => {
            if (!cliente?.id) {
                throw new Error("Selecione um cliente antes de cadastrar o endereço.");
            }

            return cadastrarEnderecoOperacional(cliente.id, dados);
        },
        [cliente]
    );

    const selecionarEnderecoCadastrado = useCallback(
        async (novoEndereco) => {
            await carregarEnderecosCliente(cliente.id);
            selecionarEndereco(novoEndereco);
        },
        [cliente, carregarEnderecosCliente, selecionarEndereco]
    );

    return {
        cadastroClienteAberto,
        cadastroEnderecoAberto,
        abrirCadastroCliente,
        fecharCadastroCliente,
        abrirCadastroEndereco,
        fecharCadastroEndereco,
        salvarCliente,
        salvarEndereco,
        selecionarEnderecoCadastrado
    };
}

export default useMiniPdvCadastro;
