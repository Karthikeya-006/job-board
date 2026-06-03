import React, { useState } from 'react';
import styles from './JobCard.module.css';

const typeConfig = {
  'Full-time':  { bg: 'var(--blue-light)',   color: 'var(--blue-text)' },
  'Part-time':  { bg: 'var(--accent-light)', color: 'var(--accent-text)' },
  'Internship': { bg: 'var(--amber-light)',  color: 'var(--amber)' },
  'Contract':   { bg: 'var(--coral-light)',  color: 'var(--coral)' },
};

function JobCard({ job, applied, onApply }) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const tc = typeConfig[job.type] || typeConfig['Full-time'];

  return (
    <div
      className={styles.card}
      style={{ boxShadow: hovered ? '0 6px 24px rgba(0,0,0,0.09)' : 'none', transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.companyRow}>
          <div className={styles.logoBox} style={{ background: job.color }}>
            {job.logo}
          </div>
          <div>
            <h3 className={styles.jobTitle}>{job.title}</h3>
            <p className={styles.companyName}>{job.company}</p>
          </div>
        </div>
        <button
          className={styles.saveBtn}
          onClick={() => setSaved(s => !s)}
          aria-label={saved ? 'Unsave job' : 'Save job'}
          style={{ color: saved ? '#E24B4A' : 'var(--text3)' }}
        >
          <i className={saved ? 'ti ti-heart-filled' : 'ti ti-heart'} />
        </button>
      </div>

      {/* Badges */}
      <div className={styles.badges}>
        <span className={styles.badge}>
          <i className="ti ti-map-pin" style={{ fontSize: 12 }} />
          {job.location}
        </span>
        {job.remote && (
          <span className={styles.badge} style={{ background: 'var(--accent-light)', color: 'var(--accent-text)' }}>
            Remote
          </span>
        )}
        <span className={styles.badge} style={{ background: tc.bg, color: tc.color }}>
          {job.type}
        </span>
      </div>

      {/* Description */}
      <p className={styles.description}>{job.description}</p>

      {/* Tags */}
      <div className={styles.tags}>
        {job.tags.map(tag => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div>
          <p className={styles.salary}>{job.salary}</p>
          <p className={styles.posted}>
            <i className="ti ti-clock" style={{ fontSize: 11, marginRight: 3 }} />
            {job.posted}
          </p>
        </div>
        <button
          className={styles.applyBtn}
          onClick={() => onApply(job.id)}
          style={{
            background: applied ? 'var(--surface2)' : 'var(--accent)',
            color: applied ? 'var(--text2)' : '#fff',
            cursor: applied ? 'default' : 'pointer',
          }}
          disabled={applied}
        >
          {applied ? (
            <><i className="ti ti-check" style={{ marginRight: 5 }} />Applied</>
          ) : (
            'Apply Now'
          )}
        </button>
      </div>
    </div>
  );
}

export default JobCard;
