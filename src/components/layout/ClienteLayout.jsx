import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { EMPRESA } from "../../config/empresa";

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
    const [compacto, setCompacto] = useState(false);

    useEffect(() => {
        function atualizarCarrinho() {
            setQuantidadeCarrinho(obterQuantidadeCarrinho());
        }

        function atualizarCliente() {
            setCliente(obterCliente());
        }

        function atualizarScroll() {
            setCompacto(window.scrollY > 40);
        }

        atualizarScroll();

        window.addEventListener("storage", atualizarCarrinho);
        window.addEventListener("carrinhoAtualizado", atualizarCarrinho);
        window.addEventListener("clienteAtualizado", atualizarCliente);
        window.addEventListener("scroll", atualizarScroll, { passive: true });

        return () => {
            window.removeEventListener("storage", atualizarCarrinho);
            window.removeEventListener("carrinhoAtualizado", atualizarCarrinho);
            window.removeEventListener("clienteAtualizado", atualizarCliente);
            window.removeEventListener("scroll", atualizarScroll);
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

    function classeNavegacao({ isActive }) {
        return `btn btn-sm rounded-pill flex-shrink-0 ${
            isActive ? "btn-light" : "btn-outline-light"
        }`;
    }

    return (
        <div className="min-vh-100 bg-light d-flex flex-column">
            <header
                className="bg-dark text-white shadow-sm sticky-top"
                style={{
                    zIndex: 1030,
                    transition: "all 0.25s ease"
                }}
            >
                <div className="container">
                    {!compacto ? (
                        <>
                            {/* HEADER EXPANDIDO */}
                            <div className="d-flex align-items-center justify-content-between py-3 gap-3">
                                <NavLink
                                    to="/cardapio"
                                    className="text-white text-decoration-none flex-shrink-0"
                                >
                                    <div className="d-flex align-items-center gap-2">
                                        {EMPRESA.logo ? (
                                            <img
                                                src={EMPRESA.logo}
                                                alt={EMPRESA.nome}
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                    objectFit: "contain"
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="d-flex align-items-center justify-content-center bg-white text-dark rounded-3 fw-bold"
                                                style={{
                                                    width: "42px",
                                                    height: "42px"
                                                }}
                                            >
                                                RC
                                            </div>
                                        )}

                                        <div>
                                            <div className="fw-bold fs-5">
                                                {EMPRESA.nome}
                                            </div>

                                            <div className="small text-white-50">
                                                {EMPRESA.descricao}
                                            </div>
                                        </div>
                                    </div>
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
                                            onClick={() =>
                                                navigate("/identificacao")
                                            }
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

                                        <span className="d-none d-sm-inline ms-2">
                                            Carrinho
                                        </span>

                                        <span className="ms-2 badge text-bg-light">
                                            {quantidadeCarrinho}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* NAVEGAÇÃO EXPANDIDA */}
                            <nav
                                className="d-flex gap-2 overflow-auto pb-3"
                                aria-label="Navegação principal"
                            >
                                <NavLink
                                    to="/cardapio"
                                    className={classeNavegacao}
                                >
                                    Cardápio
                                </NavLink>

                                {cliente && (
                                    <NavLink
                                        to="/minha-conta"
                                        className={classeNavegacao}
                                    >
                                        Minha conta
                                    </NavLink>
                                )}

                                {cliente && (
                                    <NavLink
                                        to="/acompanhar-pedido"
                                        className={classeNavegacao}
                                    >
                                        Meus pedidos
                                    </NavLink>
                                )}

                                <NavLink
                                    to="/carrinho"
                                    className={classeNavegacao}
                                >
                                    Carrinho
                                </NavLink>
                            </nav>
                        </>
                    ) : (
                        /* HEADER COMPACTO AO ROLAR */
                        <div
                            className="d-flex align-items-center gap-2 py-2"
                            style={{
                                minHeight: "52px"
                            }}
                        >
                            {/* MARCA */}
                            <NavLink
                                to="/cardapio"
                                className="text-white text-decoration-none fw-bold flex-shrink-0"
                            >
                                <span className="d-none d-md-inline">
                                    {EMPRESA.nome}
                                </span>

                                <span className="d-md-none">
                                    {EMPRESA.nome}
                                </span>
                            </NavLink>

                            <span className="text-white-50">|</span>

                            {/* CARDÁPIO */}
                            <NavLink
                                to="/cardapio"
                                className={({ isActive }) =>
                                    `text-decoration-none flex-shrink-0 ${
                                        isActive
                                            ? "text-white fw-semibold"
                                            : "text-white-50"
                                    }`
                                }
                            >
                                Cardápio
                            </NavLink>

                            {cliente && (
                                <>
                                    <span className="text-white-50">|</span>

                                    <NavLink
                                        to="/minha-conta"
                                        className={({ isActive }) =>
                                            `text-decoration-none flex-shrink-0 ${
                                                isActive
                                                    ? "text-white fw-semibold"
                                                    : "text-white-50"
                                            }`
                                        }
                                    >
                                        Minha conta
                                    </NavLink>

                                    <span className="text-white-50">|</span>

                                    <NavLink
                                        to="/acompanhar-pedido"
                                        className={({ isActive }) =>
                                            `text-decoration-none flex-shrink-0 ${
                                                isActive
                                                    ? "text-white fw-semibold"
                                                    : "text-white-50"
                                            }`
                                        }
                                    >
                                        Meus pedidos
                                    </NavLink>
                                </>
                            )}

                            <span className="text-white-50">|</span>

                            {/* CARRINHO */}
                            <button
                                type="button"
                                className="btn btn-link text-white text-decoration-none p-0 flex-shrink-0"
                                onClick={() => navigate("/carrinho")}
                            >
                                Carrinho
                                <span className="badge text-bg-success ms-1">
                                    {quantidadeCarrinho}
                                </span>
                            </button>

                            {/* ESPAÇO FLEXÍVEL */}
                            <div className="flex-grow-1" />

                            {/* CLIENTE */}
                            {cliente ? (
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-link text-white text-decoration-none p-0 flex-shrink-0 d-none d-sm-inline"
                                        onClick={() =>
                                            navigate("/minha-conta")
                                        }
                                    >
                                        Olá, {primeiroNome || "cliente"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-warning rounded-pill flex-shrink-0"
                                        onClick={sair}
                                    >
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-light rounded-pill flex-shrink-0"
                                    onClick={() =>
                                        navigate("/identificacao")
                                    }
                                >
                                    Entrar
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-grow-1">
                <div className="container py-4">
                    <Outlet />
                </div>
            </main>

            <footer className="border-top bg-white">
                <div className="container py-4 text-center">
                    <small className="text-muted">
                        {EMPRESA.nome} · {EMPRESA.descricao}
                    </small>
                </div>
            </footer>
        </div>
    );
}

export default ClienteLayout;
