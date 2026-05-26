import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, User, UserX, UserCheck, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { useClientes } from '../context/ClientesContext';

export function ClienteDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clientes, editarCliente, inativar, reativar } = useClientes();
  const [showConfirmInativo, setShowConfirmInativo] = useState(false);

  const [editando, setEditando] = useState(false);

  const [formCliente, setFormCliente] = useState({
    nome: '',
    cnpj: '',
    responsavel: '',
    telefone: '',
    email: '',
    endereco: '',
  });

  const cliente = clientes.find((c) => c.id === Number(id));

  useEffect(() => {
    if (cliente) {
      setFormCliente({
        nome: cliente.nome,
        cnpj: cliente.cnpj,
        responsavel: cliente.responsavel,
        telefone: cliente.telefone,
        email: cliente.email,
        endereco: cliente.endereco,
      });
    }
  }, [cliente]);

  if (!cliente) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Cliente não encontrado</p>
        </div>
      </MainLayout>
    );
  }

  const orcamentosPendentes = cliente.orcamentos.filter((o) => o.situacao === 'pendente');
  const pedidosAtivos = cliente.pedidos.filter((p) => p.status === 'producao');

  const handleConfirmarInativo = () => {
    inativar([cliente.id]);
    setShowConfirmInativo(false);
  };

  const handleSalvarEdicao = async () => {
    await editarCliente(cliente.id, {
      nome: formCliente.nome,
      cnpj: formCliente.cnpj,
      responsavel: formCliente.responsavel,
      telefone: formCliente.telefone,
      email: formCliente.email,
      endereco: formCliente.endereco,
    });

    setEditando(false);
  };


  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/clientes')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{cliente.nome}</h1>
                {cliente.inativo && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-full">
                    Inativo
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">CNPJ: {cliente.cnpj}</p>
            </div>
          </div>

          {/* Botão inativar ou reativar */}
          <div className="flex items-center gap-3 flex-wrap">
            {editando ? (
              <>
                <button
                  onClick={() => setEditando(false)}
                  className="h-11 px-5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvarEdicao}
                  className="h-11 px-5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  Salvar Alterações
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditando(true)}
                className="h-11 px-5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                Editar Cliente
              </button>
            )}

            {cliente.inativo ? (
              <button
                onClick={() => reativar(cliente.id)}
                className="flex items-center gap-2 h-11 px-5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
              >
                <UserCheck size={18} />
                Reativar Cliente
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmInativo(true)}
                className="flex items-center gap-2 h-11 px-5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
              >
                <UserX size={18} />
                Inativar Cliente
              </button>
            )}
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-semibold">{orcamentosPendentes.length}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Orçamentos Pendentes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-semibold">{pedidosAtivos.length}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pedidos em Produção</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-semibold">{cliente.pedidos.length}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total de Pedidos</div>
          </div>
        </div>

        {/* Informações de contato */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Informações de Contato</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User size={20} className="text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Responsável / Comprador</p>
                {editando ? (
                  <input
                    value={formCliente.responsavel}
                    onChange={(e) => setFormCliente({ ...formCliente, responsavel: e.target.value })}
                    className="w-full h-10 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{cliente.responsavel}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={20} className="text-gray-400 mt-1 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                {editando ? (
                  <input
                    value={formCliente.telefone}
                    onChange={(e) => setFormCliente({ ...formCliente, telefone: e.target.value })}
                    className="w-full h-10 px-3 mb-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white mb-2">{cliente.telefone}</p>
                )}
                <a
                  href={`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={20} className="text-gray-400 mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                {editando ? (
                  <input
                    type="email"
                    value={formCliente.email}
                    onChange={(e) => setFormCliente({ ...formCliente, email: e.target.value })}
                    className="w-full h-10 px-3 mb-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white mb-2 break-all">{cliente.email}</p>
                )}
                <a
                  href={`mailto:${cliente.email}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Mail size={12} />
                  Enviar E-mail
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Endereço</p>
                {editando ? (
                  <input
                    value={formCliente.endereco}
                    onChange={(e) => setFormCliente({ ...formCliente, endereco: e.target.value })}
                    className="w-full h-10 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{cliente.endereco}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Última Compra</p>
                <p className="text-gray-900 dark:text-white">{new Date(cliente.ultimaCompra).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orçamentos pendentes */}
        {orcamentosPendentes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Orçamentos Pendentes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Nº</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Produto</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Valor</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Data</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orcamentosPendentes.map((orc) => (
                    <tr key={orc.numero} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{orc.numero}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{orc.produto}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{orc.valor}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{new Date(orc.data).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4"><StatusBadge status={orc.situacao} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Histórico de pedidos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Histórico de Pedidos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Nº</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Produto</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Quantidade</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Valor</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Data Pedido</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Prazo</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {cliente.pedidos.map((pedido) => (
                  <tr key={pedido.numero} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{pedido.numero}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{pedido.produto}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{pedido.quantidade}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{pedido.valor}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{new Date(pedido.data).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{new Date(pedido.prazo).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={pedido.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal confirmação inativar */}
      {showConfirmInativo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Inativar Cliente</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Tem certeza que deseja inativar o cliente <strong className="text-gray-900 dark:text-white">{cliente.nome}</strong>?
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              O cliente não aparecerá na listagem padrão. Você poderá reativá-lo a qualquer momento.
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
                Sim, inativar
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
