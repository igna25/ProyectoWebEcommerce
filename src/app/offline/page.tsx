export default function OfflinePage() {
  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
        .wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f3f4f6;text-align:center;padding:24px}
        .title{font-size:1.875rem;font-weight:700;color:#111827;margin-bottom:12px}
        .desc{color:#374151;max-width:420px;line-height:1.6}
        .badge{margin-bottom:24px;background:#fee2e2;color:#991b1b;border-radius:9999px;padding:6px 16px;font-size:0.875rem;font-weight:500}
      `}</style>
      <div className="wrap">
        <span className="badge">Sin conexión</span>
        <h1 className="title">Estás sin conexión</h1>
        <p className="desc">
          No pudimos conectarnos a internet. Podés seguir navegando el contenido
          ya visitado. Cuando recuperes la conexión, actualizaremos la
          información automáticamente.
        </p>
      </div>
    </>
  );
}
