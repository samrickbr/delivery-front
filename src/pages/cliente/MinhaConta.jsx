import { useNavigate } from "react-router-dom";
import { useCheckoutCliente } from "./checkout/hooks/useCheckoutCliente";

function formatarCpf(cpf) {
    const valor = String(cpf || "").replace(/\D/g, "");

    if (valor.length !== 11) {
        return cpf || "-";
    }

    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarEndereco(endereco) {
    if (!endereco) {
        return "";
    }

    const linhaPrincipal = [endereco.logradouro, endereco.numero].filter(Boolean).join(", ");

    const linhaLocalizacao = [endereco.bairro, endereco.cidade, endereco.estado].filter(Boolean).join(" — ");

    const linhas = [
        linhaPrincipal,
        endereco.complemento,
        linhaLocalizacao,
        endereco.cep ? `CEP: ${endereco.cep}` : null
    ].filter(Boolean);

    return linhas;
}

function MinhaConta() {
    const navigate = useNavigate();

    const { cliente, enderecos, carregando, erro } = useCheckoutCliente();

    if (carregando) {
        return (
            <div className="container py-5">
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border" role="status" aria-label="Carregando" />
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4 pb-5">
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
                    <section className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">
                            <h2 className="h4 mb-4">Dados pessoais</h2>

                            <div className="mb-3">
                                <div className="small text-muted mb-1">Nome</div>

                                <div className="fw-semibold">{cliente?.nome || "-"}</div>
                            </div>

                            <div className="mb-3">
                                <div className="small text-muted mb-1">CPF</div>

                                <div className="fw-semibold">{formatarCpf(cliente?.cpf)}</div>
                            </div>

                            <div className="mb-3">
                                <div className="small text-muted mb-1">Telefone</div>

                                <div className="fw-semibold">{cliente?.telefone || "-"}</div>
                            </div>

                            <div>
                                <div className="small text-muted mb-1">E-mail</div>

                                <div className="fw-semibold">{cliente?.email || "-"}</div>
                            </div>

                            <div className="alert alert-info mt-4 mb-0">
                                A edição dos dados pessoais será disponibilizada quando o contrato de manutenção do
                                cliente estiver disponível.
                            </div>
                        </div>
                    </section>
                </div>

                <div className="col-12 col-lg-6">
                    <section className="card border-0 shadow-sm h-100">
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

                                    <p className="text-muted mb-0">Nenhum endereço foi cadastrado para esta conta.</p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {enderecos.map((endereco) => (
                                        <article key={endereco.id} className="border rounded-3 p-3">
                                            <div className="d-flex justify-content-between align-items-start gap-3">
                                                <div>
                                                    {formatarEndereco(endereco).map((linha, index) => (
                                                        <div
                                                            key={index}
                                                            className={index === 0 ? "fw-semibold" : "text-muted"}
                                                        >
                                                            {linha}
                                                        </div>
                                                    ))}
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
                    </section>
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
