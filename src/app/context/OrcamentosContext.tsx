import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useNotifications } from './NotificationContext';

export type SituacaoOrcamento = 'pendente' | 'aprovado' | 'rejeitado';

export interface Orcamento {
  id: number;
  numero: string;
  cliente: string;
  produto: string;
  quantidade: number;
  valorUnitario: string;
  valorTotal: string;
  dataCriacao: string;
  prazoEntrega: string;
  situacao: SituacaoOrcamento;
  observacoes: string;
  condicoesPagamento: string;
}

interface OrcamentosContextType {
  orcamentos: Orcamento[];
  alterarSituacao: (id: number, situacao: SituacaoOrcamento) => void;
  editar: (id: number, dados: Partial<Omit<Orcamento, 'id' | 'numero'>>) => void;
}

const OrcamentosContext = createContext<OrcamentosContextType | undefined>(undefined);

const HOJE = new Date('2026-05-21');

function diasDesde(data: string) {
  return Math.floor((HOJE.getTime() - new Date(data).getTime()) / (1000 * 60 * 60 * 24));
}

const orcamentosIniciais: Orcamento[] = [
  {
    id: 1, numero: 'ORC-001', cliente: 'Indústria ABC', produto: 'Peça X-100',
    quantidade: 500, valorUnitario: 'R$ 90,00', valorTotal: 'R$ 45.000,00',
    dataCriacao: '2026-05-15', prazoEntrega: '30 dias', situacao: 'aprovado',
    observacoes: 'Cliente solicitou embalagem especial', condicoesPagamento: '30/60 dias',
  },
  {
    id: 2, numero: 'ORC-002', cliente: 'Metalúrgica XYZ', produto: 'Componente Y-50',
    quantidade: 300, valorUnitario: 'R$ 95,00', valorTotal: 'R$ 28.500,00',
    dataCriacao: '2026-05-12', prazoEntrega: '45 dias', situacao: 'pendente',
    observacoes: 'Verificar disponibilidade de matéria-prima', condicoesPagamento: '30 dias',
  },
  {
    id: 3, numero: 'ORC-003', cliente: 'Fábrica Tech', produto: 'Peça Z-200',
    quantidade: 800, valorUnitario: 'R$ 84,00', valorTotal: 'R$ 67.200,00',
    dataCriacao: '2026-05-01', prazoEntrega: '60 dias', situacao: 'aprovado',
    observacoes: '', condicoesPagamento: 'À vista',
  },
  {
    id: 4, numero: 'ORC-004', cliente: 'Mecânica Plus', produto: 'Kit A-75',
    quantidade: 200, valorUnitario: 'R$ 79,00', valorTotal: 'R$ 15.800,00',
    dataCriacao: '2026-05-05', prazoEntrega: '20 dias', situacao: 'rejeitado',
    observacoes: 'Preço acima do orçamento do cliente', condicoesPagamento: '30/60/90 dias',
  },
  {
    id: 5, numero: 'ORC-005', cliente: 'Indústria ABC', produto: 'Conjunto B-150',
    quantidade: 400, valorUnitario: 'R$ 130,00', valorTotal: 'R$ 52.000,00',
    dataCriacao: '2026-05-16', prazoEntrega: '45 dias', situacao: 'pendente',
    observacoes: '', condicoesPagamento: '30 dias',
  },
];

function aplicarAutoRejeicao(lista: Orcamento[]): Orcamento[] {
  return lista.map((orc) => {
    if (orc.situacao === 'pendente' && diasDesde(orc.dataCriacao) >= 15) {
      return { ...orc, situacao: 'rejeitado' as SituacaoOrcamento };
    }
    return orc;
  });
}

export function OrcamentosProvider({ children }: { children: ReactNode }) {
  const { addNotification } = useNotifications();
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(() => aplicarAutoRejeicao(orcamentosIniciais));
  const notifsFired = useRef<Set<string>>(new Set());

  useEffect(() => {
    orcamentos.forEach((orc) => {
      if (orc.situacao !== 'pendente') return;
      const dias = diasDesde(orc.dataCriacao);

      if (dias >= 10) {
        const key = `${orc.numero}-10d`;
        if (!notifsFired.current.has(key)) {
          notifsFired.current.add(key);
          addNotification({
            type: 'orcamento_aprovado',
            title: `Orçamento ${orc.numero} há 10 dias pendente`,
            description: `${orc.cliente} · ${orc.produto} — rejeição automática em ${15 - dias} dia${15 - dias !== 1 ? 's' : ''}.`,
            time: 'Agora',
          });
        }
      } else if (dias >= 5) {
        const key = `${orc.numero}-5d`;
        if (!notifsFired.current.has(key)) {
          notifsFired.current.add(key);
          addNotification({
            type: 'orcamento_aprovado',
            title: `Orçamento ${orc.numero} há 5 dias pendente`,
            description: `${orc.cliente} · ${orc.produto} — sem resposta há ${dias} dias.`,
            time: 'Agora',
          });
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alterarSituacao = (id: number, situacao: SituacaoOrcamento) => {
    setOrcamentos((prev) => prev.map((o) => (o.id === id ? { ...o, situacao } : o)));
  };

  const editar = (id: number, dados: Partial<Omit<Orcamento, 'id' | 'numero'>>) => {
    setOrcamentos((prev) => prev.map((o) => (o.id === id ? { ...o, ...dados } : o)));
  };

  return (
    <OrcamentosContext.Provider value={{ orcamentos, alterarSituacao, editar }}>
      {children}
    </OrcamentosContext.Provider>
  );
}

export function useOrcamentos() {
  const ctx = useContext(OrcamentosContext);
  if (!ctx) throw new Error('useOrcamentos must be used within OrcamentosProvider');
  return ctx;
}

export { diasDesde };
