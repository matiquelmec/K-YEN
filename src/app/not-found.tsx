import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Página no encontrada - KÜYEN</h1>
      <p>La página que buscas no existe.</p>
      <Link href="/" style={{ color: 'blue' }}>Volver al inicio</Link>
    </div>
  );
}