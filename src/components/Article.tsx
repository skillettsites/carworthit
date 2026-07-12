export default function Article({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-x py-14 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
      {subtitle && <p className="mt-3 text-lg text-ink-2 leading-relaxed">{subtitle}</p>}
      <div className="mt-8 space-y-4 text-ink-2 leading-relaxed [&_h2]:text-ink [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-2 [&_h3]:text-ink [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_strong]:text-ink [&_a]:text-brand [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5">
        {children}
      </div>
    </div>
  );
}
