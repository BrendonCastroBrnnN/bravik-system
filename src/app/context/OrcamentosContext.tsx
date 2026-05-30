import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../../lib/supabaseClient';

export type SituacaoOrcamento = 'pendente' | 'aprovado' | 'rejeitado';

export interface Orcamento {
  id: number;
  cliente_id: number;
  numero: string;
  produto: string;
  quantidade: number;
  valor: string;
  data: string;
  validade: string;
  situacao: SituacaoOrcamento;
  observacoes: string | null;
  created_at?: string;
}

interface OrcamentosContextType {
  orcamentos: Orcamento[];
  cadastrarOrcamento: (orcamento: Omit<Orcamento, 'id' | 'created_at'>) => Promise<void>;
  alterarSituacao: (id: number, situacao: SituacaoOrcamento) => Promise<void>;
  editar: (id: number, dados: Partial<Omit<Orcamento, 'id' | 'created_at'>>) => Promise<void>;
}

const OrcamentosContext = createContext<OrcamentosContextType | undefined>(undefined);

export function OrcamentosProvider({ children }: { children: ReactNode }) {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);

  useEffect(() => {
    async function carregarOrcamentos() {
      const { data, error } = await supabase
        .from('orcamentos')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Erro ao carregar orçamentos:', error);
        return;
      }

      setOrcamentos((data ?? []) as Orcamento[]);
    }

    carregarOrcamentos();
  }, []);

  const cadastrarOrcamento = async (
    orcamento: Omit<Orcamento, 'id' | 'created_at'>
  ) => {
    const { data, error } = await supabase
      .from('orcamentos')
      .insert([orcamento])
      .select()
      .single();

    if (error) {
      console.error('Erro ao cadastrar orçamento:', error);
      return;
    }

    const numeroGerado = `ORC-${String(data.id).padStart(6, '0')}`;

    const { data: orcamentoAtualizado, error: updateError } = await supabase
      .from('orcamentos')
      .update({ numero: numeroGerado })
      .eq('id', data.id)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao gerar número do orçamento:', updateError);
      return;
    }

    setOrcamentos((prev) => [...prev, orcamentoAtualizado as Orcamento]);
  };

  const alterarSituacao = async (id: number, situacao: SituacaoOrcamento) => {
    const { data, error } = await supabase
      .from('orcamentos')
      .update({ situacao })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao alterar situação do orçamento:', error);
      return;
    }

    setOrcamentos((prev) =>
      prev.map((orcamento) =>
        orcamento.id === id ? (data as Orcamento) : orcamento
      )
    );
  };

  const editar = async (
    id: number,
    dados: Partial<Omit<Orcamento, 'id' | 'created_at'>>
  ) => {
    const { data, error } = await supabase
      .from('orcamentos')
      .update(dados)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao editar orçamento:', error);
      return;
    }

    setOrcamentos((prev) =>
      prev.map((orcamento) =>
        orcamento.id === id ? (data as Orcamento) : orcamento
      )
    );
  };

  return (
    <OrcamentosContext.Provider
      value={{
        orcamentos,
        cadastrarOrcamento,
        alterarSituacao,
        editar,
      }}
    >
      {children}
    </OrcamentosContext.Provider>
  );
}

export function useOrcamentos() {
  const ctx = useContext(OrcamentosContext);
  if (!ctx) {
    throw new Error('useOrcamentos must be used within OrcamentosProvider');
  }

  return ctx;
}