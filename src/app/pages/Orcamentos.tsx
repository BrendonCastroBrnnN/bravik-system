import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { StatusBadge } from '../components/StatusBadge';
import { FileText, CheckCircle, XCircle, Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useOrcamentos, SituacaoOrcamento, Orcamento } from '../context/OrcamentosContext';
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
                Valor Total
              </label>
              <input type="text" value={form.valor} onChange={set('valor')} className={inputCls} placeholder="R$ 0,00" />
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

export function Orcamentos() {
  const navigate = useNavigate();
  const { orcamentos, cadastrarOrcamento, alterarSituacao, editar } = useOrcamentos();
  const { clientes } = useClientes();

  const { pedidos, criarPedidoDeOrcamento } = usePedidos();

  const [showNovoModal, setShowNovoModal] = useState(false);
  const [editando, setEditando] = useState<Orcamento | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | SituacaoOrcamento>('todos');

  const [novoOrcamento, setNovoOrcamento] = useState({
    cliente_id: '',
    produto: '',
    quantidade: '',
    valor: '',
    validade: '',
    observacoes: '',
  });

  const getNomeCliente = (clienteId: number) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };git

  const handleCriarOrcamento = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !novoOrcamento.cliente_id ||
      !novoOrcamento.produto ||
      !novoOrcamento.quantidade ||
      !novoOrcamento.valor ||
      !novoOrcamento.validade
    ) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    await cadastrarOrcamento({
      cliente_id: Number(novoOrcamento.cliente_id),
      numero: '',
      produto: novoOrcamento.produto,
      quantidade: Number(novoOrcamento.quantidade),
      valor: novoOrcamento.valor,
      data: new Date().toISOString().split('T')[0],
      validade: novoOrcamento.validade,
      situacao: 'pendente',
      observacoes: novoOrcamento.observacoes,
    });

    setNovoOrcamento({
      cliente_id: '',
      produto: '',
      quantidade: '',
      valor: '',
      validade: '',
      observacoes: '',
    });

    toast.success('Orçamento criado com sucesso!');
    setShowNovoModal(false);
  };

  const pendentes = orcamentos.filter((o) => o.situacao === 'pendente').length;
  const aprovados = orcamentos.filter((o) => o.situacao === 'aprovado').length;
  const rejeitados = orcamentos.filter((o) => o.situacao === 'rejeitado').length;

  const statusCards = [
    { icon: FileText, label: 'Pendentes', count: pendentes, color: 'bg-orange-500' },
    { icon: CheckCircle, label: 'Aprovados', count: aprovados, color: 'bg-green-500' },
    { icon: XCircle, label: 'Rejeitados', count: rejeitados, color: 'bg-red-500' },
  ];

  const handleAprovar = async (e: React.MouseEvent, orc: Orcamento) => {
    e.stopPropagation();

    await alterarSituacao(orc.id, 'aprovado');

    const novoPedido = await criarPedidoDeOrcamento({
      orcamento_id: orc.id,
      cliente_id: orc.cliente_id,
      numero: '',
      produto: orc.produto,
      quantidade: orc.quantidade,
      valor: orc.valor,
      data: new Date().toISOString().split('T')[0],
      prazo: orc.validade,
      status: 'aguardando',
      etapa_producao: 'aguardando_materia_prima',
    });

    if (!novoPedido) {
      toast.error('Orçamento aprovado, mas houve erro ao gerar o pedido.');
      return;
    }

    toast.success(`Orçamento ${orc.numero} aprovado e pedido ${novoPedido.numero} gerado.`);
  };

  const handleRejeitar = (e: React.MouseEvent, id: number, numero: string) => {
    e.stopPropagation();
    alterarSituacao(id, 'rejeitado');
    toast.error(`Orçamento ${numero} rejeitado.`);
  };

  const orcamentosFiltrados =
    filtroStatus === 'todos'
      ? orcamentos
      : orcamentos.filter((o) => o.situacao === filtroStatus);

  const filtros: { value: 'todos' | SituacaoOrcamento; label: string; active: string }[] = [
    { value: 'todos', label: 'Todos', active: 'bg-blue-600 text-white' },
    { value: 'pendente', label: 'Pendentes', active: 'bg-orange-600 text-white' },
    { value: 'aprovado', label: 'Aprovados', active: 'bg-green-600 text-white' },
    { value: 'rejeitado', label: 'Rejeitados', active: 'bg-red-600 text-white' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Orçamentos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie seus orçamentos
            </p>
          </div>

          <button
            onClick={() => setShowNovoModal(true)}
            className="flex items-center gap-2 h-12 px-6 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Novo Orçamento
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {filtros.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltroStatus(f.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtroStatus === f.value
                ? f.active
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {statusCards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">
                  {card.count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {card.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Nº</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Produto</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Qtd.</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Valor</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Validade</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Situação</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orcamentosFiltrados.map((orc) => (
                  <tr
                    key={orc.id}
                    onClick={() => navigate(`/orcamentos/${orc.numero}`)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {orc.numero}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {getNomeCliente(orc.cliente_id)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {orc.produto}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {orc.quantidade}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {orc.valor}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(orc.validade).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={orc.situacao} />
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-wrap gap-2">
                        {orc.situacao === 'pendente' && (
                          <>
                            <button
                              onClick={(e) => handleAprovar(e, orc)}
                              className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={(e) => handleRejeitar(e, orc.id, orc.numero)}
                              className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                            >
                              Rejeitar
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setEditando(orc)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                        >
                          <Pencil size={11} />
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {orcamentosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      Nenhum orçamento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {editando && (
          <EditModal
            orc={editando}
            onClose={() => setEditando(null)}
            onSave={(dados) => editar(editando.id, dados)}
          />
        )}

        {showNovoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Novo Orçamento
              </h2>

              <form onSubmit={handleCriarOrcamento} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cliente
                  </label>
                  <select
                    required
                    value={novoOrcamento.cliente_id}
                    onChange={(e) =>
                      setNovoOrcamento({ ...novoOrcamento, cliente_id: e.target.value })
                    }
                    className={inputCls}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Produto
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nome do produto"
                      value={novoOrcamento.produto}
                      onChange={(e) =>
                        setNovoOrcamento({ ...novoOrcamento, produto: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      value={novoOrcamento.quantidade}
                      onChange={(e) =>
                        setNovoOrcamento({ ...novoOrcamento, quantidade: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor Total
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="R$ 0,00"
                      value={novoOrcamento.valor}
                      onChange={(e) =>
                        setNovoOrcamento({ ...novoOrcamento, valor: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Validade
                    </label>
                    <input
                      type="date"
                      required
                      value={novoOrcamento.validade}
                      onChange={(e) =>
                        setNovoOrcamento({ ...novoOrcamento, validade: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Observações
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Observações sobre o orçamento..."
                    value={novoOrcamento.observacoes}
                    onChange={(e) =>
                      setNovoOrcamento({ ...novoOrcamento, observacoes: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNovoModal(false)}
                    className="h-11 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="h-11 px-6 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Criar Orçamento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}