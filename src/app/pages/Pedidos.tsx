import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Plus } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { usePedidos } from '../context/PedidosContext';
import { useClientes } from '../context/ClientesContext';

const statusCards = [
  { label: 'Em orçamento', count: 12, color: 'bg-yellow-500', statusValue: 'pendente' },
  { label: 'Produção', count: 42, color: 'bg-blue-500', statusValue: 'producao' },
  { label: 'Finalizados', count: 85, color: 'bg-green-500', statusValue: 'atrasado' },
  { label: 'Entregues', count: 350, color: 'bg-purple-500', statusValue: 'entregue' },
];

export function Pedidos() {
  const [showModal, setShowModal] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const navigate = useNavigate();

  const { pedidos, cadastrarPedido } = usePedidos();
  const { clientes } = useClientes();

  const [novoPedido, setNovoPedido] = useState({
    cliente_id: '',
    produto: '',
    quantidade: '',
    valor: '',
    prazo: '',
  });

  const getNomeCliente = (clienteId: number) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const pedidosFiltrados = filtroStatus === 'todos'
    ? pedidos
    : pedidos.filter(p => p.status === filtroStatus);

  const gerarNumeroPedido = () => {
    const proximoNumero = pedidos.length + 1;
    return `PED-${String(proximoNumero).padStart(3, '0')}`;
  };

  const handleCriarPedido = async () => {
    if (
      !novoPedido.cliente_id ||
      !novoPedido.produto ||
      !novoPedido.quantidade ||
      !novoPedido.valor ||
      !novoPedido.prazo
    ) {
      return;
    }

    await cadastrarPedido({
      cliente_id: Number(novoPedido.cliente_id),
      numero: gerarNumeroPedido(),
      produto: novoPedido.produto,
      quantidade: Number(novoPedido.quantidade),
      valor: novoPedido.valor,
      data: new Date().toISOString().split('T')[0],
      prazo: novoPedido.prazo,
      status: 'aguardando',
      etapa_producao: 'aguardando_materia_prima',
    });

    setNovoPedido({
      cliente_id: '',
      produto: '',
      quantidade: '',
      valor: '',
      prazo: '',
    });

    setShowModal(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Pedidos</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie todos os pedidos</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 h-12 px-6 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Novo Pedido
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFiltroStatus('todos')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtroStatus === 'todos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroStatus('aguardando')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtroStatus === 'aguardando'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            Aguardando
          </button>
          <button
            onClick={() => setFiltroStatus('producao')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtroStatus === 'producao'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            Produção
          </button>
          <button
            onClick={() => setFiltroStatus('atrasado')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtroStatus === 'atrasado'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            Finalizados
          </button>
          <button
            onClick={() => setFiltroStatus('entregue')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtroStatus === 'entregue'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            Entregues
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statusCards.map((card) => (
            <div key={card.label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                <span className="text-white text-xl font-semibold">{card.count}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Nº</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Produto</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Quantidade</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Prazo</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {pedidosFiltrados.map((pedido) => (
                  <tr
                    key={pedido.numero}
                    onClick={() => navigate(`/pedidos/${pedido.numero}`)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{pedido.numero}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {getNomeCliente(pedido.cliente_id)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{pedido.produto}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{pedido.quantidade}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{pedido.prazo}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={pedido.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Novo Pedido</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente</label>
                  <select
                    value={novoPedido.cliente_id}
                    onChange={(e) =>
                      setNovoPedido({ ...novoPedido, cliente_id: e.target.value })
                    }
                    className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes
                      .filter((cliente) => !cliente.inativo)
                      .map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Produto</label>
                    <input
                      type="text"
                      placeholder="Nome do produto"
                      value={novoPedido.produto}
                      onChange={(e) =>
                        setNovoPedido({ ...novoPedido, produto: e.target.value })
                      }
                      className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantidade</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={novoPedido.quantidade}
                      onChange={(e) =>
                        setNovoPedido({ ...novoPedido, quantidade: e.target.value })
                      }
                      className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor</label>
                    <input
                      type="text"
                      placeholder="R$ 0,00"
                      value={novoPedido.valor}
                      onChange={(e) =>
                        setNovoPedido({ ...novoPedido, valor: e.target.value })
                      }
                      className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prazo</label>
                    <input
                      type="date"
                      value={novoPedido.prazo}
                      onChange={(e) =>
                        setNovoPedido({ ...novoPedido, prazo: e.target.value })
                      }
                      className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observação</label>
                  <textarea
                    rows={3}
                    placeholder="Observações adicionais..."
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="h-12 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCriarPedido}
                    className="h-12 px-6 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Criar Pedido
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
