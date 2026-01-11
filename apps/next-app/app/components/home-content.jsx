"use client";

import { useEffect, useState } from "react";
import {
  getStoredLocale,
  setLocaleCookie,
  LOCALE_EN,
  LOCALE_ZH
} from "../lib/home-copy";

export default function HomeContent({ zhCopy, enCopy }) {
  const [locale, setLocale] = useState(LOCALE_ZH);

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  useEffect(() => {
    setLocaleCookie(locale);
  }, [locale]);

  const copy = locale === LOCALE_EN ? enCopy : zhCopy;

  return (
    <div className="landing">
      <header className="topbar">
        <div className="brand">
          <span className="brand__name">{copy.site.name}</span>
          <span className="brand__tagline">{copy.site.tagline}</span>
        </div>
        <nav className="nav">
          {copy.site.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div
          className="lang-switch"
          role="group"
          aria-label={copy.language.label}
        >
          <button
            type="button"
            className={locale === LOCALE_ZH ? "active" : ""}
            aria-pressed={locale === LOCALE_ZH}
            onClick={() => setLocale(LOCALE_ZH)}
          >
            {copy.language.options.zh}
          </button>
          <button
            type="button"
            className={locale === LOCALE_EN ? "active" : ""}
            aria-pressed={locale === LOCALE_EN}
            onClick={() => setLocale(LOCALE_EN)}
          >
            {copy.language.options.en}
          </button>
        </div>
      </header>

      <section className="hero reveal" style={{ "--delay": "120ms" }}>
        <div className="hero__content">
          <span className="hero__badge">{copy.hero.badge}</span>
          <h1>{copy.hero.title}</h1>
          <p>{copy.hero.subtitle}</p>
          <div className="hero__actions">
            <button type="button" className="button primary">
              {copy.hero.primaryCta}
            </button>
            <button type="button" className="button ghost">
              {copy.hero.secondaryCta}
            </button>
          </div>
        </div>
        <aside className="hero__preview">
          <div className="preview-card">
            <h2>{copy.hero.previewTitle}</h2>
            <ul>
              {copy.hero.previewItems.map((item) => (
                <li key={item.label}>
                  <span className="preview-label">{item.label}</span>
                  <span className="preview-value">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="stats reveal" style={{ "--delay": "220ms" }}>
        {copy.stats.map((item) => (
          <div className="stat" key={item.label}>
            <span className="stat__value">{item.value}</span>
            <span className="stat__label">{item.label}</span>
          </div>
        ))}
      </section>

      <section
        className="features reveal"
        id="features"
        style={{ "--delay": "320ms" }}
      >
        <div className="section-head">
          <h2>{copy.sections.featuresTitle}</h2>
          <p>{copy.sections.featuresSubtitle}</p>
        </div>
        <div className="feature-grid">
          {copy.features.map((feature) => (
            <article className="card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="workflow reveal"
        id="workflow"
        style={{ "--delay": "420ms" }}
      >
        <div className="section-head">
          <h2>{copy.sections.workflowTitle}</h2>
          <p>{copy.sections.workflowBody}</p>
        </div>
        <div className="workflow-grid">
          {copy.workflow.map((step) => (
            <article className="step" key={step.step}>
              <h3>{step.step}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="story reveal"
        id="story"
        style={{ "--delay": "520ms" }}
      >
        <div className="story-card">
          <h2>{copy.sections.storyTitle}</h2>
          <p>{copy.sections.storyBody}</p>
        </div>
      </section>

      <section className="cta reveal" id="cta" style={{ "--delay": "620ms" }}>
        <div className="cta-card">
          <div>
            <h2>{copy.sections.ctaTitle}</h2>
            <p>{copy.sections.ctaBody}</p>
          </div>
          <button type="button" className="button primary">
            {copy.sections.ctaButton}
          </button>
        </div>
      </section>

      <footer className="footer">
        <span>{copy.footer.note}</span>
      </footer>
    </div>
  );
}
