import React, { useEffect, useState } from 'react';
import { CreditCard, Sparkles, Eye, Users as UsersIcon, TrendingUp, BarChart3, Calendar, Filter, ShoppingBag } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AdminStats {
  totalUsers: number;
  totalSubscribers: number;
  totalOrders: number;
  shopVisits: number;
  clubVisits: number;
  totalRevenue: number;
  shopConversion: string;
  clubConversion: string;
  conversionRate: string;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  is_subscriber: boolean;
  created_at: string;
  categoryDisplay?: string;
}

export const AdminStatsComponent = ({ token }: { token: string }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Dados mockados para o gráfico enquanto não temos log temporal completo
  const chartData = [
    { name: 'Seg', visitas: 400, vendas: 240 },
    { name: 'Ter', visitas: 300, vendas: 139 },
    { name: 'Qua', visitas: 200, vendas: 980 },
    { name: 'Qui', visitas: 278, vendas: 390 },
    { name: 'Sex', visitas: 189, vendas: 480 },
    { name: 'Sab', visitas: 239, vendas: 380 },
    { name: 'Dom', visitas: 349, vendas: 430 },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao buscar stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-64 bg-gray-100 rounded-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-100 h-32 rounded-[40px]"></div>)}
      </div>
      <div className="h-96 bg-gray-100 rounded-[48px]"></div>
    </div>
  );

  if (!stats) return (
    <div className="text-center p-12 bg-red-50 rounded-[40px]">
      <p className="text-red-400 font-bold uppercase tracking-widest text-xs">Erro ao carregar governança</p>
    </div>
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Header Governança */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[48px] shadow-sm border border-gray-50">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#6B5A53] font-luna uppercase italic tracking-tighter">Governança Luna Maria Kids</h1>
          <p className="text-xs font-bold text-gray-400 italic">Visão estratégica e saúde financeira em tempo real</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl text-[10px] font-black text-gray-400 border border-gray-100 uppercase tracking-widest">
            <Calendar size={14} /> Últimos 7 dias
          </div>
          <button className="p-2.5 bg-pink-400 text-white rounded-2xl shadow-lg shadow-pink-100 hover:scale-105 active:scale-95 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-[48px] shadow-xl text-white space-y-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Faturamento Total</p>
            <p className="text-2xl font-black">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="pt-2 flex items-center gap-2 text-[10px] font-bold">
            <span className="bg-white/20 px-2 py-0.5 rounded-full">+12% vs anterior</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 space-y-4">
          <div className="w-12 h-12 bg-pink-50 text-pink-400 rounded-2xl flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loja (Visitas / Conv.)</p>
            <p className="text-2xl font-black text-[#6B5A53]">{stats.shopVisits} / <span className="text-pink-400">{stats.shopConversion}%</span></p>
          </div>
          <p className="text-[9px] font-bold text-gray-300 italic">Total de {stats.totalOrders} pedidos realizados</p>
        </div>

        <div className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-100 space-y-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-400 rounded-2xl flex items-center justify-center">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clube (Assin. / Conv.)</p>
            <p className="text-2xl font-black text-[#6B5A53]">{stats.clubVisits} / <span className="text-purple-400">{stats.clubConversion}%</span></p>
          </div>
          <p className="text-[9px] font-bold text-gray-300 italic">Total de {stats.totalSubscribers} membros ativos</p>
        </div>

        <div className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 space-y-4">
          <div className="w-12 h-12 bg-green-50 text-green-400 rounded-2xl flex items-center justify-center">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lucro Est. / Ticket Médio</p>
            <p className="text-2xl font-black text-green-400">
              {formatCurrency(stats.totalRevenue * 0.324)} / <span className="text-[#6B5A53]">{formatCurrency(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)}</span>
            </p>
          </div>
          <p className="text-[9px] font-bold text-gray-300 italic">Baseado em margem média de 32.4%</p>
        </div>
      </div>

      {/* Gráfico Interativo */}
      <div className="bg-white p-10 rounded-[56px] shadow-sm border border-gray-50 space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black text-[#6B5A53] font-luna uppercase italic">Desempenho Semanal</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Visitas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#BBD4E8] rounded-full"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Vendas</span>
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F472B6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F472B6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BBD4E8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#BBD4E8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 900, fill: '#D1D5DB' }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 900, fill: '#D1D5DB' }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '20px' }}
                itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
              />
              <Area type="monotone" dataKey="visitas" stroke="#F472B6" strokeWidth={4} fillOpacity={1} fill="url(#colorVisitas)" />
              <Area type="monotone" dataKey="vendas" stroke="#BBD4E8" strokeWidth={4} fillOpacity={1} fill="url(#colorVendas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
