'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      fetch('/api/token', {
        method: 'POST',
        credentials: 'include',   
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
        .then(() => router.push('/dashboard'))
        .catch((err) => console.error('Token exchange failed', err));
    }
  }, [searchParams, router]);

  return <Loading />;
}