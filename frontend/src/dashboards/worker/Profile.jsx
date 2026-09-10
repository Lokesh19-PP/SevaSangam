import React, { useState } from 'react';
import { Button, Badge, Avatar, Input } from '../../components/ui';
import SkillTagInput from '../../components/forms/SkillTagInput';

/**
 * Worker Profile Page — SevaSangam
 *
 * Allows a worker to:
 *  - View and edit personal info (name, phone, address, cooperative)
 *  - Manage skill tags via SkillTagInput
 *  - Upload certifications (placeholder)
 *  - View their verification / cooperative membership status
 *
 * Lives at: /worker/profile
 * Uses: Button, Badge, Avatar, Input from components/ui; SkillTagInput from components/forms
 */

// ── Mock worker profile data (will come from workerApi later) ──────
const MOCK_PROFILE = {
  name: 'Ramesh Mhatre',
  phone: '+91 9876543210',
  email: 'ramesh.mhatre@sevacoop.in',
  address: 'Plot 14, Hadapsar, Pune - 411028',
  cooperative: 'Pune Kamgar Vikas Cooperative Society',
  experience: '8 years',
  hourlyRate: 180,
  primarySkill: 'Plumbing & Pipe Fitting',
  skills: ['Plumbing & Pipe Fitting', 'Sanitary Ware Installation', 'Pipe Leak Repair', 'Bathroom Fitting'],
  isVerified: true,
  rating: 4.7,
  reviewCount: 134,
  totalJobs: 312,
  bio: 'Experienced plumber with 8 years serving Pune households. Certified by Pune Kamgar Cooperative and trained in modern sanitary fittings.',
  certifications: [
    { id: 1, name: 'Vocational Trade Certificate – Plumbing', issuer: 'MSDE / NCVT', year: 2019, verified: true },
    { id: 2, name: 'Police Verification Certificate', issuer: 'Pune City Police', year: 2023, verified: true },
    { id: 3, name: 'Cooperative Membership ID', issuer: 'Pune Kamgar Cooperative', year: 2021, verified: true },
  ],
};

// ── Section heading helper ─────────────────────────────────────────
const Section = ({ title, children }) => (
  <section className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
      <h2 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </section>
);

// ── Field row for info display ─────────────────────────────────────
const InfoField = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</label>
    <div className="text-sm text-slate-800">{children}</div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────
const Profile = () => {
  const [profile, setProfile]   = useState(MOCK_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft]       = useState(MOCK_PROFILE);
  const [saved, setSaved]       = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel — reset draft
      setDraft(profile);
    }
    setIsEditing((prev) => !prev);
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(draft);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleField = (field, value) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your personal info, skills, and certification documents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
              ✓ Profile saved
            </span>
          )}
          <Button
            id="worker-profile-edit-btn"
            variant={isEditing ? 'outline' : 'primary'}
            size="sm"
            onClick={handleEditToggle}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
          {isEditing && (
            <Button
              id="worker-profile-save-btn"
              variant="primary"
              size="sm"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* ── Identity Card ── */}
      <Section title="Identity & Cooperative Status">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <Avatar
              name={profile.name}
              size="2xl"
              status="online"
              verified={profile.isVerified}
            />
            {isEditing && (
              <Button
                id="worker-avatar-upload-btn"
                variant="outline"
                size="xs"
                leftIcon={
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                }
              >
                Upload Photo
              </Button>
            )}
          </div>

          {/* Name, rating, badges */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                id="worker-name-input"
                type="text"
                value={draft.name}
                onChange={(e) => handleField('name', e.target.value)}
                className="w-full text-xl font-bold text-slate-900 border-b-2 border-primary-400 bg-transparent pb-1 mb-3 focus:outline-none"
              />
            ) : (
              <h2 className="text-xl font-bold text-slate-900 mb-1">{profile.name}</h2>
            )}

            <p className="text-sm text-slate-500 mb-3">{profile.cooperative}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {profile.isVerified && (
                <Badge variant="success" size="sm">✓ Verified Member</Badge>
              )}
              <Badge variant="primary" size="sm">{profile.primarySkill}</Badge>
              <Badge variant="default" size="sm">
                <span className="text-amber-500">★</span> {profile.rating} ({profile.reviewCount} reviews)
              </Badge>
              <Badge variant="default" size="sm">{profile.totalJobs} jobs completed</Badge>
            </div>

            {/* Bio */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                Short Bio
              </label>
              {isEditing ? (
                <textarea
                  id="worker-bio-input"
                  value={draft.bio}
                  onChange={(e) => handleField('bio', e.target.value)}
                  rows={3}
                  className="w-full text-sm text-slate-700 border border-slate-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                />
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Personal Info ── */}
      <Section title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {isEditing ? (
            <>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
                  Phone Number
                </label>
                <input
                  id="worker-phone-input"
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => handleField('phone', e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
                  Email
                </label>
                <input
                  id="worker-email-input"
                  type="email"
                  value={draft.email}
                  onChange={(e) => handleField('email', e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
                  Hourly Rate (₹)
                </label>
                <input
                  id="worker-hourlyrate-input"
                  type="number"
                  min={0}
                  value={draft.hourlyRate}
                  onChange={(e) => handleField('hourlyRate', Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
                  Experience
                </label>
                <input
                  id="worker-experience-input"
                  type="text"
                  value={draft.experience}
                  onChange={(e) => handleField('experience', e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
                  Address
                </label>
                <input
                  id="worker-address-input"
                  type="text"
                  value={draft.address}
                  onChange={(e) => handleField('address', e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                />
              </div>
            </>
          ) : (
            <>
              <InfoField label="Phone Number">{profile.phone}</InfoField>
              <InfoField label="Email">{profile.email}</InfoField>
              <InfoField label="Hourly Rate">₹{profile.hourlyRate}/hr</InfoField>
              <InfoField label="Experience">{profile.experience}</InfoField>
              <InfoField label="Cooperative">{profile.cooperative}</InfoField>
              <InfoField label="Address">{profile.address}</InfoField>
            </>
          )}
        </div>
      </Section>

      {/* ── Skills Section ── */}
      <Section title="Skills & Trade Specializations">
        <SkillTagInput
          value={isEditing ? draft.skills : profile.skills}
          onChange={isEditing ? (tags) => handleField('skills', tags) : undefined}
          disabled={!isEditing}
          label=""
          helperText={
            isEditing
              ? 'Add or remove verified trade skills recognized by your cooperative.'
              : 'Your registered cooperative trade skills.'
          }
        />
      </Section>

      {/* ── Certifications ── */}
      <Section title="Certifications & Documents">
        <div className="space-y-3 mb-4">
          {profile.certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors"
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{cert.name}</p>
                <p className="text-xs text-slate-500">{cert.issuer} • {cert.year}</p>
              </div>

              {/* Verified badge */}
              {cert.verified && (
                <Badge variant="success" size="sm">✓ Verified</Badge>
              )}
            </div>
          ))}
        </div>

        {/* Upload placeholder */}
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary-300 hover:bg-primary-50/30 transition-colors">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">Upload a new certificate</p>
          <p className="text-xs text-slate-400 mb-3">PDF, JPG or PNG • Max 5 MB</p>
          <Button
            id="worker-cert-upload-btn"
            variant="outline"
            size="sm"
          >
            Choose File
          </Button>
          <p className="text-[10px] text-slate-400 mt-2">
            All documents are reviewed by the cooperative within 2 business days.
          </p>
        </div>
      </Section>
    </div>
  );
};

export default Profile;
