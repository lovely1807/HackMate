import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function Search() {
  const [skillInput, setSkillInput] = useState('')
  const [searchType, setSearchType] = useState('teammates')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!skillInput.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const skills = skillInput.split(',').map(s => s.trim()).filter(Boolean)
      const endpoint = searchType === 'teammates' 
        ? `/api/users/search?skills=${skills.join('&skills=')}`
        : `/api/teams/search?skills=${skills.join('&skills=')}`
      const res = await api.get(endpoint)
      setResults(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Find Your Perfect Match
          </h1>
          <p className="text-purple-300 text-lg">
            Search for teammates or teams by skills
          </p>
        </div>
        
        <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl border border-gray-700 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setSearchType('teammates')}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  searchType === 'teammates'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">👥</span> Find Teammates
              </button>
              <button
                type="button"
                onClick={() => setSearchType('teams')}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  searchType === 'teams'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">🎯</span> Find Teams
              </button>
            </div>
            
            <div className="flex gap-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Enter skills separated by commas (e.g., React, Node.js, Python)"
                className="flex-1 px-5 py-4 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-pulse">Searching...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>🔍</span> Search
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {searched && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {searchType === 'teammates' ? 'Potential Teammates' : 'Available Teams'}
            </h2>
            
            {results.length === 0 ? (
              <div className="bg-gray-800/70 backdrop-blur-md p-10 rounded-2xl border border-gray-700 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-400 text-lg">No results found</p>
                <p className="text-gray-500 text-sm mt-2">Try different search terms</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map(item => (
                  <div key={item.id} className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                    {searchType === 'teammates' ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl font-black text-white">
                              {(item.fullName?.[0] || item.username?.[0]).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                {item.fullName || item.username}
                              </h3>
                              <p className="text-purple-300 text-sm">@{item.username}</p>
                            </div>
                          </div>
                          <Link
                            to={`/profile/${item.username}`}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
                          >
                            View Profile
                          </Link>
                        </div>
                        {item.bio && (
                          <p className="text-gray-400 text-sm mb-4">{item.bio}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {item.skills?.map(skill => (
                            <span key={skill} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">{item.name}</h3>
                            {item.projectName && (
                              <p className="text-blue-300 text-sm mt-1">{item.projectName}</p>
                            )}
                            <p className="text-gray-400 text-sm">Leader: @{item.leaderUsername}</p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-xs font-semibold border ${
                            item.isOpen
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}>
                            {item.isOpen ? 'Open to Join' : 'Closed'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.requiredSkills?.map(skill => (
                            <span key={skill} className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1.5 rounded-full font-medium border border-blue-500/30">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                          <span className="text-gray-400 text-sm">👥 {item.members?.length || 0}/{item.maxMembers} members</span>
                          {item.isOpen && (
                            <button
                              onClick={async () => {
                                try {
                                  await api.post(`/api/teams/${item.id}/join`);
                                  window.location.reload();
                                } catch (err) {
                                  alert(err.response?.data?.error || 'Failed to join team');
                                }
                              }}
                              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                            >
                              Join Team →
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
