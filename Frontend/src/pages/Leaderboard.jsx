import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/api/leaderboard')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getRankColor = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    if (index === 1) return 'bg-gradient-to-r from-gray-400 to-gray-500'
    if (index === 2) return 'bg-gradient-to-r from-orange-600 to-orange-700'
    return 'bg-gradient-to-r from-gray-700 to-gray-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            🏆 Leaderboard
          </h1>
          <p className="text-purple-300 text-lg">Top contributors on HackMate!</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-white text-xl animate-pulse">Loading leaderboard...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div key={user.id} className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 flex items-center gap-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${getRankColor(index)}`}>
                  {index + 1}
                </div>
                <Link to={`/profile/${user.username}`} className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
                    {(user.fullName?.[0] || user.username?.[0]).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{user.fullName || user.username}</h3>
                    <p className="text-gray-400 text-sm">@{user.username}</p>
                  </div>
                </Link>
                <div className="text-center min-w-[100px]">
                  <div className="text-2xl font-bold text-purple-400">{user.rating.toFixed(1)}</div>
                  <div className="text-gray-400 text-xs">Rating</div>
                </div>
                <div className="text-right">
                  <div className="flex flex-wrap gap-1 justify-end">
                    {user.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
