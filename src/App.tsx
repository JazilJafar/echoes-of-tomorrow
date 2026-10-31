import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, AlertTriangle, ArrowRight, BarChart3, Camera, Check, ChevronRight, CircleHelp, Filter, Globe2, Layers3, Lightbulb, MapPin, Menu, Plus, Radar, Search, Send, ShieldCheck, Sparkles, Target, X, Zap } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { categoryColors, observations as seedObservations, type Category, type Observation, type Risk } from './data'
import { runLocalAnalysis } from './analysis'

type Page = 'overview' | 'map' | 'patterns' | 'insights' | 'reports' | 'about'
type FilterState = { category: string; risk: string; query: string }

const weeklyData = [
  { week: 'Sep 07', observations: 3, verified: 2 },
  { week: 'Sep 14', observations: 5, verified: 3 },
  { week: 'Sep 21', observations: 7, verified: 5 },
  { week: 'Sep 28', observations: 6, verified: 4 },
  { week: 'Oct 05', observations: 9, verified: 6 },
  { week: 'Oct 12', observations: 11, verified: 8 },
  { week: 'Oct 19', observations: 14, verified: 10 },
  { week: 'Oct 26', observations: 10, verified: 8 },
]

const navItems: { id: Page; label: string; icon: typeof Radar }[] = [
  { id: 'overview', label: 'Intelligence', icon: Radar },
  { id: 'map', label: 'Community map', icon: Globe2 },
  { id: 'patterns', label: 'Pattern discovery', icon: Sparkles },
  { id: 'insights', label: 'Risk insights', icon: Target },
  { id: 'reports', label: 'Reports', icon: Layers3 },
  { id: 'about', label: 'About', icon: CircleHelp },
]

const categories: Category[] = ['Water & drainage', 'Waste management', 'Infrastructure', 'Environmental pollution', 'Public safety']

function App() {
  const [page, setPage] = useState<Page>('overview')
  const [observations, setObservations] = useState<Observation[]>(seedObservations)
  const [filters, setFilters] = useState<FilterState>({ category: 'All categories', risk: 'All risk levels', query: '' })
  const [mobileNav, setMobileNav] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [analysis, setAnalysis] = useState<ReturnType<typeof runLocalAnalysis> | null>(null)

  const filtered = useMemo(() => observations.filter((item) => {
    const matchesCategory = filters.category === 'All categories' || item.category === filters.category
    const matchesRisk = filters.risk === 'All risk levels' || item.risk === filters.risk
    const query = filters.query.toLowerCase()
    return matchesCategory && matchesRisk && (!query || `${item.title} ${item.location} ${item.description}`.toLowerCase().includes(query))
  }), [filters, observations])

  function navigate(nextPage: Page) {
    setPage(nextPage)
    setMobileNav(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate('overview')} aria-label="Go to intelligence overview">
          <span className="brand-mark"><span /></span>
          <span><strong>Echoes</strong><em>of Tomorrow</em></span>
        </button>
        <div className="topbar-meta"><span className="live-dot" /> Demo community · Ikeja district</div>
        <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu"><Menu size={21} /></button>
        <button className="report-button" onClick={() => setShowReport(true)}><Plus size={17} /> Report observation</button>
      </header>
      <div className={`layout ${mobileNav ? 'nav-open' : ''}`}>
        <aside className="sidebar">
          <div className="sidebar-label">Workspace</div>
          <nav>
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} className={page === id ? 'nav-item active' : 'nav-item'} onClick={() => navigate(id)}>
                <Icon size={17} strokeWidth={page === id ? 2.4 : 1.8} /><span>{label}</span>{page === id && <ChevronRight className="nav-chevron" size={15} />}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="status-card"><span className="status-icon"><ShieldCheck size={17} /></span><div><strong>Demo mode</strong><p>Local evidence only</p></div><span className="status-pulse" /></div>
            <div className="side-note">Built for communities that notice the small things first.</div>
            <span className="version">EOT / 01.0</span>
          </div>
        </aside>
        <main className="main-content">
          {page === 'overview' && <Overview observations={observations} onNavigate={navigate} onAnalyze={() => setAnalysis(runLocalAnalysis())} analysis={analysis} filters={filters} setFilters={setFilters} />}
          {page === 'map' && <MapPage observations={filtered} filters={filters} setFilters={setFilters} />}
          {page === 'patterns' && <Patterns analysis={analysis} onAnalyze={() => setAnalysis(runLocalAnalysis())} observations={observations} />}
          {page === 'insights' && <Insights observations={observations} onNavigate={navigate} />}
          {page === 'reports' && <Reports observations={filtered} filters={filters} setFilters={setFilters} />}
          {page === 'about' && <About onNavigate={navigate} />}
        </main>
      </div>
      {showReport && <ReportModal onClose={() => setShowReport(false)} onSubmit={(item) => { setObservations((current) => [item, ...current]); setShowReport(false); navigate('reports') }} />}
    </div>
  )
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: React.ReactNode; description: string; action?: React.ReactNode }) {
  return <div className="page-intro"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>
}

