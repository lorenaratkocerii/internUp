import {
  BrainCircuit,
  Code2,
  Compass,
  GraduationCap,
  Landmark,
  Megaphone,
  Palette,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react';

const visuals = {
  'zhvillim-softuersh': { icon: Code2, accent: 'bg-navy' },
  dizajn: { icon: Palette, accent: 'bg-terracotta' },
  'te-dhena-ai': { icon: BrainCircuit, accent: 'bg-mauve' },
  marketing: { icon: Megaphone, accent: 'bg-burgundy' },
  financa: { icon: Landmark, accent: 'bg-olive' },
  'siguri-kibernetike': { icon: ShieldCheck, accent: 'bg-navy' },
  inxhinieri: { icon: Wrench, accent: 'bg-terracotta' },
  logjistike: { icon: Truck, accent: 'bg-mauve' },
  edukim: { icon: GraduationCap, accent: 'bg-burgundy' },
};

export const fieldVisual = (id) => visuals[id] ?? { icon: Compass, accent: 'bg-navy' };
