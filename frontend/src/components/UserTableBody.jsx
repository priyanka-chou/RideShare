import React from 'react'

const UserTableBody = () => {
  return (
    <tbody className="text-gray-700">
                                    <tr className="border-t border-gray-100">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">R</div>
                                                <span>Rahul Sharma</span>
                                                </div>
                                                </td>
                                        <td className="px-5 py-4">pc091654@gmail.com</td>
                                        <td className="px-5 py-4">User</td>
                                        <td className="px-5 py-4">25 Sep 2026</td>
                                    </tr>
                                    
                                </tbody>
  )
}

export default UserTableBody
