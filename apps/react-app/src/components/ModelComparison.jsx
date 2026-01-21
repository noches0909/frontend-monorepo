import './ModelComparison.css'

const models = [
  {
    id: 'model-1',
    title: '模型一',
    mediaType: 'video',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    ctaDirection: 'left',
    ctaLabel: '方向键',
    footerText: '这个更好',
  },
  {
    id: 'model-2',
    title: '模型二',
    mediaType: 'image',
    src:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    ctaDirection: 'right',
    ctaLabel: '方向键',
    footerText: '这个更好',
  },
]

function ModelCard({
  title,
  mediaType,
  src,
  poster,
  ctaDirection,
  ctaLabel,
  footerText,
  delay,
}) {
  const arrow = ctaDirection === 'left' ? '\u2190' : '\u2192'

  return (
    <section className="model-card" style={{ '--delay': `${delay}ms` }}>
      <header className="model-card__header">
        <h3 className="model-card__title">{title}</h3>
      </header>
      <div className="model-card__media">
        {mediaType === 'video' ? (
          <video
            className="model-card__media-item"
            src={src}
            poster={poster}
            controls
            preload="metadata"
          />
        ) : (
          <img className="model-card__media-item" src={src} alt={title} loading="lazy" />
        )}
      </div>
      <footer className="model-card__footer">
        <button className="model-card__cta" type="button">
          <span className="model-card__cta-icon" aria-hidden="true">
            {arrow}
          </span>
          <span>{ctaLabel}</span>
        </button>
        <span className="model-card__footer-text">{footerText}</span>
      </footer>
    </section>
  )
}

function ModelComparison() {
  return (
    <div className="model-grid">
      {models.map((item, index) => (
        <ModelCard key={item.id} {...item} delay={index * 120} />
      ))}
    </div>
  )
}

export default ModelComparison