function Overview({ observations, onNavigate, onAnalyze, analysis, filters, setFilters }: { observations: Observation[]; onNavigate: (page: Page) => void; onAnalyze: () => void; analysis: ReturnType<typeof runLocalAnalysis> | null; filters: FilterState; setFilters: (filters: FilterState) => void }) {
  const verified = observations.filter((item) => item.status === 'Verified').length
  const high = observations.filter((item) => item.risk === 'High').length
  return <div className="content-wrap">
    <PageIntro eyebrow="Community intelligence / 31 October 2026" title={<>Tomorrow's problems<br /><i>leave signals today.</i></>} description="Echoes connects everyday observations to help communities notice emerging problems before they become major incidents." action={<button className="outline-button" onClick={onAnalyze}><Sparkles size={16} /> Run community analysis</button>} />
    <div className="notice"><div className="notice-symbol"><Activity size={18} /></div><div><strong>Demo workspace</strong><span>These 16 observations are fictional and clearly marked for demonstration. Connect Supabase to collect real community signals.</span></div><button onClick={() => onNavigate('about')}>How this works <ArrowRight size={14} /></button></div>
    <div className="metric-grid">
      <Metric label="Total observations" value={observations.length} detail="+4 this week" tone="green" />
      <Metric label="Verified evidence" value={verified} detail={`${Math.round(verified / observations.length * 100)}% of total`} tone="blue" />
      <Metric label="Emerging patterns" value="03" detail="1 needs attention" tone="amber" />
      <Metric label="Areas to watch" value={high} detail="Potential concern" tone="red" />
    </div>
    <div className="section-heading"><div><div className="eyebrow">Signal activity</div><h2>What the community is noticing</h2></div><div className="filter-row"><select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><select value={filters.risk} onChange={(e) => setFilters({ ...filters, risk: e.target.value })}><option>All risk levels</option><option>High</option><option>Moderate</option><option>Low</option></select></div></div>
    <div className="dashboard-grid">
      <section className="panel chart-panel"><div className="panel-header"><div><h3>Observation rhythm</h3><span>Reports and verified evidence, by week</span></div><div className="legend"><span><i className="legend-green" /> Observations</span><span><i className="legend-grey" /> Verified</span></div></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weeklyData} margin={{ top: 10, right: 3, left: -22, bottom: 0 }}><defs><linearGradient id="greenFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#317C62" stopOpacity=".22" /><stop offset="100%" stopColor="#317C62" stopOpacity="0" /></linearGradient></defs><CartesianGrid stroke="#e5e7e5" vertical={false} /><XAxis dataKey="week" tick={{ fontSize: 10, fill: '#8a928e' }} tickLine={false} axisLine={false} /><YAxis tick={{ fontSize: 10, fill: '#8a928e' }} tickLine={false} axisLine={false} allowDecimals={false} /><Tooltip contentStyle={{ border: '1px solid #dfe4df', borderRadius: 4, fontSize: 12, boxShadow: '0 8px 24px #101b2a12' }} /><Area type="monotone" dataKey="observations" stroke="#317C62" fill="url(#greenFill)" strokeWidth={2} /><Area type="monotone" dataKey="verified" stroke="#a9b5b0" fill="none" strokeWidth={2} strokeDasharray="4 4" /></AreaChart></ResponsiveContainer></div></section>
      <section className="panel category-panel"><div className="panel-header"><div><h3>Signals by category</h3><span>Across the demo workspace</span></div><BarChart3 size={18} className="muted-icon" /></div><div className="category-list">{categories.map((category) => { const count = observations.filter((item) => item.category === category).length; return <div className="category-line" key={category}><div className="category-label"><span className="category-dot" style={{ background: categoryColors[category] }} />{category}<b>{count}</b></div><div className="bar-track"><span style={{ width: `${count / observations.length * 100}%`, background: categoryColors[category] }} /></div></div> })}</div><button className="text-button" onClick={() => onNavigate('reports')}>View all reports <ArrowRight size={14} /></button></section>
    </div>
    <div className="section-heading activity-heading"><div><div className="eyebrow">Latest signals</div><h2>Recent community activity</h2></div><button className="text-button" onClick={() => onNavigate('reports')}>Open report history <ArrowRight size={14} /></button></div>
    <div className="activity-table panel"><div className="table-head"><span>Observation</span><span>Location</span><span>Status</span><span>Risk</span><span>Date</span></div>{observations.slice(0, 5).map((item) => <ObservationRow key={item.id} item={item} />)}</div>
    {analysis && <AnalysisBanner analysis={analysis} onNavigate={onNavigate} />}
  </div>
}

