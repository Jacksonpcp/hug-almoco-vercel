'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Colaborador = { matricula: string; nome: string; departamento: string }

export default function ConfirmarPage() {
  const [colaborador, setColaborador] = useState<Colaborador | null>(null)
  const [jaConfirmouAntes, setJaConfirmouAntes] = useState(false)
  const [confirmouAgora, setConfirmouAgora] = useState(false)
  const [foraDoPrazo, setForaDoPrazo] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const dados = sessionStorage.getItem('colaborador')
    if (!dados) { router.push('/'); return }
    const c: Colaborador = JSON.parse(dados)
    setColaborador(c)

    const agora = new Date()
    const hora = agora.getHours()
    const minuto = agora.getMinutes()
    const aposInicio = hora >= 12
    const antesDoFim = hora < 17 || (hora === 17 && minuto < 30)
    if (!aposInicio || !antesDoFim) setForaDoPrazo(true)

    fetch(`/api/confirmar?matricula=${c.matricula}`)
      .then((r) => r.json())
      .then((d) => setJaConfirmouAntes(d.confirmado))
  }, [router])

  async function confirmar() {
    if (!colaborador) return
    setErro('')
    setCarregando(true)

    const res = await fetch('/api/confirmar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricula: colaborador.matricula }),
    })

    const data = await res.json()
    setCarregando(false)

    if (!res.ok) {
      setErro(data.erro)
      return
    }

    setConfirmouAgora(true)
  }

  function sair() {
    sessionStorage.removeItem('colaborador')
    router.push('/')
  }

  if (!colaborador) return null

  return (
    <main className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🍽️</div>
        <h1 className="text-xl font-bold text-sky-700">{colaborador.nome}</h1>
        <p className="text-gray-500 text-sm mb-6">&nbsp;</p>

        {confirmouAgora && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-4">
            <div className="text-3xl mb-2">✅</div>
            <p className="font-semibold">Almoço confirmado!</p>
          </div>
        )}

        {jaConfirmouAntes && !confirmouAgora && (
          <div className="bg-sky-50 border border-sky-200 text-sky-800 rounded-xl p-4 mb-4">
            <div className="text-3xl mb-2">⚠️</div>
            <p className="font-semibold">Você já confirmou o almoço hoje.</p>
          </div>
        )}

        {foraDoPrazo && !jaConfirmouAntes && !confirmouAgora && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 mb-4">
            <div className="text-3xl mb-2">⏰</div>
            <p className="font-semibold">Fora do horário</p>
            <p className="text-sm mt-1">Confirmações aceitas somente entre 12h e 17h30.</p>
          </div>
        )}

        {!jaConfirmouAntes && !confirmouAgora && !foraDoPrazo && (
          <>
            <p className="text-gray-600 mb-6">Você vai almoçar hoje?</p>
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
                {erro}
              </div>
            )}
            <button
              onClick={confirmar}
              disabled={carregando}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors mb-3"
            >
              {carregando ? 'Confirmando...' : '✅ Sim, vou almoçar'}
            </button>
          </>
        )}

        <button
          onClick={sair}
          className="w-full text-gray-700 hover:text-gray-900 text-sm py-2 transition-colors"
        >
          Sair
        </button>
      </div>
    </main>
  )
}
