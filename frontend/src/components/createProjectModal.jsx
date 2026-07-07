export default function CreateProjectModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}>
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', color: '#fff' }}
        onClick={e => e.stopPropagation()}>
        Create Project Modal — coming soon
      </div>
    </div>
  );
}