import { ReactNode } from 'react';

interface Props {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Panel({
  title,
  children,
  className = '',
}: Props) {
  return (
    <section
      className={[
        'rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur',
        className,
      ].join(' ')}
    >
      {title && (
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300">
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}
