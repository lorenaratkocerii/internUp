import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useAsyncData } from '../../home/hooks/useAsyncData';
import { AdminRowForm } from './AdminRowForm';

const formatCell = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Po' : 'Jo';
  return String(value);
};

export function AdminTableView({ table, useCases }) {
  const [version, setVersion] = useState(0);
  const load = useCallback(() => useCases.getTableRows(table.id), [useCases, table.id, version]);
  const { status, data } = useAsyncData(load);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);

  const reload = () => setVersion((current) => current + 1);

  const handleSaved = (text) => {
    setEditing(null);
    setMessage({ type: 'success', text });
    reload();
  };

  const handleDelete = async (row) => {
    const warning = table.deleteWarning ? `\n\n${table.deleteWarning}` : '';
    if (!window.confirm(`A je i sigurt që do ta fshish rreshtin "${row.id}"?${warning}`)) return;
    try {
      await useCases.deleteRow(table.id, row.id);
      setMessage({ type: 'success', text: 'Rreshti u fshi.' });
      reload();
    } catch (deleteError) {
      setMessage({ type: 'error', text: deleteError.message });
    }
  };

  return (
    <section aria-labelledby="tabela-titulli">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-cream/45 uppercase">Homepage · {table.id}</p>
          <h1 id="tabela-titulli" className="font-display text-3xl font-medium tracking-tight">{table.label}</h1>
        </div>
        <div className="flex items-center gap-3">
          {status === 'success' && <span className="text-sm text-cream/55">{data.length} rreshta</span>}
          <button
            type="button"
            onClick={() => {
              setMessage(null);
              setEditing({ row: null });
            }}
            className="inline-flex min-h-10 items-center gap-2 rounded-[10px] bg-cream px-4 text-sm font-semibold text-charcoal hover:bg-cream/90"
          >
            <Plus aria-hidden="true" className="size-4" />
            Shto rresht
          </button>
        </div>
      </div>

      {message && (
        <p
          role={message.type === 'error' ? 'alert' : 'status'}
          className={`mb-4 rounded-[10px] border p-3 text-sm ${
            message.type === 'error' ? 'border-terracotta/40 bg-terracotta/10' : 'border-cream/15 bg-cream/[0.05]'
          }`}
        >
          {message.text}
        </p>
      )}

      {status === 'loading' && !data && <p className="text-sm text-cream/60">Duke u ngarkuar…</p>}
      {status === 'error' && (
        <p role="alert" className="rounded-[10px] border border-terracotta/40 bg-terracotta/10 p-4 text-sm">
          Të dhënat nuk u ngarkuan. Sigurohu që API është duke punuar.
        </p>
      )}
      {data && status !== 'error' && (
        <div className="overflow-x-auto rounded-[14px] border border-cream/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream/[0.05] text-xs tracking-wide text-cream/60 uppercase">
              <tr>
                {table.columns.map((column) => (
                  <th key={column.key} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                    {column.label}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/10">
              {data.length === 0 && (
                <tr>
                  <td colSpan={table.columns.length + 1} className="px-4 py-6 text-center text-cream/55">
                    Tabela është e zbrazët.
                  </td>
                </tr>
              )}
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-cream/[0.03]">
                  {table.columns.map((column) => (
                    <td key={column.key} className="max-w-xs truncate px-4 py-3 text-cream/85" title={formatCell(row[column.key])}>
                      {formatCell(row[column.key])}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        setMessage(null);
                        setEditing({ row });
                      }}
                      className="inline-grid size-9 place-items-center rounded-[10px] text-cream/70 hover:bg-cream/[0.08] hover:text-cream"
                      aria-label={`Ndrysho ${row.id}`}
                    >
                      <Pencil aria-hidden="true" className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      className="inline-grid size-9 place-items-center rounded-[10px] text-cream/70 hover:bg-terracotta/20 hover:text-cream"
                      aria-label={`Fshi ${row.id}`}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <AdminRowForm table={table} row={editing.row} useCases={useCases} onCancel={() => setEditing(null)} onSaved={handleSaved} />
      )}
    </section>
  );
}
