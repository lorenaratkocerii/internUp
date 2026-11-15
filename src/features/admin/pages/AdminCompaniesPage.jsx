import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { AdminWorkspace } from '../components/AdminWorkspace';
import { actionButton, HomeBadge, iconButton, SectionIntro } from '../components/adminUi';
import { InlineEditor } from '../components/InlineEditor';
import { useAdminHome } from '../hooks/useAdminHome';

const EDIT_FIELDS = [
  { name: 'name', label: 'Emri', maxLength: 120 },
  { name: 'industry', label: 'Industria', maxLength: 80 },
];

export function AdminCompaniesPage({ useCases }) {
  useDocumentTitle('Kompanitë partnere');
  const admin = useAdminHome(useCases);
  const { actor, busy, change } = admin;
  const [editingId, setEditingId] = useState(null);

  return (
    <AdminWorkspace title="Kompanitë partnere" admin={admin}>
      {(data) => {
        const partners = data.companies.filter((company) => company.isPartner);
        const others = data.companies.filter((company) => !company.isPartner);
        const partnerIds = partners.map((company) => company.id);

        const savePartners = (ids, message) =>
          change('companies', () => useCases.setPartnerCompanies(actor, ids), message);

        const move = (index, offset) => {
          const ids = [...partnerIds];
          [ids[index], ids[index + offset]] = [ids[index + offset], ids[index]];
          return savePartners(ids, 'Renditja u ruajt.');
        };

        const renderCompany = (company, actions) => (
          <li key={company.id} className="border-b border-cream/15 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-cream">{company.name}</p>
                <p className="text-sm text-cream/60">
                  {company.industry}, {company.location}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {actions}
                <button
                  type="button"
                  className={actionButton}
                  disabled={busy}
                  onClick={() => setEditingId(editingId === company.id ? null : company.id)}
                >
                  Ndrysho
                </button>
              </div>
            </div>
            {editingId === company.id && (
              <InlineEditor
                idPrefix={`kompani-${company.id}`}
                fields={EDIT_FIELDS}
                initialValues={{ name: company.name, industry: company.industry }}
                busy={busy}
                onCancel={() => setEditingId(null)}
                onSave={(changes) =>
                  change('companies', () => useCases.updateCompany(actor, company.id, changes), 'Kompania u ruajt.')
                }
              />
            )}
          </li>
        );

        return (
          <>
            <SectionIntro title="Partnerët në ballinë" />

            {partners.length === 0 ? (
              <p className="mt-6 border-t border-cream/15 pt-4 text-cream/65">Ende nuk ka kompani partnere.</p>
            ) : (
              <ol className="mt-6 border-t border-cream/15">
                {partners.map((company, index) =>
                  renderCompany(
                    company,
                    <>
                      <HomeBadge onHome={company.onHome} offLabel="Jashtë limitit" />
                      <button
                        type="button"
                        className={iconButton}
                        disabled={busy || index === 0}
                        onClick={() => move(index, -1)}
                        aria-label={`Lëvize ${company.name} lart`}
                      >
                        <ArrowUp aria-hidden="true" className="size-4" />
                      </button>
                      <button
                        type="button"
                        className={iconButton}
                        disabled={busy || index === partners.length - 1}
                        onClick={() => move(index, 1)}
                        aria-label={`Lëvize ${company.name} poshtë`}
                      >
                        <ArrowDown aria-hidden="true" className="size-4" />
                      </button>
                      <button
                        type="button"
                        className={actionButton}
                        disabled={busy}
                        onClick={() =>
                          savePartners(
                            partnerIds.filter((id) => id !== company.id),
                            `${company.name} u hoq nga partnerët.`,
                          )
                        }
                      >
                        Hiq
                      </button>
                    </>,
                  ),
                )}
              </ol>
            )}

            {others.length > 0 && (
              <>
                <h2 className="mt-12 font-display text-2xl text-cream">Kompani të tjera</h2>
                <ul className="mt-4 border-t border-cream/15">
                  {others.map((company) =>
                    renderCompany(
                      company,
                      <button
                        type="button"
                        className={actionButton}
                        disabled={busy}
                        onClick={() => savePartners([...partnerIds, company.id], `${company.name} u shtua te partnerët.`)}
                      >
                        Shto te partnerët
                      </button>,
                    ),
                  )}
                </ul>
              </>
            )}
          </>
        );
      }}
    </AdminWorkspace>
  );
}
