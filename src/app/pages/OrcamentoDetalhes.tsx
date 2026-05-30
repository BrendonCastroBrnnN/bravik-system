import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import {
  ArrowLeft,
  Package,
  Calendar,
  DollarSign,
  Pencil,
  CheckCircle,
  XCircle,
  RotateCcw,
  User,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { toast } from 'sonner';
import { useOrcamentos, Orcamento } from '../context/OrcamentosContext';
import { useClientes } from '../context/ClientesContext';
import { usePedidos } from '../context/PedidosContext';


const inputCls =
  'w-full h-11 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500';

interface EditModalProps {
  orc: Orcamento;
  onClose: () => void;
  onSave: (dados: Partial<Omit<Orcamento, 'id' | 'created_at'>>) => void;
}

function EditModal({ orc, onClose, onSave }: EditModalProps) {
  const { clientes } = useClientes();

  const [form, setForm] = useState({
    cliente_id: String(orc.cliente_id),
    produto: orc.produto,
    quantidade: String(orc.quantidade),
    valor: orc.valor,
    data: orc.data,
    validade: orc.validade,
    observacoes: orc.observacoes ?? '',
  });

  const set =
    (k: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = () => {
    onSave({
      cliente_id: Number(form.cliente_id),
      produto: form.produto,
      quantidade: Number(form.quantidade),
      valor: form.valor,
      data: form.data,
      validade: form.validade,
      observacoes: form.observacoes,
    });

    toast.success(`Orçamento ${orc.numero} atualizado.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Editar {orc.numero}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cliente
              </label>
              <select value={form.cliente_id} onChange={set('cliente_id')} className={inputCls}>
                {clientes
                  .filter((cliente) => !cliente.inativo)
                  .map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Produto
              </label>
              <input type="text" value={form.produto} onChange={set('produto')} className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantidade
              </label>
              <input type="number" value={form.quantidade} onChange={set('quantidade')} className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor
              </label>
              <input type="text" value={form.valor} onChange={set('valor')} className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data
              </label>
              <input type="date" value={form.data} onChange={set('data')} className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Validade
              </label>
              <input type="date" value={form.validade} onChange={set('validade')} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Observações
            </label>
            <textarea
              value={form.observacoes}
              onChange={set('observacoes')}
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observações sobre o orçamento..."
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="h-11 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="h-11 px-6 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

export function OrcamentoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { orcamentos, alterarSituacao, editar } = useOrcamentos();
  const { clientes } = useClientes();

  const { pedidos, criarPedidoDeOrcamento, atualizarPedidoPorOrcamento } = usePedidos();

  const [showEdit, setShowEdit] = useState(false);

  const orcamento = orcamentos.find((o) => o.numero === id);
  const cliente = orcamento
    ? clientes.find((c) => c.id === orcamento.cliente_id)
    : null;

  if (!orcamento) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Orçamento não encontrado
          </p>
        </div>
      </MainLayout>
    );
  }

  const calcularPrazoPedido = () => {
    return orcamento.validade;
  };

  const handleAprovar = async () => {
    await alterarSituacao(orcamento.id, 'aprovado');

    const novoPedido = await criarPedidoDeOrcamento({
      orcamento_id: orcamento.id,
      cliente_id: orcamento.cliente_id,
      numero: '',
      produto: orcamento.produto,
      quantidade: orcamento.quantidade,
      valor: orcamento.valor,
      data: new Date().toISOString().split('T')[0],
      prazo: calcularPrazoPedido(),
      status: 'aguardando',
      etapa_producao: 'aguardando_materia_prima',
    });

    if (!novoPedido) {
      toast.error('Orçamento aprovado, mas houve erro ao gerar o pedido.');
      return;
    }

    toast.success(`Orçamento ${orcamento.numero} aprovado e pedido ${novoPedido.numero} gerado.`);

    navigate(`/pedidos/${novoPedido.numero}`);
  };

  const handleRejeitar = async () => {
    await alterarSituacao(orcamento.id, 'rejeitado');
    toast.error(`Orçamento ${orcamento.numero} rejeitado.`);
  };

  const handleVoltarPendente = async () => {
    await alterarSituacao(orcamento.id, 'pendente');
    toast.info(`Orçamento ${orcamento.numero} retornado para pendente.`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/orcamentos')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
            >
              <ArrowLeft size={24} />
            </button>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {orcamento.numero}
                </h1>
                <StatusBadge status={orcamento.situacao} />
              </div>

              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {cliente?.nome || 'Cliente não encontrado'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Pencil size={16} />
            Editar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
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

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Package className="text-blue-600" size={24} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Produto
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {orcamento.produto}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Validade
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {new Date(orcamento.validade).toLocaleDateString('pt-BR')}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="text-emerald-600" size={24} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Valor
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {orcamento.valor}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Detalhes do Orçamento
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Quantidade
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {orcamento.quantidade} unidades
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Data do Orçamento
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {new Date(orcamento.data).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Validade
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {new Date(orcamento.validade).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Situação
              </p>
              <StatusBadge status={orcamento.situacao} />
            </div>
          </div>

          {orcamento.observacoes && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Observações
              </p>
              <p className="text-gray-900 dark:text-white">
                {orcamento.observacoes}
              </p>
            </div>
          )}
        </div>

        {orcamento.situacao === 'pendente' && (
          <div className="flex gap-3 justify-end flex-wrap">
            <button
              onClick={handleRejeitar}
              className="flex items-center gap-2 h-12 px-6 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-xl font-medium hover:bg-red-200 transition-colors"
            >
              <XCircle size={18} />
              Rejeitar Orçamento
            </button>

            <button
              onClick={handleAprovar}
              className="flex items-center gap-2 h-12 px-6 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={18} />
              Aprovar Orçamento
            </button>
          </div>
        )}

        {orcamento.situacao === 'rejeitado' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Orçamento Rejeitado
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Você pode retornar este orçamento para pendente ou aprová-lo diretamente.
            </p>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleVoltarPendente}
                className="flex items-center gap-2 h-11 px-5 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-xl font-medium hover:bg-orange-200 transition-colors"
              >
                <RotateCcw size={16} />
                Retornar para Pendente
              </button>

              <button
                onClick={handleAprovar}
                className="flex items-center gap-2 h-11 px-5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={16} />
                Aprovar Diretamente
              </button>
            </div>
          </div>
        )}
      </div>

      {showEdit && (
        <EditModal
          orc={orcamento}
          onClose={() => setShowEdit(false)}
          onSave={async (dados) => {
            await editar(orcamento.id, dados);

            if (orcamento.situacao === 'aprovado') {
              await atualizarPedidoPorOrcamento(orcamento.id, {
                cliente_id: dados.cliente_id ?? orcamento.cliente_id,
                produto: dados.produto ?? orcamento.produto,
                quantidade: dados.quantidade ?? orcamento.quantidade,
                valor: dados.valor ?? orcamento.valor,
              });
            }
          }}
        />
      )}
    </MainLayout>
  );
}