import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { useProducao } from '../context/ProducaoContext';

// Dados completos de todos os meses
const todosOsMeses = [
  { id: 'jan', mes: 'Jan', mesCompleto: 'Janeiro', pedidos: 65, faturamento: 180, diasProducao: 12 },
  { id: 'fev', mes: 'Fev', mesCompleto: 'Fevereiro', pedidos: 78, faturamento: 210, diasProducao: 14 },
  { id: 'mar', mes: 'Mar', mesCompleto: 'Março', pedidos: 90, faturamento: 250, diasProducao: 11 },
  { id: 'abr', mes: 'Abr', mesCompleto: 'Abril', pedidos: 81, faturamento: 230, diasProducao: 13 },
  { id: 'mai', mes: 'Mai', mesCompleto: 'Maio', pedidos: 95, faturamento: 280, diasProducao: 10 },
  { id: 'jun', mes: 'Jun', mesCompleto: 'Junho', pedidos: 110, faturamento: 310, diasProducao: 9 },
  { id: 'jul', mes: 'Jul', mesCompleto: 'Julho', pedidos: 88, faturamento: 245, diasProducao: 11 },
  { id: 'ago', mes: 'Ago', mesCompleto: 'Agosto', pedidos: 102, faturamento: 295, diasProducao: 10 },
  { id: 'set', mes: 'Set', mesCompleto: 'Setembro', pedidos: 95, faturamento: 270, diasProducao: 12 },
  { id: 'out', mes: 'Out', mesCompleto: 'Outubro', pedidos: 115, faturamento: 320, diasProducao: 9 },
  { id: 'nov', mes: 'Nov', mesCompleto: 'Novembro', pedidos: 108, faturamento: 305, diasProducao: 10 },
  { id: 'dez', mes: 'Dez', mesCompleto: 'Dezembro', pedidos: 125, faturamento: 350, diasProducao: 8 },
];

export function Relatorios() {
  const { columns } = useProducao();
  // Gráfico pizza derivado dos dados reais de produção
  const pieData = columns
    .filter((col) => col.cards.length > 0)
    .map((col) => ({
      id: col.title,
      name: col.labelCurto,
      value: col.cards.length,
      color: col.colorHex,
    }));

  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'mes' | 'periodo'>('todos');
  const [mesSelecionado, setMesSelecionado] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Função para filtrar dados baseado na seleção
  const getDadosFiltrados = () => {
    if (tipoFiltro === 'todos') {
      return todosOsMeses;
    }

    if (tipoFiltro === 'mes' && mesSelecionado) {
      return todosOsMeses.filter(m => m.id === mesSelecionado);
    }

    if (tipoFiltro === 'periodo' && dataInicio && dataFim) {
      // Simples filtro por período - você pode melhorar isso com lógica de data real
      const inicio = new Date(dataInicio).getMonth();
      const fim = new Date(dataFim).getMonth();
      return todosOsMeses.filter((_, index) => index >= inicio && index <= fim);
    }

    return todosOsMeses;
  };

  const dadosFiltrados = getDadosFiltrados();
  const barData = dadosFiltrados.map(d => ({ id: d.id, mes: d.mes, pedidos: d.pedidos }));
  const lineData = dadosFiltrados.map(d => ({ id: d.id, mes: d.mes, faturamento: d.faturamento }));
  const tempoMedioProducao = dadosFiltrados.map(d => ({ id: d.id, mes: d.mes, dias: d.diasProducao }));

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Visualize os dados do sistema</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtros de Período</h2>

          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => setTipoFiltro('todos')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tipoFiltro === 'todos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Todos os Meses
            </button>
            <button
              onClick={() => setTipoFiltro('mes')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tipoFiltro === 'mes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Mês Específico
            </button>
            <button
              onClick={() => setTipoFiltro('periodo')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tipoFiltro === 'periodo'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Período Customizado
            </button>
          </div>

          {tipoFiltro === 'mes' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selecione o Mês
                </label>
                <select
                  value={mesSelecionado}
                  onChange={(e) => setMesSelecionado(e.target.value)}
                  className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Escolha um mês</option>
                  {todosOsMeses.map((mes) => (
                    <option key={mes.id} value={mes.id}>
                      {mes.mesCompleto}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {tipoFiltro === 'periodo' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Final
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Pedidos Mensais</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="pedidos" fill="#2563EB" radius={[8, 8, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Produção por Setor</h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {pieData.map((entry) => (
                    <Cell key={`cell-${entry.id}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Evolução Mensal (R$ mil)</h2>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={lineData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="faturamento"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot={{ fill: '#22C55E', r: 6 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Tempo Médio de Produção (dias)</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={tempoMedioProducao} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="dias" fill="#F97316" radius={[8, 8, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MainLayout>
  );
}
