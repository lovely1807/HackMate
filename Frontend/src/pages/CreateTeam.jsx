import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function CreateTeam() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectName: '',
    maxMembers: 4,
    requiredSkills: '',
    isOpen: true
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' 
      ? e.target.checked 
      : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const skills = formData.requiredSkills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      
      await api.post('/api/teams', {
        name: formData.name,
        description: formData.description,
        projectName: formData.projectName,
        maxMembers: parseInt(formData.maxMembers),
        requiredSkills: skills,
        isOpen: formData.isOpen
      })
      
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Create Your Team
          </h1>
          <p className="text-purple-300 text-lg">Build the perfect team for your hackathon project</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-3 font-medium">Team Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your team name"
                className="w-full px-5 py-4 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-3 font-medium">Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="What's your project called?"
                className="w-full px-5 py-4 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-3 font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell others about your team and project goals"
                rows="4"
                className="w-full px-5 py-4 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-3 font-medium">Max Team Members</label>
              <input
                type="number"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleChange}
                min="2"
                max="10"
                placeholder="How many members are you looking for?"
                className="w-full px-5 py-4 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-3 font-medium">Required Skills (comma-separated)</label>
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, Python, Design"
                className="w-full px-5 py-4 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isOpen"
                id="isOpen"
                checked={formData.isOpen}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500/30 focus:ring-2"
              />
              <label htmlFor="isOpen" className="text-gray-300 font-medium cursor-pointer">Open for new members</label>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Team'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
