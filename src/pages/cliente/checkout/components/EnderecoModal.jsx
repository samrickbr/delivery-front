import { useState } from "react";

import { criarEnderecoCliente } from "../../../../services/clienteService";

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

function EnderecoModal({ aberto, onFechar, onSalvo }) {
    const [formulario, setFormulario] = useState(ENDERECO_INICIAL);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    if (!aberto) {
        return null;
    }

    function alterarCampo(event) {
        const { name, value, type, checked } = event.target;

        setFormulario((atual) => ({
            ...atual,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    function fechar() {
        if (salvando) {
            return;
        }

        setFormulario({ ...ENDERECO_INICIAL });
        setErro("");
        onFechar();
    }

    async function salvar(event) {
        event.preventDefault();

        try {
            setSalvando(true);
            setErro("");

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

            const endereco = await criarEnderecoCliente(dados);

            setFormulario({ ...ENDERECO_INICIAL });

            if (onSalvo) {
                await onSalvo(endereco);
            }

            onFechar();
        } catch (error) {
            console.error(error);

            setErro(
                error?.response?.data?.message ||
                    "Não foi possível salvar o endereço. Verifique os dados e tente novamente."
            );
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
            aria-labelledby="endereco-modal-titulo"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={salvar}>
                        <div className="modal-header">
                            <h2 className="modal-title h5" id="endereco-modal-titulo">
                                Novo endereço
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
                            {erro && (
                                <div className="alert alert-danger" role="alert">
                                    {erro}
                                </div>
                            )}

                            <div className="row g-3">
                                <div className="col-12 col-md-4">
                                    <label htmlFor="checkout-cep" className="form-label">
                                        CEP
                                    </label>

                                    <input
                                        id="checkout-cep"
                                        name="cep"
                                        type="text"
                                        className="form-control"
                                        value={formulario.cep}
                                        onChange={alterarCampo}
                                        required
                                    />
                                </div>

                                <div className="col-12 col-md-8">
                                    <label htmlFor="checkout-logradouro" className="form-label">
                                        Logradouro
                                    </label>

                                    <input
                                        id="checkout-logradouro"
                                        name="logradouro"
                                        type="text"
                                        className="form-control"
                                        value={formulario.logradouro}
                                        onChange={alterarCampo}
                                        required
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <label htmlFor="checkout-numero" className="form-label">
                                        Número
                                    </label>

                                    <input
                                        id="checkout-numero"
                                        name="numero"
                                        type="text"
                                        className="form-control"
                                        value={formulario.numero}
                                        onChange={alterarCampo}
                                        required
                                    />
                                </div>

                                <div className="col-12 col-md-8">
                                    <label htmlFor="checkout-complemento" className="form-label">
                                        Complemento
                                    </label>

                                    <input
                                        id="checkout-complemento"
                                        name="complemento"
                                        type="text"
                                        className="form-control"
                                        value={formulario.complemento}
                                        onChange={alterarCampo}
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label htmlFor="checkout-bairro" className="form-label">
                                        Bairro
                                    </label>

                                    <input
                                        id="checkout-bairro"
                                        name="bairro"
                                        type="text"
                                        className="form-control"
                                        value={formulario.bairro}
                                        onChange={alterarCampo}
                                        required
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label htmlFor="checkout-cidade" className="form-label">
                                        Cidade
                                    </label>

                                    <input
                                        id="checkout-cidade"
                                        name="cidade"
                                        type="text"
                                        className="form-control"
                                        value={formulario.cidade}
                                        onChange={alterarCampo}
                                        required
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <label htmlFor="checkout-uf" className="form-label">
                                        UF
                                    </label>

                                    <input
                                        id="checkout-uf"
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
                                            id="checkout-principal"
                                            name="principal"
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={formulario.principal}
                                            onChange={alterarCampo}
                                        />

                                        <label htmlFor="checkout-principal" className="form-check-label">
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
                                onClick={fechar}
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
    );
}

export default EnderecoModal;
