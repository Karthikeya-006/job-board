import React, { useState, useRef, useCallback } from 'react';
import styles from './ProfileScreen.module.css';

// Field config: key, label, icon, weight toward 100%
const FIELD_CONFIG = [
  { key: 'avatar',    label: 'Profile Picture',   icon: 'ti-photo',      weight: 10 },
  { key: 'fullName',  label: 'Full Name',          icon: 'ti-user',       weight: 15 },
  { key: 'email',     label: 'Email Address',      icon: 'ti-mail',       weight: 15 },
  { key: 'phone',     label: 'Phone Number',       icon: 'ti-phone',      weight: 10 },
  { key: 'skills',    label: 'Skills',             icon: 'ti-tag',        weight: 15 },
  { key: 'education', label: 'Education Details',  icon: 'ti-school',     weight: 20 },
  { key: 'resume',    label: 'Resume',             icon: 'ti-file-cv',    weight: 15 },
];

const INITIAL_VALUES = {
  avatar: '',
  fullName: '',
  email: '',
  phone: '',
  skills: [],
  education: '',
  resume: '',
};

// Validators
function validate(field, value) {
  if (field === 'fullName' && value && value.trim().length < 2)
    return 'Name must be at least 2 characters';
  if (field === 'email' && value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return 'Please enter a valid email address';
  }
  if (field === 'phone' && value) {
    if (!/^[\d\s\+\-\(\)]{7,15}$/.test(value))
      return 'Please enter a valid phone number';
  }
  return '';
}

// Calculate completion %
function calcCompletion(values, errors) {
  return FIELD_CONFIG.reduce((sum, { key, weight }) => {
    const val = values[key];
    const hasError = !!errors[key];
    if (hasError) return sum;
    const filled =
      key === 'skills' ? val.length > 0 :
      key === 'avatar' || key === 'resume' ? !!val :
      typeof val === 'string' && val.trim().length > 0;
    return filled ? sum + weight : sum;
  }, 0);
}

