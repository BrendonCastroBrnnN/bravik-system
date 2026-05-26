interface StatusBadgeProps {
  status:
  | 'entregue'
  | 'producao'
  | 'atrasado'
  | 'pendente'
  | 'aprovado'
  | 'rejeitado'
  | 'aguardando';
}

const statusConfig = {
  entregue: { bg: 'bg-green-100', text: 'text-green-700', label: 'Entregue' },
  producao: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Produção' },
  atrasado: { bg: 'bg-red-100', text: 'text-red-700', label: 'Atrasado' },
  pendente: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pendente' },
  aprovado: { bg: 'bg-green-100', text: 'text-green-700', label: 'Aprovado' },
  rejeitado: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeitado' },
  aguardando: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Aguardando' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
