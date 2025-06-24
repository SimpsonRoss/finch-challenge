import React from 'react';
import type { Individual } from '@/types/finch';
import { useRouter } from 'next/navigation';

/**
 * EmployeeList: Displays a table of employees with navigation to detail pages
 */

interface EmployeeListProps {
  employees: Individual[];
}

export default function EmployeeList({ employees }: EmployeeListProps) {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Employees:</h2>

      {employees.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-gray-200 bg-white rounded shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-bold text-black-500">
                  First Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-bold text-black-500">
                  Last Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-bold text-black-500">
                  ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/employee/${emp.id}`)}
                >
                  <td className="px-4 py-3 text-sm text-black-700">
                    {emp.first_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-black-700">
                    {emp.last_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{emp.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No employees found.</p>
      )}
    </div>
  );
}
