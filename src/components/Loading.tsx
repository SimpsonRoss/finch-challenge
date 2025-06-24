'use client';
import React from 'react';

/**
 * Loading: Displays a centered spinner and loading text
 */

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-8">
      <svg
        className="animate-spin h-6 w-6 text-gray-400 opacity-75"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4z"
        />
      </svg>
      <span className="ml-2 text-gray-600">Loading…</span>
    </div>
  );
}
