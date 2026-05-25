import { useState, useEffect, useRef } from 'react';
import { Bell, User, Settings, LogOut, ChevronDown, Menu, ShoppingCart, CheckCircle, Package, Truck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, NotificationType } from '../../context/NotificationContext';

interface TopbarProps {
  onMenuClick?: () => void;
}

function notifIcon(type: NotificationType) {
  const base = 'w-8 h-8 rounded-full flex items-center justify-center shrink-0';
  switch (type) {
    case 'novo_pedido':
      return <div className={`${base} bg-blue-100 dark:bg-blue-900`}><ShoppingCart size={15} className="text-blue-600 dark:text-blue-300" /></div>;
    case 'pedido_aprovado':
      return <div className={`${base} bg-green-100 dark:bg-green-900`}><CheckCircle size={15} className="text-green-600 dark:text-green-300" /></div>;
    case 'orcamento_aprovado':
      return <div className={`${base} bg-purple-100 dark:bg-purple-900`}><FileText size={15} className="text-purple-600 dark:text-purple-300" /></div>;
    case 'etapa_concluida':
      return <div className={`${base} bg-orange-100 dark:bg-orange-900`}><Package size={15} className="text-orange-600 dark:text-orange-300" /></div>;
    case 'pedido_entregue':
      return <div className={`${base} bg-teal-100 dark:bg-teal-900`}><Truck size={15} className="text-teal-600 dark:text-teal-300" /></div>;
  }
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('Admin');
  const notifRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    const savedName = localStorage.getItem('nomeUsuario');
    if (savedName) setNomeUsuario(savedName);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedName = localStorage.getItem('nomeUsuario');
      if (savedName) setNomeUsuario(savedName);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userNameUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userNameUpdated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const handleSair = () => {
    navigate('/login');
    setShowDropdown(false);
  };

  const handleConfiguracoes = () => {
    navigate('/configuracoes');
    setShowDropdown(false);
  };

  return (
    <div className="h-18 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 fixed top-0 right-0 left-0 lg:left-60 z-10">
      {/* Botão hambúrguer (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Menu size={24} className="text-gray-900 dark:text-white" />
      </button>

      <div className="flex items-center gap-2 lg:gap-4 ml-auto">

        {/* Sino de notificações */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center px-0.5">
                <span className="text-white text-[10px] font-bold leading-none">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-30 overflow-hidden">
              {/* Cabeçalho do painel */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notificações</h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>

              {/* Lista de notificações */}
              <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    Nenhuma notificação
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        !n.read ? 'bg-blue-50 dark:bg-blue-950/40' : ''
                      }`}
                    >
                      {notifIcon(n.type)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{n.description}</p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{n.time}</p>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Perfil do usuário */}
        <div className="relative">
          <button
            onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}
            className="flex items-center gap-2 lg:gap-3 lg:pl-4 lg:border-l border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-2 lg:px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={18} className="text-white lg:hidden" />
              <User size={20} className="text-white hidden lg:block" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{nomeUsuario}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrador</p>
            </div>
            <ChevronDown size={16} className="text-gray-500 dark:text-gray-400 hidden lg:block" />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                <button
                  onClick={handleConfiguracoes}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings size={16} />
                  Configurações
                </button>
                <button
                  onClick={handleSair}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
