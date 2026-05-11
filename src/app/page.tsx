export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
      <main style={{ background: 'var(--surface)', padding: '3rem', borderRadius: 'var(--radius-max)', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', maxWidth: '600px', width: '100%' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2rem', color: 'var(--primary)' }}>Next.js Fullstack Engine</h1>
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--foreground)', opacity: 0.8 }}>
          SPA First UI dengan Clean Architecture.
        </p>
        
        <div style={{ padding: '1.5rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>✅ Fase 5 Selesai</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.9 }}>
            <li>✔️ Desain Layout Dashboard Premium (Sidebar + Header)</li>
            <li>✔️ Layout SPA Tanpa Full Reload (`{'<Link>'}`)</li>
            <li>✔️ Komponen Proteksi RBAC Frontend (`{'<Protect>'}`)</li>
            <li>✔️ Layout Landing/Login Minimalis Premium</li>
            <li>✔️ Global Loading States Interaktif</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <button className="btn" style={{ background: 'var(--primary)', color: 'white', fontWeight: 'bold' }}>
            Lanjut ke Fase 6
          </button>
        </div>
      </main>
    </div>
  );
}
