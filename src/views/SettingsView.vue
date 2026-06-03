<script setup lang="ts">

import {

  Store,
  Users,
  UtensilsCrossed,
  LayoutGrid,
  Printer,
  Plug,
  ArrowRight
} from 'lucide-vue-next';


const settingsCards = [
  {
    icon: Store,
    title: 'General',
    description: 'Business info, operating hours, and location preferences.',
    action: 'CONFIGURE',
    path: '/settings/general',
  },
  {
    icon: Users,
    title: 'Personnel',
    description: 'Manage staff directory, specialized roles, and security permissions.',
    action: 'MANAGE TEAM',
    path: '/settings/personnel',
  },
  {
    icon: UtensilsCrossed,
    title: 'Menu & Catalog',
    description: 'Edit menu items, categories, and complex modifier groups.',
    action: 'EDIT ITEMS',
    path: '/settings/menu',
  },
  {
    icon: LayoutGrid,
    title: 'Floor Plan',
    description: 'Design table layouts, dining zones, and seating capacities.',
    action: 'VIEW MAP',
    path: '/settings/floorplan',
  },
  {
    icon: Printer,
    title: 'Hardware & Printers',
    description: 'Setup KDS screens, receipt printers, and terminal hardware.',
    action: 'DEVICE SETUP',
    path: '/settings/hardware',
  },
  {
    icon: Plug,
    title: 'Integrations',
    description: 'Sync with delivery apps, accounting software, and payments.',
    action: 'CONNECT APPS',
    path: '/settings/integrations',
  },
];
</script>

<template>
  <div class="flex h-screen bg-[#0a0f1e] overflow-hidden">

    

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-8">

      <!-- Header -->
      <div class="flex items-start justify-between mb-10">
        <div>
          <h1 class="text-4xl font-bold text-white tracking-tight mb-2">System Control</h1>
          <p class="text-slate-400 text-sm max-w-md leading-relaxed">
            Configure your terminal settings, manage staff access, and fine-tune your menu
            performance from one centralized obsidian-glass interface.
          </p>
        </div>

        <!-- System Status Badge -->
        <div class="flex items-center gap-2 bg-[#0d1b2e] border border-slate-700 rounded-lg px-4 py-2">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          <div class="text-right">
            <p class="text-[10px] text-slate-500 uppercase tracking-widest font-medium">System Status</p>
            <p class="text-[11px] text-green-400 font-bold uppercase tracking-wider">All Modules Active</p>
          </div>
        </div>
      </div>

      <!-- Settings Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link
          v-for="card in settingsCards"
          :key="card.path"
          :to="card.path"
          class="group bg-[#0d1525] border border-[#1e2d45] hover:border-blue-500/50 rounded-xl p-6 flex flex-col gap-4 transition-all duration-200 hover:bg-[#0f1e35]"
        >
          <!-- Icon -->
          <div class="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
            <component :is="card.icon" class="w-5 h-5 text-blue-400" />
          </div>

          <!-- Title & Description -->
          <div>
            <h3 class="text-white font-semibold text-lg mb-1">{{ card.title }}</h3>
            <p class="text-slate-400 text-sm leading-relaxed">{{ card.description }}</p>
          </div>

          <!-- Action Link -->
          <div class="flex items-center gap-1 text-blue-400 text-xs font-bold uppercase tracking-widest mt-auto group-hover:gap-2 transition-all duration-150">
            {{ card.action }}
            <ArrowRight class="w-3 h-3" />
          </div>
        </router-link>
      </div>

    </main>
  </div>
</template>