import axios from "axios";
import { attachServiceToken } from "./serviceToken";

export const axiosRegistry = axios.create({
  baseURL: `http://modulo-cadastro:${process.env.PORT_API_CADASTRO}`,
  timeout: 5000,
});

export const axiosControl = axios.create({
  baseURL: `http://modulo-controle:${process.env.PORT_API_CONTROLE}`,
  timeout: 5000,
});

/** Cliente do `operations` (veículos, locais, itinerários). Porta: `PORT_API_OPERACIONAL` (antes `PORT_API_ESCALA`). */
export const axiosOperations = axios.create({
  baseURL: `http://modulo-operacional:${process.env.PORT_API_OPERACIONAL}`,
  timeout: 5000,
});

attachServiceToken(axiosRegistry, "juristic");
attachServiceToken(axiosControl, "juristic");
attachServiceToken(axiosOperations, "juristic");
