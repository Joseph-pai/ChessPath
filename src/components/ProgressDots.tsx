export function ProgressDots({
  total,
  current,
  onSelect,
}: {
  total: number
  current: number
  onSelect?: (index: number) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect?.(i)}
          title={onSelect ? `第 ${i + 1} 步` : undefined}
          className={`h-4 rounded-full transition-all ${
            i === current ? 'w-6 bg-brass' : i < current ? 'w-1.5 bg-mint/70' : 'w-1.5 bg-line'
          } ${onSelect ? 'cursor-pointer hover:opacity-75' : ''}`}
        />
      ))}
    </div>
  )
}
