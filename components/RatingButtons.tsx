'use client'

interface RatingButtonsProps {
  id: string
  value: number | null
  onChange: (val: number) => void
  labels?: [string, string] // [low label, high label]
}

export default function RatingButtons({ id, value, onChange, labels }: RatingButtonsProps) {
  return (
    <div>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n, i) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={[
              'rating-btn',
              i > 0 ? '-ml-px' : '',
              value === n ? 'active' : '',
            ].join(' ')}
            aria-label={`${n} dari 5`}
          >
            {n}
          </button>
        ))}
      </div>
      {labels && (
        <div className="flex justify-between mt-1">
          <span className="text-[11px] text-slate-400">{labels[0]}</span>
          <span className="text-[11px] text-slate-400">{labels[1]}</span>
        </div>
      )}
    </div>
  )
}
