import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Factory,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import bravikLogoLight from '@/imports/BravikBG.png';
import bravikLogoDark from '@/imports/BravikBGBR.png';
import { useTheme } from '../../context/ThemeContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Clientes', path: '/clientes' },
  { icon: ShoppingCart, label: 'Pedidos', path: '/pedidos' },
  { icon: Factory, label: 'Produção', path: '/producao' },
  { icon: FileText, label: 'Orçamentos', path: '/orcamentos' },
  { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const bravikLogo = isDarkMode ? bravikLogoDark : bravikLogoLight;

  const handleSair = () => {
    navigate('/login');
    onClose?.();
  };

  const handleLinkClick = () => {
    onClose?.();
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-60 h-screen bg-[#1E293B] dark:bg-gray-950 text-white flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Header com logo e botão fechar (mobile) */}
        <div className="p-6 relative flex items-center justify-center">
          <button onClick={() => navigate('/dashboard')} className="focus:outline-none">
            <img
              src={bravikLogo}
              alt="Bravik"
              className="h-[70px] w-auto object-contain"
            />
          </button>
          <button
            onClick={onClose}
            className="lg:hidden absolute right-6 p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#2563EB] text-white'
                    : 'text-gray-300 hover:bg-[#334155] dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Botão Sair (apenas mobile) */}
          <button
            onClick={handleSair}
            className="lg:hidden w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-[#334155] dark:hover:bg-gray-800 transition-colors mt-4"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </nav>
      </div>
    </>
  );
}
