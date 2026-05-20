const items = [
  "Governance Advisory",
  "Risk Management",
  "Regulatory Compliance",
  "ESG Frameworks",
  "Organizational Competitiveness",
  "Policy Development",
  "Internal Audit",
  "Digital Governance",
];

export default function TrustMarquee() {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border py-[18px] bg-bg group">
      <div className="flex items-center gap-8 w-max animate-marquee group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-[0.82rem] font-semibold tracking-[0.08em] uppercase text-muted whitespace-nowrap">
              {item}
            </span>
            <span className="text-muted/30 text-base font-light">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