function Metric({ label, value, detail, tone }: { label: string; value: string | number; detail: string; tone: string }) {
  return <div className={`metric-card ${tone}`}><div className="metric-top"><span>{label}</span><span className="metric-mark" /></div><strong>{value}</strong><small>{detail}</small></div>
}

function ObservationRow({ item }: { item: Observation }) {
  return <div className="table-row"><div className="observation-name"><span className="row-category" style={{ background: categoryColors[item.category] }} /><div><strong>{item.title}</strong><small>{item.id} · {item.category}</small></div></div><span className="location-cell"><MapPin size={13} />{item.location}</span><span><span className={`status-tag ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span></span><span><span className={`risk-dot ${item.risk.toLowerCase()}`} />{item.risk}</span><span className="date-cell">{new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span></div>
}

function AnalysisBanner({ analysis, onNavigate }: { analysis: ReturnType<typeof runLocalAnalysis>; onNavigate: (page: Page) => void }) {
  return <section className="analysis-banner"><div className="analysis-icon"><Sparkles size={19} /></div><div className="analysis-copy"><div className="eyebrow">Local analysis / transparent fallback</div><h3>{analysis.title}</h3><p>{analysis.summary}</p><div className="evidence-chips">{analysis.evidence.map((evidence) => <span key={evidence}><Check size={12} />{evidence}</span>)}</div></div><div className="analysis-score"><span>Confidence</span><strong>{analysis.confidence}%</strong><button className="text-button" onClick={() => onNavigate('patterns')}>Inspect pattern <ArrowRight size={14} /></button></div></section>
}

function Filters({ filters, setFilters }: { filters: FilterState; setFilters: (filters: FilterState) => void }) {
  return <div className="map-filters"><div className="search-field"><Search size={16} /><input placeholder="Search observations or places" value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} /></div><select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><select value={filters.risk} onChange={(e) => setFilters({ ...filters, risk: e.target.value })}><option>All risk levels</option><option>High</option><option>Moderate</option><option>Low</option></select><button className="filter-button"><Filter size={15} /> Filters</button></div>
}

function MapPage({ observations, filters, setFilters }: { observations: Observation[]; filters: FilterState; setFilters: (filters: FilterState) => void }) {
  const [selected, setSelected] = useState<Observation | null>(null)
  return <div className="content-wrap"><PageIntro eyebrow="Geospatial intelligence" title="The community, in context." description="A living view of observations submitted by residents. Every marker is either community evidence or labelled demonstration data." /><Filters filters={filters} setFilters={setFilters} /><div className="map-layout"><section className="map-card"><MapContainer center={[6.5225, 3.3785]} zoom={15} scrollWheelZoom={false} className="leaflet-map"><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{observations.map((item) => <CircleMarker key={item.id} center={item.coordinates} radius={item.risk === 'High' ? 10 : 7} pathOptions={{ color: categoryColors[item.category], fillColor: categoryColors[item.category], fillOpacity: .88, weight: 2 }} eventHandlers={{ click: () => setSelected(item) }}><Popup><strong>{item.title}</strong><br />{item.location}<br /><small>{item.status} · {item.risk} concern</small></Popup></CircleMarker>)}</MapContainer><div className="map-caption"><span><i className="legend-marker" />16 demonstration observations</span><span><MapPin size={13} />Ikeja district, Lagos</span></div></section><aside className="map-aside panel"><div className="panel-header"><div><h3>{selected ? 'Selected signal' : 'Pattern hotspot'}</h3><span>{selected ? selected.id : 'North Market cluster'}</span></div><span className="signal-count">{selected ? selected.risk : '03'} </span></div>{selected ? <div className="selected-detail"><div className="detail-category" style={{ color: categoryColors[selected.category] }}>{selected.category}</div><h3>{selected.title}</h3><p>{selected.description}</p><div className="detail-line"><MapPin size={14} />{selected.location}</div><div className="detail-line"><Activity size={14} />{selected.score}% potential concern score</div><button className="outline-button small" onClick={() => setSelected(null)}>Back to hotspot</button></div> : <><div className="hotspot-graphic"><div className="hotspot-ring ring-one" /><div className="hotspot-ring ring-two" /><div className="hotspot-core"><span>4</span><small>signals</small></div></div><h3 className="hotspot-title">North Market / Market Street</h3><p className="hotspot-copy">A cluster of water, drainage and waste observations that may be connected. This is a hypothesis, not a verified incident.</p><div className="hotspot-meta"><span><AlertTriangle size={14} /> Potential concern</span><span><MapPin size={14} /> 1.1 km radius</span></div></>}</aside></div><div className="map-legend"><span><i style={{ background: categoryColors['Water & drainage'] }} />Water & drainage</span><span><i style={{ background: categoryColors['Waste management'] }} />Waste management</span><span><i style={{ background: categoryColors.Infrastructure }} />Infrastructure</span><span><i style={{ background: categoryColors['Public safety'] }} />Public safety</span></div></div>
}

function Patterns({ analysis, onAnalyze, observations }: { analysis: ReturnType<typeof runLocalAnalysis> | null; onAnalyze: () => void; observations: Observation[] }) {
  const result = analysis ?? runLocalAnalysis()
  return <div className="content-wrap"><PageIntro eyebrow="AI-assisted discovery" title="Find the thread between signals." description="Patterns are hypotheses assembled from evidence. Inspect the reasoning, challenge it, and collect more observations before taking action." action={!analysis && <button className="outline-button" onClick={onAnalyze}><Sparkles size={16} /> Run community analysis</button>} /><div className="mode-callout"><span className="mode-icon"><Zap size={16} /></span><div><strong>Transparent local analysis</strong><p>Gemini is not configured in this demo. The relationship below is generated from category, keyword, proximity and time signals — not a live AI model.</p></div><span className="confidence-pill">Evidence-first</span></div><div className="pattern-layout"><section className="panel connection-panel"><div className="panel-header"><div><h3>{result.title}</h3><span>One possible relationship · {result.related.length} connected observations</span></div><span className="potential-label">Potential concern</span></div><div className="connection-canvas">{result.related.slice(0, 5).map((item, index) => <div key={item.id} className={`signal-node node-${index}`}><span className="node-line" /><div className="node-circle" style={{ borderColor: categoryColors[item.category] }}><MapPin size={16} /></div><div><strong>{item.id}</strong><small>{item.title}</small><em>{item.location}</em></div></div>)}<div className="connection-center"><Sparkles size={19} /><span>Possible<br />connection</span></div></div><div className="connection-footer"><span><Activity size={14} /> {result.related.length} signals connected</span><span><MapPin size={14} /> 1.1 km geographic spread</span><span><BarChart3 size={14} /> Sep — Oct 2026</span></div></section><aside className="panel reasoning-panel"><div className="eyebrow">Why this may be connected</div><h3>{result.summary}</h3><div className="evidence-list">{result.evidence.map((evidence) => <div key={evidence}><Check size={14} /><span>{evidence}</span></div>)}</div><div className="confidence-block"><div><span>Confidence in hypothesis</span><strong>{result.confidence}%</strong></div><div className="confidence-track"><span style={{ width: `${result.confidence}%` }} /></div></div><div className="actions-block"><div className="eyebrow">Suggested next steps</div>{result.actions.map((action) => <div className="action-line" key={action}><ArrowRight size={14} />{action}</div>)}</div><p className="disclaimer"><AlertTriangle size={13} /> This is an AI-assisted hypothesis. It is not a prediction or verified finding.</p></aside></div><div className="section-heading pattern-history"><div><div className="eyebrow">Supporting signals</div><h2>All observations in this workspace</h2></div><span className="subtle-count">{observations.length} total</span></div><div className="activity-table panel">{observations.slice(0, 6).map((item) => <ObservationRow key={item.id} item={item} />)}</div></div>
}

function Insights({ observations, onNavigate }: { observations: Observation[]; onNavigate: (page: Page) => void }) {
  const highItems = observations.filter((item) => item.risk === 'High')
  const rising = observations.filter((item) => item.category === 'Water & drainage').length
  return <div className="content-wrap"><PageIntro eyebrow="Risk insights / evidence ledger" title="Attention, without alarmism." description="A clear distinction between what people observed, what the system hypothesizes, and what still needs verification." /><div className="insight-grid"><div className="insight-hero panel"><div className="insight-hero-top"><span className="risk-icon"><AlertTriangle size={18} /></span><div><div className="eyebrow">Priority area</div><h2>North Market drainage loop</h2></div><span className="potential-label">Potential concern</span></div><p>Water pooling, blocked channels and waste at an entrance appear repeatedly around North Market. The evidence suggests a maintenance loop worth checking before the next heavy rain.</p><div className="insight-stats"><div><strong>04</strong><span>related signals</span></div><div><strong>86%</strong><span>hypothesis confidence</span></div><div><strong>1.1 km</strong><span>geographic spread</span></div></div><button className="outline-button small" onClick={() => onNavigate('patterns')}>Inspect evidence <ArrowRight size={14} /></button></div><div className="panel trend-card"><div className="panel-header"><div><h3>Signal frequency</h3><span>Water & drainage · last 8 weeks</span></div><span className="trend-up">↑ {rising} reports</span></div><div className="mini-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={weeklyData}><XAxis dataKey="week" hide /><YAxis hide /><Bar dataKey="observations" fill="#317C62" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div><p className="chart-footnote">Increasing observation frequency is a signal to investigate, not proof of an incident.</p></div></div><div className="section-heading"><div><div className="eyebrow">Evidence ledger</div><h2>What deserves attention</h2></div></div><div className="ledger-grid">{highItems.slice(0, 3).map((item) => <div className="ledger-card panel" key={item.id}><div className="ledger-top"><span className="risk-dot high" />{item.risk} potential concern <span className="ledger-date">{item.date}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="ledger-bottom"><span><MapPin size={13} />{item.location}</span><span className="needs-review">{item.status}</span></div></div>)}</div><div className="verification-note"><ShieldCheck size={19} /><div><strong>Verification matters</strong><p>Risk scores are explainable estimates based on recurrence, proximity and reported severity. They are not scientifically validated disaster predictions.</p></div></div></div>
}

function Reports({ observations, filters, setFilters }: { observations: Observation[]; filters: FilterState; setFilters: (filters: FilterState) => void }) {
  return <div className="content-wrap"><PageIntro eyebrow="Observation archive" title="Every signal has a story." description="A private-by-default history of observations. Personal details are never exposed in the public intelligence view." action={<button className="outline-button" onClick={() => document.querySelector<HTMLButtonElement>('.report-button')?.click()}><Plus size={16} /> New observation</button>} /><Filters filters={filters} setFilters={setFilters} /><div className="archive-summary"><span><strong>{observations.length}</strong> matching observations</span><span><Filter size={14} /> Filters update the archive instantly</span></div><div className="activity-table panel archive-table"><div className="table-head"><span>Observation</span><span>Location</span><span>Status</span><span>Risk</span><span>Date</span></div>{observations.map((item) => <ObservationRow key={item.id} item={item} />)}</div>{observations.length === 0 && <div className="empty-state"><Search size={22} /><h3>No matching observations</h3><p>Try clearing a filter or searching for another place.</p></div>}</div>
}

function About({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return <div className="content-wrap about-page"><PageIntro eyebrow="The project" title={<>Small signals.<br /><i>Connected intelligence.</i></>} description="Echoes of Tomorrow is a community early-warning platform for the moments before a problem becomes impossible to ignore." /><div className="about-hero"><div className="about-quote">“The first person to notice a problem is rarely the person with the power to fix it. Echoes helps make the signal legible.”</div><div className="about-quote-meta">— Product principle / Echoes of Tomorrow</div></div><div className="about-grid"><section><div className="eyebrow">The problem</div><h2>Communities experience problems before authorities recognize them.</h2><p>A blocked drain, a broken light, or a recurring waste pile can look isolated. Together, they may reveal a maintenance gap. Echoes gives those small observations a shared context.</p></section><section><div className="eyebrow">How the intelligence works</div><div className="how-step"><span>01</span><div><strong>Observe</strong><p>A resident submits a photo, description and location.</p></div></div><div className="how-step"><span>02</span><div><strong>Connect</strong><p>The system looks for recurring keywords, proximity and timing.</p></div></div><div className="how-step"><span>03</span><div><strong>Act carefully</strong><p>Communities inspect the evidence and choose preventive next steps.</p></div></div></section></div><div className="tech-strip"><span>Built with</span><b>React + TypeScript</b><b>Leaflet / OpenStreetMap</b><b>Gemini-ready API</b><b>Supabase-ready data layer</b></div><div className="about-bottom"><div><div className="eyebrow">Limitations, made visible</div><p>AI-generated relationships are hypotheses, not facts. This demo uses fictional observations and a transparent local fallback. A production deployment needs consent, moderation, secure storage, and community verification.</p></div><button className="outline-button" onClick={() => onNavigate('patterns')}>See a pattern in action <ArrowRight size={15} /></button></div></div>
}

function ReportModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (item: Observation) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('Water & drainage')
  const [location, setLocation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !location.trim()) { setError('Please complete the title, description and location.'); return }
    const item: Observation = { id: `OBS-${105 + Math.floor(Math.random() * 20)}`, title, description, category, location, coordinates: [6.523, 3.378], date: new Date().toISOString().slice(0, 10), status: 'New', risk: 'Low', score: 28, keywords: title.toLowerCase().split(' ').slice(0, 3) }
    setSubmitted(true)
    setTimeout(() => onSubmit(item), 800)
  }
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="report-modal">{submitted ? <div className="success-state"><div className="success-check"><Check size={27} /></div><div className="eyebrow">Observation received</div><h2>Your signal is now part of the picture.</h2><p>It has been saved locally in demo mode and marked “New” until reviewed.</p></div> : <><div className="modal-header"><div><div className="eyebrow">Add a community signal</div><h2>Report an observation</h2></div><button className="close-button" onClick={onClose}><X size={18} /></button></div><form onSubmit={submit}><label>What did you notice?<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Water collecting by the school gate" /></label><label>Tell us more<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what happened, how often, and why it matters." rows={4} /></label><div className="form-two"><label>Category<select value={category} onChange={(e) => setCategory(e.target.value as Category)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Where is it?<input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Landmark or street" /></label></div><label className="upload-field"><span><Camera size={17} /> Add a photo <small>(optional)</small></span><input type="file" accept="image/*" /></label>{error && <div className="form-error"><AlertTriangle size={14} />{error}</div>}<div className="form-footer"><span><ShieldCheck size={14} /> Your identity stays private</span><button className="submit-button" type="submit"><Send size={15} /> Submit observation</button></div></form></>}</div></div>
}

export default App
