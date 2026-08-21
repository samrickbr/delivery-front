import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function obterQuantidadeCarrinho() {
    try {
        const carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];

        return carrinho.reduce((total, item) => total + Number(item.quantidade || 0), 0);
    } catch {
        return 0;
    }
}

function obterCliente() {
    try {
        return JSON.parse(sessionStorage.getItem("cliente")) || null;
    } catch {
        return null;
    }
}

function ClienteLayout() {
    const navigate = useNavigate();

    const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(obterQuantidadeCarrinho);

    const [cliente, setCliente] = useState(obterCliente);

    useEffect(() => {
        function atualizarCarrinho() {
            setQuantidadeCarrinho(obterQuantidadeCarrinho());
        }

        function atualizarCliente() {
            setCliente(obterCliente());
        }

        window.addEventListener("storage", atualizarCarrinho);
        window.addEventListener("carrinhoAtualizado", atualizarCarrinho);
        window.addEventListener("clienteAtualizado", atualizarCliente);

        return () => {
            window.removeEventListener("storage", atualizarCarrinho);
            window.removeEventListener("carrinhoAtualizado", atualizarCarrinho);
            window.removeEventListener("clienteAtualizado", atualizarCliente);
        };
    }, []);

    function sair() {
        sessionStorage.removeItem("clienteToken");
        sessionStorage.removeItem("clienteId");
        sessionStorage.removeItem("cliente");

        setCliente(null);

        window.dispatchEvent(new Event("clienteAtualizado"));

        navigate("/cardapio");
    }

    const primeiroNome = cliente?.nome?.trim()?.split(/\s+/)[0];

    return (
        <div className="min-vh-100 bg-light d-flex flex-column">
            <header className="bg-dark text-white shadow-sm">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between py-3 gap-3">
                        <NavLink to="/cardapio" className="text-white text-decoration-none">
                            <div className="fw-bold fs-4">SIGIN Delivery</div>

                            <div className="small text-white-50">Faça seu pedido</div>
                        </NavLink>

                        <div className="d-flex align-items-center gap-2">
                            {cliente ? (
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-outline-light rounded-pill"
                                        onClick={() => navigate("/minha-conta")}
                                    >
                                        Olá, {primeiroNome || "cliente"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-warning rounded-pill"
                                        onClick={sair}
                                    >
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-outline-light rounded-pill"
                                    onClick={() => navigate("/identificacao")}
                                >
                                    Entrar
                                </button>
                            )}

                            <button
                                type="button"
                                className="btn btn-success rounded-pill px-3"
                                onClick={() => navigate("/carrinho")}
                            >
                                <span aria-hidden="true">🛒</span>

                                <span className="d-none d-sm-inline ms-2">Carrinho</span>

                                <span className="ms-2 badge text-bg-light">{quantidadeCarrinho}</span>
                            </button>
                        </div>
                    </div>

                    <nav className="d-flex gap-2 overflow-auto pb-3" aria-label="Navegação principal">
                        <NavLink
                            to="/cardapio"
                            className={({ isActive }) =>
                                `btn btn-sm rounded-pill flex-shrink-0 ${isActive ? "btn-light" : "btn-outline-light"}`
                            }
                        >
                            Cardápio
                        </NavLink>

                        <NavLink
                            to="/carrinho"
                            className={({ isActive }) =>
                                `btn btn-sm rounded-pill flex-shrink-0 ${isActive ? "btn-light" : "btn-outline-light"}`
                            }
                        >
                            Carrinho
                        </NavLink>

                        {cliente && (
                            <NavLink
                                to="/minha-conta"
                                className={({ isActive }) =>
                                    `btn btn-sm rounded-pill flex-shrink-0 ${
                                        isActive ? "btn-light" : "btn-outline-light"
                                    }`
                                }
                            >
                                Minha conta
                            </NavLink>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-grow-1">
                <div className="container py-4">
                    <Outlet />
                </div>
            </main>

            <footer className="border-top bg-white">
                <div className="container py-4 text-center">
                    <small className="text-muted">SIGIN Delivery</small>
                </div>
            </footer>
        </div>
    );
}

export default ClienteLayout;
