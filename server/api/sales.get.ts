import { readFile } from 'fs/promises'
import { join } from 'path'
import { Sale } from '~/types'

export default eventHandler(async () => {
 const filePath = join(process.cwd(), 'data', 'sales.json')

  const text = await readFile(filePath, 'utf-8')
  const raw = JSON.parse(text) as any[]
  const data: Sale[] = raw.map((item: any) => {
    const year = new Date().getFullYear()
    const parsed = new Date(`${item.date} ${year}`)
    return {
      ...item,
      date: parsed.toISOString(),
      amount: Number(String(item.amount).replace(/[^\d.]/g, '')),
      revenue: Number(String(item.revenue).replace(/[^\d.]/g, ''))
    }
  })

  // optional: simple sanity check
  if (!Array.isArray(data)) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid sales.json format'
    })
  }

  return data
})