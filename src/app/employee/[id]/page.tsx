'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmployeeDetails from '@/components/EmployeeDetails';
import Loading from '@/components/Loading';
import type { Individual, Employment } from '@/types/finch';

/**
 * EmployeePage: Displays individual and employment details for a given employee
 */

export default function EmployeePage() {
  const { id } = useParams();
  const [individual, setIndividual] = useState<Individual|null>(null);
  const [employment, setEmployment] = useState<Employment|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [iRes, eRes] = await Promise.all([
          fetch(`/api/individual/${id}`, { credentials: 'include' }),
          fetch(`/api/employment/${id}`,   { credentials: 'include' }),
        ]);
        if (!iRes.ok) {
          if (iRes.status === 501) throw new Error('Individual data not supported by this provider.');
          throw new Error('Could not load individual');
        }
        if (!eRes.ok) {
          if (eRes.status === 501) throw new Error('Employment data not supported by this provider.');
          throw new Error('Could not load employment');
        }
        const [iData, eData] = await Promise.all([
          iRes.json() as Promise<Individual>,
          eRes.json() as Promise<Employment>,
        ]);
        setIndividual(iData);
        setEmployment(eData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <Loading />;
  if (error)   return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <main className="p-4 w-full md:w-3/5 mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">Employee Information</h1>
      <h3 className="text-lg font-bold mb-4">
        Full name: {individual?.first_name} {individual?.last_name}
      </h3>

      {individual && (
        <EmployeeDetails title="Individual Info" data={individual} />
      )}
      {employment && (
        <EmployeeDetails title="Employment Info" data={employment} />
      )}
    </main>
  );
}
