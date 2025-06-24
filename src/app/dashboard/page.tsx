'use client';

import { useEffect, useState } from 'react';
import CompanyCard from '@/components/CompanyCard';
import EmployeeList from '@/components/EmployeeList';
import Loading from '@/components/Loading';
import type { Company, DirectoryResponse, Individual } from '@/types/finch';

/**
 * Dashboard: Displays company and employee directory information
 */

export default function Dashboard() {
  const [company, setCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Individual[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const companyRes = await fetch('/api/company', { credentials: 'include' });
        if (!companyRes.ok) {
          if (companyRes.status === 501) {
            throw new Error('Sorry—this provider does not support company data.');
          }
          throw new Error('Company fetch failed');
        }
        const companyData = (await companyRes.json()) as Company;
        setCompany(companyData);

        const directoryRes = await fetch('/api/directory', { credentials: 'include' });
        if (!directoryRes.ok) {
          if (directoryRes.status === 501) {
            throw new Error('Sorry—this provider does not support directory data.');
          }
          throw new Error('Directory fetch failed');
        }
        const dirData = (await directoryRes.json()) as DirectoryResponse;
        setEmployees(dirData.individuals || []);
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

    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <main className="p-4 w-full md:w-3/5 mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">Company Information</h1>

      {company && (
        <div className="mb-6">
          <CompanyCard company={company} />
        </div>
      )}

      <EmployeeList employees={employees} />
    </main>
  );
}
