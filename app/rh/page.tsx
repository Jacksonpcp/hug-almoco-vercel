'use client'

import { useState } from 'react'

export default function RhPage() {
  const [senha, setSenha] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [erro, setErro] = useState('')
  const [mes, setMes] = useState(() => new Date().toISOString().slice(0, 7))
  const [mensagem, setMensagem] = useState('')
  const [colaboradores, setColaboradores] = useState<{ matricula: string; nome: string; departamento: string }[]>([])

  const [novoSenha, setNovoSenha] = useState('')
  const [novoNome, setNovoNome] = useState('')
  const [novoSetor, setNovoSetor] = useState('')
  const [msgCadastro, setMsgCadastro] = useState('')

  async function login(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch(`/api/colaboradores?senha=${senha}`)
    if (!res.ok) { setErro('Senha incorreta.'); return }
    const data = await res.json()
    setColaboradores(data.colaboradores)
    setAutenticado(true)
    setErro('')
  }

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault()
    setMsgCadastro('')
    const res = await fetch(`/api/colaboradores?senha=${senha}&modo=cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colaboradores: [{ matricula: novoSenha, nome: novoNome.toUpperCase(), departamento: novoSetor.toUpperCase() }] }),
    })
    const data = await res.json()
    if (!res.ok) { setMsgCadastro(data.erro); return }
    setMsgCadastro('Colaborador cadastrado com sucesso!')
    setNovoSenha('')
    setNovoNome('')
    setNovoSetor('')
    const atualizado = await fetch(`/api/colaboradores?senha=${senha}`)
    setColaboradores((await atualizado.json()).colaboradores)
  }

  async function remover(matricula: string) {
    if (!confirm(`Remover matrícula ${matricula}?`)) return
    await fetch(`/api/colaboradores?senha=${senha}&matricula=${matricula}`, { method: 'DELETE' })
    setColaboradores((prev) => prev.filter((c) => c.matricula !== matricula))
  }

  function exportarRelatorio() {
    window.open(`/api/relatorio?senha=${senha}&mes=${mes}`, '_blank')
  }

  if (!autenticado) {
    return (
      <main className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <img src="/logo-hug.png" alt="Logo HUG" className="w-24 h-auto mx-auto mb-3" />
            <h1 className="text-xl font-bold text-sky-700">Painel RH</h1>
          </div>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha do RH"
              className="w-full border border-sky-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
              autoFocus
            />
            {erro && <p className="text-red-600 text-sm">{erro}</p>}
            <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition-colors">
              Entrar
            </button>
          </form>
          <p className="text-center text-xs mt-4">
            <a href="/" className="text-gray-700 hover:underline">Voltar ao app</a>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-sky-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo-hug.png" alt="Logo HUG" className="w-16 h-auto" />
            <h1 className="text-2xl font-bold text-sky-700">Painel RH</h1>
          </div>
          <button onClick={() => setAutenticado(false)} className="text-sm text-gray-700 hover:underline">Sair</button>
        </div>

        <div className="flex gap-6 items-start">

          {/* Coluna esquerda — Cadastro */}
          <div className="w-72 shrink-0">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-sky-700 mb-4">Novo Colaborador</h2>
              <form onSubmit={cadastrar} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Senha</label>
                  <input
                    type="text"
                    value={novoSenha}
                    onChange={(e) => setNovoSenha(e.target.value)}
                    placeholder="Ex: 12"
                    className="w-full border border-sky-200 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nome</label>
                  <input
                    type="text"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    placeholder="Ex: CARLOS"
                    className="w-full border border-sky-200 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Setor</label>
                  <input
                    type="text"
                    value={novoSetor}
                    onChange={(e) => setNovoSetor(e.target.value)}
                    placeholder="Ex: FINANCEIRO"
                    className="w-full border border-sky-200 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                  Incluir Colaborador
                </button>
                {msgCadastro && (
                  <p className={`text-xs mt-1 ${msgCadastro.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
                    {msgCadastro}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Coluna direita — Relatório e lista */}
          <div className="flex-1 space-y-6">

            {/* Relatório */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-sky-700 mb-4">Exportar Relatório Mensal</h2>
              <div className="flex gap-3">
                <input
                  type="month"
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  className="border border-sky-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  onClick={exportarRelatorio}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
                >
                  Baixar CSV
                </button>
              </div>
              {mensagem && <p className="mt-2 text-sm text-gray-600">{mensagem}</p>}
            </div>

            {/* Lista de colaboradores */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-sky-700 mb-4">Colaboradores ({colaboradores.length})</h2>
              {colaboradores.length === 0 ? (
                <p className="text-gray-400 text-sm">Nenhum colaborador cadastrado.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-sky-600 border-b border-sky-100">
                      <th className="pb-2">Senha</th>
                      <th className="pb-2">Nome</th>
                      <th className="pb-2">Setor</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {colaboradores.map((c) => (
                      <tr key={c.matricula} className="border-b border-sky-50 last:border-0">
                        <td className="py-2 text-gray-600">{c.matricula}</td>
                        <td className="py-2 font-medium text-gray-800">{c.nome}</td>
                        <td className="py-2 text-gray-600">{c.departamento}</td>
                        <td className="py-2">
                          <button
                            onClick={() => remover(c.matricula)}
                            className="text-red-400 hover:text-red-600 text-xs"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
