import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ClientesProvider } from './context/ClientesContext';
import { OrcamentosProvider } from './context/OrcamentosContext';
import { ProducaoProvider } from './context/ProducaoContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Clientes } from './pages/Clientes';
import { ClienteDetalhes } from './pages/ClienteDetalhes';
import { Pedidos } from './pages/Pedidos';
import { PedidoDetalhes } from './pages/PedidoDetalhes';
import { Producao } from './pages/Producao';
import { Orcamentos } from './pages/Orcamentos';
import { OrcamentoDetalhes } from './pages/OrcamentoDetalhes';
import { Relatorios } from './pages/Relatorios';
import { Configuracoes } from './pages/Configuracoes';

// Suprime avisos conhecidos do Recharts
const originalError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('Encountered two children with the same key')) {
    return;
  }
  originalError(...args);
};

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
      <ClientesProvider>
      <OrcamentosProvider>
      <ProducaoProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/:id" element={<ClienteDetalhes />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/pedidos/:id" element={<PedidoDetalhes />} />
        <Route path="/producao" element={<Producao />} />
        <Route path="/orcamentos" element={<Orcamentos />} />
        <Route path="/orcamentos/:id" element={<OrcamentoDetalhes />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </BrowserRouter>
      </ProducaoProvider>
      </OrcamentosProvider>
      </ClientesProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}