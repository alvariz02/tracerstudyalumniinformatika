'use client'

interface CompetencyRow {
  key: string
  label: string
}

interface CompetencyTableProps {
  rows: CompetencyRow[]
  values: Record<string, number | null>
  onChange: (key: string, val: number) => void
  ratingLabels?: [string, string]
}

export default function CompetencyTable({ rows, values, onChange, ratingLabels }: CompetencyTableProps) {
  const labels = ratingLabels ?? ['Sangat rendah', 'Sangat tinggi']
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left text-xs font-medium text-slate-400 pb-2 pr-4 min-w-[160px]">Kompetensi</th>
            <th colSpan={5} className="text-center text-xs font-medium text-slate-400 pb-2">
              <div className="flex justify-between px-1">
                <span>{labels[0]}</span>
                <span>{labels[1]}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-slate-50 last:border-0">
              <td className="py-3 pr-4 text-slate-700 font-medium text-sm">{row.label}</td>
              <td className="py-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((n, i) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => onChange(row.key, n)}
                      className={[
                        'rating-btn',
                        i > 0 ? '-ml-px' : '',
                        values[row.key] === n ? 'active' : '',
                      ].join(' ')}
                      aria-label={`${row.label}: ${n} dari 5`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
