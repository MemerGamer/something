import { useState, startViewTransition } from 'hono/jsx';
import { hc } from 'hono/client';
import type { AppType } from '../index.js';
import type { RequestType } from '../types.js';

// Create Hono client
const client: any = hc<AppType>('/');

export const RequestDetail = ({ request }: { request: RequestType }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleApprove = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            // Using Hono client for API call
            const response = await client.api.requests[':id'].approve.$post({
                param: {
                    id: request.requestId
                }
            });

            const data = await response.json();

            startViewTransition(() => {
                setResult({
                    success: data.success,
                    message: data.message
                });
            });

            if (data.success) {
                // Redirect after 1 second
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        } catch (error) {
            setResult({
                success: false,
                message: 'Error processing request. Please try again.'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Request Details
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Review details and take action
                </p>
            </div>

            <div className="border-t border-gray-200">
                <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Username</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.username}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">User ID</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.userId}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Current Type</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                {request.currentType}
                            </span>
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Requested Type</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {request.requestedType}
                            </span>
                        </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Date Requested</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {new Date(request.createdAt).toLocaleString()}
                        </dd>
                    </div>
                </dl>
            </div>

            {result && (
                <div className={`px-4 py-5 sm:px-6 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className={`text-sm ${result.success ? 'text-green-800' : 'text-red-800'}`}>{result.message}</p>
                    {result.success && <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>}
                </div>
            )}

            <div className="px-4 py-5 sm:px-6 border-t border-gray-200 flex justify-end space-x-3">
                <a href="/requests" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Back to List
                </a>

                <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isProcessing ? 'Processing...' : 'Approve Request'}
                </button>
            </div>
        </div>
    );
};