import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Matematică pentru copii - Clasa 0-2';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom right, #fbbf24, #f59e0b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>
          📚 Matematică 🎯
        </div>
        <div style={{ fontSize: 48, marginBottom: 30 }}>
          pentru copii clasa 0-2
        </div>
        <div
          style={{
            fontSize: 36,
            display: 'flex',
            gap: 40,
            marginTop: 20,
          }}
        >
          <span>✅ Tabele</span>
          <span>✅ Teste</span>
          <span>✅ Calculator</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
