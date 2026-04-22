import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <img src={logo} alt="ElectionGuide" width={32} height={32} loading="lazy" className="h-8 w-8" />
            <span className="font-serif font-bold text-lg">ElectionGuide</span>
          </div>
          <p className="text-sm text-primary-foreground/70 max-w-xs">
            An independent civic resource explaining how democratic elections work.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-accent mb-3 font-semibold">Learn</div>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><a href="#timeline" className="hover:text-accent">The 6 steps</a></li>
            <li><a href="#eligibility" className="hover:text-accent">Eligibility checker</a></li>
            <li><a href="#vote" className="hover:text-accent">Practice ballot</a></li>
            <li><a href="#faq" className="hover:text-accent">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-accent mb-3 font-semibold">Disclaimer</div>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            Information here is general civic education and does not constitute legal advice.
            Always confirm rules with your national election commission.
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container py-5 text-xs text-primary-foreground/50 flex justify-between">
          <span>© {new Date().getFullYear()} ElectionGuide</span>
          <span className="font-mono">v1.0</span>
        </div>
      </div>
    </footer>
  );
}
