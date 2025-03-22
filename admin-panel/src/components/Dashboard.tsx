import type { DashboardStats } from '../types.js';

export const Dashboard = ({ stats }: { stats: DashboardStats }) => {
    return (
        <div className="space-y-6">
            {/* Overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium text-gray-900">Pending Requests</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Type change requests awaiting approval
                        </p>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="ml-5">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Pending</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">{stats.pendingCount}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                        <div className="mt-6">
                            <a href="/requests" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                View All Requests
                            </a>
                        </div>
                    </div>
                </div>
                {/* Recent Activity */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Recent Approved Requests
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Recent account type changes that have been approved
                        </p>
                    </div>

                    {stats.recentApproved.length === 0 ? (
                        <div className="px-4 py-5 sm:p-6 text-center text-gray-500 italic">
                            No recent approvals
                        </div>
                    ) : (
                        <div className="overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {stats.recentApproved.map((approval) => (
                                    <li key={approval.requestId} className="px-4 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {approval.username}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Changed to <span className="font-medium">{approval.requestedType}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm text-gray-500">
                                                {new Date(approval.updatedAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};