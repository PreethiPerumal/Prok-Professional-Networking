import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 mb-4 ${className || ''}`.trim()}>
    <h2 className="text-lg font-bold mb-3 text-black">{title}</h2>
    {children}
  </div>
);

// Default profile data
const defaultProfile = {
  username: 'johnsmith',
  name: 'John Smith',
  title: 'B.E - Electronics and Communication Engineering',
  location: 'Tirunelveli, Tamil Nadu, India',
  email: 'john.smith@email.com',
  phone: '+1 555-123-4567',
  avatarUrl: '',
  bio: 'Passionate developer with 10+ years of experience.',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
  socialLinks: [
    { platform: 'LinkedIn', url: '', icon: <i className="fab fa-linkedin" /> },
    { platform: 'GitHub', url: '', icon: <i className="fab fa-github" /> },
    { platform: 'Twitter', url: '', icon: <i className="fab fa-twitter" /> },
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
  connections: 200,
  mutualConnections: 25,
};

// Get profile data from localStorage or return defaultProfile
const getProfileFromStorage = () => {
  const stored = localStorage.getItem('profile');
  return stored ? JSON.parse(stored) : defaultProfile;
};

// Main ProfileView
const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const [profile] = useState(getProfileFromStorage());
  const [activities, setActivities] = useState([
    { id: '1', type: 'Post', content: 'Shared a new article on React.', date: '2025-07-01' },
    { id: '2', type: 'Connection', content: 'Connected with Jane Doe.', date: '2025-06-30' },
    { id: '3', type: 'Comment', content: 'Commented on a post.', date: '2025-06-29' },
  ]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Lazy load more activities (mock)
  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setActivities((prev) => [
        ...prev,
        { id: String(prev.length + 1), type: 'Like', content: 'Liked a post.', date: '2025-06-28' },
      ]);
      setLoadingMore(false);
      if (activities.length > 10) setHasMore(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] py-8 font-sans text-black">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left: Main profile sections */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-white rounded-2xl shadow p-8 mb-8 relative">
            <div className="relative -mt-16 md:mt-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center text-4xl text-gray-400 overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>Profile Pic</span>
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-start gap-1 w-full">
              <div className="text-2xl md:text-3xl font-bold text-black text-center md:text-left">{profile.name}</div>
              <div className="text-black text-base mb-1 text-center md:text-left">{profile.title}</div>
              <div className="text-black text-sm flex items-center gap-1 justify-center md:justify-start">
                <i className="fas fa-map-marker-alt mr-1" /> {profile.location}
              </div>
              <div className="flex gap-3 mt-2 justify-center md:justify-start">
                {profile.socialLinks && profile.socialLinks.map((link: { platform: string; url: string }) => {
                  if (!link.url) return null;
                  let icon;
                  if (link.platform === 'LinkedIn') icon = <i className="fab fa-linkedin" />;
                  else if (link.platform === 'GitHub') icon = <i className="fab fa-github" />;
                  else if (link.platform === 'Twitter') icon = <i className="fab fa-twitter" />;
                  else icon = <i className="fas fa-link" />;
                  return (
                    <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 text-gray-600 text-xl">
                      {icon}
                    </a>
                  );
                })}
              </div>
            </div>
            {/* Edit Profile button: absolute on md+, block and at bottom inside card on mobile */}
            <button
              className="hidden md:block absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors text-base"
              onClick={() => navigate('/profile/edit')}
            >
              Edit Profile
            </button>
            {/* Mobile-only Edit Profile button inside card */}
            <div className="block md:hidden w-full mt-6">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors text-base"
                onClick={() => navigate('/profile/edit')}
              >
                Edit Profile
              </button>
            </div>
          </div>
          <SectionCard title="About">
            <p className="text-black">{profile.bio}</p>
          </SectionCard>

          <SectionCard title="Skills">
            <div className="flex flex-wrap gap-2 mt-2">
              {(Array.isArray(profile.skills) ? profile.skills : profile.skills.split(',')).map((skill: string) => (
                <span key={skill.trim()} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Education">
            <div className="border-l-2 border-blue-200 pl-4">
              {profile.education.map((edu: any, idx: number) => (
                <div className={idx !== profile.education.length - 1 ? 'mb-4' : ''} key={edu.school}>
                  <div className="font-bold text-black">{edu.degree}</div>
                  <div className="text-black">{edu.school}</div>
                  <div className="text-black text-sm">{edu.years}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Recent Activity">
            <ul className="space-y-3">
              {activities.map((a) => (
                <li key={a.id} className="bg-gray-50 rounded p-3 shadow-sm">
                  <div className="text-sm text-gray-500">{a.date}</div>
                  <div className="font-medium text-gray-800">{a.type}</div>
                  <div className="text-gray-700">{a.content}</div>
                </li>
              ))}
            </ul>
            {hasMore && (
              <div className="mt-2 text-blue-600 hover:underline cursor-pointer text-sm" onClick={loadMore}>
                Show more activity
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right: Sidebar */}
        <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4 mt-8 md:mt-0">
          <SectionCard title="Contact Information" className="mb-0">
            <div className="flex items-center gap-2 mb-2"><i className="fas fa-envelope text-gray-400" /> <span className="text-black">{profile.email}</span></div>
            <div className="flex items-center gap-2 mb-2"><i className="fas fa-phone text-gray-400" /> <span className="text-black">{profile.phone}</span></div>
            <div className="flex items-center gap-2"><i className="fas fa-map-marker-alt text-gray-400" /> <span className="text-black">{profile.location}</span></div>
          </SectionCard>
          <SectionCard title="Languages" className="mb-0">
            <div className="flex flex-col gap-1">
              {profile.languages.map((lang: any) => (
                <div key={lang.name}><span className="font-semibold text-black">{lang.name}</span> <span className="text-black text-xs ml-1">{lang.level}</span></div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Connections" className="mb-0">
            <div className="flex gap-8">
              <div>
                <div className="text-2xl font-bold text-blue-700">{profile.connections}+</div>
                <div className="text-black text-xs">Connections</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">{profile.mutualConnections}</div>
                <div className="text-black text-xs">Mutual</div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;