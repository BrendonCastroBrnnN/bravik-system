import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducao, KanbanCard as KanbanCardData } from '../context/ProducaoContext';

function KanbanCard({ card, onClick }: { card: KanbanCardData; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{card.pedido}</span>
        <span className="text-xs bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg">
          {card.quantidade} un
        </span>
      </div>

      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">{card.cliente}</h3>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <User size={14} />
          <span>{card.responsavel}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <Clock size={14} />
          <span>{card.prazo}</span>
        </div>
      </div>
    </div>
  );
}

export function Producao() {
  const navigate = useNavigate();
  const { columns } = useProducao();
  const [filtroEtapa, setFiltroEtapa] = useState<string>('todos');

  const colunasFiltradas = filtroEtapa === 'todos'
    ? columns
    : columns.filter(col => col.title === filtroEtapa);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Produção</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Acompanhe o fluxo de produção</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFiltroEtapa('todos')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroEtapa === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Todos
          </button>
          {columns.map((column) => (
            <button
              key={column.title}
              onClick={() => setFiltroEtapa(column.title)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtroEtapa === column.title
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {column.title} ({column.cards.length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {colunasFiltradas.map((column) => (
            <div key={column.title} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 ${column.colorClass} rounded-full`}></div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{column.title}</h2>
                <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg">
                  {column.cards.length}
                </span>
              </div>

              <div className="space-y-3">
                {column.cards.map((card) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    onClick={() => navigate(`/pedidos/${card.pedido}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
