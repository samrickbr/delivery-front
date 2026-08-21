import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    atualizarEnderecoCliente,
    criarEnderecoCliente,
    definirEnderecoPrincipalCliente,
    excluirEnderecoCliente
} from "../../services/clienteService";
import { useCheckoutCliente } from "./checkout/hooks/useCheckoutCliente";

const ENDERECO_INICIAL = {
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    principal: false
};

function formatarCpf(cpf) {
    const valor = String(cpf || "").replace(/\D/g, "");

    if (valor.length !== 11) {
        return cpf || "-";
    }

    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarEndereco(endereco) {
    if (!endereco) {
        return [];
    }

    const linhaPrincipal = [endereco.logradouro, endereco.numero].filter(Boolean).join(", ");

    const linhaLocalizacao = [endereco.bairro, endereco.cidade, endereco.uf].filter(Boolean).join(" — ");

    return [
        linhaPrincipal,
        endereco.complemento,
        linhaLocalizacao,
        endereco.cep ? `CEP: ${endereco.cep}` : null
    ].filter(Boolean);
}

function obterFormularioEndereco(endereco) {
    if (!endereco) {
        return { ...ENDERECO_INICIAL };
    }

    return {
        cep: endereco.cep || "",
        logradouro: endereco.logradouro || "",
        numero: endereco.numero || "",
        complemento: endereco.complemento || "",
        bairro: endereco.bairro || "",
        cidade: endereco.cidade || "",
        uf: endereco.uf || "",
        principal: Boolean(endereco.principal)
    };
}

function MinhaConta() {
    const navigate = useNavigate();

    const { cliente, enderecos, carregando, erro, recarregar } = useCheckoutCliente();

    const [formularioAberto, setFormularioAberto] = useState(false);
    const [enderecoEditando, setEnderecoEditando] = useState(null);
    const [formulario, setFormulario] = useState(ENDERECO_INICIAL);
    const [salvando, setSalvando] = useState(false);
    const [erroFormulario, setErroFormulario] = useState("");

    function abrirNovoEndereco() {
        setEnderecoEditando(null);
        setFormulario({ ...ENDERECO_INICIAL });
        setErroFormulario("");
        setFormularioAberto(true);
    }

    function abrirEdicaoEndereco(endereco) {
        setEnderecoEditando(endereco);
        setFormulario(obterFormularioEndereco(endereco));
        setErroFormulario("");
        setFormularioAberto(true);
    }

    function fecharFormulario() {
        if (salvando) {
            return;
        }

        setFormularioAberto(false);
        setEnderecoEditando(null);
        setFormulario({ ...ENDERECO_INICIAL });
        setErroFormulario("");
    }

    function alterarCampo(event) {
        const { name, value, type, checked } = event.target;

        setFormulario((atual) => ({
            ...atual,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    async function salvarEndereco(event) {
        event.preventDefault();

        try {
            setSalvando(true);
            setErroFormulario("");

            const dados = {
                cep: formulario.cep.trim(),
                logradouro: formulario.logradouro.trim(),
                numero: formulario.numero.trim(),
                complemento: formulario.complemento.trim(),
                bairro: formulario.bairro.trim(),
                cidade: formulario.cidade.trim(),
                uf: formulario.uf.trim().toUpperCase(),
                principal: formulario.principal
            };

            if (enderecoEditando?.id) {
                await atualizarEnderecoCliente(enderecoEditando.id, dados);
            } else {
                await criarEnderecoCliente(dados);
            }

            await recarregar();
            fecharFormulario();
        } catch (error) {
            setErroFormulario(
                error?.response?.data?.message ||
                    "Não foi possível salvar o endereço. Verifique os dados e tente novamente."
            );
        } finally {
            setSalvando(false);
        }
    }

    async function tornarPrincipal(enderecoId) {
        try {
            setErroFormulario("");
            await definirEnderecoPrincipalCliente(enderecoId);
            await recarregar();
        } catch (error) {
            setErroFormulario(error?.response?.data?.message || "Não foi possível definir o endereço principal.");
        }
    }

    async function removerEndereco(enderecoId) {
        const confirmar = window.confirm("Deseja realmente excluir este endereço?");

        if (!confirmar) {
            return;
        }

        try {
            setErroFormulario("");
            await excluirEnderecoCliente(enderecoId);
            await recarregar();
        } catch (error) {
            setErroFormulario(error?.response?.data?.message || "Não foi possível excluir o endereço.");
        }
    }

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

            {erroFormulario && (
                <div className="alert alert-danger" role="alert">
                    {erroFormulario}
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

                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm rounded-pill"
                                    onClick={abrirNovoEndereco}
                                >
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
                                        Cadastre um endereço para utilizar a entrega dos seus pedidos.
                                    </p>
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

                                            <div className="d-flex flex-wrap gap-2 mt-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => abrirEdicaoEndereco(endereco)}
                                                >
                                                    Editar
                                                </button>

                                                {!endereco.principal && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-success btn-sm"
                                                        onClick={() => tornarPrincipal(endereco.id)}
                                                    >
                                                        Tornar principal
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => removerEndereco(endereco.id)}
                                                >
                                                    Excluir
                                                </button>
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

            {formularioAberto && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="endereco-modal-titulo"
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <form onSubmit={salvarEndereco}>
                                <div className="modal-header">
                                    <h2 className="modal-title h5" id="endereco-modal-titulo">
                                        {enderecoEditando ? "Editar endereço" : "Novo endereço"}
                                    </h2>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Fechar"
                                        onClick={fecharFormulario}
                                        disabled={salvando}
                                    />
                                </div>

                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-12 col-md-4">
                                            <label htmlFor="cep" className="form-label">
                                                CEP
                                            </label>

                                            <input
                                                id="cep"
                                                name="cep"
                                                type="text"
                                                className="form-control"
                                                value={formulario.cep}
                                                onChange={alterarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-8">
                                            <label htmlFor="logradouro" className="form-label">
                                                Logradouro
                                            </label>

                                            <input
                                                id="logradouro"
                                                name="logradouro"
                                                type="text"
                                                className="form-control"
                                                value={formulario.logradouro}
                                                onChange={alterarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-4">
                                            <label htmlFor="numero" className="form-label">
                                                Número
                                            </label>

                                            <input
                                                id="numero"
                                                name="numero"
                                                type="text"
                                                className="form-control"
                                                value={formulario.numero}
                                                onChange={alterarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-8">
                                            <label htmlFor="complemento" className="form-label">
                                                Complemento
                                            </label>

                                            <input
                                                id="complemento"
                                                name="complemento"
                                                type="text"
                                                className="form-control"
                                                value={formulario.complemento}
                                                onChange={alterarCampo}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label htmlFor="bairro" className="form-label">
                                                Bairro
                                            </label>

                                            <input
                                                id="bairro"
                                                name="bairro"
                                                type="text"
                                                className="form-control"
                                                value={formulario.bairro}
                                                onChange={alterarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label htmlFor="cidade" className="form-label">
                                                Cidade
                                            </label>

                                            <input
                                                id="cidade"
                                                name="cidade"
                                                type="text"
                                                className="form-control"
                                                value={formulario.cidade}
                                                onChange={alterarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-4">
                                            <label htmlFor="uf" className="form-label">
                                                UF
                                            </label>

                                            <input
                                                id="uf"
                                                name="uf"
                                                type="text"
                                                className="form-control"
                                                maxLength="2"
                                                value={formulario.uf}
                                                onChange={alterarCampo}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-8 d-flex align-items-end">
                                            <div className="form-check mb-2">
                                                <input
                                                    id="principal"
                                                    name="principal"
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={formulario.principal}
                                                    onChange={alterarCampo}
                                                />

                                                <label htmlFor="principal" className="form-check-label">
                                                    Definir como endereço principal
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={fecharFormulario}
                                        disabled={salvando}
                                    >
                                        Cancelar
                                    </button>

                                    <button type="submit" className="btn btn-primary" disabled={salvando}>
                                        {salvando ? "Salvando..." : "Salvar endereço"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

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
