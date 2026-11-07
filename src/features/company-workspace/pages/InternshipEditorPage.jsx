import { ArrowLeft } from 'lucide-react';
import { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { draftFromInternship, emptyInternshipDraft } from '../../../domain/internship/internshipDraft';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { CompanyWorkspace } from '../components/CompanyWorkspace';
import { InternshipForm } from '../components/InternshipForm';
import { WorkspaceError, WorkspaceLoading } from '../components/WorkspaceStatus';
import { useWorkspaceData } from '../hooks/useWorkspaceData';

export function InternshipEditorPage({ useCases }) {
  const { internshipId } = useParams();
  const isEdit = Boolean(internshipId);
  useDocumentTitle(isEdit ? 'Ndrysho pozitën' : 'Publiko pozitë');
  const actor = useCurrentActor();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    const company = await useCases.getMyCompany(actor);
    const internship = isEdit ? await useCases.getMyInternship(actor, internshipId) : null;
    return { company, internship };
  }, [useCases, actor, isEdit, internshipId]);
  const { status, data, error } = useWorkspaceData(load);

  const submit = async (values) => {
    const saved = isEdit
      ? await useCases.updateInternship(actor, internshipId, values)
      : await useCases.publishInternship(actor, values);
    navigate('/kompani/pozitat', {
      state: { flash: isEdit ? `Ndryshimet te "${saved.title}" u ruajtën.` : `Pozita "${saved.title}" u publikua dhe është e dukshme për studentët.` },
    });
  };

  return (
    <CompanyWorkspace title={isEdit ? 'Ndrysho pozitën' : 'Publiko pozitë'} subtitle="Formulari i pozitës" companyName={data?.company.name}>
      <Link to="/kompani/pozitat" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cream/75 hover:text-cream">
        <ArrowLeft aria-hidden="true" className="size-4" /> Kthehu te Manage Internships
      </Link>
      <div className="mt-2 mb-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-cream/50 uppercase">Manage Internships</p>
        <h2 className="mt-2 font-display text-4xl text-cream">{isEdit ? 'Ndrysho pozitën' : 'Publiko një pozitë të re'}</h2>
        <p className="mt-2 text-cream/65">
          {isEdit ? 'Ndryshimet shfaqen menjëherë te faqja publike e pozitës.' : 'Pozita shfaqet te profili publik i kompanisë sapo të publikohet.'}
        </p>
      </div>

      {status === 'loading' && !data && <WorkspaceLoading />}
      {status === 'error' && <WorkspaceError error={error} />}
      {data && (
        <InternshipForm
          key={internshipId ?? 'e-re'}
          initialValues={data.internship ? draftFromInternship(data.internship) : emptyInternshipDraft({ location: data.company.location })}
          validate={useCases.validateInternshipDraft}
          onSubmit={submit}
          submitLabel={isEdit ? 'Ruaj ndryshimet' : 'Publiko pozitën'}
        />
      )}
    </CompanyWorkspace>
  );
}
