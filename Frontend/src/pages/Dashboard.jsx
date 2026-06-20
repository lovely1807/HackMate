import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [myProjects, setMyProjects] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [openRes, myRes] = await Promise.all([
        api.get('/api/projects', { params: { status: 'open' } }),
        api.get('/api/projects/my-projects').catch(() => ({ data: [] }))
      ])
      setProjects(openRes.data)
      setMyProjects(myRes.data)

      // Fetch applications for all my projects
      const allApps = []
      for (const project of myRes.data) {
        try {
          const appRes = await api.get(`/api/applications/project/${project.id}`)
          allApps.push(...appRes.data.map(app => ({ ...app, project })))
        } catch (e) {
          console.error(e)
        }
      }
      setApplications(allApps)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (appId) => {
    try {
      await api.post(`/api/applications/${appId}/accept`)
      fetchData()
    } catch (err) {
      alert('Failed to accept application')
    }
  }

  const handleReject = async (appId) => {
    try {
      await api.post(`/api/applications/${appId}/reject`)
      fetchData()
    } catch (err) {
      alert('Failed to reject application')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl font-semibold animate-pulse">Loading HackMate...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Welcome to HackMate 🎉
          </h1>
          <p className="text-purple-300 text-lg">Find your perfect team and start building!</p>
        </div>

        {/* Applications Received Section */}
        {applications.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="text-yellow-400">📬</span> Applications Received ({applications.length})
            </h2>
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl font-bold text-white">
                        {app.user?.fullName?.[0] || 'U'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{app.user?.fullName}</h3>
                        <p className="text-gray-400 text-sm">for {app.project?.title}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      app.status === 'Accepted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      app.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{app.message}</p>
                  {app.user?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {app.user.skills.map(skill => (
                        <span key={skill} className="bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {app.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAccept(app.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                <span className="text-purple-400">🚀</span> Featured Projects
              </h2>
              <Link to="/projects" className="text-purple-400 hover:text-purple-300 font-medium">
                View All →
              </Link>
            </div>
            
            {projects.length === 0 ? (
              <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center">
                <p className="text-gray-400 text-lg">No open projects yet</p>
                <Link to="/create-project" className="text-purple-400 hover:text-purple-300 font-semibold mt-2 inline-block">
                  Create one now →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 4).map(project => (
                  <div key={project.id} className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                        <p className="text-purple-300 text-sm mt-1">{project.category}</p>
                      </div>
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/30">
                        Open
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    
                    {project.requiredSkills && project.requiredSkills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {project.requiredSkills.slice(0, 3).map(skill => (
                            <span key={skill} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs px-3 py-1 rounded-full font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {project.owner?.fullName?.[0] || 'U'}
                        </div>
                        <span>by {project.owner?.fullName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs">👥 {project.teamSize}</span>
                        <Link 
                          to={`/projects/${project.id}`} 
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                <span className="text-blue-400">📋</span> My Projects
              </h2>
              <Link to="/create-project" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg">
                + New Project
              </Link>
            </div>
            
            {myProjects.length === 0 ? (
              <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center">
                <div className="text-4xl mb-3">💡</div>
                <p className="text-gray-400 text-lg mb-3">You haven't created any projects yet</p>
                <Link to="/create-project" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2 rounded-lg font-semibold inline-block transition-all duration-200">
                  Start your project →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myProjects.map(project => (
                  <div key={project.id} className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                        <p className="text-blue-300 text-sm mt-1">{project.category}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        project.status === 'open' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    {project.requiredSkills && project.requiredSkills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {project.requiredSkills.map(skill => (
                            <span key={skill} className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium border border-blue-500/30">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span>👥</span>
                        <span>{project.teamSize} members</span>
                      </div>
                      <Link 
                        to={`/projects/${project.id}`} 
                        className="text-purple-400 hover:text-purple-300 font-medium text-sm"
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Link to="/hackathons" className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
            <div className="text-3xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-all">Hackathon Hub</h3>
            <p className="text-gray-400 text-sm">Find upcoming hackathons to join!</p>
          </Link>
          <Link to="/leaderboard" className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-all">Leaderboard</h3>
            <p className="text-gray-400 text-sm">See top contributors!</p>
          </Link>
          <Link to="/search" className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-all">Search Teammates</h3>
            <p className="text-gray-400 text-sm">Find people with the skills you need!</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
