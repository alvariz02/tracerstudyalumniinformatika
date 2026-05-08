interface FieldLabelProps {
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}

export default function FieldLabel({ htmlFor, required, children, hint }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
      {hint && (
        <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {hint}
        </span>
      )}
    </label>
  )
}
