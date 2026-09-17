export default function SeatLegend() {
  const items = [
    { label: 'Disponible', color: 'bg-surface-600' },
    { label: 'Seleccionado', color: 'bg-gold-400' },
    { label: 'Ocupado', color: 'bg-surface-800 opacity-30' },
    { label: 'VIP', color: 'bg-vip-purple/30' },
    { label: 'Accesible', color: 'bg-imax-blue/30' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-sm ${item.color}`} />
          <span className="text-xs text-text-secondary">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
