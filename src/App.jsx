import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Historico from "./pages/entrega/Historico";
import Cozinha from "./pages/cozinha/Cozinha";
import Entrega from "./pages/entrega/Entrega";
import Balcao from "./pages/balcao/Balcao";
import Lanchonete from "./pages/lanchonete/Lanchonete";
import PedidoTeste from "./pages/pedido/PedidoTeste";
import Cardapio from "./pages/cardapio/Cardapio";
import Carrinho from "./pages/cliente/Carrinho";
import Checkout from "./pages/cliente/Checkout";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/pedidoteste" element={<PedidoTeste />} />
                <Route path="/" element={<Navigate to="/cozinha" replace />} />
                <Route path="/balcao" element={<Balcao />} />
                <Route path="/lanchonete" element={<Lanchonete />} />
                <Route path="/cozinha" element={<Cozinha />} />
                <Route path="/entrega" element={<Entrega />} />
                <Route path="/entrega/historico" element={<Historico />} />
                <Route path="/cardapio" element={<Cardapio />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/checkout" element={<Checkout />} />
            </Route>
        </Routes>
    );
}

export default App;
