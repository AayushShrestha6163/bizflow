"use client";

import { useState } from "react";

const features = [
  {
    number: "01",
    title: "Smart Dashboard",
    description:
      "See revenue, orders, inventory, and business performance from one clean dashboard.",
    icon: "▦",
  },
  {
    number: "02",
    title: "Sales Management",
    description:
      "Create and manage sales, invoices, products, and customer transactions with ease.",
    icon: "↗",
  },
  {
    number: "03",
    title: "Inventory Control",
    description:
      "Track stock levels, purchases, adjustments, returns, and low-stock products in real time.",
    icon: "□",
  },
  {
    number: "04",
    title: "Business Analytics",
    description:
      "Turn your business data into useful metrics, trends, and actionable insights.",
    icon: "⌁",
  },
  {
    number: "05",
    title: "AI Insights",
    description:
      "Get intelligent recommendations based on your actual sales and inventory data.",
    icon: "✦",
  },
  {
    number: "06",
    title: "Role-Based Access",
    description:
      "Keep your business secure with authentication and role-based access for your team.",
    icon: "◇",
  },
];

const stats = [
  ["01", "Sales", "Track every transaction"],
  ["02", "Inventory", "Know your stock"],
  ["03", "Analytics", "Understand your business"],
  ["04", "AI", "Make better decisions"],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="landing-page">
      {/* ================= NAVBAR ================= */}
      <nav className="landing-nav">
        <div className="landing-container nav-inner">
          <a href="#" className="brand">
            <span className="brand-mark">
              <span />
              <span />
              <span />
            </span>

            <span className="brand-name">BizFlow</span>
          </a>

          <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>
              Features
            </a>

            <a href="#analytics" onClick={() => setMenuOpen(false)}>
              Analytics
            </a>

            <a href="#ai" onClick={() => setMenuOpen(false)}>
              AI Insights
            </a>

            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
          </div>

          <div className="nav-actions">
            <a href="/login" className="nav-login">
              Log in
            </a>

            <a href="/register" className="nav-cta">
              Get started
              <span>→</span>
            </a>
          </div>

          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="landing-container hero-container">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              AI-powered business management
            </div>

            <h1>
              Run your business
              <br />
              <span>with clarity.</span>
            </h1>

            <p className="hero-description">
              BizFlow brings sales, inventory, analytics, and intelligent
              business insights together in one simple platform.
            </p>

            <div className="hero-buttons">
              <a href="/register" className="primary-button">
                Start managing your business
                <span>→</span>
              </a>

              <a href="#features" className="secondary-button">
                Explore features
              </a>
            </div>

            <div className="hero-trust">
              <div className="trust-avatars">
                <span>JD</span>
                <span>AS</span>
                <span>MK</span>
                <span>+</span>
              </div>

              <div>
                <strong>Built for growing businesses</strong>
                <small>Simple tools. Better decisions.</small>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="hero-preview">
            <div className="preview-window">
              <div className="preview-topbar">
                <div className="preview-dots">
                  <i />
                  <i />
                  <i />
                </div>

                <div className="preview-url">
                  app.bizflow.local/dashboard
                </div>

                <div className="preview-user">AS</div>
              </div>

              <div className="preview-body">
                <aside className="preview-sidebar">
                  <div className="preview-logo">
                    <span className="mini-logo">
                      <i />
                      <i />
                      <i />
                    </span>
                    BizFlow
                  </div>

                  <div className="preview-menu">
                    <div className="preview-menu-item active">
                      <span>▦</span>
                      Dashboard
                    </div>

                    <div className="preview-menu-item">
                      <span>□</span>
                      Products
                    </div>

                    <div className="preview-menu-item">
                      <span>↗</span>
                      Sales
                    </div>

                    <div className="preview-menu-item">
                      <span>◇</span>
                      Inventory
                    </div>

                    <div className="preview-menu-item">
                      <span>⌁</span>
                      Analytics
                    </div>

                    <div className="preview-menu-item">
                      <span>✦</span>
                      AI Insights
                    </div>
                  </div>
                </aside>

                <div className="preview-main">
                  <div className="preview-heading">
                    <div>
                      <small>OVERVIEW</small>
                      <h3>Good morning, Admin</h3>
                    </div>

                    <button>Today ▾</button>
                  </div>

                  <div className="preview-stats">
                    <div className="preview-stat">
                      <span>Total revenue</span>
                      <strong>Rs. 248,560</strong>
                      <em>↗ 12.8%</em>
                    </div>

                    <div className="preview-stat">
                      <span>Total orders</span>
                      <strong>1,284</strong>
                      <em>↗ 8.4%</em>
                    </div>

                    <div className="preview-stat">
                      <span>Products</span>
                      <strong>248</strong>
                      <em className="neutral">Active</em>
                    </div>
                  </div>

                  <div className="preview-grid">
                    <div className="chart-card">
                      <div className="chart-header">
                        <div>
                          <span>Revenue overview</span>
                          <strong>Rs. 248,560</strong>
                        </div>

                        <span className="chart-period">7 days</span>
                      </div>

                      <div className="fake-chart">
                        <div className="chart-lines">
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>

                        <svg
                          viewBox="0 0 500 180"
                          preserveAspectRatio="none"
                          className="chart-svg"
                        >
                          <defs>
                            <linearGradient
                              id="area"
                              x1="0"
                              x2="0"
                              y1="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#2563eb"
                                stopOpacity="0.18"
                              />
                              <stop
                                offset="100%"
                                stopColor="#2563eb"
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>

                          <path
                            d="M0 145 C35 138 48 112 78 118 C105 124 118 91 148 100 C177 110 189 78 218 86 C245 94 258 61 288 68 C318 76 327 48 357 56 C389 65 408 25 438 40 C463 51 477 25 500 18 L500 180 L0 180 Z"
                            fill="url(#area)"
                          />

                          <path
                            d="M0 145 C35 138 48 112 78 118 C105 124 118 91 148 100 C177 110 189 78 218 86 C245 94 258 61 288 68 C318 76 327 48 357 56 C389 65 408 25 438 40 C463 51 477 25 500 18"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="3"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>

                        <div className="chart-labels">
                          <span>Mon</span>
                          <span>Tue</span>
                          <span>Wed</span>
                          <span>Thu</span>
                          <span>Fri</span>
                          <span>Sat</span>
                          <span>Sun</span>
                        </div>
                      </div>
                    </div>

                    <div className="ai-preview-card">
                      <div className="ai-preview-icon">✦</div>

                      <span className="ai-label">AI INSIGHT</span>

                      <h4>Your business is growing</h4>

                      <p>
                        Revenue is trending upward. Your best-selling product
                        is contributing strongly to current sales.
                      </p>

                      <a href="#ai">
                        View insights <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-stock">
              <span className="floating-icon">✓</span>
              <div>
                <strong>Stock healthy</strong>
                <small>All key products available</small>
              </div>
            </div>

            <div className="floating-card floating-card-revenue">
              <span className="floating-icon revenue">↗</span>
              <div>
                <strong>+12.8%</strong>
                <small>Revenue growth</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="stats-section">
        <div className="landing-container stats-grid">
          {stats.map(([number, title, description]) => (
            <div className="stat-item" key={number}>
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section" id="features">
        <div className="landing-container">
          <div className="section-heading">
            <div className="section-eyebrow">EVERYTHING IN ONE PLACE</div>

            <h2>
              Tools that help you
              <br />
              <span>move your business forward.</span>
            </h2>

            <p>
              Stop switching between spreadsheets and disconnected tools.
              BizFlow gives you the essentials in one intelligent workspace.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <div className="feature-card" key={feature.number}>
                <div className="feature-top">
                  <span className="feature-number">{feature.number}</span>
                  <span className="feature-icon">{feature.icon}</span>
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <a href="#analytics">
                  Learn more <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ANALYTICS ================= */}
      <section className="analytics-section" id="analytics">
        <div className="landing-container analytics-container">
          <div className="analytics-content">
            <div className="section-eyebrow">BUSINESS INTELLIGENCE</div>

            <h2>
              Your data should
              <br />
              <span>tell you something.</span>
            </h2>

            <p>
              BizFlow transforms everyday business activity into clear
              analytics so you can understand what is working, what is not,
              and where your attention is needed.
            </p>

            <div className="analytics-points">
              <div>
                <span>✓</span>
                <div>
                  <strong>Revenue tracking</strong>
                  <p>Monitor revenue and order performance.</p>
                </div>
              </div>

              <div>
                <span>✓</span>
                <div>
                  <strong>Product performance</strong>
                  <p>Identify your best-selling products.</p>
                </div>
              </div>

              <div>
                <span>✓</span>
                <div>
                  <strong>Inventory intelligence</strong>
                  <p>Spot low-stock and stock-out risks early.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-visual">
            <div className="analytics-card">
              <div className="analytics-card-header">
                <div>
                  <small>SALES PERFORMANCE</small>
                  <strong>Rs. 248,560</strong>
                </div>

                <span>+12.8%</span>
              </div>

              <div className="large-chart">
                <div className="large-chart-y">
                  <span>300k</span>
                  <span>200k</span>
                  <span>100k</span>
                  <span>0</span>
                </div>

                <svg
                  viewBox="0 0 560 230"
                  preserveAspectRatio="none"
                  className="large-chart-svg"
                >
                  <defs>
                    <linearGradient
                      id="largeArea"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2563eb"
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor="#2563eb"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  <path
                    d="M0 190 C35 170 45 177 75 156 C105 135 119 160 147 138 C177 116 189 125 217 111 C245 97 258 120 287 86 C318 50 328 82 358 62 C389 41 405 66 433 42 C465 16 482 45 510 22 C530 7 545 15 560 5 L560 230 L0 230 Z"
                    fill="url(#largeArea)"
                  />

                  <path
                    d="M0 190 C35 170 45 177 75 156 C105 135 119 160 147 138 C177 116 189 125 217 111 C245 97 258 120 287 86 C318 50 328 82 358 62 C389 41 405 66 433 42 C465 16 482 45 510 22 C530 7 545 15 560 5"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              <div className="large-chart-x">
                <span>JAN</span>
                <span>FEB</span>
                <span>MAR</span>
                <span>APR</span>
                <span>MAY</span>
                <span>JUN</span>
                <span>JUL</span>
              </div>
            </div>

            <div className="mini-metrics">
              <div>
                <span>Orders</span>
                <strong>1,284</strong>
                <small>+8.4%</small>
              </div>

              <div>
                <span>Avg. order</span>
                <strong>Rs. 193</strong>
                <small>+4.2%</small>
              </div>

              <div>
                <span>Profit</span>
                <strong>32.6%</strong>
                <small>+3.1%</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= AI ================= */}
      <section className="ai-section" id="ai">
        <div className="ai-grid-background" />

        <div className="landing-container ai-container">
          <div className="ai-visual">
            <div className="ai-orbit orbit-one" />
            <div className="ai-orbit orbit-two" />
            <div className="ai-orbit orbit-three" />

            <div className="ai-center">
              <span>✦</span>
            </div>

            <div className="ai-node node-one">
              <span>↗</span>
              <small>Sales</small>
            </div>

            <div className="ai-node node-two">
              <span>□</span>
              <small>Stock</small>
            </div>

            <div className="ai-node node-three">
              <span>⌁</span>
              <small>Data</small>
            </div>

            <div className="ai-node node-four">
              <span>◇</span>
              <small>Products</small>
            </div>
          </div>

          <div className="ai-content">
            <div className="ai-badge">
              <span>✦</span>
              INTELLIGENT BUSINESS INSIGHTS
            </div>

            <h2>
              Let your data
              <br />
              <span>work for you.</span>
            </h2>

            <p>
              BizFlow's intelligence layer analyzes your business data and
              highlights patterns, opportunities, and risks that deserve your
              attention.
            </p>

            <div className="ai-list">
              <div>
                <span>01</span>
                <p>
                  <strong>Understand performance</strong>
                  See what is driving your sales and revenue.
                </p>
              </div>

              <div>
                <span>02</span>
                <p>
                  <strong>Spot inventory risks</strong>
                  Identify products that may need attention.
                </p>
              </div>

              <div>
                <span>03</span>
                <p>
                  <strong>Get recommendations</strong>
                  Turn business data into practical next steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section" id="about">
        <div className="landing-container">
          <div className="cta-card">
            <div className="cta-glow" />

            <div className="cta-content">
              <div className="section-eyebrow">READY TO FLOW?</div>

              <h2>
                Build a better way
                <br />
                <span>to run your business.</span>
              </h2>

              <p>
                Bring your sales, inventory, analytics, and business insights
                together with BizFlow.
              </p>

              <a href="/register" className="primary-button cta-button">
                Get started with BizFlow
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="landing-footer">
        <div className="landing-container footer-inner">
          <div>
            <a href="#" className="brand footer-brand">
              <span className="brand-mark">
                <span />
                <span />
                <span />
              </span>

              <span className="brand-name">BizFlow</span>
            </a>

            <p>
              Simple business management.
              <br />
              Smarter business decisions.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <span>PRODUCT</span>
              <a href="#features">Features</a>
              <a href="#analytics">Analytics</a>
              <a href="#ai">AI Insights</a>
            </div>

            <div>
              <span>ACCOUNT</span>
              <a href="/login">Log in</a>
              <a href="/register">Create account</a>
            </div>

            <div>
              <span>PROJECT</span>
              <a href="#about">About BizFlow</a>
              <a href="#features">Technology</a>
            </div>
          </div>
        </div>

        <div className="landing-container footer-bottom">
          <span>© 2026 BizFlow. All rights reserved.</span>
          <span>Built for better business decisions.</span>
        </div>
      </footer>
    </main>
  );
}