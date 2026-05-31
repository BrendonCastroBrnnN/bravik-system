import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../../lib/supabaseClient';

export type PerfilUsuario = 'admin' | 'comercial' | 'producao';

interface Perfil {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

interface AuthContextType {
  perfil: Perfil | null;
  carregandoPerfil: boolean;
  isAdmin: boolean;
  isComercial: boolean;
  isProducao: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);

  useEffect(() => {
    async function carregarPerfil() {
      const { data: sessionData } = await supabase.auth.getSession();

      const user = sessionData.session?.user;

      if (!user) {
        setPerfil(null);
        setCarregandoPerfil(false);
        return;
      }

      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        setPerfil(null);
        setCarregandoPerfil(false);
        return;
      }

      setPerfil(data as Perfil);
      setCarregandoPerfil(false);
    }

    carregarPerfil();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        perfil,
        carregandoPerfil,
        isAdmin: perfil?.perfil === 'admin',
        isComercial: perfil?.perfil === 'comercial',
        isProducao: perfil?.perfil === 'producao',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}