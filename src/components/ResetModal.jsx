export default function ResetModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-mc-card border-2 border-red-500/50 rounded-xl w-full max-w-sm shadow-2xl p-6 space-y-5">
        <div className="text-center space-y-2">
          <div className="text-4xl">⚠️</div>
          <h2 className="font-minecraft text-red-400" style={{ fontSize: '10px' }}>Reset Progress?</h2>
          <p className="font-ui text-mc-muted text-sm">
            This will permanently delete all your caught fish, dates, and notes. This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-mc-surface border border-mc-border rounded-lg font-ui text-mc-text text-sm hover:border-mc-green transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg font-ui text-sm hover:bg-red-500/30 transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  )
}
