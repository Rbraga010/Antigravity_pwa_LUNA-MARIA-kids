import React, { useEffect, useState } from 'react';
import { CreditCard, Sparkles, Eye, Users as UsersIcon } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalSubscribers: number;
  totalOrders: number;
  conversionRate: string;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  is_subscriber: boolean;
  created_at: string;
}

export const AdminStatsComponent = ({ token }: { token: string }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentUsers(data.recentUsers);
      }
    } catch (error) {
      console.error('Erro ao buscar stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-100 h-32 rounded-[40px]"></div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-[40px]">
        <p className="text-red-400 font-bold">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <UsersIcon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Usuários</p>
            <p className="text-2xl font-black text-blue-500">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assinantes</p>
            <p className="text-2xl font-black text-purple-500">{stats.totalSubscribers}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-4">
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pedidos</p>
            <p className="text-2xl font-black text-green-500">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-4">
          <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center">
            <Eye size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Taxa Conversão</p>
            <p className="text-2xl font-black text-pink-500">{stats.conversionRate}%</p>
          </div>
        </div>
      </div>

      {recentUsers.length > 0 && (
        <div className="mt-8 bg-white rounded-[40px] shadow-sm border border-gray-50 p-8">
          <h3 className="text-lg font-black text-[#6B5A53] mb-6 uppercase italic">Últimos Cadastros</h3>
          <div className="space-y-4">
            {recentUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-black">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#6B5A53]">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                {user.is_subscriber && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-500 rounded-full text-xs font-black">
                    ASSINANTE
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
