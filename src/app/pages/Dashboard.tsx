import { MainLayout } from '../components/layout/MainLayout';
import { Package, Factory, CheckCircle, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '../components/StatusBadge';

const statsCards = [
  { icon: Package, label: 'Pedidos em aberto', value: '128', color: 'bg-blue-500' },
  { icon: Factory, label: 'Em produção', value: '42', color: 'bg-orange-500' },
  { icon: CheckCircle, label: 'Entregues', value: '350', color: 'bg-green-500' },
  { icon: Users, label: 'Clientes', value: '89', color: 'bg-purple-500' },
];

const chartData = [
  { id: 'jan', mes: 'Jan', pedidos: 65 },
  { id: 'fev', mes: 'Fev', pedidos: 78 },
  { id: 'mar', mes: 'Mar', pedidos: 90 },
  { id: 'abr', mes: 'Abr', pedidos: 81 },
  { id: 'mai', mes: 'Mai', pedidos: 95 },
  { id: 'jun', mes: 'Jun', pedidos: 110 },
];

const recentOrders = [
  { id: 'PED-001', cliente: 'Indústria ABC', produto: 'Peça X-100', status: 'entregue' as const, prazo: '15/05/2026' },
  { id: 'PED-002', cliente: 'Metalúrgica XYZ', produto: 'Componente Y-50', status: 'producao' as const, prazo: '20/05/2026' },
  { id: 'PED-003', cliente: 'Fábrica Tech', produto: 'Peça Z-200', status: 'atrasado' as const, prazo: '05/05/2026' },
  { id: 'PED-004', cliente: 'Mecânica Plus', produto: 'Kit A-75', status: 'producao' as const, prazo: '25/05/2026' },
];

export function Dashboard() {
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{order.cliente}</td>
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
