import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePedidos, Pedido } from '../context/PedidosContext';
import { useClientes } from '../context/ClientesContext';
import { useAuth } from '../context/AuthContext';

const etapasProducao = [
  {
    key: 'aguardando_materia_prima',
    title: 'Aguardando Matéria-Prima',
    labelCurto: 'Mat. Prima',
    colorClass: 'bg-gray-500',
  },
  {
    key: 'liberacao',
    title: 'Aguardando Liberação',
    labelCurto: 'Liberação',
    colorClass: 'bg-yellow-500',
  },
  {
    key: 'corte',
    title: 'Corte',
    labelCurto: 'Corte',
    colorClass: 'bg-purple-500',
  },
  {
    key: 'personalizacao',
    title: 'Personalização',
    labelCurto: 'Personal.',
    colorClass: 'bg-pink-500',
  },
  {
    key: 'costura',
    title: 'Costura',
    labelCurto: 'Costura',
    colorClass: 'bg-blue-500',
  },
  {
    key: 'expedicao',
    title: 'Expedição',
    labelCurto: 'Expedição',
    colorClass: 'bg-green-500',
  },
  {
    key: 'concluido',
    title: 'Concluído',
    labelCurto: 'Concluído',
    colorClass: 'bg-emerald-500',
  },
];

function KanbanCard({
  pedido,
  clienteNome,
  podeEditar,
  onClick,
  onChangeEtapa,
}: {
  pedido: Pedido;
  clienteNome: string;
  podeEditar: boolean;
  onClick: () => void;
  onChangeEtapa: (etapa: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div onClick={onClick} className="cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {pedido.numero}
          </span>
          <span className="text-xs bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg">
            {pedido.quantidade} un
          </span>
        </div>

        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          {clienteNome}
        </h3>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <User size={14} />
            <span>{pedido.produto}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Clock size={14} />
            <span>{new Date(pedido.prazo).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {podeEditar ? (
        <select
          value={pedido.etapa_producao}
          onChange={(e) => onChangeEtapa(e.target.value)}
          className="w-full h-9 px-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {etapasProducao.map((etapa) => (
            <option key={etapa.key} value={etapa.key}>
              {etapa.title}
            </option>
          ))}
        </select>
      ) : (
        <div className="w-full h-9 px-2 flex items-center bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-xs">
          {etapasProducao.find((etapa) => etapa.key === pedido.etapa_producao)?.title || 'Etapa não encontrada'}
        </div>
      )}
    </div>
  );
}

export function Producao() {
  const navigate = useNavigate();
  const { pedidos, editarEtapaProducao } = usePedidos();
  console.log('PEDIDOS NA PRODUÇÃO:', pedidos);
  const { clientes } = useClientes();

  const { isAdmin, isProducao } = useAuth();

  const podeEditarProducao = isAdmin || isProducao;

  const [filtroEtapa, setFiltroEtapa] = useState<string>('todos');

  const pedidosEmProducao = pedidos;

  const getNomeCliente = (clienteId: number) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const getPedidosPorEtapa = (etapa: string) => {
    return pedidosEmProducao.filter(
      (pedido) => pedido.etapa_producao === etapa
    );
  };

  const colunasFiltradas =
    filtroEtapa === 'todos'
      ? etapasProducao
      : etapasProducao.filter((etapa) => etapa.key === filtroEtapa);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Produção
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Acompanhe o fluxo de produção
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFiltroEtapa('todos')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtroEtapa === 'todos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            Todos
          </button>

          {etapasProducao.map((etapa) => (
            <button
              key={etapa.key}
              onClick={() => setFiltroEtapa(etapa.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtroEtapa === etapa.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {etapa.title} ({getPedidosPorEtapa(etapa.key).length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {colunasFiltradas.map((etapa) => {
            const pedidosDaEtapa = getPedidosPorEtapa(etapa.key);

            return (
              <div
                key={etapa.key}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 ${etapa.colorClass} rounded-full`} />
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {etapa.title}
                  </h2>
                  <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg">
                    {pedidosDaEtapa.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {pedidosDaEtapa.map((pedido) => (
                    <KanbanCard
                      key={pedido.id}
                      pedido={pedido}
                      clienteNome={getNomeCliente(pedido.cliente_id)}
                      podeEditar={podeEditarProducao}
                      onClick={() => navigate(`/pedidos/${pedido.numero}`)}
                      onChangeEtapa={(novaEtapa) =>
                        editarEtapaProducao(pedido.id, novaEtapa)
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}