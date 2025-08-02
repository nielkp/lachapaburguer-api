import app from './app';
require('dotenv').config();

const PORT = process.env.API_PORT;

app.listen(PORT, () => console.log(`✅ SERVIDOR RODANDO ⚙️  PORTA: ${PORT} !`));
