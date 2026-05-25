import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { StatusBadge } from '../components/StatusBadge';
import { FileText, CheckCircle, XCircle, Plus, Clock, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useOrcamentos, diasDesde, SituacaoOrcamento, Orcamento } from '../context/OrcamentosContext';

function DiasTag({ dias }: { dias: number }) {
  const urgency = dias >= 10 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    : dias >= 5 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${urgency}`}>
      <Clock size={11} />
      {dias}d pendente
    </span>
  );
}

const inputCls = 'w-full h-11 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500';

interface EditModalProps {
  orc: Orcamento;
  onClose: () => void;
  onSave: (dados: Partial<Omit<Orcamento, 'id' | 'numero'>>) => void;
}

function EditModal({ orc, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState({
    cliente: orc.cliente,
    produto: orc.produto,
    quantidade: String(orc.quantidade),
    valorUnitario: orc.valorUnitario,
    valorTotal: orc.valorTotal,
    prazoEntrega: orc.prazoEntrega,
    condicoesPagamento: orc.condicoesPagamento,
    observacoes: orc.observacoes,
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = () => {
    onSave({ ...form, quantidade: Number(form.quantidade) });
    toast.success(`Orçamento ${orc.numero} atualizado.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Editar {orc.numero}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
              <select value={form.cliente} onChange={set('cliente')} className={inputCls}>
                <option>Indústria ABC</option>
                <option>Metalúrgica XYZ</option>
                <option>Fábrica Tech</option>
                <option>Mecânica Plus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Produto</label>
              <input type="text" value={form.produto} onChange={set('produto')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantidade</label>
              <input type="number" value={form.quantidade} onChange={set('quantidade')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Unitário</label>
              <input type="text" value={form.valorUnitario} onChange={set('valorUnitario')} className={inputCls} placeholder="R$ 0,00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Total</label>
              <input type="text" value={form.valorTotal} onChange={set('valorTotal')} className={inputCls} placeholder="R$ 0,00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prazo de Entrega</label>
              <input type="text" value={form.prazoEntrega} onChange={set('prazoEntrega')} className={inputCls} placeholder="ex: 30 dias" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condições de Pagamento</label>
              <select value={form.condicoesPagamento} onChange={set('condicoesPagamento')} className={inputCls}>
                <option>À vista</option>
                <option>30 dias</option>
                <option>30/60 dias</option>
                <option>30/60/90 dias</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observações</label>
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
          <button onClick={onClose} className="h-11 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="h-11 px-6 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

export function Orcamentos() {
  const navigate = useNavigate();
  const { orcamentos, alterarSituacao, editar } = useOrcamentos();
  const [showNovoModal, setShowNovoModal] = useState(false);
  const [editando, setEditando] = useState<Orcamento | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | SituacaoOrcamento>('todos');

  const pendentes = orcamentos.filter((o) => o.situacao === 'pendente').length;
  const aprovados = orcamentos.filter((o) => o.situacao === 'aprovado').length;
  const rejeitados = orcamentos.filter((o) => o.situacao === 'rejeitado').length;

  const statusCards = [
    { icon: FileText, label: 'Pendentes', count: pendentes, color: 'bg-orange-500' },
    { icon: CheckCircle, label: 'Aprovados', count: aprovados, color: 'bg-green-500' },
    { icon: XCircle, label: 'Rejeitados', count: rejeitados, color: 'bg-red-500' },
  ];

  const handleAprovar = (e: React.MouseEvent, id: number, numero: string) => {
    e.stopPropagation();
    alterarSituacao(id, 'aprovado');
    toast.success(`Orçamento ${numero} aprovado e enviado para Pedidos!`);
  };

  const handleRejeitar = (e: React.MouseEvent, id: number, numero: string) => {
    e.stopPropagation();
    alterarSituacao(id, 'rejeitado');
    toast.error(`Orçamento ${numero} rejeitado.`);
  };

  const orcamentosFiltrados = filtroStatus === 'todos'
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
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Orçamentos</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie seus orçamentos</p>
          </div>
          <button
            onClick={() => setShowNovoModal(true)}
            className="flex items-center gap-2 h-12 px-6 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Novo Orçamento
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3">
          {filtros.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltroStatus(f.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtroStatus === f.value
                  ? f.active
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards de contagem */}
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
                <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">{card.count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{card.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tabela */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Nº</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Produto</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Qtd.</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Valor Total</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Situação</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orcamentosFiltrados.map((orc) => {
                  const dias = diasDesde(orc.dataCriacao);
                  return (
                    <tr
                      key={orc.numero}
                      onClick={() => navigate(`/orcamentos/${orc.numero}`)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{orc.numero}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{orc.cliente}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{orc.produto}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{orc.quantidade}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{orc.valorTotal}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <StatusBadge status={orc.situacao} />
                          {orc.situacao === 'pendente' && <DiasTag dias={dias} />}
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap gap-2">
                          {orc.situacao === 'pendente' && (
                            <>
                              <button
                                onClick={(e) => handleAprovar(e, orc.id, orc.numero)}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal editar */}
        {editando && (
          <EditModal
            orc={editando}
            onClose={() => setEditando(null)}
            onSave={(dados) => editar(editando.id, dados)}
          />
        )}

        {/* Modal novo orçamento */}
        {showNovoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Novo Orçamento</h2>
              <form onSubmit={(e) => { e.preventDefault(); toast.success('Orçamento criado com sucesso!'); setShowNovoModal(false); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente</label>
                  <select required className={inputCls}>
                    <option value="">Selecione um cliente</option>
                    <option>Indústria ABC</option>
                    <option>Metalúrgica XYZ</option>
                    <option>Fábrica Tech</option>
                    <option>Mecânica Plus</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Produto</label>
                    <input type="text" required placeholder="Nome do produto" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantidade</label>
                    <input type="number" required placeholder="0" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor Unitário</label>
                    <input type="text" required placeholder="R$ 0,00" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prazo de Entrega</label>
                    <input type="text" required placeholder="ex: 30 dias" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações</label>
                  <textarea rows={3} placeholder="Observações sobre o orçamento..." className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condições de Pagamento</label>
                  <select required className={inputCls}>
                    <option value="">Selecione</option>
                    <option>À vista</option>
                    <option>30 dias</option>
                    <option>30/60 dias</option>
                    <option>30/60/90 dias</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button type="button" onClick={() => setShowNovoModal(false)} className="h-11 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="h-11 px-6 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
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
