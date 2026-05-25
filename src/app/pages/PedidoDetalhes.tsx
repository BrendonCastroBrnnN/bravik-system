import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ArrowLeft, Calendar, Package, User, Clock, Edit, Save } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { toast } from 'sonner';

const etapasProducao = ['Aguardando Matéria-Prima', 'Aguardando Liberação', 'Corte', 'Personalização', 'Costura', 'Expedição'] as const;

const pedidosData = {
  'PED-001': {
    numero: 'PED-001',
    cliente: 'Indústria ABC',
    produto: 'Peça X-100',
    quantidade: 500,
    valor: 'R$ 45.000,00',
    dataPedido: '2026-05-10',
    dataAprovacao: '2026-05-10',
    prazoEntrega: '2026-05-25',
    dataFinalizacao: '2026-05-24',
    status: 'entregue' as const,
    etapaAtual: 'Expedição',
    responsavel: 'Carlos Silva',
    observacoes: 'Cliente solicitou embalagem especial',
  },
  'PED-002': {
    numero: 'PED-002',
    cliente: 'Metalúrgica XYZ',
    produto: 'Componente Y-50',
    quantidade: 300,
    valor: 'R$ 28.500,00',
    dataPedido: '2026-04-15',
    dataAprovacao: '2026-04-16',
    prazoEntrega: '2026-05-20',
    dataFinalizacao: null,
    status: 'producao' as const,
    etapaAtual: 'Costura',
    responsavel: 'Pedro Santos',
    observacoes: 'Verificar especificações técnicas antes de iniciar',
  },
  'PED-003': {
    numero: 'PED-003',
    cliente: 'Fábrica Tech',
    produto: 'Peça Z-200',
    quantidade: 800,
    valor: 'R$ 67.200,00',
    dataPedido: '2026-05-05',
    dataAprovacao: null,
    prazoEntrega: '2026-06-05',
    dataFinalizacao: null,
    status: 'atrasado' as const,
    etapaAtual: null,
    responsavel: null,
    observacoes: 'Aguardando aprovação do orçamento',
  },
};

export function PedidoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pedido = pedidosData[id as keyof typeof pedidosData];

  const [etapaAtual, setEtapaAtual] = useState(pedido?.etapaAtual || 'Corte');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPedido, setEditedPedido] = useState({
    quantidade: pedido?.quantidade || 0,
    valor: pedido?.valor || '',
    prazoEntrega: pedido?.prazoEntrega || '',
    observacoes: pedido?.observacoes || '',
  });

  if (!pedido) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Pedido não encontrado</p>
        </div>
      </MainLayout>
    );
  }

  const calcularPrazoProducao = () => {
    if (!pedido.dataAprovacao || !pedido.dataFinalizacao) return null;
    const inicio = new Date(pedido.dataAprovacao);
    const fim = new Date(pedido.dataFinalizacao);
    const dias = Math.floor((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    return dias;
  };

  const handleMudarEtapa = (novaEtapa: string) => {
    setEtapaAtual(novaEtapa);
    toast.success(`Pedido movido para ${novaEtapa}`);
  };

  const handleSalvarEdicao = () => {
    toast.success('Alterações salvas com sucesso!');
    setIsEditing(false);
  };

  const prazoProducao = calcularPrazoProducao();

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
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{pedido.numero}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{pedido.cliente}</p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 h-12 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <Edit size={20} />
              Editar Pedido
            </button>
          ) : (
            <button
              onClick={handleSalvarEdicao}
              className="flex items-center gap-2 h-12 px-6 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              <Save size={20} />
              Salvar Alterações
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Package className="text-blue-600" size={24} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Produto</div>
            <div className="font-medium text-gray-900 dark:text-white">{pedido.produto}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Prazo de Entrega</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {new Date(pedido.prazoEntrega).toLocaleDateString('pt-BR')}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="text-orange-600" size={24} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Prazo de Produção</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {prazoProducao !== null ? `${prazoProducao} dias` : 'Em andamento'}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <User className="text-purple-600" size={24} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Responsável</div>
            <div className="font-medium text-gray-900 dark:text-white">{pedido.responsavel || 'Não atribuído'}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Informações do Pedido</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Quantidade</p>
              {isEditing ? (
                <input
                  type="number"
                  value={editedPedido.quantidade}
                  onChange={(e) => setEditedPedido({ ...editedPedido, quantidade: parseInt(e.target.value) })}
                  className="w-full h-10 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-medium">{pedido.quantidade} unidades</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Valor Total</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPedido.valor}
                  onChange={(e) => setEditedPedido({ ...editedPedido, valor: e.target.value })}
                  className="w-full h-10 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-medium">{pedido.valor}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Data do Pedido</p>
              <p className="text-gray-900 dark:text-white font-medium">{new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <StatusBadge status={pedido.status} />
            </div>
            {pedido.dataAprovacao && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Data de Aprovação</p>
                <p className="text-gray-900 dark:text-white font-medium">{new Date(pedido.dataAprovacao).toLocaleDateString('pt-BR')}</p>
              </div>
            )}
            {pedido.dataFinalizacao && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Data de Finalização</p>
                <p className="text-gray-900 dark:text-white font-medium">{new Date(pedido.dataFinalizacao).toLocaleDateString('pt-BR')}</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Observações</p>
            {isEditing ? (
              <textarea
                value={editedPedido.observacoes}
                onChange={(e) => setEditedPedido({ ...editedPedido, observacoes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{pedido.observacoes || 'Nenhuma observação'}</p>
            )}
          </div>
        </div>

        {pedido.status === 'producao' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Etapas de Produção</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {etapasProducao.map((etapa) => (
                <button
                  key={etapa}
                  onClick={() => handleMudarEtapa(etapa)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    etapaAtual === etapa
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="font-medium">{etapa}</div>
                  {etapaAtual === etapa && (
                    <div className="text-xs mt-1">Em andamento</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {pedido.status === 'atrasado' && !pedido.dataAprovacao && (
          <div className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">Aguardando Aprovação</h3>
            <p className="text-orange-800 dark:text-orange-200">Este pedido está aguardando aprovação do orçamento antes de entrar em produção.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
