import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function HackathonHub() {
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHackathons()
  }, [])

  const fetchHackathons = async () => {
    try {
      const res = await api.get('/api/hackathons')
      setHackathons(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            🎉 Hackathon Hub
          </h1>
          <p className="text-purple-300 text-lg">Find exciting hackathons to participate in!</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-white text-xl animate-pulse">Loading hackathons...</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map(hackathon => (
              <div key={hackathon.id} className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    hackathon.mode === 'Online' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 
                    hackathon.mode === 'Hybrid' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 
                    'bg-green-500/20 text-green-400 border-green-500/30'
                  }`}>
                    {hackathon.mode}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{hackathon.name}</h3>
                <div className="space-y-2 text-gray-400 text-sm mb-4">
                  <div className="flex items-center gap-2">📅 {hackathon.date}</div>
                  <div className="flex items-center gap-2">📍 {hackathon.location}</div>
                </div>
                <a 
                  href={hackathon.registrationLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2 rounded-lg font-semibold transition-all shadow-lg"
                >
                  Register Now
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
