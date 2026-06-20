import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { username } = useParams()
  const { user: currentUser, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    college: '',
    branch: '',
    year: 2026,
    experienceLevel: 'Beginner',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: ''
  })

  const isOwnProfile = !username || username === currentUser?.username

  useEffect(() => {
    fetchProfile()
  }, [username, currentUser])

  const fetchProfile = async () => {
    try {
      const targetUsername = username || currentUser?.username
      const res = await api.get(`/api/users/${targetUsername}`)
      setProfile(res.data)
      setFormData({
        fullName: res.data.fullName || '',
        bio: res.data.bio || '',
        college: res.data.college || '',
        branch: res.data.branch || '',
        year: res.data.year || 2026,
        experienceLevel: res.data.experienceLevel || 'Beginner',
        githubUrl: res.data.githubUrl || '',
        linkedinUrl: res.data.linkedinUrl || '',
        portfolioUrl: res.data.portfolioUrl || '',
        skills: (res.data.skills || []).join(', ')
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.put('/api/users/me', {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      })
      setProfile(res.data)
      updateUser(res.data)
      setEditing(false)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update profile')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl font-semibold animate-pulse">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">User not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {editing ? (
          <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Experience Level</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">College</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Branch</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Graduation Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    min={2024}
                    max={2030}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, Python, JavaScript, etc."
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Portfolio URL</label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-purple-500/25"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl border border-gray-700 mb-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-5xl font-black text-white shadow-lg shadow-purple-500/30">
                    {(profile.fullName?.[0] || profile.username?.[0])?.toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-3xl font-extrabold text-white mb-1">
                      {profile.fullName || profile.username}
                    </h1>
                    <p className="text-purple-300 text-lg">@{profile.username}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold border border-purple-500/30">
                        {profile.experienceLevel || 'Beginner'}
                      </span>
                      {profile.rating > 0 && (
                        <span className="bg-yellow-600/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold border border-yellow-500/30">
                          ⭐ {profile.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isOwnProfile && (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-purple-500/25"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {profile.bio && (
                <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600/50 mb-6">
                  <p className="text-gray-300 text-lg leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {(profile.college || profile.branch || profile.year) && (
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {profile.college && (
                    <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">College</p>
                      <p className="text-white font-medium">{profile.college}</p>
                    </div>
                  )}
                  {profile.branch && (
                    <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Branch</p>
                      <p className="text-white font-medium">{profile.branch}</p>
                    </div>
                  )}
                  {profile.year && (
                    <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Grad Year</p>
                      <p className="text-white font-medium">{profile.year}</p>
                    </div>
                  )}
                </div>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-gray-400 text-sm mb-3 font-semibold uppercase tracking-wide">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <span key={skill} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full font-medium shadow-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl text-gray-200 hover:text-white font-medium transition-all duration-200 border border-gray-600/50"
                  >
                    <span className="text-xl">💻</span> GitHub
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl text-gray-200 hover:text-white font-medium transition-all duration-200 border border-gray-600/50"
                  >
                    <span className="text-xl">💼</span> LinkedIn
                  </a>
                )}
                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl text-gray-200 hover:text-white font-medium transition-all duration-200 border border-gray-600/50"
                  >
                    <span className="text-xl">🌐</span> Portfolio
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
