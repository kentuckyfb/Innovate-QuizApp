// src/components/admin/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Users,
  Award,
  FileQuestion,
  Clock,
  ArrowRight,
  BarChart2,
  Settings as SettingsIcon,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: JSX.Element;
  description: string;
  linkTo?: string;
  color: string;
}

const StatCard = ({
  title,
  value,
  icon,
  description,
  linkTo,
  color,
}: StatCardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border-t-4 ${color}`}
    >
      <div className="p-6">
        <div className="flex items-center">
          <div
            className="p-3 rounded-full bg-opacity-10 mr-4"
            style={{ backgroundColor: `${color.replace('border-', 'rgb(')}` }}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">{description}</p>
        {linkTo && (
          <Link
            to={linkTo}
            className="mt-4 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
          >
            View Details <ArrowRight size={16} className="ml-1" />
          </Link>
        )}
      </div>
    </div>
  );
};

interface RecentActivity {
  id: string;
  name: string;
  type: string;
  date: string;
  result?: string;
}

export function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [mostCommonPersonality, setMostCommonPersonality] =
    useState<string>('Loading...');
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch total users
        const { count: userCount, error: userError } = await supabase
          .from('quiz_users')
          .select('*', { count: 'exact', head: true });

        if (userError) throw userError;
        setTotalUsers(userCount || 0);

        // Fetch total questions
        const { count: questionCount, error: questionError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true });

        if (questionError) throw questionError;
        setTotalQuestions(questionCount || 0);

        // Fetch most common personality
        const { data: personalityData, error: personalityError } =
          await supabase
            .from('quiz_users')
            .select('personality_result')
            .not('personality_result', 'is', null);

        if (personalityError) throw personalityError;

        // Count occurrences of each personality
        const personalityCounts: Record<string, number> = {};
        personalityData?.forEach((item) => {
          const personality = item.personality_result as string;
          personalityCounts[personality] =
            (personalityCounts[personality] || 0) + 1;
        });

        // Find the most common personality
        let maxCount = 0;
        let mostCommon = 'None';

        Object.entries(personalityCounts).forEach(([personality, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostCommon = personality;
          }
        });

        // Format the personality name for display
        const formattedPersonality = mostCommon
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());

        setMostCommonPersonality(formattedPersonality);

        // Fetch recent activities
        const { data: recentData, error: recentError } = await supabase
          .from('quiz_users')
          .select('id, name, personality_result, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentError) throw recentError;

        const activities =
          recentData?.map((item) => ({
            id: item.id,
            name: item.name,
            type: 'Quiz Completion',
            date: new Date(item.created_at).toLocaleDateString(),
            result: item.personality_result || 'Unknown',
          })) || [];

        setRecentActivities(activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Overview of your Avrudu Quiz administration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users size={24} className="text-blue-600" />}
          description="Total number of users who have taken the quiz"
          linkTo="/admin/analytics"
          color="border-blue-600"
        />

        <StatCard
          title="Quiz Questions"
          value={totalQuestions}
          icon={<FileQuestion size={24} className="text-purple-600" />}
          description="Total number of questions in the quiz"
          linkTo="/admin/questions"
          color="border-purple-600"
        />

        <StatCard
          title="Most Common Personality"
          value={mostCommonPersonality}
          icon={<Award size={24} className="text-yellow-600" />}
          description="Most common personality result"
          linkTo="/admin/analytics"
          color="border-yellow-600"
        />

        <StatCard
          title="Response Time"
          value="2.5 mins"
          icon={<Clock size={24} className="text-green-600" />}
          description="Average time to complete the quiz"
          color="border-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Activities
              </h3>
              <Link
                to="/admin/analytics"
                className="text-sm font-medium text-purple-600 hover:text-purple-800"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="py-3 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <Users size={20} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {activity.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {activity.type} ({activity.result})
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">{activity.date}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                No recent activities
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/admin/questions"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <FileQuestion size={20} className="text-purple-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Manage Questions
                  </h4>
                  <p className="text-xs text-gray-600">Edit or add questions</p>
                </div>
              </Link>

              <Link
                to="/admin/personalities"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Manage Personalities
                  </h4>
                  <p className="text-xs text-gray-600">
                    Edit personality types
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/analytics"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <BarChart2 size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    View Analytics
                  </h4>
                  <p className="text-xs text-gray-600">Check quiz statistics</p>
                </div>
              </Link>

              <Link
                to="/admin/settings"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <SettingsIcon size={20} className="text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Settings
                  </h4>
                  <p className="text-xs text-gray-600">
                    Customize quiz appearance
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
