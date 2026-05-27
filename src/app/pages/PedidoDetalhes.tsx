import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ArrowLeft, Calendar, Package, User, Clock } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { usePedidos } from '../context/PedidosContext';
import { useClientes } from '../context/ClientesContext';

export function PedidoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { pedidos, editarStatusPedido } = usePedidos();
  const { clientes } = useClientes();

  const pedido = pedidos.find((p) => p.numero === id);
  const cliente = pedido ? clientes.find((c) => c.id === pedido.cliente_id) : null;

  if (!pedido) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Pedido não encontrado</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/pedidos')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
            </button>

            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                {pedido.numero}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {cliente?.nome || 'Cliente não encontrado'}
              </p>
            </div>
          </div>

          <StatusBadge status={pedido.status} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Package className="text-blue-600" size={24} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Produto
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {pedido.produto}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Prazo de Entrega
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {new Date(pedido.prazo).toLocaleDateString('pt-BR')}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="text-orange-600" size={24} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Status
            </p>
            <div className="flex items-center gap-3">
              <StatusBadge status={pedido.status} />

              <select
                value={pedido.status}
                onChange={(e) =>
                  editarStatusPedido(
                    pedido.id,
                    e.target.value as 'aguardando' | 'producao' | 'entregue'
                  )
                }
                className="h-10 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="aguardando">Aguardando</option>
                <option value="producao">Produção</option>
                <option value="entregue">Entregue</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <User className="text-purple-600" size={24} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Cliente
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {cliente?.nome || 'Não encontrado'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Informações do Pedido
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Quantidade
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {pedido.quantidade} unidades
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Valor Total
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {pedido.valor}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Data do Pedido
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {new Date(pedido.data).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Prazo
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {new Date(pedido.prazo).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}