import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Database,
  FileText,
  Search,
  ShieldCheck,
  AlertTriangle,
  Clock3,
  MapPin,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

type ClaimStatus = 'supported' | 'supported_with_caution' | 'open_caution';

type SectionKey =
  | 'overview'
  | 'claims'
  | 'sources'
  | 'evidence'
  | 'gaps'
  | 'method';

type Claim = {
  id: string;
  title: string;
  statement: string;
  status: ClaimStatus;
  period: string;
  scope: string;
  confidence: number;
  tags: string[];
  sourceIds: string[];
  notes: string;
};

type Source = {
  id: string;
  title: string;
  type: string;
  year: string;
  locality: string;
  reliability: string;
  relevance: string;
  summary: string;
};

type Evidence = {
  id: string;
  claimId: string;
  sourceId: string;
  kind: string;
  locality: string;
  temporalProximity: string;
  text: string;
};

type Gap = {
  id: string;
  title: string;
  priority: string;
  detail: string;
};

const claims: Claim[] = [
  {
    id: 'C-001',
    title: 'Institutionelle Reorganisation unter Präsidium Renggli',
    statement:
      'Mit dem Amtsantritt von Edy Renggli (1969) erfolgte eine Verbindung von sportlicher Neuausrichtung und finanzieller Stabilisierung.',
    status: 'supported',
    period: '1969',
    scope: 'FC Luzern',
    confidence: 0.84,
    tags: ['Governance', 'Finanzen', 'Präsidium'],
    sourceIds: ['S-001', 'S-002'],
    notes:
      'Der Claim wird innerhalb der Vereinsüberlieferung klar gestützt. Für institutionsgeschichtliche Belastbarkeit sind zusätzliche zeitgenössische Gegenquellen weiterhin sinnvoll.',
  },
  {
    id: 'C-002',
    title: 'Ligaerhalt bei fortbestehender struktureller Fragilität',
    statement:
      'Der sportliche Verbleib in der Liga 1970/71 beseitigte die institutionellen und finanziellen Spannungen des Vereins nicht.',
    status: 'supported_with_caution',
    period: '1970/71',
    scope: 'FC Luzern',
    confidence: 0.72,
    tags: ['Sport', 'Institutionen', 'Risiko'],
    sourceIds: ['S-001', 'S-004'],
    notes:
      'Der sportliche Befund ist gesichert. Die institutionelle Lesart ist eine quellennahe Synthese, aber keine wörtlich dokumentierte Selbstbeschreibung des Vereins.',
  },
  {
    id: 'C-003',
    title: 'Mediale Sichtbarkeit der Flower-Power-Trikots',
    statement:
      'Die farbigen Luzerner Trikots von 1970 sind als kultureller und medialer Distinktionsversuch belegt, nicht jedoch als nachweisbar wirksame Sanierungsmassnahme.',
    status: 'supported',
    period: '1970',
    scope: 'FC Luzern',
    confidence: 0.81,
    tags: ['Kultur', 'Medien', 'Symbolik'],
    sourceIds: ['S-003', 'S-006'],
    notes:
      'Die symbolische Aufladung ist gut belegt. Ein belastbarer Nachweis finanzieller Wirkung liegt bislang nicht vor.',
  },
  {
    id: 'C-004',
    title: 'Abstieg 1971/72 als Ausdruck tieferer Strukturprobleme',
    statement:
      'Der Abstieg 1971/72 kann als sportlicher Ausdruck organisatorischer und finanzieller Fragilität interpretiert werden.',
    status: 'supported_with_caution',
    period: '1971/72',
    scope: 'FC Luzern',
    confidence: 0.7,
    tags: ['Abstieg', 'Organisation', 'Finanzen'],
    sourceIds: ['S-004', 'S-007'],
    notes:
      'Der Abstieg selbst ist unstrittig. Die strukturgeschichtliche Deutung bleibt Interpretation, wird jedoch durch mehrere Quellen gestützt.',
  },
  {
    id: 'C-005',
    title: 'Prekäre Finanzlage und personelle Notmassnahmen',
    statement:
      'In der Saison 1974/75 führte die prekäre Finanzlage zu personellen Abgaben und Notmassnahmen im Kaderbereich.',
    status: 'supported',
    period: '1974/75',
    scope: 'FC Luzern',
    confidence: 0.9,
    tags: ['Liquidität', 'Kader', 'Krise'],
    sourceIds: ['S-007', 'S-008', 'S-009'],
    notes:
      'Starker Claim mit mehrschichtiger Quellenstützung. Eine weitere Präzisierung durch exakte Pressezitate bleibt wünschenswert.',
  },
  {
    id: 'C-006',
    title: 'Dokumentierte Konkursgefahr 1974/75',
    statement:
      'Spätestens 1974/75 ist eine akute Überschuldungs- bzw. Konkursgefährdung des FC Luzern quellenbasiert dokumentiert.',
    status: 'supported',
    period: '1974/75',
    scope: 'FC Luzern',
    confidence: 0.92,
    tags: ['Überschuldung', 'Konkursgefahr', 'Finanzgeschichte'],
    sourceIds: ['S-008', 'S-009'],
    notes:
      'Dies gehört zu den am stärksten gestützten Claims des Dossiers.',
  },
  {
    id: 'C-007',
    title: 'Politisch verhandeltes Darlehensgesuch an die Stadt Luzern',
    statement:
      'Der FC Luzern ersuchte die Stadt Luzern um finanzielle Unterstützung; das Darlehensgesuch wurde kommunalpolitisch verhandelt und nicht bewilligt.',
    status: 'supported',
    period: '1975',
    scope: 'FC Luzern / Stadt Luzern',
    confidence: 0.89,
    tags: ['Stadtpolitik', 'Darlehen', 'Öffentliche Hilfe'],
    sourceIds: ['S-009', 'S-010'],
    notes:
      'Dieser Claim ist institutionell besonders relevant, da er Vereinsgeschichte und kommunalpolitische Ebene direkt verbindet.',
  },
  {
    id: 'C-008',
    title: 'SRF Rundschau 1971 als Makrokontext',
    statement:
      'Die SRF-Rundschau von 1971 dokumentiert eine nationale Schuldenproblematik im Schweizer Fussball, kann aber nicht ohne Zusatzquellen als direkter Nachweis für den FC Luzern dienen.',
    status: 'supported',
    period: '1971',
    scope: 'Schweiz',
    confidence: 0.87,
    tags: ['SRF', 'Makrokontext', 'Methodik'],
    sourceIds: ['S-011'],
    notes:
      'Methodisch zentral zur Abgrenzung zwischen Kontextquelle und club-spezifischem Beleg.',
  },
  {
    id: 'C-009',
    title: 'Ambition ohne deckungsgleiche Erlösbasis',
    statement:
      'Die Quellen legen nahe, dass sportliche Ambition und ökonomische Tragfähigkeit beim FC Luzern Anfang der 1970er Jahre nicht deckungsgleich waren.',
    status: 'supported_with_caution',
    period: '1969–1975',
    scope: 'FC Luzern',
    confidence: 0.76,
    tags: ['Ökonomie', 'Erlösmodell', 'Strategie'],
    sourceIds: ['S-001', 'S-007', 'S-008'],
    notes:
      'Analytisch tragfähig, aber als Synthese nicht auf ein einzelnes Zitat reduzierbar.',
  },
  {
    id: 'C-010',
    title: 'Kudi Müller als sporthistorisch relevante, aber ökonomisch begrenzte Figur',
    statement:
      'Kudi Müller ist für die sporthistorische Einordnung der Epoche relevant, trägt den ökonomischen Krisenclaim jedoch nicht allein.',
    status: 'open_caution',
    period: '1970–1972',
    scope: 'FC Luzern',
    confidence: 0.51,
    tags: ['Kudi Müller', 'Methodik', 'Personalisierung'],
    sourceIds: ['S-005', 'S-011'],
    notes:
      'Wichtiger Korrekturclaim gegen eine überpersonalisierte Krisenerzählung.',
  },
  {
    id: 'C-011',
    title: 'Institutionelle Krise statt bloss sportlicher Schwächephase',
    statement:
      'Für den FC Luzern der frühen 1970er Jahre ist eher von einer institutionellen Krise als von einer bloss sportlichen Schwächephase zu sprechen.',
    status: 'supported_with_caution',
    period: '1969–1975',
    scope: 'FC Luzern',
    confidence: 0.78,
    tags: ['Institutionen', 'Governance', 'Langfristigkeit'],
    sourceIds: ['S-001', 'S-007', 'S-008', 'S-009'],
    notes:
      'Als Synthese derzeit gut vertretbar; für Publikationsniveau sollten zusätzliche externe Primärquellen ergänzt werden.',
  },
];

