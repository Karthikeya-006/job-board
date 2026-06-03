import React, { useState } from 'react';
import JobBoard from './components/JobBoard';
import ProfileScreen from './components/ProfileScreen';
import styles from './App.module.css';

function App() {
  const [screen, setScreen] = useState('jobs');

  return (
    <div className={styles.app}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <i className="ti ti-bolt" style={{ fontSize: 20, color: 'var(--accent)' }} />
            <span className={styles.brandName}>TalentFlow</span>
          </div>

          <div className={styles.navLinks}>
            <button
              className={styles.navBtn}
              style={{
                background: screen === 'jobs' ? 'var(--accent-light)' : 'transparent',
                color: screen === 'jobs' ? 'var(--accent-text)' : 'var(--text2)',
                fontWeight: screen === 'jobs' ? 600 : 400,
              }}
              onClick={() => setScreen('jobs')}
            >
              <i className="ti ti-briefcase" style={{ fontSize: 16 }} />
              <span>Job Board</span>
            </button>
            <button
              className={styles.navBtn}
              style={{
                background: screen === 'profile' ? 'var(--accent-light)' : 'transparent',
                color: screen === 'profile' ? 'var(--accent-text)' : 'var(--text2)',
                fontWeight: screen === 'profile' ? 600 : 400,
              }}
              onClick={() => setScreen('profile')}
            >
              <i className="ti ti-user-circle" style={{ fontSize: 16 }} />
              <span>My Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Screen Content */}
      <main>
        {screen === 'jobs' ? <JobBoard /> : <ProfileScreen />}
      </main>
    </div>
  );
}

export default App;
