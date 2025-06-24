'use client';

import React from 'react';

/**
 * RenderValue: Recursively renders any value (primitive, array, or object) in a readable format
 */

export function formatKey(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (str) => str.toUpperCase());
}

interface RenderValueProps {
  value: unknown;
}

export default function RenderValue({ value }: RenderValueProps) {
  if (value === null || value === undefined) {
    return <em className="text-gray-400">N/A</em>;
  }

  // Arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <em className="text-gray-400">N/A</em>;
    }
    return (
      <ul className="ml-4 list-disc">
        {value.map((item, i) => (
          <li key={i}>
            <RenderValue value={item} />
          </li>
        ))}
      </ul>
    );
  }

  // Objects
  if (typeof value === 'object') {
    return (
      <div className="ml-4 space-y-1">
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <div key={k}>
            <strong>{formatKey(k)}:</strong>{' '}
            <RenderValue value={v} />
          </div>
        ))}
      </div>
    );
  }

  // Primitives (string, number, boolean, etc.)
  return <span>{String(value)}</span>;
}
