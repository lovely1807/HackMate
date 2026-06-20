import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProjectMarketplace() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    skill: '',
    category: '',
    status: 'open'
  })
  const [bookmarks, setBookmarks] = useState({})

  const categories = ['All', 'Web Development', 'AI/ML', 'Mobile App', 'Blockchain', 'Cyber Security']

  useEffect(() => {
    fetchProjects()
  }, [filters])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.skill) params.skills = filters.skill
      if (filters.category && filters.category !== 'All') params.category = filters.category
      if (filters.status) params.status = filters.status
      
      const res = await api.get('/api/projects', { params })
      setProjects(res.data)
      
      // Pre-fetch bookmarks
      for (const project of res.data) {
        try {
          const checkRes = await api.get(`/api/bookmarks/${project.id}/check`)
          setBookmarks(prev => ({ ...prev, [project.id]: checkRes.data.isBookmarked }))
        } catch (e) {
          console.error(e)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleBookmark = async (e, projectId) => {
    e.stopPropagation()
    try {
      const res = await api.post(`/api/bookmarks/${projectId}/toggle`)
      setBookmarks(prev => ({ ...prev, [projectId]: res.data.isBookmarked }))
    } catch (err) {
      console.error(err)
    }
  }

  const calculateMatch = (userSkills, requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) return 0
    const matched = userSkills?.filter(skill => requiredSkills.includes(skill)).length || 0
    return Math.round((matched / requiredSkills.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Project Marketplace
          </h1>
          <p className="text-purple-300 text-lg">Find the perfect project to join or contribute</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Category</label>
              <select 
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Skill</label>
              <input 
                type="text" 
                placeholder="e.g. React, Python" 
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none"
                value={filters.skill}
                onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Link to="/create-project" className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-semibold text-center transition-all">
                + Create Project
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-white text-xl animate-pulse">Loading projects...</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => {
              const match = calculateMatch(user?.skills, project.requiredSkills)
              return (
                <div
                  key={project.id}
                  className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
                        {project.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        project.status === 'open' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <button
                      onClick={(e) => toggleBookmark(e, project.id)}
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <svg className={`w-5 h-5 ${bookmarks[project.id] ? 'fill-yellow-400 text-yellow-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  {project.hackathonName && (
                    <p className="text-blue-300 text-xs mb-4">📍 {project.hackathonName}</p>
                  )}

                  {/* Skill Match */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Skill Match</span>
                      <span className={`font-bold ${match >= 70 ? 'text-green-400' : match >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {match}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${match >= 70 ? 'bg-green-500' : match >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${match}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.requiredSkills.slice(0, 3).map(skill => (
                      <span key={skill} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                    {project.requiredSkills.length > 3 && (
                      <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                        +{project.requiredSkills.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {project.owner?.fullName?.[0] || 'U'}
                      </div>
                      <span>by {project.owner?.fullName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                      <span>👥 {project.teamSize}</span>
                      <span>📋 {project.applicantCount || 0} applicants</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
