import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ClienteLayout from "./components/layout/ClienteLayout";

import Historico from "./pages/entrega/Historico";
import Cozinha from "./pages/cozinha/Cozinha";
import Lanchonete from "./pages/lanchonete/Lanchonete";
import Entrega from "./pages/entrega/Entrega";
import Balcao from "./pages/balcao/Balcao";
import PedidoTeste from "./pages/pedido/PedidoTeste";

import Cardapio from "./pages/cardapio/Cardapio";
import Carrinho from "./pages/cliente/Carrinho";
import Checkout from "./pages/cliente/Checkout";

import Identificacao from "./pages/cliente/Identificacao";
import MinhaConta from "./pages/cliente/MinhaConta";
import AcompanharPedido from "./pages/cliente/AcompanharPedido";

import MiniPdv from "./pages/minipdv/pages/MiniPdv";

import LoginOperacional from "./pages/operacional/LoginOperacional";
import RotaOperacional from "./pages/operacional/RotaOperacional";

function AcessoNegado() {
    return (
        <div className="container py-5">
            <div className="alert alert-danger">Acesso negado.</div>
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/login-operacional" element={<LoginOperacional />} />

            <Route path="/acesso-negado" element={<AcessoNegado />} />

            <Route element={<Layout />}>
                <Route path="/pedidoteste" element={<PedidoTeste />} />

                <Route path="/" element={<Navigate to="/login-operacional" replace />} />

                <Route
                    path="/balcao"
                    element={
                        <RotaOperacional perfil="DELIVERY_BALCAO">
                            <Balcao />
                        </RotaOperacional>
                    }
                />

                <Route
                    path="/cozinha"
                    element={
                        <RotaOperacional perfil="DELIVERY_COZINHA">
                            <Cozinha />
                        </RotaOperacional>
                    }
                />

                <Route
                    path="/pizzaria"
                    element={
                        <RotaOperacional perfil="DELIVERY_PIZZARIA">
                            <Lanchonete />
                        </RotaOperacional>
                    }
                />

                <Route
                    path="/entrega"
                    element={
                        <RotaOperacional perfil="DELIVERY_ENTREGA">
                            <Entrega />
                        </RotaOperacional>
                    }
                />

                <Route
                    path="/entrega/historico"
                    element={
                        <RotaOperacional perfil="DELIVERY_ENTREGA">
                            <Historico />
                        </RotaOperacional>
                    }
                />

                <Route
                    path="/minipdv"
                    element={
                        <RotaOperacional perfil="DELIVERY_MINIPDV">
                            <MiniPdv />
                        </RotaOperacional>
                    }
                />
            </Route>

            <Route element={<ClienteLayout />}>
                <Route path="/cardapio" element={<Cardapio />} />

                <Route path="/carrinho" element={<Carrinho />} />

                <Route path="/identificacao" element={<Identificacao />} />

                <Route path="/checkout" element={<Checkout />} />

                <Route path="/minha-conta" element={<MinhaConta />} />

                <Route path="/acompanhar-pedido" element={<AcompanharPedido />} />
            </Route>
        </Routes>
    );
}

export default App;
