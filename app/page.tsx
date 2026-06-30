'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [matricula, setMatricula] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricula }),
    })

    const data = await res.json()
    setCarregando(false)

    if (!res.ok) {
      setErro(data.erro)
      return
    }

    sessionStorage.setItem('colaborador', JSON.stringify(data.colaborador))
    router.push('/confirmar')
  }

  return (
    <main className="min-h-screen bg-sky-50 p-4">
      <div className="p-2">
        <img src="/logo-hug.png" alt="Logo HUG" className="w-24 h-auto mix-blend-multiply" />
      </div>
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-1">🍽️</div>
          <h1 className="text-2xl font-bold text-sky-700">HUG Almoço</h1>
          <p className="text-gray-500 text-sm mt-1">Confirme sua presença no almoço hoje.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full border border-sky-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
              autoFocus
            />
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          <a href="/rh" className="text-gray-700 hover:underline">Acesso RH</a>
        </p>
      </div>
      </div>
    </main>
  )
}
