import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, setAuthenticated } = useAuth()

  function handleLogout() {
    localStorage.removeItem('@Eventos:token')
    localStorage.removeItem('@Eventos:user')
    setAuthenticated(false)
    navigate('/login')
  }

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-blue-500/20"
            aria-label="Abrir menu"
          >
            <Menu />
          </button>

          <Link to="/" className="text-xl font-bold hover:text-blue-200">
            🎟️ Gestão de Eventos
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <User />
                <span className="hidden sm:inline text-sm">Conta</span>
                <ChevronDown />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded shadow-lg z-50 overflow-hidden">
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100">
                    <User />
                    <span>Meu Perfil</span>
                  </Link>
                  <Link to="/my-events" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100">
                    <User />
                    <span>Meus Eventos</span>
                  </Link>
                  <Link to="/my-certificates" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100">
                    <User />
                    <span>Meus Certificados</span>
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-slate-100 text-red-600"
                  >
                    <LogOut />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-white text-blue-600 px-4 py-1 rounded-md font-semibold hover:bg-gray-100 transition">Entrar</Link>
          )}
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      <div className={`fixed inset-0 z-50 ${open ? 'visible' : 'pointer-events-none'}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 ${open ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        />

        <aside
          className={`absolute left-0 top-0 h-full w-64 bg-white text-slate-800 transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform shadow-xl`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/" onClick={() => setOpen(false)} className="text-lg font-bold">
              🎟️ Gestão
            </Link>
            <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-slate-100" aria-label="Fechar menu">
              <X />
            </button>
          </div>

          <nav className="p-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-slate-100">Início</Link>
            <Link to="/profile" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-slate-100">Meu Perfil</Link>
            <Link to="/my-events" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-slate-100">Meus Eventos</Link>
            <Link to="/my-certificates" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-slate-100">Meus Certificados</Link>

            <button
              onClick={() => {
                setOpen(false)
                handleLogout()
              }}
              className="mt-4 bg-red-50 text-red-600 py-2 px-3 rounded font-semibold w-full text-left"
            >
              Sair
            </button>
          </nav>
        </aside>
      </div>
    </header>
  )
}
