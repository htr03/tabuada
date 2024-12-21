import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { AuthForm } from './components/AuthForm';
import { Game } from './components/Game';
import { LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-gray-700 text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Mathematical symbols background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 gap-8 p-8 text-gray-800 text-4xl select-none">
          {Array.from({ length: 64 }, (_, i) => (
            <div key={i} className="animate-float" style={{ 
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}>
              {['×', '+', '÷', '=', '∑', '√', '∞', '≠'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        {user ? (
          <div className="w-full max-w-md">
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleSignOut}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg
                  flex items-center gap-2 transition-colors"
              >
                <LogOut size={20} />
                Sair
              </button>
            </div>
            <Game />
          </div>
        ) : (
          <AuthForm onSuccess={() => {}} />
        )}
      </div>
    </div>
  );
}

export default App;