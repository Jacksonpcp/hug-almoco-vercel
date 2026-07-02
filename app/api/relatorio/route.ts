import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const senha = searchParams.get('senha')
  const mes = searchParams.get('mes')

  if (senha !== process.env.RH_SENHA) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 })
  }

  if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
    return NextResponse.json({ erro: 'Mês inválido. Use o formato AAAA-MM.' }, { status: 400 })
  }

  const db = getPool()
  const result = await db.query(
    `SELECT
       c.matricula,
       col.nome,
       c.data
     FROM confirmacoes c
     JOIN colaboradores col ON col.matricula = c.matricula
     WHERE c.data LIKE $1
     ORDER BY col.nome, c.data`,
    [`${mes}%`]
  )

  const formatarData = (iso: string) => {
    const [ano, m, dia] = iso.split('-')
    return `${dia}/${m}/${ano}`
  }

  const csv = [
    'Senha;Nome;Data;Almoço',
    ...result.rows.map((r) =>
      `${r.matricula};"${r.nome}";${formatarData(r.data)};1`
    ),
  ].join('\n')

  const bom = '﻿'

  return new NextResponse(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="relatorio-almoco-${mes}.csv"`,
    },
  })
}
