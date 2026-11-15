import { useState } from 'react';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { formatDay } from '../../company-workspace/utils/format';
import { AdminWorkspace } from '../components/AdminWorkspace';
import { actionButton, HomeBadge, SectionIntro } from '../components/adminUi';
import { InlineEditor } from '../components/InlineEditor';
import { useAdminHome } from '../hooks/useAdminHome';

const EDIT_FIELDS = [{ name: 'title', label: 'Titulli', maxLength: 160 }];

export function AdminInternshipsPage({ useCases }) {
  useDocumentTitle('Praktikat në ballinë');
  const admin = useAdminHome(useCases);
  const { actor, busy, change } = admin;
  const [editingId, setEditingId] = useState(null);

  const update = (internship, changes, message) =>
    change('internships', () => useCases.updateInternship(actor, internship.id, changes), message);

  return (
    <AdminWorkspace title="Praktikat" admin={admin}>
      {(data) => (
        <>
          <SectionIntro title="Praktikat e veçuara" />

          <ul className="mt-6 border-t border-cream/15">
            {data.internships.map((internship) => (
              <li key={internship.id} className="border-b border-cream/15 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-cream">{internship.title}</p>
                    <p className="text-sm text-cream/60">
                      {internship.company}, {internship.location}. Mbyllet më {formatDay(internship.closesAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <HomeBadge onHome={internship.onHome} />
                    <button
                      type="button"
                      className={actionButton}
                      disabled={busy}
                      onClick={() =>
                        update(
                          internship,
                          { featured: !internship.featured },
                          internship.featured ? 'Praktika u hoq nga ballina.' : 'Praktika u veçua në ballinë.',
                        )
                      }
                    >
                      {internship.featured ? 'Hiq nga ballina' : 'Shfaq në ballinë'}
                    </button>
                    <button
                      type="button"
                      className={actionButton}
                      disabled={busy}
                      onClick={() => setEditingId(editingId === internship.id ? null : internship.id)}
                    >
                      Ndrysho
                    </button>
                  </div>
                </div>
                {editingId === internship.id && (
                  <InlineEditor
                    idPrefix={`praktike-${internship.id}`}
                    fields={EDIT_FIELDS}
                    initialValues={{ title: internship.title }}
                    busy={busy}
                    onCancel={() => setEditingId(null)}
                    onSave={(changes) => update(internship, changes, 'Praktika u ruajt.')}
                  />
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </AdminWorkspace>
  );
}
