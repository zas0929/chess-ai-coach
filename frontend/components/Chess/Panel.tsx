import { ReactNode } from 'react';

interface Props {
  title?: string;
  children: ReactNode;
  className?: string;
  density?: 'default' | 'compact';
}

export default function Panel({
  title,
  children,
  className = '',
  density = 'default',
}: Props) {
  return (
    <section
      className={[
        'border border-white/10 bg-white/[0.04] backdrop-blur',
        density === 'compact'
          ? 'rounded-2xl px-3 py-2 shadow-lg'
          : 'rounded-3xl p-4 shadow-2xl',
        className,
      ].join(' ')}
    >
      {title && (
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-300">
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}
