import { createServerSupabaseClient } from '@/lib/supabase-server';
import AnalyticsChart from '@/components/AnalyticsChart';
import { Activity, Users, MousePointerClick, TrendingUp } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AnalyticsDashboard() {
  const supabase = await createServerSupabaseClient();
  
  // Fetch last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  let { data: pageViews, error } = await supabase
    .from('page_views')
    .select('url_path, created_at, session_id')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  if (error && error.code === '42703') {
    const fallback = await supabase
      .from('page_views')
      .select('url_path, created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });
    pageViews = fallback.data as any;
    error = fallback.error;
  }

  // Filter out any accidentally tracked admin-portal views
  const views = (pageViews || []).filter(v => !v.url_path.startsWith('/admin-portal'));

  // Metrics Calculation - Unique Visitors
  const uniqueSessions = new Set<string>();
  let validSessionsCount = 0;
  
  views.forEach(v => {
    if (v.session_id) {
       uniqueSessions.add(v.session_id);
       validSessionsCount++;
    }
  });

  const totalViews = uniqueSessions.size > 0 ? (uniqueSessions.size + (views.length - validSessionsCount)) : views.length;
  
  const today = new Date().toISOString().split('T')[0];
  const trafficTodayArray = views.filter(v => v.created_at.startsWith(today));
  const todaySessions = new Set<string>();
  let todayValid = 0;
  trafficTodayArray.forEach(v => {
    if (v.session_id) {
       todaySessions.add(v.session_id);
       todayValid++;
    }
  });
  const trafficToday = todaySessions.size > 0 ? (todaySessions.size + (trafficTodayArray.length - todayValid)) : trafficTodayArray.length;

  const pageCounts: Record<string, number> = {};
  views.forEach(v => {
    pageCounts[v.url_path] = (pageCounts[v.url_path] || 0) + 1;
  });
  
  let mostPopularPage = 'N/A';
  let maxCount = 0;
  Object.entries(pageCounts).forEach(([path, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostPopularPage = path;
    }
  });

  const formatPathName = (path: string) => {
    if (path === '/') return 'Home Page';
    return path.split('/').filter(Boolean).map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join(' > ') || path;
  };
  
  const mostPopularDisplay = mostPopularPage !== 'N/A' ? formatPathName(mostPopularPage) : 'N/A';

  // Chart Data Processing
  // Create an array of the last 30 dates
  const chartDataMap: Record<string, number> = {};
  const dailySessionsMap: Record<string, Set<string>> = {};
  const dailyRawViewsMap: Record<string, number> = {};
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    chartDataMap[dateStr] = 0;
    dailySessionsMap[dateStr] = new Set();
    dailyRawViewsMap[dateStr] = 0;
  }

  // Fill in actual data
  views.forEach(v => {
    const dateStr = v.created_at.split('T')[0];
    if (chartDataMap[dateStr] !== undefined) {
      if (v.session_id) {
         dailySessionsMap[dateStr].add(v.session_id);
      } else {
         dailyRawViewsMap[dateStr]++;
      }
    }
  });

  const chartData = Object.keys(chartDataMap).map(dateStr => {
    const d = new Date(dateStr);
    const dailyViews = dailySessionsMap[dateStr].size > 0 
       ? dailySessionsMap[dateStr].size + dailyRawViewsMap[dateStr]
       : dailyRawViewsMap[dateStr];
       
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: dailyViews
    };
  });

  return (
    <div className="flex bg-[#0d1117] h-screen overflow-hidden text-white">
      <AdminSidebar
        activeSection={"analytics" as any}
      />
      
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-[#0d1117]/90 backdrop-blur-xl border-b border-white/8 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg font-sans leading-tight">Website Manager</h1>
            <p className="text-white/30 text-xs font-sans">System Level Analytics</p>
          </div>
        </header>

        <div className="p-8 max-w-4xl pb-32">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
              <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
                <Activity className="w-6 h-6 text-myf-teal" />
                Native Analytics
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Monitor your website traffic and user engagement over the last 30 days.
              </p>
            </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
             <Users className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm font-semibold text-gray-400 mb-1">Total Views (30 Days)</p>
             <h3 className="text-3xl font-black text-gray-800">{totalViews}</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
           <div className="p-3 bg-green-50 text-green-600 rounded-xl">
             <TrendingUp className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm font-semibold text-gray-400 mb-1">Traffic Today</p>
             <h3 className="text-3xl font-black text-gray-800">{trafficToday}</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 overflow-hidden">
           <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
             <MousePointerClick className="w-6 h-6" />
           </div>
           <div className="truncate">
             <p className="text-sm font-semibold text-gray-400 mb-1">Most Popular Page</p>
             <h3 className="text-lg font-black text-gray-800 truncate" title={mostPopularDisplay}>{mostPopularDisplay}</h3>
             {mostPopularPage !== 'N/A' && mostPopularPage !== '/' && <p className="text-[10px] text-gray-400 mt-0.5 truncate">{mostPopularPage}</p>}
           </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Website Foot Traffic</h3>
        <p className="text-sm text-gray-500 mb-6 font-medium">Daily page views over the last 30 days</p>
        
        {error ? (
          <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
             Error loading analytics data. Please ensure the `page_views` table has been created in Supabase.
          </div>
        ) : (
          <AnalyticsChart data={chartData} />
        )}
      </div>
          </div>
        </div>
      </main>
    </div>
  );
}
