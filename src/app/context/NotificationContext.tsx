import { createContext, useContext, useState, ReactNode } from 'react';

export type NotificationType = 'novo_pedido' | 'pedido_aprovado' | 'etapa_concluida' | 'orcamento_aprovado' | 'pedido_entregue';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'novo_pedido',
    title: 'Novo pedido cadastrado',
    description: 'PED-010 — Indústria ABC · 600 unidades de Peça X-200',
    time: 'Agora há pouco',
    read: false,
  },
  {
    id: '2',
    type: 'etapa_concluida',
    title: 'Etapa de Corte finalizada',
    description: 'PED-005 — Conjunto B-150 avançou para Personalização',
    time: 'Há 15 minutos',
    read: false,
  },
  {
    id: '3',
    type: 'orcamento_aprovado',
    title: 'Orçamento aprovado',
    description: 'ORC-003 — Fábrica Tech aprovou R$ 67.200,00 · enviado para produção',
    time: 'Há 42 minutos',
    read: false,
  },
  {
    id: '4',
    type: 'etapa_concluida',
    title: 'Etapa de Costura finalizada',
    description: 'PED-002 — Componente Y-50 avançou para Expedição',
    time: 'Há 1 hora',
    read: false,
  },
  {
    id: '5',
    type: 'pedido_entregue',
    title: 'Pedido entregue',
    description: 'PED-001 — Peça X-100 · Indústria ABC confirmou recebimento',
    time: 'Há 2 horas',
    read: true,
  },
  {
    id: '6',
    type: 'pedido_aprovado',
    title: 'Pedido aprovado e liberado',
    description: 'PED-008 — Kit Premium aguardando início da produção',
    time: 'Há 3 horas',
    read: true,
  },
  {
    id: '7',
    type: 'novo_pedido',
    title: 'Novo pedido cadastrado',
    description: 'PED-009 — Metalúrgica XYZ · 350 unidades de Peça Z-300',
    time: 'Ontem, 16:30',
    read: true,
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (n: Omit<Notification, 'id' | 'read'>) => {
    const newNotif: Notification = {
      ...n,
      id: Date.now().toString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
