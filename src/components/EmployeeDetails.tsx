'use client';

import React from 'react';
import RenderValue, { formatKey } from './RenderValue';

/**
 * EmployeeDetails: Displays a titled section of key-value pairs for an employee or related object
 */

interface EmployeeDetailsProps<T> {
  title: string;
  data: T;
}

export default function EmployeeDetails<T extends Record<string, unknown>>({
  title,
  data,
}: EmployeeDetailsProps<T>) {
  return (
    <section className="mb-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {Object.entries(data).map(([key, val]) => (
          <React.Fragment key={key}>
            <dt className="text-sm font-medium text-gray-500">
              {formatKey(key)}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              <RenderValue value={val} />
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </section>
  );
}
