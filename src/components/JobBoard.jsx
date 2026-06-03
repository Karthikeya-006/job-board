import React, { useState } from 'react';
import JobCard from './JobCard';
import { JOBS, JOB_TYPES } from '../data/jobs';
import styles from './JobBoard.module.css';

function JobBoard() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [applied, setApplied] = useState(new Set());

  const filtered = JOBS.filter(job => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.tags.some(t => t.toLowerCase().includes(q));
    const matchType = filter === 'All' || job.type === filter;
    return matchSearch && matchType;
  });

  const handleApply = id => {
    setApplied(prev => new Set([...prev, id]));
  };

  return (
    <div className={styles.container}>
      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Find Your Next Role</h1>
        <p className={styles.heroSub}>
          {JOBS.length} curated opportunities from world-class companies
        </p>
      </div>

      {/* Search & Filters */}
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontSize: 16, pointerEvents: 'none' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs, companies, skills…"
            className={styles.searchInput}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch('')} aria-label="Clear search">
              <i className="ti ti-x" style={{ fontSize: 14 }} />
            </button>
          )}
        </div>

        <div className={styles.filters}>
          {JOB_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={styles.filterBtn}
              style={{
                background: filter === type ? 'var(--accent-light)' : 'var(--surface)',
                color: filter === type ? 'var(--accent-text)' : 'var(--text2)',
                borderColor: filter === type ? 'var(--accent)' : 'var(--border)',
                fontWeight: filter === type ? 600 : 400,
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsRow}>
        <p className={styles.resultsCount}>
          Showing <strong>{filtered.length}</strong> of {JOBS.length} jobs
          {filter !== 'All' && <> · <span style={{ color: 'var(--accent)' }}>{filter}</span></>}
          {search && <> matching "<strong>{search}</strong>"</>}
        </p>
        {applied.size > 0 && (
          <span className={styles.appliedBadge}>
            <i className="ti ti-check" style={{ marginRight: 4 }} />
            {applied.size} Applied
          </span>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <i className="ti ti-mood-empty" style={{ fontSize: 48, color: 'var(--text3)', display: 'block', marginBottom: 12 }} />
          <p style={{ fontSize: 16, color: 'var(--text2)', fontWeight: 500 }}>No jobs match your search</p>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6 }}>Try different keywords or clear your filters</p>
          <button className={styles.resetBtn} onClick={() => { setSearch(''); setFilter('All'); }}>
            Reset filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(job => (
            <JobCard
              key={job.id}
              job={job}
              applied={applied.has(job.id)}
              onApply={handleApply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default JobBoard;