const sources: Source[] = [
  {
    id: 'S-001',
    title: '120 Jahre FC Luzern – 1961–1971',
    type: 'Vereinschronik',
    year: '2021 / rückblickend',
    locality: 'Luzern',
    reliability: 'mittel–hoch',
    relevance: 'hoch',
    summary:
      'Dokumentiert sportliche Zielsetzungen, organisatorische Neuordnung und Hinweise auf finanzielle Schieflagen beim Amtsantritt Rengglis.',
  },
  {
    id: 'S-002',
    title: 'Lokale Presse zu Präsidium und Sanierungsrhetorik',
    type: 'Zeitung',
    year: '1969/70',
    locality: 'Luzern',
    reliability: 'mittel',
    relevance: 'hoch',
    summary:
      'Frühe Berichterstattung zur Neuordnung des Vereins, zu Donatoren und Wiederaufstiegsambitionen.',
  },
  {
    id: 'S-003',
    title: 'Berichte zu den farbigen Trikots / Flower-Power-Ästhetik',
    type: 'Zeitung / Bildbericht',
    year: '1970',
    locality: 'Luzern',
    reliability: 'mittel',
    relevance: 'mittel–hoch',
    summary:
      'Belegt die mediale Sichtbarkeit des ungewöhnlichen Vereinsauftritts im Jahr 1970.',
  },
  {
    id: 'S-004',
    title: 'Abstieg und Barrage gegen St. Gallen',
    type: 'Vereinschronik / Presse',
    year: '1972',
    locality: 'Luzern / Schweiz',
    reliability: 'hoch',
    relevance: 'hoch',
    summary:
      'Sichert den sportlichen Befund zum Abstieg 1971/72 ab.',
  },
  {
    id: 'S-005',
    title: 'Kudi Müller – biografischer Kontext',
    type: 'Porträt / Sekundärquelle',
    year: 'später, rückblickend',
    locality: 'Luzern',
    reliability: 'mittel',
    relevance: 'mittel',
    summary:
      'Hilfreich für die sporthistorische Kontextualisierung, begrenzt belastbar für institutionenökonomische Aussagen.',
  },
  {
    id: 'S-006',
    title: 'Rückschau auf die Blumenkinder-Ära',
    type: 'Erinnerungsquelle',
    year: 'später, rückblickend',
    locality: 'Luzern',
    reliability: 'mittel–niedrig',
    relevance: 'mittel',
    summary:
      'Kulturell ergiebig, methodisch aber nur mit Vorsicht zu verwenden.',
  },
  {
    id: 'S-007',
    title: '120 Jahre FC Luzern – 1971–1981',
    type: 'Vereinschronik',
    year: '2021 / rückblickend',
    locality: 'Luzern',
    reliability: 'mittel–hoch',
    relevance: 'hoch',
    summary:
      'Enthält zentrale Hinweise auf prekäre Finanzlage, personelle Abgänge und kommunale Hilfeersuchen.',
  },
  {
    id: 'S-008',
    title: 'Berichte zur Überschuldung und Konkursgefahr',
    type: 'Lokalpresse',
    year: '1974/75',
    locality: 'Luzern',
    reliability: 'hoch',
    relevance: 'hoch',
    summary:
      'Zeitgenössische Stützung für die finanzielle Zuspitzung.',
  },
  {
    id: 'S-009',
    title: 'Darlehensgesuch an die Stadt Luzern',
    type: 'Presse / Politikberichterstattung',
    year: '1975',
    locality: 'Stadt Luzern',
    reliability: 'hoch',
    relevance: 'hoch',
    summary:
      'Zentrale Quelle für die Verflechtung von Vereinskrise und kommunaler Öffentlichkeit.',
  },
  {
    id: 'S-010',
    title: 'Städtische Debatte / Grossstadtrat',
    type: 'Kommunalquelle',
    year: '1975',
    locality: 'Stadt Luzern',
    reliability: 'hoch',
    relevance: 'hoch',
    summary:
      'Methodisch besonders wertvoll, da ausserhalb der Vereinsüberlieferung.',
  },
  {
    id: 'S-011',
    title: 'SRF Rundschau – Schuldenkrise im Schweizer Fussball',
    type: 'TV-Primärquelle',
    year: '1971',
    locality: 'Schweiz',
    reliability: 'hoch',
    relevance: 'mittel–hoch',
    summary:
      'Robuster Makrokontext zur nationalen Kosten- und Schuldenproblematik, aber ohne direkte Luzern-Spezifik.',
  },
];

