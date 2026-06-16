<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../utils/api';
import Skeleton from '../components/ui/Skeleton.vue';
import { DollarSign, ShoppingBag, CheckCircle, TrendingUp } from 'lucide-vue-next';
import VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from 'apexcharts';

interface AnalyticsData {
  totalRevenue: number;
  activeOrders: number;
  completedOrders: number;
}

const analytics = ref<AnalyticsData | null>(null);
const loading = ref(true);

const fetchAnalytics = async () => {
  loading.value = true;
  try {
    const res = await api.get<AnalyticsData>('/analytics/dashboard');
    if (res) {
      analytics.value = res;
    }
  } catch(err) {
    console.error('Failed to load dashboard analytics:', err);
  } finally {
    loading.value = false;
  }
};

const chartOptions: ApexOptions = {
  chart: {
    type: 'area',
    background: 'transparent',
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif'
  },
  theme: { mode: 'dark' },
  colors: ['#3b82f6', '#10b981'], // Blue for revenue, emerald for orders
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#94a3b8' } }
  },
  yaxis: [
    {
      title: { text: 'Revenue', style: { color: '#94a3b8' } },
      labels: {
        style: { colors: '#94a3b8' },
        formatter: (val: number) => `$${val}`
      }
    },
    {
      opposite: true,
      title: { text: 'Orders', style: { color: '#94a3b8' } },
      labels: { style: { colors: '#94a3b8' } }
    }
  ],
  grid: {
    borderColor: '#334155',
    strokeDashArray: 4,
    yaxis: { lines: { show: true } }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 100]
    }
  },
  legend: { show: true, position: 'top', horizontalAlign: 'right', labels: { colors: '#e2e8f0' } },
  tooltip: { theme: 'dark' }
};

const chartSeries = [
  { name: 'Revenue', data: [1250, 1800, 1500, 2100, 2800, 3400, 3100] },
  { name: 'Orders', data: [45, 60, 52, 78, 105, 140, 125] }
];

onMounted(() => {
  fetchAnalytics();
});
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="header">
      <h1 class="title">Store Analytics</h1>
      <p class="subtitle">Overview of today's business performance</p>
    </div>

    <!-- Skeletons -->
    <div v-if="loading" class="metrics-grid">
      <div v-for="i in 3" :key="i" class="metric-card">
        <Skeleton class="w-12 h-12 rounded-full mb-4" />
        <Skeleton class="h-4 w-24 mb-2" />
        <Skeleton class="h-8 w-32" />
      </div>
    </div>

    <!-- Data Grid -->
    <div v-else-if="analytics" class="metrics-grid">
      <!-- Revenue -->
      <div class="metric-card">
        <div class="icon-wrapper bg-emerald-500/20 text-emerald-400">
          <DollarSign class="w-6 h-6" />
        </div>
        <div class="metric-label">Today's Revenue</div>
        <div class="metric-value text-emerald-400">${{ analytics.totalRevenue?.toFixed(2) || '0.00' }}</div>
      </div>

      <!-- Active Orders -->
      <div class="metric-card">
        <div class="icon-wrapper bg-blue-500/20 text-blue-400">
          <ShoppingBag class="w-6 h-6" />
        </div>
        <div class="metric-label">Active Orders</div>
        <div class="metric-value text-blue-400">{{ analytics.activeOrders || 0 }}</div>
      </div>

      <!-- Completed Orders -->
      <div class="metric-card">
        <div class="icon-wrapper bg-indigo-500/20 text-indigo-400">
          <CheckCircle class="w-6 h-6" />
        </div>
        <div class="metric-label">Completed Orders</div>
        <div class="metric-value text-indigo-400">{{ analytics.completedOrders || 0 }}</div>
      </div>
    </div>
    
    <div class="chart-container mt-8">
      <div class="metric-card p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp class="w-5 h-5 text-indigo-400" />
              7-Day Sales Trends
            </h3>
            <p class="text-slate-400 text-sm mt-1">Mock data for visual demonstration</p>
          </div>
        </div>
        <div class="chart-wrapper w-full h-[400px]">
          <VueApexCharts type="area" height="400" :options="chartOptions" :series="chartSeries" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  padding: 2rem;
  background: #0b1120;
  min-height: 100vh;
  color: #fff;
  font-family: 'Inter', sans-serif;
}

.header {
  margin-bottom: 2.5rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 1.75rem;
  transition: transform 0.2s, border-color 0.2s;
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-2px);
  border-color: #475569;
}

.icon-wrapper {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.metric-label {
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}
</style>
