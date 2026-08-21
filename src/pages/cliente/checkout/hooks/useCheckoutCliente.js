import { useEffect, useState } from "react";
import { buscarClienteAutenticado, buscarEnderecosCliente } from "../../../../services/clienteService";

export function useCheckoutCliente() {
    const [cliente, setCliente] = useState(null);
    const [enderecos, setEnderecos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            const token = sessionStorage.getItem("clienteToken");
            const clienteId = sessionStorage.getItem("clienteId");

            if (!token || !clienteId) {
                if (ativo) {
                    setErro("Cliente não autenticado. Volte para a identificação.");
                    setCarregando(false);
                }

                return;
            }

            try {
                setCarregando(true);
                setErro("");

                const [clienteAtual, enderecosCliente] = await Promise.all([
                    buscarClienteAutenticado(),
                    buscarEnderecosCliente()
                ]);

                if (!ativo) {
                    return;
                }

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
            } catch (error) {
                console.error(error);

                if (!ativo) {
                    return;
                }

                const status = error?.response?.status;

                if (status === 401 || status === 403) {
                    setErro("Sua sessão expirou. Volte para a identificação.");
                } else {
                    setErro("Não foi possível carregar os dados do cliente.");
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregar();

        return () => {
            ativo = false;
        };
    }, []);

    return {
        cliente,
        enderecos,
        carregando,
        erro
    };
}
