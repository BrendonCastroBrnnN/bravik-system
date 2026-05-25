import { createContext, useContext, useState, ReactNode } from 'react';

export interface Orcamento {
  numero: string;
  produto: string;
  valor: string;
  data: string;
  situacao: 'aprovado' | 'pendente' | 'rejeitado';
}

export interface Pedido {
  numero: string;
  produto: string;
  quantidade: number;
  valor: string;
  data: string;
  prazo: string;
  status: 'producao' | 'entregue' | 'aguardando';
}

export interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  ultimaCompra: string;
  inativo: boolean;
  orcamentos: Orcamento[];
  pedidos: Pedido[];
}

interface ClientesContextType {
  clientes: Cliente[];
  inativar: (ids: number[]) => void;
  reativar: (id: number) => void;
}

const ClientesContext = createContext<ClientesContextType | undefined>(undefined);

const clientesIniciais: Cliente[] = [
  {
    id: 1,
    nome: 'Indústria ABC',
    cnpj: '12.345.678/0001-90',
    responsavel: 'João Silva',
    telefone: '(11) 98765-4321',
    email: 'contato@industriaabc.com.br',
    endereco: 'Rua das Indústrias, 100 - São Paulo, SP',
    ultimaCompra: '2026-05-10',
    inativo: false,
    orcamentos: [
      { numero: 'ORC-001', produto: 'Peça X-100', valor: 'R$ 45.000,00', data: '2026-05-15', situacao: 'aprovado' },
      { numero: 'ORC-005', produto: 'Conjunto B-150', valor: 'R$ 52.000,00', data: '2026-05-18', situacao: 'pendente' },
    ],
    pedidos: [
      { numero: 'PED-001', produto: 'Peça X-100', quantidade: 500, valor: 'R$ 45.000,00', data: '2026-05-10', prazo: '2026-05-25', status: 'entregue' },
      { numero: 'PED-005', produto: 'Conjunto B-150', quantidade: 400, valor: 'R$ 52.000,00', data: '2026-04-20', prazo: '2026-05-30', status: 'producao' },
    ],
  },
  {
    id: 2,
    nome: 'Metalúrgica XYZ',
    cnpj: '98.765.432/0001-10',
    responsavel: 'Maria Santos',
    telefone: '(11) 91234-5678',
    email: 'maria@metalurgicaxyz.com.br',
    endereco: 'Av. Industrial, 500 - Guarulhos, SP',
    ultimaCompra: '2026-04-15',
    inativo: false,
    orcamentos: [
      { numero: 'ORC-002', produto: 'Componente Y-50', valor: 'R$ 28.500,00', data: '2026-05-12', situacao: 'pendente' },
    ],
    pedidos: [
      { numero: 'PED-002', produto: 'Componente Y-50', quantidade: 300, valor: 'R$ 28.500,00', data: '2026-04-15', prazo: '2026-05-20', status: 'producao' },
      { numero: 'PED-009', produto: 'Peça Z-300', quantidade: 350, valor: 'R$ 38.000,00', data: '2026-03-10', prazo: '2026-04-05', status: 'entregue' },
    ],
  },
  {
    id: 3,
    nome: 'Fábrica Tech',
    cnpj: '45.678.912/0001-34',
    responsavel: 'Pedro Costa',
    telefone: '(11) 99876-5432',
    email: 'pedro@fabricatech.com.br',
    endereco: 'Rua da Tecnologia, 250 - Osasco, SP',
    ultimaCompra: '2026-03-10',
    inativo: false,
    orcamentos: [
      { numero: 'ORC-003', produto: 'Peça Z-200', valor: 'R$ 67.200,00', data: '2026-05-01', situacao: 'aprovado' },
    ],
    pedidos: [
      { numero: 'PED-003', produto: 'Peça Z-200', quantidade: 800, valor: 'R$ 67.200,00', data: '2026-03-10', prazo: '2026-04-05', status: 'entregue' },
      { numero: 'PED-008', produto: 'Kit Premium', quantidade: 500, valor: 'R$ 55.000,00', data: '2026-02-05', prazo: '2026-03-08', status: 'entregue' },
    ],
  },
  {
    id: 4,
    nome: 'Mecânica Plus',
    cnpj: '78.912.345/0001-56',
    responsavel: 'Ana Oliveira',
    telefone: '(11) 92345-6789',
    email: 'ana@mecanicaplus.com.br',
    endereco: 'Av. das Máquinas, 800 - Santo André, SP',
    ultimaCompra: '2026-01-20',
    inativo: false,
    orcamentos: [
      { numero: 'ORC-004', produto: 'Kit A-75', valor: 'R$ 15.800,00', data: '2026-05-05', situacao: 'rejeitado' },
    ],
    pedidos: [
      { numero: 'PED-004', produto: 'Kit A-75', quantidade: 200, valor: 'R$ 15.800,00', data: '2026-01-20', prazo: '2026-02-25', status: 'entregue' },
    ],
  },
];

export function ClientesProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciais);

  const inativar = (ids: number[]) => {
    setClientes((prev) => prev.map((c) => (ids.includes(c.id) ? { ...c, inativo: true } : c)));
  };

  const reativar = (id: number) => {
    setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, inativo: false } : c)));
  };

  return (
    <ClientesContext.Provider value={{ clientes, inativar, reativar }}>
      {children}
    </ClientesContext.Provider>
  );
}

export function useClientes() {
  const ctx = useContext(ClientesContext);
  if (!ctx) throw new Error('useClientes must be used within ClientesProvider');
  return ctx;
}
