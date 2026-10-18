import React from 'react'
import UserTableBody from './UserTableBody'

const RecentUsers = () => {
  return (
    <div className="bg-white mt-4 rounded-xl p-6">
                            <div className="flex justify-between">
                                <h2 className="text-xl font-bold text-gray-800">Recent Users</h2>
                                <a href="" className="text-blue-600 underline text-md">View All</a>
                            </div>

                            <div className="max-h-80 overflow-auto">
                                <table className="w-full text-left min-w-150 text-sm">
                                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">Name</th>
                                        <th className="px-5 py-3 font-medium">Email</th>
                                        <th className="px-5 py-3 font-medium">Role</th>
                                        <th className="px-5 py-3 font-medium">Joined</th>
                                    </tr>
                                </thead>

                                 <UserTableBody/>
                                 <UserTableBody/>
                                 <UserTableBody/>
                                 <UserTableBody/>
                                 <UserTableBody/>
                                 <UserTableBody/>
                                 <UserTableBody/>
                                 <UserTableBody/>

                            </table>
                            </div>
                        </div>
  )
}

export default RecentUsers
