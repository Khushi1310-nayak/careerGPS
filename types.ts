import { ReactNode } from 'react';

export interface SectionProps {
  children?: ReactNode;
  className?: string;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  delay?: number;
}
