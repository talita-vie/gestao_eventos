import { Link, Outlet, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem(
    '@Eventos:token'
  );

  function handleLogout() {
    localStorage.removeItem('@Eventos:token');

    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Navbar */}
      {isAuthenticated && (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link
              to="/"
              className="text-xl font-bold hover:text-blue-200 transition"
            >
              🎟️ Gestão de Eventos
            </Link>

            {/* Menu */}
            <div className="flex items-center gap-4">

              <Link
                to="/profile"
                className="hover:underline"
              >
                Meu Perfil
              </Link>

              <Link
                to="/my-events"
                className="hover:underline"
              >
                Meus Eventos
              </Link>

              <Link
                to="/my-certificates"
                className="hover:underline"
              >
                Meus Certificados
              </Link>

              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-1 rounded-md font-semibold hover:bg-gray-100 transition cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Conteúdo */}
      <main className={isAuthenticated ? '' : ''}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;