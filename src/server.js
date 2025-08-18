import app from './app';
require('dotenv').config();

const PORT = process.env.API_PORT;

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
  console.error('🔧 A aplicação continuará rodando, mas verifique os logs.');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
  console.error('🔧 Promise:', promise);
  console.error('🔧 A aplicação continuará rodando, mas verifique os logs.');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM. Encerrando servidor graciosamente...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT. Encerrando servidor graciosamente...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`✅ SERVIDOR RODANDO ⚙️  PORTA: ${PORT} !`);
  console.log('🔧 Tratamento de erro ativado - a API não irá crashar por problemas de conexão com banco.');
});
