'use client';

import { useState } from 'react';

/**
 * ConnectPage: Collects customer info and initiates Finch Connect flow
 */

export default function ConnectPage() {
  const [customerId, setCustomerId]     = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const hasHtmlTags = (s: string) => /[<>]/.test(s);

  const nameError = customerName && hasHtmlTags(customerName)
    ? 'Company Name cannot include angle-brackets (< or >).'
    : null;

  const canConnect =
    customerId.trim()    !== '' &&
    customerName.trim()  !== '' &&
    !nameError &&
    !loading;

  async function handleConnect() {
    setError(null);

    if (nameError) {
      return; 
    }

    setLoading(true);
    const res = await fetch('/api/createLinkToken', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ customerId, customerName }),
    });

    if (!res.ok) {
      const { error: apiError } = await res.json().catch(() => ({}));
      setError(apiError || 'Failed to start Finch Connect.');
      setLoading(false);
      return;
    }

    const { connect_url } = await res.json();
    setTimeout(() => window.location.href = connect_url, 500);
  }

  return (
    <main className="p-4 max-w-md mx-auto mt-50">
      <h1 className="text-2xl font-bold mb-4 text-center">HR Connect</h1>

      <label className="block mb-4">
        <span className="block text-sm font-bold">Customer ID</span>
        <input
          type="text"
          value={customerId}
          onChange={e => setCustomerId(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          placeholder="e.g. acme-42"
        />
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-bold">Company Name</span>
        <input
          type="text"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          className={`mt-1 block w-full border rounded p-2 ${
            nameError ? 'border-red-500' : ''
          }`}
          placeholder="e.g. Acme Corporation"
        />
      </label>
      {nameError && (
        <p className="text-red-600 text-sm mb-4">{nameError}</p>
      )}

      {error && (
        <p className="text-red-600 mb-2">{error}</p>
      )}

      <button
        onClick={handleConnect}
        disabled={!canConnect}
        className={`w-full px-4 py-2 rounded text-white ${
          loading       ? 'bg-gray-400' :
          canConnect    ? 'bg-blue-600 hover:bg-blue-700' :
                          'bg-gray-300'
        }`}
      >
        {loading ? 'Preparing…' : 'Connect to provider'}
      </button>
    </main>
  );
}
