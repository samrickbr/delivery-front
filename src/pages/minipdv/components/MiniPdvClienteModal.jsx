import { useState } from "react";

import { cadastrarClienteOperacional } from "../../../services/clienteService";

const FORMULARIO_INICIAL = {
    nome: "",
    cpf: "",
    telefone: ""
};

function MiniPdvClienteModal({ aberto, onFechar, onSalvo }) {
    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    if (!aberto) {
        return null;
    }

    function alterarCampo(event) {
        const { name, value } = event.target;
        const novoValor = name === "cpf" ? value.replace(/\D/g, "").slice(0, 11) : value;

        setFormulario((atual) => ({ ...atual, [name]: novoValor }));
        setErro("");
    }

    function fechar() {
        if (salvando) {
            return;
        }

        setFormulario(FORMULARIO_INICIAL);
        setErro("");
        onFechar();
    }

    async function salvar(event) {
        event.preventDefault();

        const nome = formulario.nome.trim();
        const cpf = formulario.cpf.trim();
        const telefone = formulario.telefone.trim();

        if (!nome || !cpf || !telefone) {
            setErro("Preencha nome, CPF e telefone.");
            return;
        }

        try {
            setSalvando(true);
            setErro("");

            const cliente = await cadastrarClienteOperacional({ nome, cpf, telefone });

            await onSalvo(cliente);
            setFormulario(FORMULARIO_INICIAL);
            onFechar();
        } catch (error) {
            console.error("Erro ao cadastrar cliente operacional.", error);
            setErro(error?.response?.data?.message || "Não foi possível salvar o cliente. Verifique os dados e tente novamente.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div
            className="modal d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mini-pdv-cliente-modal-titulo"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={salvar}>
                        <div className="modal-header">
                            <h2 className="modal-title h5" id="mini-pdv-cliente-modal-titulo">
                                Novo cliente
                            </h2>

                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Fechar"
                                onClick={fechar}
                                disabled={salvando}
                            />
                        </div>

                        <div className="modal-body">
                            {erro && <div className="alert alert-danger">{erro}</div>}

                            <div className="mb-3">
                                <label htmlFor="mini-pdv-cliente-nome" className="form-label">
                                    Nome completo
                                </label>

                                <input
                                    id="mini-pdv-cliente-nome"
                                    name="nome"
                                    type="text"
                                    className="form-control"
                                    value={formulario.nome}
                                    onChange={alterarCampo}
                                    disabled={salvando}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="mini-pdv-cliente-cpf" className="form-label">
                                    CPF
                                </label>

                                <input
                                    id="mini-pdv-cliente-cpf"
                                    name="cpf"
                                    type="text"
                                    className="form-control"
                                    value={formulario.cpf}
                                    onChange={alterarCampo}
                                    disabled={salvando}
                                    inputMode="numeric"
                                    maxLength="11"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="mini-pdv-cliente-telefone" className="form-label">
                                    Telefone / WhatsApp
                                </label>

                                <input
                                    id="mini-pdv-cliente-telefone"
                                    name="telefone"
                                    type="tel"
                                    className="form-control"
                                    value={formulario.telefone}
                                    onChange={alterarCampo}
                                    disabled={salvando}
                                    required
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={fechar} disabled={salvando}>
                                Cancelar
                            </button>

                            <button type="submit" className="btn btn-primary" disabled={salvando}>
                                {salvando ? "Salvando..." : "Salvar cliente"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MiniPdvClienteModal;
