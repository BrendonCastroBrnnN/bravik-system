import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bravikLogo from '../../imports/BravikBG.png';
import { supabase } from '../../lib/supabaseClient';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
    setError('Preencha o e-mail e a senha para continuar.');
    return;
  }

  setError('');

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setError('E-mail ou senha inválidos.');
    console.error(error);
    return;
  }

  navigate('/dashboard');
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md px-8">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <div className="mb-8 flex flex-col items-center">
            <img
              src={bravikLogo}
              alt="Bravik"
              className="h-[88px] w-auto object-contain mb-6"
            />
            <h2 className="text-2xl font-semibold text-gray-900">Bem-vindo</h2>
            <p className="text-gray-600 mt-2">Acesse o sistema Bravik</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              className="w-full h-12 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
