import { useContext } from "react";
import { CarrinhoContext } from "./CarrinhoContext";

export function useCarrinho() {
    return useContext(CarrinhoContext);
}
