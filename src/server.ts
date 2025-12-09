import app from "./app";
import "dotenv/config";
import './database/connection';

const PORT = process.env.PORT_API_IRREGULARIDADE || 2030;

app.listen(PORT, () => {
  console.log(`API Irregularidade rodando na porta ${PORT}`);
});