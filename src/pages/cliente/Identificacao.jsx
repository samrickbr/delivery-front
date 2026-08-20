import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function normalizarCpf(cpf) {
    return cpf.replace(/\D/g, "");
}

function Identificacao() {
    const navigate = useNavigate();

    const [modo, setModo] = useState("novo");
    const [formulario, setFormulario] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        senha: "",
        confirmarSenha: ""
    });

    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    function alterarCampo(campo, valor) {
        setFormulario((estado) => ({
            ...estado,
            [campo]: valor
        }));

        setErro("");
    }

    async function continuar(event) {
        event.preventDefault();
        setErro("");

        const cpf = normalizarCpf(formulario.cpf);

        if (modo === "novo") {
            if (
                !formulario.nome.trim() ||
                !cpf ||
                !formulario.telefone.trim() ||
                !formulario.email.trim() ||
                !formulario.senha ||
                !formulario.confirmarSenha
            ) {
                setErro("Preencha todos os campos.");
                return;
            }

            if (formulario.senha !== formulario.confirmarSenha) {
                setErro("A confirmação da senha não confere.");
                return;
            }

            try {
                setEnviando(true);

                const response = await api.post("/cliente/cadastro", {
                    nome: formulario.nome.trim(),
                    cpf,
                    telefone: formulario.telefone.trim(),
                    email: formulario.email.trim(),
                    senha: formulario.senha
                });

                sessionStorage.setItem(
                    "cliente",
                    JSON.stringify({
                        clienteId: response.data.id,
                        nome: response.data.nome,
                        cpf: response.data.cpf,
                        telefone: response.data.telefone,
                        email: response.data.email
                    })
                );

                sessionStorage.setItem("clienteId", String(response.data.id));

                navigate("/checkout");
            } catch (error) {
                const status = error.response?.status;

                if (status === 400 || status === 409) {
                    setErro("Este CPF já está cadastrado.");
                } else {
                    setErro("Não foi possível realizar o cadastro. Tente novamente.");
                }
            } finally {
                setEnviando(false);
            }

            return;
        }

        if (!cpf || !formulario.senha) {
            setErro("Informe o CPF e a senha.");
            return;
        }

        try {
            setEnviando(true);

            const response = await api.post("/cliente/login", {
                cpf,
                senha: formulario.senha
            });

            sessionStorage.setItem("clienteToken", response.data.token);

            sessionStorage.setItem("clienteId", String(response.data.clienteId));

            sessionStorage.setItem(
                "cliente",
                JSON.stringify({
                    clienteId: response.data.clienteId,
                    cpf
                })
            );

            navigate("/checkout");
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                setErro("CPF ou senha inválidos.");
            } else {
                setErro("Não foi possível realizar o login. Tente novamente.");
            }
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="mb-4">Identificação</h2>

                    <div className="btn-group w-100 mb-4" role="group">
                        <button
                            type="button"
                            className={`btn ${modo === "novo" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => {
                                setModo("novo");
                                setErro("");
                            }}
                        >
                            Novo cliente
                        </button>

                        <button
                            type="button"
                            className={`btn ${modo === "existente" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => {
                                setModo("existente");
                                setErro("");
                            }}
                        >
                            Já sou cliente
                        </button>
                    </div>

                    {erro && <div className="alert alert-danger">{erro}</div>}

                    <form onSubmit={continuar}>
                        {modo === "novo" && (
                            <>
                                <label className="form-label">Nome completo</label>

                                <input
                                    className="form-control mb-3"
                                    value={formulario.nome}
                                    onChange={(e) => alterarCampo("nome", e.target.value)}
                                />

                                <label className="form-label">CPF</label>

                                <input
                                    className="form-control mb-3"
                                    value={formulario.cpf}
                                    onChange={(e) => alterarCampo("cpf", e.target.value)}
                                />

                                <label className="form-label">Telefone / WhatsApp</label>

                                <input
                                    type="tel"
                                    className="form-control mb-3"
                                    value={formulario.telefone}
                                    onChange={(e) => alterarCampo("telefone", e.target.value)}
                                />

                                <label className="form-label">E-mail</label>

                                <input
                                    type="email"
                                    className="form-control mb-3"
                                    value={formulario.email}
                                    onChange={(e) => alterarCampo("email", e.target.value)}
                                />

                                <label className="form-label">Senha</label>

                                <input
                                    type="password"
                                    className="form-control mb-3"
                                    value={formulario.senha}
                                    onChange={(e) => alterarCampo("senha", e.target.value)}
                                />

                                <label className="form-label">Confirmar senha</label>

                                <input
                                    type="password"
                                    className="form-control mb-3"
                                    value={formulario.confirmarSenha}
                                    onChange={(e) => alterarCampo("confirmarSenha", e.target.value)}
                                />
                            </>
                        )}

                        {modo === "existente" && (
                            <>
                                <label className="form-label">CPF</label>

                                <input
                                    className="form-control mb-3"
                                    value={formulario.cpf}
                                    onChange={(e) => alterarCampo("cpf", e.target.value)}
                                />

                                <label className="form-label">Senha</label>

                                <input
                                    type="password"
                                    className="form-control mb-3"
                                    value={formulario.senha}
                                    onChange={(e) => alterarCampo("senha", e.target.value)}
                                />
                            </>
                        )}

                        <button type="submit" className="btn btn-success w-100" disabled={enviando}>
                            {enviando ? "Processando..." : "Continuar"}
                        </button>
                    </form>

                    <button type="button" className="btn btn-link w-100 mt-2" onClick={() => navigate("/carrinho")}>
                        Voltar para o carrinho
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Identificacao;
