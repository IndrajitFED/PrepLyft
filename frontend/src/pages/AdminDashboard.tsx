import React from 'react'
import { 
  GraduationCap, 
  Users, 
  Video, 
  DollarSign, 
  UserCheck, 
  Plus,
  ArrowUp,
  MoreVertical,
  Search,
  BarChart3,
  Calendar,
  Upload,
  FileText,
  Settings
} from 'lucide-react'

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MockInterviewPro</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Prompt history</a>
              <a href="#" className="text-primary-600 font-medium">Admin Dashboard</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">All Design</span>
                <span className="text-sm text-gray-600">Single Design</span>
                <span className="text-sm text-gray-600">Actual Size (100%)</span>
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <div className="w-6 h-6 bg-red-500 rounded-full absolute -top-1 -right-1 text-xs text-white flex items-center justify-center">
                  3
                </div>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
              </button>
              <button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <GraduationCap className="w-8 h-8 text-primary-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">MockInterviewPro</h2>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-primary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-lg">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Admin Panel</p>
                  <p className="text-xs text-gray-600">Super Admin</p>
                </div>
              </div>
            </div>
            
            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg">
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Users className="w-5 h-5" />
                <span>User Management</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5" />
                <span>Session Management</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5" />
                <span>Revenue Tracking</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <UserCheck className="w-5 h-5" />
                <span>Mentor Management</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>Content Library</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Monitor and manage your mock interview platform</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">2,847</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>12%</span>
                  </div>
                  <p className="text-xs text-gray-500">from last month</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Video className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>8%</span>
                  </div>
                  <p className="text-xs text-gray-500">from yesterday</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <span className="text-2xl font-bold text-purple-600">₹</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹1,24,560</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>15%</span>
                  </div>
                  <p className="text-xs text-gray-500">from last month</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <UserCheck className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Mentors</p>
                    <p className="text-2xl font-bold text-gray-900">47</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>3</span>
                  </div>
                  <p className="text-xs text-gray-500">new this week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* User Growth Chart */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                </select>
              </div>
              
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500">Chart visualization would go here</p>
                  <p className="text-sm text-gray-400">Showing New Users over 4 weeks</p>
                </div>
              </div>
            </div>

            {/* Session Types Chart */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Session Types</h3>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                  <option>This month</option>
                  <option>Last month</option>
                  <option>Last quarter</option>
                </select>
              </div>
              
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 border-8 border-blue-200 border-t-blue-600 border-r-green-500 border-b-orange-500 rounded-full mb-4"></div>
                  <p className="text-gray-500">Donut chart visualization</p>
                  <p className="text-sm text-gray-400">DSA, Data Science, Analytics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Sessions */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700">View all</a>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">R</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">DSA Mock Interview with Rahul Kumar</p>
                      <p className="text-sm text-gray-600">2:00 PM</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Completed</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">P</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Data Science Interview with Priya Sharma</p>
                      <p className="text-sm text-gray-600">4:30 PM</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">In Progress</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">A</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Analytics Mock Interview with Amit Singh</p>
                      <p className="text-sm text-gray-600">6:00 PM</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Scheduled</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-4">
                <button className="w-full flex items-center space-x-3 p-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
                  <Users className="w-5 h-5" />
                  <span>Add New User: Create candidate/mentor</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Session: Create new interview slot</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>Upload Resource: Add study materials</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                  <span>Generate Report: Monthly analytics</span>
                </button>
              </div>
            </div>
          </div>

          {/* User Management Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option>All Users</option>
                  <option>Candidates</option>
                  <option>Mentors</option>
                  <option>Admins</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Sessions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">S</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Sarah Johnson</p>
                          <p className="text-sm text-gray-600">sarah@example.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Candidate</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">12</td>
                    <td className="py-3 px-4 text-gray-600">Jan 15, 2024</td>
                    <td className="py-3 px-4">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">R</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Rajesh Patel</p>
                          <p className="text-sm text-gray-600">rajesh@example.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Mentor</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">45</td>
                    <td className="py-3 px-4 text-gray-600">Dec 8, 2023</td>
                    <td className="py-3 px-4">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Help Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
        <span className="text-white font-bold text-lg">?</span>
      </button>
    </div>
  )
}

export default AdminDashboard
