// src/components/admin/AnalyticsManager.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  Calendar,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Users,
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  phone: string;
  personality_result: string | null;
  created_at: string;
}

interface PersonalityCount {
  name: string;
  count: number;
}

interface DailyCount {
  date: string;
  count: number;
}

export function AnalyticsManager() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [personalityCounts, setPersonalityCounts] = useState<
    PersonalityCount[]
  >([]);
  const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('month');

  // COLORS for pie chart
  const COLORS = [
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
  ];

  // Load user data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all users
        const { data, error } = await supabase
          .from('quiz_users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setUserData(data || []);

        // Process data for charts
        processData(data || []);
      } catch (error: any) {
        console.error('Error fetching analytics data:', error);
        setError(error.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for charts when date range changes
  useEffect(() => {
    if (userData.length > 0) {
      processData(userData);
    }
  }, [dateRange, userData]);

  // Process user data into chart data
  const processData = (data: UserData[]) => {
    // Filter data by date range if needed
    let filteredData = [...data];

    const now = new Date();
    if (dateRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredData = data.filter(
        (user) => new Date(user.created_at) >= weekAgo
      );
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredData = data.filter(
        (user) => new Date(user.created_at) >= monthAgo
      );
    }

    // Count personalities
    const counts: Record<string, number> = {};
    filteredData.forEach((user) => {
      if (user.personality_result) {
        counts[user.personality_result] =
          (counts[user.personality_result] || 0) + 1;
      }
    });

    const personalityData = Object.entries(counts)
      .map(([name, count]) => ({
        name: formatPersonalityName(name),
        count,
      }))
      .sort((a, b) => b.count - a.count);

    setPersonalityCounts(personalityData);

    // Count daily users
    const dailyData: Record<string, number> = {};

    // Determine date format based on range
    const formatDate = (date: Date) => {
      if (dateRange === 'week') {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'numeric',
          day: 'numeric',
        });
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      }
    };

    // Initialize with zero counts for all days in range
    if (dateRange === 'week' || dateRange === 'month') {
      const daysToShow = dateRange === 'week' ? 7 : 30;
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        dailyData[formatDate(date)] = 0;
      }
    }

    // Count users by day
    filteredData.forEach((user) => {
      const date = formatDate(new Date(user.created_at));
      dailyData[date] = (dailyData[date] || 0) + 1;
    });

    const dailyChartData = Object.entries(dailyData).map(([date, count]) => ({
      date,
      count,
    }));

    setDailyCounts(dailyChartData);
  };

  // Format personality name for display
  const formatPersonalityName = (name: string) => {
    // Convert from camelCase or snake_case to Title Case
    return name
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
  };

  // Export data as CSV
  const exportCSV = () => {
    if (userData.length === 0) return;

    // Create CSV content
    const headers = ['Name', 'Phone', 'Result', 'Date'];
    const csvRows = [
      headers.join(','),
      ...userData.map((user) =>
        [
          `"${user.name.replace(/"/g, '""')}"`, // Escape quotes in name
          `"${user.phone.replace(/"/g, '""')}"`, // Escape quotes in phone
          user.personality_result || 'N/A',
          new Date(user.created_at).toLocaleDateString(),
        ].join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `avrudu_quiz_data_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && userData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track quiz usage and results</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <Download size={16} className="mr-2" />
          Export Data
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd>
                    <div className="text-lg font-bold text-gray-900">
                      {userData.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Recent Users (7 days)
                  </dt>
                  <dd>
                    <div className="text-lg font-bold text-gray-900">
                      {
                        userData.filter((user) => {
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return new Date(user.created_at) >= weekAgo;
                        }).length
                      }
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <PieChartIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Most Common Result
                  </dt>
                  <dd>
                    <div className="text-lg font-bold text-gray-900">
                      {personalityCounts.length > 0
                        ? personalityCounts[0].name
                        : 'N/A'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <BarChartIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Daily Users
                  </dt>
                  <dd>
                    <div className="text-lg font-bold text-gray-900">
                      {dailyCounts.length > 0
                        ? (
                            dailyCounts.reduce(
                              (sum, item) => sum + item.count,
                              0
                            ) / dailyCounts.length
                          ).toFixed(1)
                        : '0'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Time Period</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setDateRange('week')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  dateRange === 'week'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Last Week
              </button>
              <button
                onClick={() => setDateRange('month')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  dateRange === 'month'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Last Month
              </button>
              <button
                onClick={() => setDateRange('all')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  dateRange === 'all'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Users Chart */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Daily Quiz Completions
            </h2>
            <div className="h-72">
              {dailyCounts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyCounts}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Users" fill="#9c27b0" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personality Distribution Chart */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Personality Results Distribution
            </h2>
            <div className="h-72">
              {personalityCounts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={personalityCounts}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {personalityCounts.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, _name, props) => [
                        `${value} users`,
                        props.payload.name,
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Recent Quiz Takers
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Result
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData.slice(0, 10).map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.personality_result
                      ? formatPersonalityName(user.personality_result)
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {userData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {userData.length > 10 && (
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 text-right">
            <button
              onClick={exportCSV}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
            >
              Export All {userData.length} Records
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
