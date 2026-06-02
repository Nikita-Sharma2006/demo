import { LoaderCircle } from 'lucide-react'

function Loader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-64 items-center justify-center">
      <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
        <LoaderCircle className="h-5 w-5 animate-spin text-slate-950" aria-hidden="true" />
        <span>{label}</span>
      </div>
    </div>
  )
}

export default Loader
