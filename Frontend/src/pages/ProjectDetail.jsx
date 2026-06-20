import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applyMessage, setApplyMessage] = useState('')
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    fetchProject()
    fetchMatch()
  }, [id])

  const fetchProject = async () => {
    try {
      const res = await api.get(`/api/projects/${id}`)
      setProject(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMatch = async () => {
    try {
      const res = await api.get(`/api/projects/${id}/match`)
      setMatch(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleApply = async () => {
    try {
      setApplying(true)
      await api.post(`/api/projects/${id}/apply`, { message: applyMessage })
      alert('Application submitted!')
      setApplyMessage('')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading project...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Project not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="text-purple-400 hover:text-purple-300 mb-4 flex items-center gap-2">
            ← Back
          </button>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-purple-600/20 text-purple-300 px-4 py-1 rounded-full text-sm font-semibold">
                  {project.category}
                </span>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold border ${
                  project.status === 'open' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}>
                  {project.status}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2">{project.title}</h1>
              {project.hackathonName && (
                <p className="text-blue-300 text-sm mb-2">📍 {project.hackathonName}</p>
              )}
            </div>
            {match !== null && (
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{match.matchPercentage}%</div>
                <div className="text-gray-400 text-sm">Skill Match</div>
              </div>
            )}
          </div>

          <p className="text-gray-300 text-lg mb-6">{project.description}</p>

          <div className="mb-8">
            <h3 className="text-white font-bold mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.map(skill => (
                <span key={skill} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-white font-bold mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map(tech => (
                <span key={tech} className="bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full font-medium border border-blue-500/30">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
                {project.owner?.fullName?.[0] || project.ownerUsername?.[0] || 'U'}
              </div>
              <div>
                <div className="text-white font-semibold">{project.owner?.fullName || project.ownerUsername}</div>
                <div className="text-gray-400 text-sm">Project Owner</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">👥 {project.teamSize}</div>
              <div className="text-gray-400 text-sm">Team Size</div>
            </div>
          </div>

          {project.status === 'open' && user?.username !== project.ownerUsername && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-white font-bold mb-4">Apply to Join</h3>
              <textarea 
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder="Write a short message about why you want to join..."
                className="w-full mb-4 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none"
                rows={4}
              />
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Apply Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
