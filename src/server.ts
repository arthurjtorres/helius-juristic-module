import app from "./app";
import "dotenv/config";
import './database/connection';
import { assertJwtSecret } from './middlewares/Authentication';
import { assertRequiredEnv } from './utils/assertRequiredEnv';

// Falha ao subir se faltar variável obrigatória (lista só os nomes) ou se JWT_SECRET estiver vazio
assertRequiredEnv();
assertJwtSecret();

const PORT = process.env.PORT_API_IRREGULARIDADE || 2030;

app.listen(PORT, () => {
  console.log(`API Irregularidade rodando na porta ${PORT}`);
});