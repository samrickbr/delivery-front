import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DADOS_IDENTIFICACAO = "identificacaoCliente";

function Identificacao() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState(() => {
        return (
            JSON.parse(sessionStorage.getItem(DADOS_IDENTIFICACAO)) || {
                nomeCompleto: "",
                cpf: "",
                telefone: "",
                endereco: "",
                senha: "",
                confirmarSenha: ""
            }
        );
    });

    const [erro, setErro] = useState("");

    function alterarCampo(event) {
        const { name, value } = event.target;

        setFormulario((estadoAtual) => ({
            ...estadoAtual,
            [name]: value
        }));
    }

    function continuar(event) {
        event.preventDefault();
        setErro("");

        const camposObrigatorios = [
            "nomeCompleto",
            "cpf",
            "telefone",
            "endereco",
            "senha",
            "confirmarSenha"
        ];

        const campoVazio = camposObrigatorios.some(
            (campo) => !formulario[campo].trim()
        );

        if (campoVazio) {
            setErro("Preencha todos os campos.");
            return;
        }

        if (formulario.senha !== formulario.confirmarSenha) {
            setErro("A confirmação da senha não corresponde à senha.");
            return;
        }

        sessionStorage.setItem(
            DADOS_IDENTIFICACAO,
            JSON.stringify(formulario)
        );

        navigate("/checkout");
    }

    return (
        <div className="container mt-3 mt-md-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
                <h1 className="mb-0">Identificação</h1>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => navigate("/carrinho")}
                >
                    Voltar ao carrinho
                </button>
            </div>

            {erro && <div className="alert alert-danger">{erro}</div>}

            <form onSubmit={continuar}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="nomeCompleto">
                        Nome completo
                    </label>

                    <input
                        id="nomeCompleto"
                        name="nomeCompleto"
                        type="text"
                        className="form-control"
                        value={formulario.nomeCompleto}
                        onChange={alterarCampo}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="cpf">
                        CPF
                    </label>

                    <input
                        id="cpf"
                        name="cpf"
                        type="text"
                        className="form-control"
                        value={formulario.cpf}
                        onChange={alterarCampo}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="telefone">
                        Telefone / WhatsApp
                    </label>

                    <input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        className="form-control"
                        value={formulario.telefone}
                        onChange={alterarCampo}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="endereco">
                        Endereço
                    </label>

                    <input
                        id="endereco"
                        name="endereco"
                        type="text"
                        className="form-control"
                        value={formulario.endereco}
                        onChange={alterarCampo}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="senha">
                        Senha
                    </label>

                    <input
                        id="senha"
                        name="senha"
                        type="password"
                        className="form-control"
                        value={formulario.senha}
                        onChange={alterarCampo}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label" htmlFor="confirmarSenha">
                        Confirmar senha
                    </label>

                    <input
                        id="confirmarSenha"
                        name="confirmarSenha"
                        type="password"
                        className="form-control"
                        value={formulario.confirmarSenha}
                        onChange={alterarCampo}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success w-100">
                    Continuar para pagamento
                </button>
            </form>
        </div>
    );
}

export default Identificacao;