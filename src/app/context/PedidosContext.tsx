import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../../lib/supabaseClient';

export type StatusPedido = 'producao' | 'entregue' | 'aguardando';

export interface Pedido {
    id: number;
    cliente_id: number;
    numero: string;
    produto: string;
    quantidade: number;
    valor: string;
    data: string;
    prazo: string;
    status: StatusPedido;
    etapa_producao: string;
}

interface PedidosContextType {
    pedidos: Pedido[];
    cadastrarPedido: (pedido: Omit<Pedido, 'id'>) => Promise<void>;
    editarStatusPedido: (id: number, status: StatusPedido) => Promise<void>;
    editarEtapaProducao: (id: number, etapa: string) => Promise<void>;
}

const PedidosContext = createContext<PedidosContextType | undefined>(undefined);

export function PedidosProvider({ children }: { children: ReactNode }) {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        async function carregarPedidos() {
            const { data, error } = await supabase
                .from('pedidos')
                .select('*')
                .order('id', { ascending: true });

            if (error) {
                console.error('Erro ao carregar pedidos:', error);
                return;
            }

            setPedidos((data ?? []) as Pedido[]);
        }

        carregarPedidos();
    }, []);

    const cadastrarPedido = async (pedido: Omit<Pedido, 'id'>) => {
        const { data, error } = await supabase
            .from('pedidos')
            .insert([pedido])
            .select()
            .single();

        if (error) {
            console.error('Erro ao cadastrar pedido:', error);
            return;
        }

        setPedidos((prev) => [...prev, data as Pedido]);
    };

    const editarStatusPedido = async (id: number, status: StatusPedido) => {
        const { data, error } = await supabase
            .from('pedidos')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao alterar status do pedido:', error);
            return;
        }

        setPedidos((prev) =>
            prev.map((pedido) =>
                pedido.id === id ? (data as Pedido) : pedido
            )
        );
    };

    const editarEtapaProducao = async (id: number, etapa: string) => {
        const { data, error } = await supabase
            .from('pedidos')
            .update({ etapa_producao: etapa })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao alterar etapa de produção:', error);
            return;
        }

        setPedidos((prev) =>
            prev.map((pedido) =>
                pedido.id === id ? (data as Pedido) : pedido
            )
        );
    };

    return (
        <PedidosContext.Provider value={{ pedidos, cadastrarPedido, editarStatusPedido, editarEtapaProducao }}>
            {children}
        </PedidosContext.Provider>
    );
}

export function usePedidos() {
    const ctx = useContext(PedidosContext);
    if (!ctx) throw new Error('usePedidos must be used within PedidosProvider');
    return ctx;
}