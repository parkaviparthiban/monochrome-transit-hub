export default function Footer() {
  return (
    <footer className="bg-background">
      <div className="px-6 md:px-10 py-12 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mono text-[11px] uppercase tracking-[0.18em]">
        <div>
          <div className="eyebrow mb-3">BharatRail&Air</div>
          <p className="text-muted-foreground normal-case tracking-normal font-sans text-sm">A reservation house for the considered Indian traveller. Founded MMXXVI.</p>
        </div>
        <div>
          <div className="eyebrow mb-3">Sections</div>
          <ul className="space-y-2"><li>Air</li><li>Rail</li><li>Concierge</li><li>Lounges</li></ul>
        </div>
        <div>
          <div className="eyebrow mb-3">Service</div>
          <ul className="space-y-2"><li>Help Desk</li><li>Refunds</li><li>Lost & Found</li><li>Press</li></ul>
        </div>
        <div>
          <div className="eyebrow mb-3">Legal</div>
          <ul className="space-y-2"><li>Terms</li><li>Privacy</li><li>Cookies</li><li>© 2026</li></ul>
        </div>
      </div>
      <div className="border-t border-foreground py-3 px-6 md:px-10 flex justify-between mono text-[10px] uppercase tracking-[0.2em]">
        <span>End of Edition</span>
        <span>Printed Digitally · ◆</span>
      </div>
    </footer>
  );
}
