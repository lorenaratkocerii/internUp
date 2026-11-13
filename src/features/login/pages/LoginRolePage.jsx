import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { NotFoundMessage } from '../../companies/components/NotFoundMessage';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { Container } from '../../home/components/ui/Container';
import { loginWithDemoAccount } from '../demoAuth';
import { loginRoles } from '../loginRoles';

export function LoginRolePage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get('next');
  const selectedRole = loginRoles.find((item) => item.id === role);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  useDocumentTitle(selectedRole ? `Hyr si ${selectedRole.title}` : 'Hyr në llogari');

  if (!selectedRole) {
    return (
      <NotFoundMessage
        title="Ky lloj llogarie nuk u gjet."
        description="Zgjidhni një nga llojet e disponueshme të llogarisë."
        href="/hyr"
        linkLabel="Kthehu te kyçja"
      />
    );
  }

  const Icon = selectedRole.icon;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const nextErrors = {};
    if (!email) nextErrors.email = 'Shkruani adresën tuaj të emailit.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Shkruani një adresë emaili të vlefshme.';
    if (!password) nextErrors.password = 'Shkruani fjalëkalimin tuaj.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    const user = loginWithDemoAccount(role, email, password);
    if (!user) {
      setErrors({ form: 'Emaili ose fjalëkalimi nuk është i saktë për këtë lloj llogarie.' });
      return;
    }
    setErrors({});
    const safeNext = nextPath?.startsWith('/') && !nextPath.startsWith('//') ? nextPath : null;
    navigate(user.role === 'student' && user.profile?.approved === false ? '/student' : safeNext ?? ({ student: '/profili', kompani: '/kompani', universitet: '/universitet' }[user.role] ?? '/'));
  };

  return (
    <Container className="grid min-h-[calc(100svh-4.5rem)] place-items-center py-12 lg:py-16">
      <div className={`w-full max-w-lg border border-cream/20 p-7 sm:p-10 ${selectedRole.colorClass}`}>
        <div className="flex items-center gap-4">
          <span className={`grid size-14 place-items-center text-cream ${selectedRole.colorClass}`}>
            <Icon aria-hidden="true" className="size-7" strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-cream/70 uppercase">Hyr si</p>
            <h1 className="font-display text-3xl font-medium">{selectedRole.title}</h1>
          </div>
        </div>

        <form className="mt-9 space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block">
            <span className="mb-2 block font-semibold">Email</span>
            <span className="flex items-center rounded-2xl border border-cream/35 bg-charcoal/35 transition focus-within:border-cream focus-within:ring-2 focus-within:ring-cream/15">
              <Mail aria-hidden="true" className="ml-4 size-5 text-cream/70" />
              <input className="min-w-0 flex-1 bg-transparent px-3 py-3.5 outline-none placeholder:text-cream/45" type="email" name="email" autoComplete="email" placeholder="example@email.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'hyr-email-gabim' : undefined} />
            </span>
            {errors.email && <span id="hyr-email-gabim" role="alert" className="mt-2 block text-sm font-semibold text-cream">{errors.email}</span>}
          </label>
          <label className="block">
            <span className="mb-2 block font-semibold">Fjalëkalimi</span>
            <span className="flex items-center rounded-2xl border border-cream/35 bg-charcoal/35 transition focus-within:border-cream focus-within:ring-2 focus-within:ring-cream/15">
              <LockKeyhole aria-hidden="true" className="ml-4 size-5 text-cream/70" />
              <input className="min-w-0 flex-1 bg-transparent px-3 py-3.5 outline-none placeholder:text-cream/45" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" placeholder="Shkruani fjalëkalimin" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'hyr-password-gabim' : undefined} />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="grid size-12 place-items-center text-cream/75 hover:text-cream" aria-label={showPassword ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'}>
                {showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
              </button>
            </span>
            {errors.password && <span id="hyr-password-gabim" role="alert" className="mt-2 block text-sm font-semibold text-cream">{errors.password}</span>}
          </label>
          {errors.form && <p role="alert" className="text-sm font-semibold text-cream">{errors.form}</p>}
          <button type="submit" className="min-h-12 w-full rounded-2xl bg-cream px-6 py-3 font-semibold text-charcoal transition-colors duration-300 hover:bg-cream/85">
            Kyçu
          </button>
        </form>

        <p className="mt-7 text-center text-cream/75">
          Nuk keni llogari?{' '}
          <Link to="/regjistrohu" className="font-semibold text-cream underline underline-offset-4 hover:text-white">
            Regjistrohuni
          </Link>
        </p>
        <Link to="/hyr" className="mt-5 block text-center text-sm text-cream/70 underline underline-offset-4 hover:text-cream">
          Ndrysho llojin e llogarisë
        </Link>
      </div>
    </Container>
  );
}
