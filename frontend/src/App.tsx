import { Outlet } from 'react-router-dom';
import Navbar from './components/ui/Navbar'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated && <Navbar />}

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;