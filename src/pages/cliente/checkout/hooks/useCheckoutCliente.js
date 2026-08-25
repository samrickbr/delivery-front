import { useCallback, useEffect, useState } from "react";

import { buscarClienteAutenticado, buscarEnderecosCliente } from "../../../../services/clienteService";

export function useCheckoutCliente() {
    const [cliente, setCliente] = useState(null);
    const [enderecos, setEnderecos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const recarregar = useCallback(async () => {
        const token = sessionStorage.getItem("clienteToken");
        const clienteId = sessionStorage.getItem("clienteId");

        if (!token || !clienteId) {
            setErro("Cliente não autenticado. Volte para a identificação.");
            setCarregando(false);
            return;
        }

        try {
            setCarregando(true);
            setErro("");

            const [clienteAtual, enderecosCliente] = await Promise.all([
                buscarClienteAutenticado(),
                buscarEnderecosCliente()
            ]);

            const clienteNormalizado = {
                clienteId: clienteAtual.id,
                nome: clienteAtual.nome,
                cpf: clienteAtual.cpf,
                telefone: clienteAtual.telefone,
                email: clienteAtual.email
            };

            setCliente(clienteNormalizado);
            setEnderecos(Array.isArray(enderecosCliente) ? enderecosCliente : []);

            sessionStorage.setItem("cliente", JSON.stringify(clienteNormalizado));
            window.dispatchEvent(new Event("clienteAtualizado"));
        } catch (error) {
            console.error(error);

            const status = error?.response?.status;

            if (status === 401 || status === 403) {
                setErro("Sua sessão expirou. Volte para a identificação.");
            } else {
                setErro("Não foi possível carregar os dados do cliente.");
            }
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        let ativo = true;

        async function carregarInicialmente() {
            if (!ativo) {
                return;
            }

            await recarregar();
        }

        carregarInicialmente();

        return () => {
            ativo = false;
        };
    }, [recarregar]);

    return {
        cliente,
        enderecos,
        carregando,
        erro,
        recarregar
    };
}