const evidence: Evidence[] = [
  {
    id: 'E-001',
    claimId: 'C-001',
    sourceId: 'S-001',
    kind: 'summary_excerpt',
    locality: 'Luzern',
    temporalProximity: 'mittel',
    text:
      'Die Vereinsüberlieferung beschreibt den Amtsantritt Rengglis entlang einer Doppelbewegung aus Wiederaufstiegsambition und finanzieller Ordnung.',
  },
  {
    id: 'E-002',
    claimId: 'C-003',
    sourceId: 'S-003',
    kind: 'press_excerpt',
    locality: 'Luzern',
    temporalProximity: 'hoch',
    text:
      'Zeitgenössische Berichte bestätigen die symbolische und mediale Wirkung der farbigen Trikots.',
  },
  {
    id: 'E-003',
    claimId: 'C-005',
    sourceId: 'S-007',
    kind: 'summary_excerpt',
    locality: 'Luzern',
    temporalProximity: 'mittel',
    text:
      'Für 1974/75 wird eine prekäre Finanzlage genannt, die personelle Abgaben notwendig gemacht habe.',
  },
  {
    id: 'E-004',
    claimId: 'C-006',
    sourceId: 'S-008',
    kind: 'press_excerpt',
    locality: 'Luzern',
    temporalProximity: 'hoch',
    text:
      'Zeitgenössische Lokalberichte sprechen von realer Konkursgefahr und Überschuldung.',
  },
  {
    id: 'E-005',
    claimId: 'C-007',
    sourceId: 'S-009',
    kind: 'press_excerpt',
    locality: 'Stadt Luzern',
    temporalProximity: 'hoch',
    text:
      'Das Gesuch um ein städtisches Darlehen wurde öffentlich diskutiert und politisch nicht bewilligt.',
  },
  {
    id: 'E-006',
    claimId: 'C-008',
    sourceId: 'S-011',
    kind: 'tv_context',
    locality: 'Schweiz',
    temporalProximity: 'hoch',
    text:
      'Die Rundschau benennt steigende Spielerlöhne und Transferkosten als Ursachen einer breiteren Schuldenproblematik im Schweizer Fussball.',
  },
  {
    id: 'E-007',
    claimId: 'C-011',
    sourceId: 'S-010',
    kind: 'institutional_context',
    locality: 'Stadt Luzern',
    temporalProximity: 'hoch',
    text:
      'Die kommunale Debatte zeigt, dass die Vereinskrise über den sportlichen Bereich hinaus als öffentlich relevantes Problem sichtbar wurde.',
  },
];

