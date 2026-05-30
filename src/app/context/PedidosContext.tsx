import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../../lib/supabaseClient';

export type StatusPedido = 'producao' | 'entregue' | 'aguardando';

export interface Pedido {
    id: number;
    cliente_id: number;
    orcamento_id?: number | null;
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
    criarPedidoDeOrcamento: (pedido: Omit<Pedido, 'id'>) => Promise<Pedido | null>;
    atualizarPedidoPorOrcamento: (
        orcamentoId: number,
        dados: Partial<Omit<Pedido, 'id'>>
    ) => Promise<void>;
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

        const numeroGerado = `PED-${String(data.id).padStart(6, '0')}`;

        const { data: pedidoAtualizado, error: updateError } = await supabase
            .from('pedidos')
            .update({ numero: numeroGerado })
            .eq('id', data.id)
            .select()
            .single();

        if (updateError) {
            console.error('Erro ao gerar número do pedido:', updateError);
            return;
        }

        setPedidos((prev) => [...prev, pedidoAtualizado as Pedido]);
    };

    const criarPedidoDeOrcamento = async (pedido: Omit<Pedido, 'id'>) => {
        const { data, error } = await supabase
            .from('pedidos')
            .insert([pedido])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar pedido a partir do orçamento:', error);
            return null;
        }

        const numeroGerado = `PED-${String(data.id).padStart(6, '0')}`;

        const { data: pedidoAtualizado, error: updateError } = await supabase
            .from('pedidos')
            .update({ numero: numeroGerado })
            .eq('id', data.id)
            .select()
            .single();

        if (updateError) {
            console.error('Erro ao gerar número do pedido:', updateError);
            return null;
        }

        setPedidos((prev) => [...prev, pedidoAtualizado as Pedido]);

        return pedidoAtualizado as Pedido;
    };

    const atualizarPedidoPorOrcamento = async (
        orcamentoId: number,
        dados: Partial<Omit<Pedido, 'id'>>
    ) => {
        const { data, error } = await supabase
            .from('pedidos')
            .update(dados)
            .eq('orcamento_id', orcamentoId)
            .select();

        if (error) {
            console.error('Erro ao atualizar pedido vinculado ao orçamento:', error);
            return;
        }

        setPedidos((prev) =>
            prev.map((pedido) => {
                const pedidoAtualizado = data?.find((p) => p.id === pedido.id);
                return pedidoAtualizado ? (pedidoAtualizado as Pedido) : pedido;
            })
        );
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
        const statusAtualizado =
            etapa === 'concluido'
                ? 'entregue'
                : 'producao';

        const { data, error } = await supabase
            .from('pedidos')
            .update({
                etapa_producao: etapa,
                status: statusAtualizado,
            })
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
        <PedidosContext.Provider
            value={{
                pedidos,
                cadastrarPedido,
                criarPedidoDeOrcamento,
                atualizarPedidoPorOrcamento,
                editarStatusPedido,
                editarEtapaProducao,
            }}
        >
            {children}
        </PedidosContext.Provider>
    );
}

export function usePedidos() {
    const ctx = useContext(PedidosContext);
    if (!ctx) throw new Error('usePedidos must be used within PedidosProvider');
    return ctx;
}