export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal figma-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-decor" aria-hidden="true">
          <span className="modal-decor-back" />
          <span className="modal-decor-front" />
        </div>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