const gaps: Gap[] = [
  {
    id: 'G-001',
    title: 'Verbatim-Zitate aus Luzerner Tagespresse',
    priority: 'hoch',
    detail:
      'Für belastbares Publikationsniveau fehlen exakte Wortlaute mit Zeitung, Datum und Seitenangabe.',
  },
  {
    id: 'G-002',
    title: 'Kommunalprotokolle zum Darlehensgesuch',
    priority: 'hoch',
    detail:
      'Die politische Verhandlung sollte mit Ratsprotokollen oder offiziellen Vorlagen extern abgesichert werden.',
  },
  {
    id: 'G-003',
    title: 'Transkript oder Vollsichtung der Rundschau 1971',
    priority: 'hoch',
    detail:
      'Der Makrokontext ist stark, aber ohne vollständiges Transkript nur begrenzt granular auswertbar.',
  },
  {
    id: 'G-004',
    title: 'Quantitative Reihen zu Löhnen, Erlösen, Transfers',
    priority: 'mittel–hoch',
    detail:
      'Der strukturelle Krisenclaim wäre mit quantitativen Reihen deutlich präziser zu modellieren.',
  },
  {
    id: 'G-005',
    title: 'Systematische Gegenprüfung der Vereinschroniken',
    priority: 'mittel',
    detail:
      'Die Vereinsüberlieferung sollte stärker gegen unabhängige Presse- und Verwaltungsquellen gespiegelt werden.',
  },
];

type NavSection = {
  key: SectionKey;
  title: string;
  items?: string[];
};

