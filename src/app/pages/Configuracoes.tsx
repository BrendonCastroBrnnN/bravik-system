import { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Moon, Sun, User, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';


export function Configuracoes() {
  
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [nomeUsuario, setNomeUsuario] = useState('Admin');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('nomeUsuario');
    if (savedName) setNomeUsuario(savedName);
  }, []);

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    toast.success(isDarkMode ? 'Modo claro ativado' : 'Modo escuro ativado');
  };

  const handleSalvarNome = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('nomeUsuario', nomeUsuario);
    window.dispatchEvent(new Event('userNameUpdated'));
    toast.success('Nome de usuário atualizado com sucesso!');
  };

  const handleAlterarSenha = (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem!');
      return;
    }

    if (novaSenha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    toast.success('Senha alterada com sucesso!');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Configurações</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie as configurações do sistema</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Aparência</h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon size={24} className="text-blue-400" /> : <Sun size={24} className="text-yellow-500" />}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Modo {isDarkMode ? 'Escuro' : 'Claro'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Altere a aparência do sistema</p>
              </div>
            </div>

            <button
              onClick={handleToggleDarkMode}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Conta</h2>

          <form onSubmit={handleSalvarNome} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User size={18} />
                Nome de Usuário
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={nomeUsuario}
                  onChange={(e) => setNomeUsuario(e.target.value)}
                  className="flex-1 h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Digite seu nome"
                  required
                />
                <button
                  type="submit"
                  className="h-12 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Salvar Nome
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Segurança</h2>

          <form onSubmit={handleAlterarSenha} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Lock size={18} />
                Senha Atual
              </label>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Digite sua senha atual"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Digite a nova senha"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Confirme a nova senha"
                required
              />
            </div>

            <button
              type="submit"
              className="h-12 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Alterar Senha
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
