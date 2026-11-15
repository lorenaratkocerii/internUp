import { WorkspaceError, WorkspaceLoading } from '../../company-workspace/components/WorkspaceStatus';

export function AdminWorkspace({ title, admin, children }) {
  const { status, data, error, flash } = admin;

  return (
    <section aria-label={title}>
      {status === 'loading' && !data && <WorkspaceLoading />}
      {status === 'error' && <WorkspaceError error={error} />}
      {data && children(data)}
      {flash && (
        <p
          role={flash.tone === 'error' ? 'alert' : 'status'}
          className={`fixed inset-x-4 bottom-6 z-40 mx-auto max-w-md px-4 py-3 text-center text-sm font-semibold shadow-2xl ${
            flash.tone === 'error' ? 'bg-burgundy text-cream' : 'bg-cream text-charcoal'
          }`}
        >
          {flash.message}
        </p>
      )}
    </section>
  );
}
