import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

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
  cadastrarCliente: (cliente: Omit<Cliente, 'id'>) => Promise<void>;
  inativar: (ids: number[]) => Promise<void>;
  reativar: (id: number) => Promise<void>;
}

const ClientesContext = createContext<ClientesContextType | undefined>(undefined);

const clientesIniciais: Cliente[] = [];

export function ClientesProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciais);

  useEffect(() => {
    async function carregarClientes() {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Erro ao carregar clientes:', error);
        return;
      }

      console.log('Clientes Supabase:', data);
      setClientes((data ?? []) as Cliente[]);
    }

    carregarClientes();
  }, []);

  const cadastrarCliente = async (cliente: Omit<Cliente, 'id'>) => {
    const { data, error } = await supabase
      .from('clientes')
      .insert([cliente])
      .select()
      .single();

    if (error) {
      console.error('Erro ao cadastrar cliente:', error);
      return;
    }

    setClientes((prev) => [...prev, data as Cliente]);
  };

  const inativar = async (ids: number[]) => {
    const { error } = await supabase
      .from('clientes')
      .update({ inativo: true })
      .in('id', ids);

    if (error) {
      console.error('Erro ao inativar cliente:', error);
      return;
    }

    setClientes((prev) =>
      prev.map((c) =>
        ids.includes(c.id)
          ? { ...c, inativo: true }
          : c
      )
    );
  };

  const reativar = async (id: number) => {
    const { error } = await supabase
      .from('clientes')
      .update({ inativo: false })
      .eq('id', id);

    if (error) {
      console.error('Erro ao reativar cliente:', error);
      return;
    }

    setClientes((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, inativo: false }
          : c
      )
    );
  };

  return (
    <ClientesContext.Provider
      value={{
        clientes,
        cadastrarCliente,
        inativar,
        reativar,
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
}

export function useClientes() {
  const ctx = useContext(ClientesContext);
  if (!ctx) throw new Error('useClientes must be used within ClientesProvider');
  return ctx;
}