// ── SkillInput subcomponent ───────────────────────────────────
function SkillInput({ skills, onChange }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const s = input.trim();
    if (s && !skills.includes(s)) {
      onChange([...skills, s]);
      setInput('');
    }
  };

  const removeSkill = skill => onChange(skills.filter(s => s !== skill));

  return (
    <div>
      <div className={styles.skillRow}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
          placeholder="Type a skill and press Enter or Add…"
          className={styles.skillInput}
        />
        <button type="button" onClick={addSkill} className={styles.addBtn}>
          <i className="ti ti-plus" style={{ marginRight: 4 }} />Add
        </button>
      </div>
      {skills.length > 0 && (
        <div className={styles.skillTags}>
          {skills.map(skill => (
            <span key={skill} className={styles.skillTag}>
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className={styles.removeSkill}
                aria-label={`Remove ${skill}`}
              >
                <i className="ti ti-x" style={{ fontSize: 11 }} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── FileUpload subcomponent ───────────────────────────────────
function FileUpload({ label, icon, accept, value, onChange }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);

  const handleFile = file => {
    if (file) onChange(file.name);
  };

  return (
    <div
      className={styles.fileZone}
      style={{
        borderColor: drag ? 'var(--accent)' : value ? 'var(--accent)' : 'var(--border)',
        background: value ? 'var(--accent-light)' : drag ? 'var(--accent-light)' : 'var(--surface)',
      }}
      onClick={() => ref.current.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
    >
      <input
        ref={ref}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />
      {value ? (
        <div className={styles.fileUploaded}>
          <i className={`ti ${icon}`} style={{ fontSize: 22, color: 'var(--accent)' }} />
          <div>
            <p className={styles.fileName}>{value}</p>
            <p className={styles.fileHint} style={{ color: 'var(--accent)' }}>Click to replace</p>
          </div>
        </div>
      ) : (
        <div className={styles.fileEmpty}>
          <i className={`ti ${icon}`} style={{ fontSize: 22, color: 'var(--text3)' }} />
          <div>
            <p className={styles.fileLabel}>{label}</p>
            <p className={styles.fileHint}>Click to browse or drag & drop</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ProfileScreen ────────────────────────────────────────
function ProfileScreen() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitState, setSubmitState] = useState('idle'); // idle | success | error

  const setField = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    const err = validate(field, value);
    setErrors(prev => ({ ...prev, [field]: err }));
    setSubmitState('idle');
  }, []);

  const handleBlur = field => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const err = validate(field, values[field]);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const completion = calcCompletion(values, errors);
  const progressColor =
    completion < 40 ? '#E24B4A' :
    completion < 70 ? '#BA7517' :
    'var(--accent)';

  const avatarInitials = values.fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || null;

  const handleSubmit = e => {
    e.preventDefault();
    const requiredFields = ['fullName', 'email', 'phone'];
    const newTouched = {};
    const newErrors = {};
    requiredFields.forEach(f => {
      newTouched[f] = true;
      newErrors[f] = validate(f, values[f]);
    });
    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(prev => ({ ...prev, ...newErrors }));

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (!hasErrors) {
      setSubmitState('success');
      setTimeout(() => setSubmitState('idle'), 3000);
    } else {
      setSubmitState('error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Complete Your Profile</h1>
        <p className={styles.subtitle}>Stand out to employers — a complete profile gets 4× more views</p>
      </div>

      {/* Progress Card */}
      <div className={styles.progressCard}>
        <div className={styles.progressHeader}>
          <div>
            <p className={styles.progressLabel}>Profile Completion</p>
            <p className={styles.progressHint}>
              {completion < 40 ? 'Just getting started — keep going!' :
               completion < 70 ? 'Looking good! A few more sections to go.' :
               completion < 100 ? 'Almost there! Nearly complete.' :
               '🎉 Your profile is 100% complete!'}
            </p>
          </div>
          <span className={styles.progressPct} style={{ color: progressColor }}>
            {completion}%
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${completion}%`, background: progressColor }}
          />
        </div>
        <div className={styles.fieldPills}>
          {FIELD_CONFIG.map(({ key, label }) => {
            const val = values[key];
            const filled =
              (key === 'skills' ? val.length > 0 : !!val) && !errors[key];
            return (
              <span
                key={key}
                className={styles.pill}
                style={{
                  background: filled ? 'var(--accent-light)' : 'var(--surface2)',
                  color: filled ? 'var(--accent-text)' : 'var(--text3)',
                  borderColor: filled ? 'var(--accent)' : 'transparent',
                }}
              >
                {filled && <i className="ti ti-check" style={{ fontSize: 11, marginRight: 3 }} />}
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formCard}>

          {/* Avatar Section */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarPreview}>
              {values.avatar ? (
                <div className={styles.avatarCircle} style={{ background: 'var(--accent)', color: '#fff' }}>
                  {avatarInitials || <i className="ti ti-user" style={{ fontSize: 26 }} />}
                </div>
              ) : (
                <div className={styles.avatarCircle} style={{ background: 'var(--surface2)', color: 'var(--text3)' }}>
                  <i className="ti ti-user" style={{ fontSize: 26 }} />
                </div>
              )}
            </div>
            <div className={styles.avatarUpload}>
              <label className={styles.fieldLabel}>
                <i className="ti ti-photo" style={{ fontSize: 14, color: 'var(--text3)' }} />
                Profile Picture
              </label>
              <FileUpload
                label="Upload a profile photo"
                icon="ti-photo"
                accept="image/*"
                value={values.avatar}
                onChange={v => setField('avatar', v)}
              />
            </div>
          </div>

          <div className={styles.divider} />

          {/* Name / Email / Phone */}
          <div className={styles.fieldGrid}>
            {[
              { key: 'fullName', label: 'Full Name',      icon: 'ti-user',  type: 'text',  ph: 'e.g. Karthikeya Reddy', required: true },
              { key: 'email',    label: 'Email Address',  icon: 'ti-mail',  type: 'email', ph: 'you@example.com',        required: true },
              { key: 'phone',    label: 'Phone Number',   icon: 'ti-phone', type: 'tel',   ph: '+91 98765 43210',         required: true },
            ].map(({ key, label, icon, type, ph, required }) => (
              <div key={key} className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor={key}>
                  <i className={`ti ${icon}`} style={{ fontSize: 14, color: 'var(--text3)' }} />
                  {label}
                  {required && <span style={{ color: 'var(--coral)', marginLeft: 2 }}>*</span>}
                </label>
                <input
                  id={key}
                  type={type}
                  value={values[key]}
                  placeholder={ph}
                  onChange={e => setField(key, e.target.value)}
                  onBlur={() => handleBlur(key)}
                  className={styles.input}
                  style={{ borderColor: touched[key] && errors[key] ? '#E24B4A' : 'var(--border)' }}
                />
                {touched[key] && errors[key] && (
                  <p className={styles.errorMsg}>
                    <i className="ti ti-alert-circle" style={{ fontSize: 12, marginRight: 3 }} />
                    {errors[key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className={styles.divider} />

          {/* Skills */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              <i className="ti ti-tag" style={{ fontSize: 14, color: 'var(--text3)' }} />
              Skills
            </label>
            <SkillInput skills={values.skills} onChange={v => setField('skills', v)} />
          </div>

          <div className={styles.divider} />

          {/* Education */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="education">
              <i className="ti ti-school" style={{ fontSize: 14, color: 'var(--text3)' }} />
              Education Details
            </label>
            <textarea
              id="education"
              value={values.education}
              onChange={e => setField('education', e.target.value)}
              placeholder="e.g.&#10;B.Tech Computer Science, VIT University, 2020–2024&#10;Relevant coursework: Data Structures, ML, Web Development"
              rows={4}
              className={styles.textarea}
            />
          </div>

          <div className={styles.divider} />

          {/* Resume */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              <i className="ti ti-file-cv" style={{ fontSize: 14, color: 'var(--text3)' }} />
              Resume
            </label>
            <FileUpload
              label="Upload your resume (PDF, DOC, DOCX)"
              icon="ti-file-cv"
              accept=".pdf,.doc,.docx"
              value={values.resume}
              onChange={v => setField('resume', v)}
            />
          </div>

          {/* Submit */}
          <div className={styles.formFooter}>
            <p className={styles.footerNote}>
              {submitState === 'error'
                ? <span style={{ color: '#E24B4A' }}><i className="ti ti-alert-circle" style={{ marginRight: 4 }} />Please fix the errors above</span>
                : <span><i className="ti ti-lock" style={{ fontSize: 12, marginRight: 4 }} />Your information is private and secure</span>
              }
            </p>
            <button
              type="submit"
              className={styles.saveBtn}
              style={{ background: submitState === 'success' ? 'var(--accent)' : 'var(--accent)' }}
            >
              {submitState === 'success' ? (
                <><i className="ti ti-check" style={{ marginRight: 6 }} />Profile Saved!</>
              ) : (
                <><i className="ti ti-device-floppy" style={{ marginRight: 6 }} />Save Profile</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProfileScreen;
