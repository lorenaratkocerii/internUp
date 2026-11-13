import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { VerificationStatus } from '../../../domain/university/studentVerification';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { WorkspaceError, WorkspaceLoading } from '../../company-workspace/components/WorkspaceStatus';
import { formatDay } from '../../company-workspace/utils/format';
import { UniversityWorkspace } from '../components/UniversityWorkspace';
import { useUniversityOverview } from '../hooks/useUniversityOverview';

export function UniversityStudentsPage({ useCases }) {
  useDocumentTitle('Studentët e verifikuar');
  const { status, data, error } = useUniversityOverview(useCases);
  const [query, setQuery] = useState('');

  const students = useMemo(
    () => (data?.requests ?? []).filter((request) => request.status === VerificationStatus.VERIFIED),
    [data],
  );
  const visible = students.filter((student) =>
    `${student.student.name} ${student.program} ${student.faculty} ${student.studentNumber}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  return (
    <UniversityWorkspace title="Studentët" university={data?.university} pendingCount={data?.counts.pending}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl text-cream">Studentët e verifikuar</h2>
          <p className="mt-2 max-w-2xl text-cream/65">Këtë listë e sheh vetëm universiteti. Aplikimet dhe pranimet janë ato që studenti ka bërë në InternUp.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <label htmlFor="kerko-student" className="sr-only">Kërko student</label>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-cream/60" />
          <input
            id="kerko-student"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Emri, drejtimi, indeksi…"
            className="min-h-11 w-full rounded-lg border border-cream/25 bg-charcoal/50 pr-3 pl-9 text-sm text-cream placeholder:text-cream/45"
          />
        </div>
      </div>

      {status === 'loading' && !data && <WorkspaceLoading />}
      {status === 'error' && <WorkspaceError error={error} />}

      {data && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-cream/15 bg-cream text-charcoal">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-charcoal/15 text-xs text-charcoal/60">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Studenti</th>
                <th scope="col" className="px-3 py-3 font-semibold">Indeksi</th>
                <th scope="col" className="px-3 py-3 font-semibold">Viti</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">Aplikime</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">Pranime</th>
                <th scope="col" className="px-5 py-3 font-semibold">Verifikuar</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((student) => (
                <tr key={student.id} className="border-t border-charcoal/10 first:border-t-0">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold">{student.student.name}</p>
                    <p className="text-xs text-charcoal/60">{student.program}</p>
                  </td>
                  <td className="px-3 py-3.5 tabular-nums">{student.studentNumber}</td>
                  <td className="px-3 py-3.5">{student.studyYear}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums">{student.applicationCount}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums">
                    {student.acceptedCount ? (
                      <span className="rounded-full bg-olive/15 px-2 py-0.5 font-semibold text-olive">{student.acceptedCount}</span>
                    ) : (
                      <span className="text-charcoal/40">0</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-charcoal/65">{formatDay(student.decidedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && (
            <div className="px-5 py-8">
              <p className="text-charcoal/70">
                {students.length ? 'Asnjë student nuk përputhet me kërkimin.' : 'Ende nuk ke verifikuar asnjë student.'}
              </p>
            </div>
          )}
        </div>
      )}
    </UniversityWorkspace>
  );
}
