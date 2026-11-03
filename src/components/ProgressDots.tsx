export function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === current ? 'w-6 bg-brass' : i < current ? 'w-1.5 bg-mint/70' : 'w-1.5 bg-line'
          }`}
        />
      ))}
    </div>
  )
}
