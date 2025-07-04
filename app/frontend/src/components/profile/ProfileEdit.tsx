import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

// --- Default Profile Data ---
const defaultProfile = {
  username: 'johnsmith',
  name: 'John Smith',
  title: 'B.E - Electronics and Communication Engineering',
  location: 'Tirunelveli, Tamil Nadu, India',
  email: 'john.smith@email.com',
  phone: '+1 555-123-4567',
  avatar: '',
  bio: 'Passionate developer with 10+ years of experience.',
  skills: 'React, TypeScript, Node.js, Python, AWS',
  experience: '',
  website: '',
  socialLinks: [
    { platform: 'LinkedIn', url: '' },
    { platform: 'GitHub', url: '' },
    { platform: 'Twitter', url: '' },
  ],
  education: [
    { school: 'Anna University', degree: 'B.E - Electronics and Communication Engineering', years: '2019 - 2023' },
    { school: 'Tirunelveli Government Higher Secondary School', degree: 'Higher Secondary Education', years: '2017 - 2019' },
  ],
  languages: [
    { name: 'Tamil', level: 'Native' },
    { name: 'English', level: 'Professional' },
    { name: 'Hindi', level: 'Conversational' },
  ],
  connections: '200',
  mutualConnections: '25',
};

// Reusable Input component
const InputField: React.FC<{
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  icon?: React.ReactNode;
}> = ({ label, name, type = 'text', value, onChange, error, autoComplete, icon }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`w-full border rounded px-3 py-2 pl-${icon ? '10' : '3'} focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'} text-black`}
      />
    </div>
    {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
  </div>
);

// Reusable Textarea component
const TextareaField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}> = ({ label, name, value, onChange, error }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={3}
      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'} text-black`}
    />
    {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
  </div>
);

// Image upload with drag-and-drop, preview, and progress
const ImageUpload: React.FC<{
  value: string;
  onChange: (url: string, file?: File) => void;
  uploading: boolean;
  progress: number;
  setUploading: (v: boolean) => void;
  setProgress: (v: number) => void;
}> = ({ value, onChange, uploading, progress, setUploading, setProgress }) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploading(true);
    setProgress(0);
    // Simulate upload
    const reader = new FileReader();
    reader.onload = (ev) => {
      setTimeout(() => {
        setProgress(100);
        setUploading(false);
        onChange(ev.target?.result as string, file);
      }, 1200);
    };
    reader.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`mb-4 border-2 border-dashed rounded p-4 flex flex-col items-center justify-center ${uploading ? 'border-blue-400' : 'border-gray-300'}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => fileInput.current?.click()}
      style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
    >
      {value ? (
        <img src={value} alt="avatar preview" className="w-24 h-24 rounded-full object-cover mb-2" />
      ) : (
        <span className="text-gray-500">Drag & drop or click to upload avatar</span>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
        }}
        disabled={uploading}
      />
      {uploading && (
        <div className="w-full mt-2">
          <div className="h-2 bg-blue-100 rounded">
            <div className="h-2 bg-blue-500 rounded" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-blue-700 mt-1">Uploading... {progress}%</div>
        </div>
      )}
    </div>
  );
};

const validateEmail = (email: string) => /.+@.+\..+/.test(email);
const validatePhone = (phone: string) => /^\+?[0-9\-\s]+$/.test(phone);

const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 mb-4 ${className || ''}`.trim()}>
    <h2 className="text-lg font-bold mb-3 text-black">{title}</h2>
    {children}
  </div>
);