const navSections: NavSection[] = [
  {
    key: 'overview',
    title: 'Übersicht',
    items: ['Projektbeschreibung', 'Epistemischer Status'],
  },
  {
    key: 'claims',
    title: 'Claims',
    items: ['Claim Index', 'Thematische Ordnung', 'Zeitliche Einordnung'],
  },
  {
    key: 'sources',
    title: 'Quellen & Provenienz',
    items: ['Primär- und Sekundärquellen', 'Lokalität', 'Reliabilität'],
  },
  {
    key: 'evidence',
    title: 'Evidenzzuordnung',
    items: ['Claim → Quelle', 'Evidenztyp', 'Temporale Nähe'],
  },
  {
    key: 'gaps',
    title: 'Forschungslücken',
    items: ['Offene Validierung', 'Fehlende Dokumente'],
  },
  {
    key: 'method',
    title: 'Methodik',
    items: ['Modell', 'Datenstruktur', 'Grenzen des Datensatzes'],
  },
];

function statusTone(status: ClaimStatus): string {
  switch (status) {
    case 'supported':
      return 'tone-success';
    case 'supported_with_caution':
      return 'tone-warning';
    default:
      return 'tone-muted';
  }
}

function confidenceLabel(value: number): string {
  if (value >= 0.85) return 'hoch';
  if (value >= 0.7) return 'mittel–hoch';
  if (value >= 0.55) return 'mittel';
  return 'offen';
}

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');
  const [selectedClaim, setSelectedClaim] = useState(claims[0].id);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ClaimStatus>('all');
  const [expandedNav, setExpandedNav] = useState<Record<string, boolean>>({
    overview: true,
    claims: true,
    sources: false,
    evidence: false,
    gaps: false,
    method: false,
  });

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesQuery =
        !query ||
        [claim.id, claim.title, claim.statement, claim.scope, ...claim.tags]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || claim.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const activeClaim =
    filteredClaims.find((claim) => claim.id === selectedClaim) ??
    filteredClaims[0] ??
    null;

  const activeClaimEvidence = evidence.filter(
    (item) => item.claimId === activeClaim?.id
  );

  const activeClaimSources = sources.filter((src) =>
    activeClaim?.sourceIds.includes(src.id)
  );

  function toggleNav(key: string) {
    setExpandedNav((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="page-shell">
      <div className="container">
        <section className="hero-grid">
          <div className="panel">
            <div className="panel-header">
              <div className="eyebrow">
                <Database size={14} />
                Forschungsinterface · Claim-basierte Rekonstruktion
              </div>
              <h1>FC Luzern – Strukturkrise 1969–1976</h1>
              <p className="lede">
                Forschungsinterface zur claim-basierten Rekonstruktion institutioneller,
                sportlicher und finanzieller Entwicklungen. Darstellung von Claims,
                Evidenzzuordnungen, Provenienz und Forschungslücken auf Basis historischer Quellen.
              </p>
            </div>

            <div className="metric-grid">
              <MetricCard
                icon={<ShieldCheck size={16} />}
                label="Claims"
                value={String(claims.length)}
                detail="formal formulierte Aussagen"
              />
              <MetricCard
                icon={<BookOpen size={16} />}
                label="Quellen"
                value={String(sources.length)}
                detail="Primär- und Sekundärquellen"
              />
              <MetricCard
                icon={<FileText size={16} />}
                label="Evidenzzuordnungen"
                value={String(evidence.length)}
                detail="dokumentierte Claim-Bezüge"
              />
              <MetricCard
                icon={<AlertTriangle size={16} />}
                label="Forschungslücken"
                value={String(gaps.length)}
                detail="offene Validierungsbereiche"
              />
            </div>
          </div>

          <div className="panel">
            <div className="panel-header compact">
              <h2>Epistemischer Status</h2>
            </div>
            <div className="status-list">
              <p>
                <strong>Faktisch belegt:</strong> Mehrere voneinander unabhängige Quellen
                stützen finanzielle Spannungen, Darlehensgesuche und Hinweise auf Überschuldung.
              </p>
              <p>
                <strong>Annahmen:</strong> Die interne institutionelle Tiefenstruktur ist
                nur teilweise rekonstruierbar.
              </p>
              <p>
                <strong>Interpretation:</strong> Der Fall FC Luzern kann als lokaler Ausdruck
                einer breiteren Transformationsphase des Schweizer Fussballs gelesen werden.
              </p>
              <p>
                <strong>Evidenzqualität:</strong> mittel bis hoch; heterogene Quellenbasis,
                jedoch noch unvollständige Archivabdeckung.
              </p>
            </div>
          </div>
        </section>

        <div className="research-layout">
            {activeSection === 'overview' && (
              <section className="panel">
                <div className="panel-header">
                  <h2>Projektbeschreibung</h2>
                  <p className="detail-statement">
                    Das Interface trennt Claim, Quelle, Evidenz und Forschungslücke ausdrücklich voneinander.
                    Historische Aussagen erscheinen nicht als abgeschlossene Faktenliste, sondern als
                    rekonstruierbare und revisionsfähige Aussageeinheiten.
                  </p>
                </div>

                <div className="card-grid two">
                  <article className="inner-card">
                    <h3>Funktion</h3>
                    <p>
                      Erfassung und Sichtbarmachung institutioneller, sportlicher und finanzieller
                      Entwicklungen des FC Luzern zwischen 1969 und 1976.
                    </p>
                  </article>
                  <article className="inner-card">
                    <h3>Begriffslogik</h3>
                    <p>
                      Claim ≠ Fakt. Ein Claim ist eine formal formulierte historische Aussage, die
                      durch Quellen gestützt, aber nicht notwendigerweise endgültig verifiziert ist.
                    </p>
                  </article>
                </div>
              </section>
            )}

            {activeSection === 'claims' && (
              <section className="claims-grid">
                <aside className="panel">
                  <div className="panel-header compact">
                    <h2>Claim Index</h2>
                    <p>Filter nach Text oder Evidenzstatus.</p>
                  </div>

                  <div className="controls">
                    <label className="search-box">
                      <Search size={16} />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Claim, Zeitraum, Tag …"
                      />
                    </label>

                    <div className="select-block">
                      <div className="select-label">Status</div>
                      <select
                        value={statusFilter}
                        onChange={(e) =>
                          setStatusFilter(e.target.value as 'all' | ClaimStatus)
                        }
                      >
                        <option value="all">Alle</option>
                        <option value="supported">supported</option>
                        <option value="supported_with_caution">supported_with_caution</option>
                        <option value="open_caution">open_caution</option>
                      </select>
                    </div>
                  </div>

                  <div className="claim-list">
                    {filteredClaims.map((claim) => (
                      <button
                        key={claim.id}
                        onClick={() => setSelectedClaim(claim.id)}
                        className={selectedClaim === claim.id ? 'claim-item active' : 'claim-item'}
                      >
                        <div className="claim-meta-row">
                          <span
                            className={`status-pill ${
                              selectedClaim === claim.id
                                ? 'status-invert'
                                : statusTone(claim.status)
                            }`}
                          >
                            {claim.status}
                          </span>
                          <span className="claim-id">{claim.id}</span>
                        </div>
                        <div className="claim-item-title">{claim.title}</div>
                        <div className="claim-item-subtitle">
                          {claim.period} · {claim.scope}
                        </div>
                      </button>
                    ))}
                  </div>
                </aside>

                <div className="detail-column">
                  {activeClaim ? (
                    <section className="panel">
                      <div className="panel-header">
                        <div className="badges-row">
                          <span className={`status-pill ${statusTone(activeClaim.status)}`}>
                            {activeClaim.status}
                          </span>
                          <span className="outline-pill">{activeClaim.id}</span>
                          <span className="outline-pill">
                            Evidenzgrad: {confidenceLabel(activeClaim.confidence)}
                          </span>
                        </div>
                        <h2>{activeClaim.title}</h2>
                        <p className="detail-statement">{activeClaim.statement}</p>
                      </div>

                      <div className="tag-row">
                        {activeClaim.tags.map((tag) => (
                          <span key={tag} className="soft-pill">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mini-grid">
                        <MiniInfo icon={<Clock3 size={15} />} label="Zeitraum" value={activeClaim.period} />
                        <MiniInfo icon={<MapPin size={15} />} label="Scope" value={activeClaim.scope} />
                        <MiniInfo
                          icon={<ShieldCheck size={15} />}
                          label="Konfidenz"
                          value={String(activeClaim.confidence)}
                        />
                      </div>

                      <div className="method-box">
                        <strong>Methodischer Hinweis:</strong> {activeClaim.notes}
                      </div>
                    </section>
                  ) : (
                    <section className="panel">
                      <p>Keine Claims gefunden.</p>
                    </section>
                  )}
                </div>
              </section>
            )}

            {activeSection === 'sources' && (
              <section className="panel">
                <div className="panel-header">
                  <h2>Quellen & Provenienz</h2>
                  <p>
                    Erfassung identifizierter Primär- und Sekundärquellen mit Angaben zu Lokalität,
                    Relevanz und methodischer Belastbarkeit.
                  </p>
                </div>

                <div className="card-grid three">
                  {sources.map((src) => (
                    <article key={src.id} className="inner-card">
                      <div className="source-topline">
                        <div>
                          <div className="source-title">{src.title}</div>
                          <div className="subtle">
                            {src.id} · {src.type}
                          </div>
                        </div>
                        <span className="outline-pill">{src.year}</span>
                      </div>

                      <div className="source-grid">
                        <div><strong>Lokalität:</strong> {src.locality}</div>
                        <div><strong>Reliabilität:</strong> {src.reliability}</div>
                        <div><strong>Relevanz:</strong> {src.relevance}</div>
                      </div>

                      <p>{src.summary}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'evidence' && (
              <section className="panel">
                <div className="panel-header">
                  <h2>Evidenzzuordnung</h2>
                  <p>
                    Sichtbare Zuordnung von Claims zu konkreten Evidenzobjekten. Nicht jede Quelle ist
                    bereits Evidenz; erst claim-relevante Exzerpte oder Kontextelemente werden hier
                    als Evidenz geführt.
                  </p>
                </div>

                <div className="card-grid two">
                  {evidence.map((item) => (
                    <article key={item.id} className="inner-card">
                      <div className="badges-row small">
                        <span className="outline-pill">{item.id}</span>
                        <span className="outline-pill">{item.claimId}</span>
                        <span className="outline-pill">{item.sourceId}</span>
                      </div>
                      <p>{item.text}</p>
                      <div className="subtle">
                        {item.kind} · {item.locality} · temporale Nähe: {item.temporalProximity}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'gaps' && (
              <section className="panel">
                <div className="panel-header">
                  <h2>Forschungslücken</h2>
                  <p>
                    Offene Validierungsbereiche, fehlende Dokumente und methodisch relevante Leerräume
                    des aktuellen Forschungsstands.
                  </p>
                </div>

                <div className="card-grid two">
                  {gaps.map((gap) => (
                    <article key={gap.id} className="inner-card">
                      <div className="source-topline">
                        <span className="outline-pill">{gap.id}</span>
                        <span
                          className={
                            gap.priority === 'hoch'
                              ? 'status-pill tone-danger'
                              : 'status-pill tone-warning'
                          }
                        >
                          {gap.priority}
                        </span>
                      </div>
                      <h3>{gap.title}</h3>
                      <p>{gap.detail}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'method' && (
              <section className="panel">
                <div className="panel-header">
                  <h2>Methodik</h2>
                  <p>
                    Claim-zentriertes Modell historischer Rekonstruktion mit expliziter Trennung von
                    Aussage, Evidenz, Quelle und Unsicherheit.
                  </p>
                </div>

                <div className="card-grid three text-grid">
                  <article>
                    <h3>1. Source Layer</h3>
                    <p>
                      Quellen werden zunächst als Trägerobjekte erfasst: Vereinschronik, Zeitung,
                      TV-Primärquelle oder kommunale Quelle.
                    </p>
                  </article>
                  <article>
                    <h3>2. Evidence Layer</h3>
                    <p>
                      Erst claim-relevante Exzerpte, Kontextelemente oder paraphrasierte Aussagen
                      werden als Evidenzobjekte modelliert.
                    </p>
                  </article>
                  <article>
                    <h3>3. Claim Layer</h3>
                    <p>
                      Claims bleiben von den Quellen getrennt. Dadurch werden Unsicherheit,
                      Gegenhypothesen und spätere Revisionen sichtbar.
                    </p>
                  </article>
                </div>

                <div className="method-box">
                  <strong>Status des Datensatzes:</strong> Der vorliegende Bestand ist nicht vollständig.
                  Er ist als ausbaufähiger Forschungsstand zu verstehen und nicht als endgültige Edition.
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="metric-card">
      <div className="metric-label">
        {icon} {label}
      </div>
      <div className="metric-value">{value}</div>
      <div className="subtle">{detail}</div>
    </div>
  );
}

function MiniInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="mini-card">
      <div className="metric-label">
        {icon} {label}
      </div>
      <div className="source-title">{value}</div>
    </div>
  );
}
