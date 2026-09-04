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

    function alterarModo(novoModo) {
        setModo(novoModo);
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

                const dadosCadastro = {
                    nome: formulario.nome.trim(),
                    cpf,
                    telefone: formulario.telefone.trim(),
                    senha: formulario.senha
                };

                const email = formulario.email.trim();

                if (email) {
                    dadosCadastro.email = email;
                }

                const response = await api.post("/cliente/cadastro", dadosCadastro);

                const loginResponse = await api.post("/cliente/login", {
                    cpf,
                    senha: formulario.senha
                });

                sessionStorage.setItem("clienteToken", loginResponse.data.token);

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

                sessionStorage.setItem("clienteId", String(loginResponse.data.clienteId || response.data.id));

                window.dispatchEvent(new Event("clienteAtualizado"));

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

            try {
                const clienteResponse = await api.get("/cliente/me", {
                    headers: {
                        Authorization: `Bearer ${response.data.token}`
                    }
                });

                sessionStorage.setItem(
                    "cliente",
                    JSON.stringify({
                        clienteId: clienteResponse.data.id,
                        nome: clienteResponse.data.nome,
                        cpf: clienteResponse.data.cpf,
                        telefone: clienteResponse.data.telefone,
                        email: clienteResponse.data.email
                    })
                );
            } catch {
                sessionStorage.setItem(
                    "cliente",
                    JSON.stringify({
                        clienteId: response.data.clienteId,
                        cpf
                    })
                );
            }

            window.dispatchEvent(new Event("clienteAtualizado"));

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

    const novoCliente = modo === "novo";

    return (
        <div className="pb-5">
            <section className="mb-4">
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4 p-md-5">
                        <div className="row align-items-center g-4">
                            <div className="col-12 col-lg-8">
                                <span className="badge text-bg-primary rounded-pill mb-3">Quase lá</span>

                                <h1 className="display-6 fw-bold mb-2">Identificação</h1>

                                <p className="lead text-muted mb-0">
                                    Entre na sua conta ou faça seu cadastro para continuar o pedido.
                                </p>
                            </div>

                            <div className="col-12 col-lg-4 text-lg-end">
                                <div className="fs-1" aria-hidden="true">
                                    👤
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="row justify-content-center">
                <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4 p-md-5">
                            <div className="btn-group w-100 mb-4" role="group" aria-label="Tipo de identificação">
                                <button
                                    type="button"
                                    className={novoCliente ? "btn btn-primary" : "btn btn-outline-primary"}
                                    onClick={() => alterarModo("novo")}
                                    disabled={enviando}
                                >
                                    Criar cadastro
                                </button>

                                <button
                                    type="button"
                                    className={!novoCliente ? "btn btn-primary" : "btn btn-outline-primary"}
                                    onClick={() => alterarModo("existente")}
                                    disabled={enviando}
                                >
                                    Já sou cliente
                                </button>
                            </div>

                            <div className="mb-4">
                                <h2 className="h4 mb-1">{novoCliente ? "Crie sua conta" : "Acesse sua conta"}</h2>

                                <p className="text-muted mb-0">
                                    {novoCliente
                                        ? "Preencha seus dados para finalizar o pedido."
                                        : "Informe seus dados para continuar."}
                                </p>
                            </div>

                            {erro && (
                                <div className="alert alert-danger" role="alert">
                                    {erro}
                                </div>
                            )}

                            <form onSubmit={continuar}>
                                {novoCliente && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Nome completo</label>

                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                value={formulario.nome}
                                                onChange={(event) => alterarCampo("nome", event.target.value)}
                                                disabled={enviando}
                                                autoComplete="name"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">CPF</label>

                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                value={formulario.cpf}
                                                onChange={(event) => alterarCampo("cpf", event.target.value)}
                                                disabled={enviando}
                                                inputMode="numeric"
                                                autoComplete="off"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Telefone / WhatsApp</label>

                                            <input
                                                type="tel"
                                                className="form-control form-control-lg"
                                                value={formulario.telefone}
                                                onChange={(event) => alterarCampo("telefone", event.target.value)}
                                                disabled={enviando}
                                                autoComplete="tel"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">E-mail</label>

                                            <input
                                                type="email"
                                                className="form-control form-control-lg"
                                                value={formulario.email}
                                                onChange={(event) => alterarCampo("email", event.target.value)}
                                                disabled={enviando}
                                                autoComplete="email"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Senha</label>

                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                value={formulario.senha}
                                                onChange={(event) => alterarCampo("senha", event.target.value)}
                                                disabled={enviando}
                                                autoComplete="new-password"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">Confirmar senha</label>

                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                value={formulario.confirmarSenha}
                                                onChange={(event) => alterarCampo("confirmarSenha", event.target.value)}
                                                disabled={enviando}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                    </>
                                )}

                                {!novoCliente && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">CPF</label>

                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                value={formulario.cpf}
                                                onChange={(event) => alterarCampo("cpf", event.target.value)}
                                                disabled={enviando}
                                                inputMode="numeric"
                                                autoComplete="username"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">Senha</label>

                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                value={formulario.senha}
                                                onChange={(event) => alterarCampo("senha", event.target.value)}
                                                disabled={enviando}
                                                autoComplete="current-password"
                                            />
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-success btn-lg w-100 rounded-pill"
                                    disabled={enviando}
                                >
                                    {enviando
                                        ? "Processando..."
                                        : novoCliente
                                          ? "Criar conta e continuar"
                                          : "Entrar e continuar"}
                                </button>
                            </form>

                            <div className="text-center mt-4 pt-3 border-top">
                                <button
                                    type="button"
                                    className="btn btn-link text-decoration-none"
                                    onClick={() => navigate("/carrinho")}
                                    disabled={enviando}
                                >
                                    ← Voltar para o carrinho
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Identificacao;
