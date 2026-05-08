'use client'

interface RatingButtons4Props {
  id: string
  value: number | null
  onChange: (val: number) => void
  labels?: [string, string, string, string] // [1, 2, 3, 4 labels]
}

export default function RatingButtons4({ id, value, onChange, labels }: RatingButtons4Props) {
  const defaultLabels = ['Sangat Baik', 'Baik', 'Cukup', 'Kurang']
  const displayLabels = labels || defaultLabels

  return (
    <div>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((n, i) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={[
              'flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-all',
              value === n
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50',
            ].join(' ')}
            aria-label={`${displayLabels[i]} (${n})`}
          >
            <div className="text-xs opacity-70 mb-1">{n}</div>
            <div className="text-xs leading-tight">{displayLabels[i]}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
