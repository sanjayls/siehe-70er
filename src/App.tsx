import React from 'react'

export default function App() {
  return (
    <div className="page-shell">
      <div className="container">

        <header className="panel">
          <div className="panel-header">
            <span className="eyebrow">Freistoss Luzern · Prototype</span>
            <h1>FC Luzern Research Explorer</h1>
            <p className="lede">
              Claim-centric research interface for the institutional and financial
              crisis period (1969–1976).
            </p>
          </div>
        </header>

        <section className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Claims</div>
            <div className="metric-value">12</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Sources</div>
            <div className="metric-value">8</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Conflicts</div>
            <div className="metric-value">3</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Coverage</div>
            <div className="metric-value">~45%</div>
          </div>
        </section>

        <section className="panel">
          <h2>Example Claim</h2>

          <div className="stack">
            <div className="claim-item active">
              <div className="claim-item-title">
                Financial instability increased in Swiss football around 1971
              </div>
              <div className="claim-item-subtitle">
                Based on SRF Rundschau report (05.05.1971)
              </div>
            </div>

            <div className="method-box">
              <strong>Interpretation:</strong><br />
              Revenue structures (attendance-driven) became insufficient to cover
              rising cost structures → structural deficit formation.
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
