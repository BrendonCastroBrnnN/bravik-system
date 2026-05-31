import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ClientesProvider } from './context/ClientesContext';
import { OrcamentosProvider } from './context/OrcamentosContext';
import { ProducaoProvider } from './context/ProducaoContext';
import { PedidosProvider } from './context/PedidosContext';
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
import { AuthProvider } from './context/AuthContext';

const originalError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('Encountered two children with the same key')) {
    return;
  }
  originalError(...args);
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    async function verificarSessao() {
      const { data } = await supabase.auth.getSession();

      setAutenticado(!!data.session);
      setLoading(false);
    }

    verificarSessao();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <ClientesProvider>
            <PedidosProvider>
              <OrcamentosProvider>
                <ProducaoProvider>
                  <BrowserRouter>
                    <Toaster position="top-right" richColors />

                    <Routes>
                      <Route path="/" element={<Navigate to="/login" replace />} />
                      <Route path="/login" element={<Login />} />

                      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
                      <Route path="/clientes/:id" element={<ProtectedRoute><ClienteDetalhes /></ProtectedRoute>} />
                      <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
                      <Route path="/pedidos/:id" element={<ProtectedRoute><PedidoDetalhes /></ProtectedRoute>} />
                      <Route path="/producao" element={<ProtectedRoute><Producao /></ProtectedRoute>} />
                      <Route path="/orcamentos" element={<ProtectedRoute><Orcamentos /></ProtectedRoute>} />
                      <Route path="/orcamentos/:id" element={<ProtectedRoute><OrcamentoDetalhes /></ProtectedRoute>} />
                      <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
                      <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
                    </Routes>

                  </BrowserRouter>
                </ProducaoProvider>
              </OrcamentosProvider>
            </PedidosProvider>
          </ClientesProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}