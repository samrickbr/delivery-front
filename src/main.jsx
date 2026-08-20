import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { CarrinhoProvider } from "./context/CarrinhoProvider";


createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
        <CarrinhoProvider>
            <App />
        </CarrinhoProvider>
        </BrowserRouter>
    </StrictMode>
);