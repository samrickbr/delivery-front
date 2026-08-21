import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function formatarCpf(cpf) {
    const valor = String(cpf || "").replace(/\D/g, "");

    if (valor.length !== 11) {
        return cpf || "-";
    }

    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function MinhaConta() {
    const navigate = useNavigate();

    const [cliente, setCliente] = useState(null);
    const [enderecos, setEnderecos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
            const token = sessionStorage.getItem("clienteToken");

            if (!token) {
                navigate("/identificacao", {
                    replace: true
                });

                return;
            }

            try {
                setCarregando(true);
                setErro("");

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const [clienteResponse, enderecosResponse] = await Promise.all([
                    api.get("/cliente/me", config),
                    api.get("/cliente/me/enderecos", config)
                ]);

                const dadosCliente = clienteResponse.data;

                setCliente(dadosCliente);
                setEnderecos(enderecosResponse.data || []);

                sessionStorage.setItem(
                    "cliente",
                    JSON.stringify({
                        clienteId: dadosCliente.id,
                        nome: dadosCliente.nome,
                        cpf: dadosCliente.cpf,
                        telefone: dadosCliente.telefone,
                        email: dadosCliente.email
                    })
                );

                sessionStorage.setItem("clienteId", String(dadosCliente.id));

                window.dispatchEvent(new Event("clienteAtualizado"));
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    sessionStorage.removeItem("clienteToken");
                    sessionStorage.removeItem("clienteId");
                    sessionStorage.removeItem("cliente");

                    window.dispatchEvent(new Event("clienteAtualizado"));

                    navigate("/identificacao", {
                        replace: true
                    });

                    return;
                }

                setErro("Não foi possível carregar os dados da sua conta.");
            } finally {
                setCarregando(false);
            }
        }

        carregar();
    }, [navigate]);

    if (carregando) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-5">
            <section className="mb-4">
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4 p-md-5">
                        <span className="badge text-bg-primary rounded-pill mb-2">Minha conta</span>

                        <h1 className="display-6 fw-bold mb-2">Meus dados</h1>

                        <p className="text-muted mb-0">Consulte seus dados e endereços cadastrados.</p>
                    </div>
                </div>
            </section>

            {erro && (
                <div className="alert alert-danger" role="alert">
                    {erro}
                </div>
            )}

            <div className="row g-4">
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">
                            <h2 className="h4 mb-4">Dados pessoais</h2>

                            <div className="mb-3">
                                <label className="form-label text-muted">Nome</label>

                                <div className="fw-semibold">{cliente?.nome || "-"}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted">CPF</label>

                                <div className="fw-semibold">{formatarCpf(cliente?.cpf)}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted">Telefone</label>

                                <div className="fw-semibold">{cliente?.telefone || "-"}</div>
                            </div>

                            <div>
                                <label className="form-label text-muted">E-mail</label>

                                <div className="fw-semibold">{cliente?.email || "-"}</div>
                            </div>

                            <div className="alert alert-info mt-4 mb-0">
                                A edição dos dados pessoais será liberada quando o contrato de manutenção do cliente
                                estiver disponível no Delivery Back.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="h4 mb-0">Meus endereços</h2>

                                <button type="button" className="btn btn-primary btn-sm rounded-pill" disabled>
                                    Novo endereço
                                </button>
                            </div>

                            {enderecos.length === 0 ? (
                                <div className="text-center py-4">
                                    <div className="fs-1 mb-3" aria-hidden="true">
                                        📍
                                    </div>

                                    <h3 className="h5">Nenhum endereço cadastrado</h3>

                                    <p className="text-muted mb-0">
                                        Você poderá cadastrar um endereço assim que o contrato estiver disponível.
                                    </p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {enderecos.map((endereco) => (
                                        <article key={endereco.id} className="border rounded-3 p-3">
                                            <div className="d-flex justify-content-between align-items-start gap-3">
                                                <div>
                                                    <div className="fw-semibold">
                                                        {endereco.logradouro}, {endereco.numero}
                                                    </div>

                                                    {endereco.complemento && (
                                                        <div className="text-muted">{endereco.complemento}</div>
                                                    )}

                                                    <div className="text-muted">
                                                        {endereco.bairro} — {endereco.cidade}/{endereco.estado}
                                                    </div>

                                                    <div className="text-muted">CEP: {endereco.cep}</div>
                                                </div>

                                                {endereco.principal && (
                                                    <span className="badge text-bg-success rounded-pill">
                                                        Principal
                                                    </span>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}

                            <div className="alert alert-secondary mt-4 mb-0">
                                Você poderá manter vários endereços e escolher no checkout onde deseja receber cada
                                pedido.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    className="btn btn-outline-primary rounded-pill"
                    onClick={() => navigate("/cardapio")}
                >
                    ← Voltar ao cardápio
                </button>
            </div>
        </div>
    );
}

export default MinhaConta;
