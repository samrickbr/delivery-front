import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarOperacionalAutenticado, loginOperacional } from "../../services/operacionalService";

function obterRotaInicial(perfis = []) {
    if (perfis.includes("DELIVERY_BALCAO")) {
        return "/balcao";
    }

    if (perfis.includes("DELIVERY_MINIPDV")) {
        return "/minipdv";
    }

    if (perfis.includes("DELIVERY_COZINHA")) {
        return "/cozinha";
    }

    if (perfis.includes("DELIVERY_PIZZARIA")) {
        return "/pizzaria";
    }

    return "/acesso-negado";
}

function LoginOperacional() {
    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setCarregando(true);
            setErro("");

            const resposta = await loginOperacional({
                login,
                senha
            });

            sessionStorage.setItem("operacionalToken", resposta.token);

            const usuario = await buscarOperacionalAutenticado();

            const perfis = usuario?.perfis ?? [];

            navigate(obterRotaInicial(perfis), {
                replace: true
            });
        } catch (error) {
            console.error("Erro ao realizar login operacional.", error);

            sessionStorage.removeItem("operacionalToken");

            setErro("Usuário ou senha inválidos.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card shadow-sm border-0" style={{ width: "350px" }}>
                <div className="card-body p-4">
                    <h1 className="h4 mb-4">SIGIN</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="login" className="form-label">
                                Login
                            </label>

                            <input
                                id="login"
                                type="text"
                                className="form-control"
                                value={login}
                                onChange={(event) => setLogin(event.target.value)}
                                autoComplete="username"
                                autoFocus
                                disabled={carregando}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="senha" className="form-label">
                                Senha
                            </label>

                            <input
                                id="senha"
                                type="password"
                                className="form-control"
                                value={senha}
                                onChange={(event) => setSenha(event.target.value)}
                                autoComplete="current-password"
                                disabled={carregando}
                            />
                        </div>

                        {erro && <div className="text-danger mt-2">{erro}</div>}

                        <button
                            type="submit"
                            className="btn btn-primary w-100 mt-3"
                            disabled={carregando || !login || !senha}
                        >
                            {carregando ? "Entrando..." : "Entrar"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginOperacional;
