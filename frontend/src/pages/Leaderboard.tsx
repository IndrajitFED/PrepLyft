import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, Star, User } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { leaderboardAPI } from '../services/api'

interface LeaderboardEntry {
  rank: number
  name: string
  email: string
  avatar?: string
  totalScore: number
  completedSessions: number
  totalSessions: number
}

interface MyRank {
  rank: number
  totalScore: number
  totalCandidates: number
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [myRank, setMyRank] = useState<MyRank | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
    fetchMyRank()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const data = await leaderboardAPI.getLeaderboard(100)
      setLeaderboard(data)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyRank = async () => {
    try {
      const data = await leaderboardAPI.getMyRank()
      setMyRank(data)
    } catch (error) {
      console.error('Error fetching my rank:', error)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />
    return <span className="text-gray-600 font-semibold">#{rank}</span>
  }

  const getRankBgColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300'
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300'
    return 'bg-white border-gray-200'
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Top performers in mock interviews</p>
        </div>

        {/* My Rank Card */}
        {myRank && (
          <div className="mb-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm mb-1">Your Current Rank</p>
                <div className="flex items-center space-x-3">
                  {getRankIcon(myRank.rank)}
                  <div>
                    <h2 className="text-3xl font-bold">
                      #{myRank.rank} of {myRank.totalCandidates}
                    </h2>
                    <p className="text-primary-100">Total Score: {myRank.totalScore}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-primary-100 text-sm mb-1">Your Score</p>
                <p className="text-4xl font-bold">{myRank.totalScore}</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Sessions</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sessions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.email}
                      className={`hover:bg-gray-50 transition-colors ${getRankBgColor(entry.rank)}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {entry.avatar ? (
                            <img
                              src={entry.avatar}
                              alt={entry.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                              <User className="w-6 h-6 text-primary-600" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                            <div className="text-sm text-gray-500">{entry.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <Star className="w-5 h-5 text-yellow-500 mr-1" />
                          <span className="text-lg font-bold text-gray-900">{entry.totalScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                        {entry.completedSessions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                        {entry.totalSessions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leaderboard data yet</h3>
            <p className="text-gray-600">Complete your first mock interview to see your rank!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Leaderboard