const mockActivities = [
  { id: '1', type: 'Post', content: 'Shared a new article on React.', date: '2025-07-01' },
  { id: '2', type: 'Connection', content: 'Connected with Jane Doe.', date: '2025-06-30' },
  { id: '3', type: 'Comment', content: 'Commented on a post.', date: '2025-06-29' },
];

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  // --- State ---
  const [form, setForm] = useState(defaultProfile);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch profile on mount ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await api.getProfile();
        
        if (response.error) {
          setError(response.error);
          setLoading(false);
          return;
        }

        // Transform API data to match frontend format
        const apiProfile = response.profile;
        // Handle image URL - prefix with backend URL if it exists
        let avatarUrl = '';
        if (apiProfile?.image_url) {
          avatarUrl = `http://localhost:5000${apiProfile.image_url}`;
        }
        
        const transformedProfile = {
          username: response.user?.username || 'user',
          name: apiProfile?.full_name || 'User',
          title: apiProfile?.headline || 'Professional',
          location: apiProfile?.location || 'Location not specified',
          email: response.user?.email || 'email@example.com',
          phone: '+1 555-123-4567', // Not in API yet
          avatar: avatarUrl,
          bio: apiProfile?.bio || 'No bio available.',
          skills: Array.isArray(apiProfile?.skills) ? apiProfile.skills.join(', ') : (apiProfile?.skills || ''),
          experience: apiProfile?.experience || '',
          website: apiProfile?.website || '',
          socialLinks: [
            { platform: 'LinkedIn', url: '' },
            { platform: 'GitHub', url: '' },
            { platform: 'Twitter', url: '' },
          ],
          education: apiProfile?.education || [
            { school: 'University', degree: 'Degree', years: 'Year' }
          ],
          languages: [
            { name: 'English', level: 'Professional' },
          ],
          connections: '200',
          mutualConnections: '25',
        };

        setForm(transformedProfile);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Real-time validation
  const validate = (field = form) => {
    const errs: { [k: string]: string } = {};
    if (!field.name) errs.name = 'Full name is required.';
    if (!field.email) errs.email = 'Email is required.';
    else if (!validateEmail(field.email)) errs.email = 'Invalid email.';
    if (!field.bio) errs.bio = 'Bio is required.';
    if (!field.skills) errs.skills = 'At least one skill is required.';
    if (field.phone && !validatePhone(field.phone)) errs.phone = 'Invalid phone.';
    return errs;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors((errs) => ({ ...errs, [e.target.name]: '' }));
  };

  // Handle array field changes (education, languages, socialLinks)
  const handleArrayChange = (field: string, idx: number, key: string, value: string) => {
    setForm((f: any) => {
      const arr = [...f[field]];
      arr[idx][key] = value;
      return { ...f, [field]: arr };
    });
  };

  // Handle image upload
  const handleAvatarChange = async (_url: string, file?: File) => {
    if (file) {
      setUploading(true);
      setProgress(0);
      try {
        const res = await api.uploadProfileImage(file);
        if (res.image_url) {
          // Prefix with backend URL for display
          const fullImageUrl = `http://localhost:5000${res.image_url}`;
          setForm((f: typeof form) => ({ ...f, avatar: fullImageUrl }));
        } else if (res.error) {
          setError(res.error);
        }
      } catch (e) {
        console.error('Image upload failed:', e);
        setError('Image upload failed. Please try again.');
      }
      setUploading(false);
      setProgress(100);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({
      name: true,
      email: true,
      bio: true,
      skills: true,
      phone: true,
    });
    
    if (Object.keys(errs).length > 0) return;

    try {
      setSaving(true);
      setError(null);

      // Transform frontend data to API format
      const apiData = {
        name: form.name,
        bio: form.bio,
        location: form.location,
        title: form.title,
        experience: form.experience || '',
        education: form.education,
        skills: form.skills.split(',').map(s => s.trim()).filter(s => s),
        website: form.website || ''
      };

      const response = await api.updateProfile(apiData);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      // Navigate back to profile view on success
      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] py-8 font-sans text-black">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-8 mb-8">
            <div className="animate-pulse">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] py-8 font-sans text-black">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] py-8 font-sans text-black">
      <form onSubmit={handleSubmit}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Left: Main profile sections */}
          <div className="flex-1 min-w-0">
            {/* Profile Card */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-white rounded-2xl shadow p-8 mb-8 relative">
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center text-4xl text-gray-400 overflow-hidden">
                  {form.avatar ? (
                    <img src={form.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span>Profile Pic</span>
                  )}
                </div>
                {/* Image upload area below avatar, always visible and accessible */}
                <div className="mt-2 w-full flex justify-center">
                  <ImageUpload
                    value={form.avatar}
                    onChange={handleAvatarChange}
                    uploading={uploading}
                    progress={progress}
                    setUploading={setUploading}
                    setProgress={setProgress}
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center md:items-start gap-1 w-full">
                <InputField 
                  label="Full Name" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  error={touched.name ? errors.name : undefined}
                />
                <InputField 
                  label="Title" 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange}
                  error={touched.title ? errors.title : undefined}
                />
                <InputField 
                  label="Location" 
                  name="location" 
                  value={form.location} 
                  onChange={handleChange}
                  error={touched.location ? errors.location : undefined}
                />
                <div className="flex gap-3 mt-2 justify-center md:justify-start w-full">
                  {form.socialLinks.map((link: any, idx: number) => (
                    <input
                      key={link.platform}
                      type="url"
                      placeholder={link.platform + ' URL'}
                      value={link.url}
                      onChange={e => handleArrayChange('socialLinks', idx, 'url', e.target.value)}
                      className="border rounded px-3 py-1 text-black w-32"
                    />
                  ))}
                </div>
              </div>
              {/* Save button: absolute on md+, block and at bottom inside card on mobile */}
              <button
                type="submit"
                disabled={saving}
                className="hidden md:block absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors text-base"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              {/* Mobile-only Save button inside card */}
              <div className="block md:hidden w-full mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors text-base"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            {/* About */}
            <SectionCard title="About">
              <TextareaField
                label="About"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                error={touched.bio ? errors.bio : undefined}
              />
            </SectionCard>
            
            {/* Experience */}
            <SectionCard title="Experience">
              <TextareaField
                label="Experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                error={touched.experience ? errors.experience : undefined}
              />
            </SectionCard>
            {/* Skills */}
            <SectionCard title="Skills">
              <InputField
                label="Skills (comma separated)"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                error={touched.skills ? errors.skills : undefined}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {form.skills.split(',').map((skill: string) => (
                  <span key={skill.trim()} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </SectionCard>
            {/* Education */}
            <SectionCard title="Education">
              <div className="border-l-2 border-blue-200 pl-4">
                {form.education.map((edu: any, idx: number) => (
                  <div className="mb-4" key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-700">Education #{idx + 1}</h4>
                      {form.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setForm((f: any) => ({
                              ...f,
                              education: f.education.filter((_: any, i: number) => i !== idx)
                            }));
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <InputField label="Degree" name={`degree-${idx}`} value={edu.degree} onChange={e => handleArrayChange('education', idx, 'degree', e.target.value)} />
                    <InputField label="School" name={`school-${idx}`} value={edu.school} onChange={e => handleArrayChange('education', idx, 'school', e.target.value)} />
                    <InputField label="Years" name={`years-${idx}`} value={edu.years} onChange={e => handleArrayChange('education', idx, 'years', e.target.value)} />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setForm((f: any) => ({
                      ...f,
                      education: [...f.education, { school: '', degree: '', years: '' }]
                    }));
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Education
                </button>
              </div>
            </SectionCard>

            {/* Recent Activity */}
            <SectionCard title="Recent Activity">
              <ul className="space-y-3">
                {mockActivities.map((a) => (
                  <li key={a.id} className="bg-gray-50 rounded p-3 shadow-sm">
                    <div className="text-sm text-gray-500">{a.date}</div>
                    <div className="font-medium text-gray-800">{a.type}</div>
                    <div className="text-gray-700">{a.content}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-blue-600 hover:underline cursor-pointer text-sm">Show more activity</div>
            </SectionCard>
          </div>

          {/* Right: Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4 mt-8 md:mt-0">
            <SectionCard title="Contact Information" className="mb-0">
              <InputField 
                label="Email" 
                name="email" 
                value={form.email} 
                onChange={handleChange}
                error={touched.email ? errors.email : undefined}
                autoComplete="email"
              />
              <InputField 
                label="Phone" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange}
                error={touched.phone ? errors.phone : undefined}
                autoComplete="tel"
              />
              <InputField 
                label="Website" 
                name="website" 
                value={form.website} 
                onChange={handleChange}
                error={touched.website ? errors.website : undefined}
                type="url"
                autoComplete="url"
              />
              <InputField 
                label="Location" 
                name="contactLocation" 
                value={form.location} 
                onChange={handleChange}
                error={touched.contactLocation ? errors.contactLocation : undefined}
              />
            </SectionCard>
            <SectionCard title="Languages" className="mb-0">
              <div className="flex flex-col gap-1">
                {form.languages.map((lang: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <InputField label="Language" name={`lang-name-${idx}`} value={lang.name} onChange={e => handleArrayChange('languages', idx, 'name', e.target.value)} />
                    </div>
                    <div className="flex-1">
                      <InputField label="Level" name={`lang-level-${idx}`} value={lang.level} onChange={e => handleArrayChange('languages', idx, 'level', e.target.value)} />
                    </div>
                    {form.languages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm((f: any) => ({
                            ...f,
                            languages: f.languages.filter((_: any, i: number) => i !== idx)
                          }));
                        }}
                        className="text-red-600 hover:text-red-800 text-sm mt-6"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setForm((f: any) => ({
                      ...f,
                      languages: [...f.languages, { name: '', level: '' }]
                    }));
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Language
                </button>
              </div>
            </SectionCard>
            <SectionCard title="Connections" className="mb-0">
              <InputField label="Connections" name="connections" value={form.connections} onChange={handleChange} />
              <InputField label="Mutual" name="mutualConnections" value={form.mutualConnections} onChange={handleChange} />
            </SectionCard>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;