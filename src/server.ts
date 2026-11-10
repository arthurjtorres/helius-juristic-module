import app from "./app";
import "dotenv/config";
import './database/connection';
import { assertJwtSecret } from './middlewares/Authentication';

// Falha ao subir se JWT_SECRET estiver ausente ou vazio
assertJwtSecret();

const PORT = process.env.PORT_API_IRREGULARIDADE || 2030;

app.listen(PORT, () => {
  console.log(`API Irregularidade rodando na porta ${PORT}`);
});