interface FormSectionProps {
  title: string
  children: React.ReactNode
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</h2>
      {children}
    </div>
  )
}
