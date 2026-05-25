import { createContext, useContext, useState, ReactNode } from 'react';

export interface KanbanCard {
  id: string;
  pedido: string;
  cliente: string;
  quantidade: number;
  responsavel: string;
  prazo: string;
}

export interface KanbanColumn {
  title: string;
  labelCurto: string;
  colorClass: string;
  colorHex: string;
  cards: KanbanCard[];
}

interface ProducaoContextType {
  columns: KanbanColumn[];
}

const ProducaoContext = createContext<ProducaoContextType | undefined>(undefined);

const initialColumns: KanbanColumn[] = [
  {
    title: 'Aguardando Matéria-Prima',
    labelCurto: 'Mat. Prima',
    colorClass: 'bg-gray-500',
    colorHex: '#6B7280',
    cards: [
      { id: '1', pedido: 'PED-010', cliente: 'Indústria ABC', quantidade: 300, responsavel: 'Carlos Silva', prazo: '30/05/2026' },
    ],
  },
  {
    title: 'Aguardando Liberação',
    labelCurto: 'Liberação',
    colorClass: 'bg-yellow-500',
    colorHex: '#EAB308',
    cards: [
      { id: '2', pedido: 'PED-011', cliente: 'Metalúrgica XYZ', quantidade: 250, responsavel: 'Ana Costa', prazo: '28/05/2026' },
    ],
  },
  {
    title: 'Corte',
    labelCurto: 'Corte',
    colorClass: 'bg-purple-500',
    colorHex: '#8B5CF6',
    cards: [
      { id: '3', pedido: 'PED-005', cliente: 'Indústria ABC', quantidade: 400, responsavel: 'Carlos Silva', prazo: '10/05/2026' },
      { id: '4', pedido: 'PED-006', cliente: 'Metalúrgica XYZ', quantidade: 250, responsavel: 'Ana Costa', prazo: '12/05/2026' },
    ],
  },
  {
    title: 'Personalização',
    labelCurto: 'Personal.',
    colorClass: 'bg-pink-500',
    colorHex: '#EC4899',
    cards: [
      { id: '5', pedido: 'PED-012', cliente: 'Fábrica Tech', quantidade: 150, responsavel: 'Maria Silva', prazo: '15/05/2026' },
    ],
  },
  {
    title: 'Costura',
    labelCurto: 'Costura',
    colorClass: 'bg-blue-500',
    colorHex: '#3B82F6',
    cards: [
      { id: '6', pedido: 'PED-002', cliente: 'Fábrica Tech', quantidade: 300, responsavel: 'Pedro Santos', prazo: '20/05/2026' },
      { id: '7', pedido: 'PED-007', cliente: 'Mecânica Plus', quantidade: 180, responsavel: 'Julia Alves', prazo: '18/05/2026' },
    ],
  },
  {
    title: 'Expedição',
    labelCurto: 'Expedição',
    colorClass: 'bg-green-500',
    colorHex: '#22C55E',
    cards: [
      { id: '8', pedido: 'PED-008', cliente: 'Fábrica Tech', quantidade: 500, responsavel: 'Marina Souza', prazo: '08/05/2026' },
      { id: '9', pedido: 'PED-009', cliente: 'Metalúrgica XYZ', quantidade: 350, responsavel: 'Lucas Martins', prazo: '09/05/2026' },
    ],
  },
];

export function ProducaoProvider({ children }: { children: ReactNode }) {
  const [columns] = useState<KanbanColumn[]>(initialColumns);

  return (
    <ProducaoContext.Provider value={{ columns }}>
      {children}
    </ProducaoContext.Provider>
  );
}

export function useProducao() {
  const ctx = useContext(ProducaoContext);
  if (!ctx) throw new Error('useProducao must be used within ProducaoProvider');
  return ctx;
}
