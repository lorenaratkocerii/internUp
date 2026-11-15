import { useState } from 'react';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { formatDay } from '../../company-workspace/utils/format';
import { AdminWorkspace } from '../components/AdminWorkspace';
import { actionButton, HomeBadge, SectionIntro } from '../components/adminUi';
import { InlineEditor } from '../components/InlineEditor';
import { useAdminHome } from '../hooks/useAdminHome';

const EDIT_FIELDS = [
  { name: 'title', label: 'Titulli', maxLength: 160 },
  { name: 'excerpt', label: 'Përmbledhja', maxLength: 255, multiline: true },
];

export function AdminStoriesPage({ useCases }) {
  useDocumentTitle('Historitë në ballinë');
  const admin = useAdminHome(useCases);
  const { actor, busy, change } = admin;
  const [editingId, setEditingId] = useState(null);

  const update = (story, changes, message) =>
    change('stories', () => useCases.updateStory(actor, story.id, changes), message);

  return (
    <AdminWorkspace title="Historitë" admin={admin}>
      {(data) => (
        <>
          <SectionIntro title="Eksperiencat e studentëve" />

          <ul className="mt-6 border-t border-cream/15">
            {data.stories.map((story) => (
              <li key={story.id} className="border-b border-cream/15 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 max-w-xl">
                    <p className="font-semibold text-cream">{story.title}</p>
                    <p className="text-sm text-cream/60">
                      {[story.authorName || 'Student anonim', story.companyName, formatDay(story.publishedAt)]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <HomeBadge onHome={story.onHome} />
                    <button
                      type="button"
                      className={actionButton}
                      disabled={busy}
                      aria-pressed={story.featured}
                      onClick={() =>
                        update(
                          story,
                          { featured: !story.featured },
                          story.featured ? 'Fiksimi u hoq.' : 'Historia u fiksua në ballinë.',
                        )
                      }
                    >
                      {story.featured ? 'Hiq fiksimin' : 'Fikso në ballinë'}
                    </button>
                    <button
                      type="button"
                      className={actionButton}
                      disabled={busy}
                      onClick={() => setEditingId(editingId === story.id ? null : story.id)}
                    >
                      Ndrysho
                    </button>
                  </div>
                </div>
                {editingId === story.id && (
                  <InlineEditor
                    idPrefix={`histori-${story.id}`}
                    fields={EDIT_FIELDS}
                    initialValues={{ title: story.title, excerpt: story.excerpt }}
                    busy={busy}
                    onCancel={() => setEditingId(null)}
                    onSave={(changes) => update(story, changes, 'Historia u ruajt.')}
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
