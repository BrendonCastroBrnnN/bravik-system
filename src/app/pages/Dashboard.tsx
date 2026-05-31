import { useClientes } from '../context/ClientesContext';
import { usePedidos } from '../context/PedidosContext';
import { useOrcamentos } from '../context/OrcamentosContext';
import { MainLayout } from '../components/layout/MainLayout';
import { Package, Factory, CheckCircle, Users, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '../components/StatusBadge';

export function Dashboard() {

  const { clientes } = useClientes();
  const { pedidos } = usePedidos();
  const { orcamentos } = useOrcamentos();

  const pedidosEmAberto = pedidos.filter((p) => p.status !== 'entregue').length;
  const pedidosEmProducao = pedidos.filter((p) => p.status === 'producao').length;
  const pedidosEntregues = pedidos.filter((p) => p.status === 'entregue').length;
  const clientesAtivos = clientes.filter((c) => !c.inativo).length;
  const orcamentosPendentes = orcamentos.filter((o) => o.situacao === 'pendente').length;

  const statsCards = [
    { icon: Package, label: 'Pedidos em aberto', value: String(pedidosEmAberto), color: 'bg-blue-500' },
    { icon: Factory, label: 'Em produção', value: String(pedidosEmProducao), color: 'bg-orange-500' },
    { icon: CheckCircle, label: 'Entregues', value: String(pedidosEntregues), color: 'bg-green-500' },
    { icon: Users, label: 'Clientes ativos', value: String(clientesAtivos), color: 'bg-purple-500' },
    { icon: FileText, label: 'Orçamentos pendentes', value: String(orcamentosPendentes), color: 'bg-yellow-500' },
  ];

  const ultimosPedidos = [...pedidos]
    .sort((a, b) => b.id - a.id)
    .slice(0, 10);

  const getNomeCliente = (clienteId: number) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente?.nome ?? 'Cliente não encontrado';
  };

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const chartData = meses.map((mes, index) => {
    const totalPedidos = pedidos.filter((pedido) => {
      const dataPedido = new Date(pedido.data);
      return dataPedido.getMonth() === index;
    }).length;

    return {
      id: mes.toLowerCase(),
      mes,
      pedidos: totalPedidos,
    };
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Resumo geral do sistema</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">{card.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{card.label}</div>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Pedidos por mês</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Line type="monotone" dataKey="pedidos" stroke="#2563EB" strokeWidth={3} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">Últimos pedidos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Pedido</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Produto</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Prazo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {ultimosPedidos.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{order.numero}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{getNomeCliente(order.cliente_id)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{order.produto}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{order.prazo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
