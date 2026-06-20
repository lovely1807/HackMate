import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function CreateProject() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    techStack: '',
    requiredSkills: '',
    teamSize: 4,
    hackathonName: ''
  })
  const [loading, setLoading] = useState(false)

  const categories = ['Web Development', 'AI/ML', 'Mobile App', 'Blockchain', 'Cyber Security']

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.post('/api/projects', {
        ...formData,
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        teamSize: parseInt(formData.teamSize)
      })
      navigate('/projects')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Create New Project
          </h1>
          <p className="text-purple-300 text-lg">Start building your dream team!</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Project Title *</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none transition-all"
                placeholder="e.g. EcoTrack - Carbon Footprint Tracker"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Category</label>
              <select 
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none transition-all"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Description</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none transition-all"
                placeholder="Describe your project, goals, and what you're looking for in teammates..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Tech Stack (comma separated)</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none transition-all"
                placeholder="e.g. React, Node.js, MongoDB"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Required Skills (comma separated)</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none transition-all"
                placeholder="e.g. React, Python, UI/UX"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Team Size</label>
              <input 
                type="number" 
                min="2" 
                max="10"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none transition-all"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Hackathon (optional)</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none transition-all"
                placeholder="e.g. TechCrunch Disrupt 2026"
                value={formData.hackathonName}
                onChange={(e) => setFormData({ ...formData, hackathonName: e.target.value })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
