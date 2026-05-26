import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Plus, Search, Filter, UserX, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClientes } from '../context/ClientesContext';

type FiltroStatus = 'todos' | 'ativos' | '30dias' | '60dias' | 'inativos';

const HOJE = new Date('2026-05-21');

function getDias(ultimaCompra: string) {
  return Math.floor((HOJE.getTime() - new Date(ultimaCompra).getTime()) / (1000 * 60 * 60 * 24));
}

function getStatus(ultimaCompra: string) {
  const d = getDias(ultimaCompra);
  if (d <= 30) return { label: 'Ativo', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', key: 'ativos' };
  if (d <= 60) return { label: '30 dias sem comprar', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300', key: '30dias' };
  if (d <= 90) return { label: '60 dias sem comprar', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', key: '60dias' };
  return { label: '90+ dias sem comprar', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', key: '90dias' };
}

function normalizar(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

const filtroOpcoes: { value: FiltroStatus; label: string }[] = [
  { value: 'todos', label: 'Todos os clientes' },
  { value: 'ativos', label: 'Ativos (até 30 dias)' },
  { value: '30dias', label: '30 dias sem comprar' },
  { value: '60dias', label: '60 dias sem comprar' },
  { value: 'inativos', label: 'Inativos' },
];

export function Clientes() {
  const navigate = useNavigate();
  const { clientes, cadastrarCliente, inativar, reativar } = useClientes();

  const [showModal, setShowModal] = useState(false);
  const [searchNome, setSearchNome] = useState('');
  const [searchCnpj, setSearchCnpj] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showConfirmInativo, setShowConfirmInativo] = useState(false);

  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    cnpj: '',
    responsavel: '',
    telefone: '',
    email: '',
    endereco: '',
  });

  const handleSalvarCliente = async () => {
    await cadastrarCliente({
      nome: novoCliente.nome,
      cnpj: novoCliente.cnpj,
      responsavel: novoCliente.responsavel,
      telefone: novoCliente.telefone,
      email: novoCliente.email,
      endereco: novoCliente.endereco,
      ultimaCompra: new Date().toISOString().split('T')[0],
      inativo: false,
      orcamentos: [],
      pedidos: [],
    });

    setNovoCliente({
      nome: '',
      cnpj: '',
      responsavel: '',
      telefone: '',
      email: '',
      endereco: '',
    });

    setShowModal(false);
  };

  const clientesFiltrados = clientes.filter((c) => {
    if (filtroStatus === 'inativos') return c.inativo;
    if (c.inativo) return false;

    const nomeOk = normalizar(c.nome).includes(normalizar(searchNome));
    const cnpjOk = c.cnpj.replace(/\D/g, '').includes(searchCnpj.replace(/\D/g, '').trim());
    if (!nomeOk || !cnpjOk) return false;

    if (filtroStatus === 'todos') return true;
    return getStatus(c.ultimaCompra).key === filtroStatus;
  });

  const toggleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === clientesFiltrados.length ? [] : clientesFiltrados.map((c) => c.id));
  };

  const handleConfirmarInativo = () => {
    inativar(selectedIds);
    setSelectedIds([]);
    setShowConfirmInativo(false);
  };

  const nomesParaInativar = clientes.filter((c) => selectedIds.includes(c.id)).map((c) => c.nome);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Clientes</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie seus clientes</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 h-12 px-6 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Novo Cliente
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          {/* Filtros */}
          <div className="flex flex-col lg:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchNome}
                onChange={(e) => setSearchNome(e.target.value)}
                placeholder="Buscar por nome..."
                className="w-full h-12 pl-10 pr-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchCnpj}
                onChange={(e) => setSearchCnpj(e.target.value)}
                placeholder="Buscar por CNPJ..."
                className="w-full lg:w-52 h-12 pl-10 pr-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              <select
                value={filtroStatus}
                onChange={(e) => { setFiltroStatus(e.target.value as FiltroStatus); setSelectedIds([]); }}
                className="w-full lg:w-56 h-12 pl-10 pr-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                {filtroOpcoes.map((op) => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Barra de ação inativar */}
          {selectedIds.length > 0 && filtroStatus !== 'inativos' && (
            <div className="mb-4 flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
              <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                {selectedIds.length} cliente{selectedIds.length > 1 ? 's' : ''} selecionado{selectedIds.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setShowConfirmInativo(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors ml-auto"
              >
                <UserX size={15} />
                Transferir para Inativo
              </button>
            </div>
          )}

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {filtroStatus !== 'inativos' && (
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={clientesFiltrados.length > 0 && selectedIds.length === clientesFiltrados.length}
                        onChange={toggleSelectAll}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">CNPJ</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Responsável</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Telefone</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Última Compra</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                  {filtroStatus === 'inativos' && (
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Ação</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={filtroStatus !== 'inativos' ? 7 : 7} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      Nenhum cliente encontrado
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cliente) => {
                    const status = getStatus(cliente.ultimaCompra);
                    const isSelected = selectedIds.includes(cliente.id);
                    return (
                      <tr
                        key={cliente.id}
                        onClick={() => navigate(`/clientes/${cliente.id}`)}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      >
                        {filtroStatus !== 'inativos' && (
                          <td className="px-4 py-4" onClick={(e) => toggleSelect(cliente.id, e)}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => { }}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                            />
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{cliente.nome}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{cliente.cnpj}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{cliente.responsavel}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{cliente.telefone}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {new Date(cliente.ultimaCompra).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4">
                          {cliente.inativo ? (
                            <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                              Inativo
                            </span>
                          ) : (
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                              {status.label}
                            </span>
                          )}
                        </td>
                        {filtroStatus === 'inativos' && (
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => reativar(cliente.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              Reativar
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal confirmação inativo */}
        {showConfirmInativo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transferir para Inativo</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Tem certeza que deseja transferir {nomesParaInativar.length > 1 ? 'os clientes' : 'o cliente'} abaixo para <strong>Inativo</strong>?
              </p>
              <ul className="mb-4 space-y-1">
                {nomesParaInativar.map((nome) => (
                  <li key={nome} className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {nome}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Clientes inativos não aparecem na listagem padrão. Use o filtro "Inativos" para visualizá-los ou reativá-los.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmInativo(false)}
                  className="h-11 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarInativo}
                  className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                >
                  Sim, transferir para Inativo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal novo cliente */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Novo Cliente</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Dados da Empresa</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Razão Social"
                      value={novoCliente.nome}
                      onChange={(e) =>
                        setNovoCliente({ ...novoCliente, nome: e.target.value })
                      }
                      className="h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input type="text" placeholder="Nome Fantasia" className="h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input
                      type="text"
                      placeholder="CNPJ"
                      value={novoCliente.cnpj}
                      onChange={(e) =>
                        setNovoCliente({ ...novoCliente, cnpj: e.target.value })
                      }
                      className="h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Contato</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
  type="email"
  placeholder="Email"
  value={novoCliente.email}
  onChange={(e) =>
    setNovoCliente({ ...novoCliente, email: e.target.value })
  }
  className="h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
                    <input
  type="tel"
  placeholder="Telefone"
  value={novoCliente.telefone}
  onChange={(e) =>
    setNovoCliente({ ...novoCliente, telefone: e.target.value })
  }
  className="h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Endereço</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="CEP" className="h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Cidade" className="h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button onClick={() => setShowModal(false)} className="h-12 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Cancelar
                  </button>
                  <button onClick={handleSalvarCliente} className="h-12 px-6 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                    Salvar Cliente
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
