'use client';

import React from 'react';
import type { Company } from '@/types/finch';

/**
 * CompanyCard: Displays company information in a semantic, accessible format
 */

function formatKey(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (str) => str.toUpperCase());
}

function RenderValue({ value }: { value: unknown }) {
  if (value == null) {
    return <span className="text-gray-400 italic">N/A</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-400 italic">N/A</span>;
    return (
      <ul className="list-disc list-outside ml-6 space-y-1">
        {value.map((item, idx) => (
          <li key={idx}>
            <RenderValue value={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === 'object') {
    return (
      <div className="ml-6 space-y-1">
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <div key={k}>
            <span className="font-medium">{formatKey(k)}:</span>{' '}
            <RenderValue value={v} />
          </div>
        ))}
      </div>
    );
  }
  return <span className="text-gray-900">{String(value)}</span>;
}

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Company:</h2>
      <h3 className="text-md font-bold mb-4">Name: {company.legal_name}</h3>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {Object.entries(company)
          .filter(([key]) => key !== 'legal_name')
          .map(([key, value]) => (
            <React.Fragment key={key}>
              <dt className="text-sm font-bold text-gray-600">{formatKey(key)}</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <RenderValue value={value} />
              </dd>
            </React.Fragment>
          ))}
      </dl>
    </section>
  );
}
