import { BadgeCheck, CalendarDays, CircleAlert, CircleCheck, ExternalLink, GraduationCap, ShieldCheck, Timer } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { categoryLabel } from '../../../domain/blog/storyTaxonomy';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { CompanyWorkspace } from '../components/CompanyWorkspace';
import { ConfirmDialog } from '../components/FormControls';
import { Flash, WorkspaceError, WorkspaceLoading } from '../components/WorkspaceStatus';
import { useWorkspaceData } from '../hooks/useWorkspaceData';
import { formatDay } from '../utils/format';

const TABS = [
  { id: 'pending', label: 'Në pritje', test: (story) => !story.verified },
  { id: 'verified', label: 'Të verifikuara', test: (story) => story.verified },
  { id: 'all', label: 'Të gjitha', test: () => true },
];

export function VerifyInternsPage({ useCases }) {
  useDocumentTitle('Verifiko interns');
  const actor = useCurrentActor();
  const load = useCallback(async () => {
    const [company, stories] = await Promise.all([useCases.getMyCompany(actor), useCases.listInternStories(actor)]);
    return { company, stories };
  }, [useCases, actor]);
  const { status, data, error, reload } = useWorkspaceData(load);

  const [tab, setTab] = useState('pending');
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(null);

  const stories = useMemo(() => data?.stories ?? [], [data]);
  const visible = stories.filter(TABS.find((item) => item.id === tab).test);

  const apply = async () => {
    setBusy(true);
    try {
      const updated = await useCases.setStoryVerification(actor, pending.story.id, pending.verified);
      await reload();
      setFlash({
        message: updated.verified
          ? `"${updated.title}" tani ka shenjën Verified Intern në Student Blog.`
          : `Verifikimi u hoq nga "${updated.title}".`,
      });
    } catch (applyError) {
      setFlash({ message: applyError.message, tone: 'error' });
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  return (
    <CompanyWorkspace title="Verifiko interns" subtitle="Verifikimi i interns" companyName={data?.company.name}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-cream/50 uppercase">Student Blog</p>
          <h2 className="mt-2 font-display text-4xl text-cream">Verifiko interns</h2>
          <p className="mt-2 max-w-2xl text-cream/65">
            Konfirmoni që studentët që kanë shkruar për praktikën te {data?.company.name ?? 'kompania juaj'} kanë qenë vërtet interns
            tuaj. Historitë e verifikuara marrin shenjën <span className="font-semibold text-cream">Verified Intern</span>.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-xl border border-cream/15 bg-charcoal/60 px-4 py-3 text-sm text-cream/75">
          <ShieldCheck aria-hidden="true" className="size-4" />
          {stories.filter((story) => !story.verified).length} në pritje
        </span>
      </div>
      <Flash message={flash?.message} tone={flash?.tone} />

      {status === 'loading' && !data && <WorkspaceLoading />}
      {status === 'error' && <WorkspaceError error={error} />}

      {data && (
        <>
          <div role="tablist" aria-label="Filtro historitë" className="mt-6 flex flex-wrap gap-2">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${
                  tab === item.id ? 'bg-cream text-charcoal' : 'border border-cream/20 text-cream/75 hover:bg-cream/10'
                }`}
              >
                {item.label} ({stories.filter(item.test).length})
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {visible.map((story) => (
              <article key={story.id} className="rounded-2xl border border-cream/15 bg-cream p-5 text-charcoal shadow-lg sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-terracotta uppercase">{categoryLabel(story.category)}</p>
                    <h3 className="mt-1 font-display text-2xl">{story.title}</h3>
                    <p className="mt-1 text-sm text-charcoal/65">
                      <span className="font-semibold text-charcoal">{story.author.name}</span>
                      {story.anonymous && ' (e publikuar në mënyrë anonime)'} · {story.position}
                    </p>
                  </div>
                  {story.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-xs font-semibold text-cream">
                      <BadgeCheck aria-hidden="true" className="size-3.5" /> Verified Intern
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full border border-charcoal/25 px-2.5 py-1 text-xs font-semibold text-charcoal/70">
                      Në verifikim
                    </span>
                  )}
                </div>

                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-charcoal/65">
                  {story.author.university && (
                    <li className="inline-flex items-center gap-1.5"><GraduationCap aria-hidden="true" className="size-4" />{story.author.university}</li>
                  )}
                  <li className="inline-flex items-center gap-1.5"><Timer aria-hidden="true" className="size-4" />{story.durationMonths} muaj</li>
                  <li className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="size-4" />Publikuar më {formatDay(story.publishedAt)}</li>
                </ul>

                <p
                  className={`mt-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${
                    story.hasAcceptedApplication ? 'bg-olive/15 text-olive' : 'bg-terracotta/10 text-terracotta'
                  }`}
                >
                  {story.hasAcceptedApplication ? (
                    <>
                      <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                      Ky student ka një aplikim të pranuar te ju përmes InternUp.
                    </>
                  ) : (
                    <>
                      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                      Nuk u gjet aplikim i pranuar përmes InternUp. Kontrolloni në të dhënat tuaja para se ta verifikoni.
                    </>
                  )}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-charcoal/10 pt-4">
                  <Link to={`/blog/${story.id}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-charcoal/20 px-4 text-sm font-semibold hover:bg-charcoal/5">
                    <ExternalLink aria-hidden="true" className="size-4" /> Lexo historinë
                  </Link>
                  {story.verified ? (
                    <>
                      <span className="text-sm text-charcoal/60">
                        {story.verifiedAt ? `Verifikuar më ${formatDay(story.verifiedAt)}` : 'E verifikuar'}
                      </span>
                      <button type="button" onClick={() => setPending({ story, verified: false })} className="ml-auto inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold text-burgundy hover:bg-burgundy/10">
                        Hiq verifikimin
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setPending({ story, verified: true })} className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-lg bg-olive px-4 text-sm font-semibold text-cream hover:bg-olive/90">
                      <BadgeCheck aria-hidden="true" className="size-4" /> Verifiko intern
                    </button>
                  )}
                </div>
              </article>
            ))}

            {visible.length === 0 && (
              <div className="rounded-2xl border border-dashed border-cream/20 bg-charcoal/30 px-6 py-12 text-center text-cream">
                <ShieldCheck aria-hidden="true" className="mx-auto size-7 text-cream/55" />
                <h3 className="mt-4 font-display text-2xl">
                  {stories.length ? 'Asgjë në këtë grup' : 'Ende nuk ka histori për kompaninë tuaj'}
                </h3>
                <p className="mt-2 text-sm text-cream/60">
                  Kur një student publikon në Student Blog përvojën e praktikës te ju, historia shfaqet këtu për verifikim.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {pending && (
        <ConfirmDialog
          title={pending.verified ? 'Ta verifikosh këtë intern?' : 'Ta heqësh verifikimin?'}
          description={
            pending.verified
              ? `Duke verifikuar, konfirmoni që autori i "${pending.story.title}" ka bërë praktikë te ju si "${pending.story.position}". Historia do të shfaqet me shenjën Verified Intern.`
              : `"${pending.story.title}" do të shfaqet sërish si "Në verifikim" në Student Blog.`
          }
          confirmLabel={pending.verified ? 'Po, verifiko' : 'Po, hiqe'}
          tone={pending.verified ? 'success' : 'danger'}
          busy={busy}
          onConfirm={apply}
          onCancel={() => setPending(null)}
        />
      )}
    </CompanyWorkspace>
  );
}
