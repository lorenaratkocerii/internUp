import { useParams } from 'react-router';
import { NotFoundMessage } from '../../companies/components/NotFoundMessage';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { signupRoles } from '../roles';

export function SignupRolePage() {
  const { role } = useParams();
  const match = signupRoles.find((item) => item.id === role && item.pendingTitle);
  useDocumentTitle(match?.pendingTitle ?? 'Krijo llogari');

  return (
    <NotFoundMessage
      title={match?.pendingTitle ?? 'Ky lloj llogarie nuk u gjet.'}
      description={match ? undefined : 'Zgjidhni një nga llojet e llogarive.'}
      href="/regjistrohu"
      linkLabel="Kthehu te zgjedhja e llogarisë"
    />
  );
}
