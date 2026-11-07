import { Building2, GraduationCap, Landmark } from 'lucide-react';

export const signupRoles = [
  {
    id: 'kompani',
    title: 'Kompani',
    description: 'Publikoni pozita praktike dhe gjeni studentët e duhur për ekipin tuaj.',
    action: 'Vazhdo si kompani',
    icon: Building2,
    colorClass: 'bg-burgundy',
    href: '/regjistrohu/kompani',
  },
  {
    id: 'student',
    title: 'Student',
    description: 'Krijo profilin tënd, gjej praktika dhe apliko në disa hapa.',
    action: 'Vazhdo si student',
    icon: GraduationCap,
    colorClass: 'bg-navy',
    href: '/regjistrohu/student',
    pendingTitle: 'Regjistrimi si student',
  },
  {
    id: 'universitet',
    title: 'Universitet',
    description: 'Lidhni studentët tuaj me mundësi praktike në kompani.',
    action: 'Vazhdo si universitet',
    icon: Landmark,
    colorClass: 'bg-mauve',
    href: '/regjistrohu/universitet',
    pendingTitle: 'Regjistrimi si universitet',
  },
];
