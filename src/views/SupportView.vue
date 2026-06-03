<script setup lang="ts">
import { ref } from 'vue';
import {
  Monitor,
  CreditCard,
  Lightbulb,
  ArrowRight,
  Search,
  ChevronDown,
  MessageCircle,
  Mail,
  Phone
} from 'lucide-vue-next';

const searchQuery = ref('');


const supportCards = [
  {
    icon: Monitor,
    iconBg: 'bg-blue-600/20',
    iconColor: 'text-blue-400',
    title: 'Technical Support',
    description: 'Troubleshooting hardware, connectivity, and system errors.',
    action: 'Browse Technical',
    path: '/support/technical',
  },
  {
    icon: CreditCard,
    iconBg: 'bg-green-600/20',
    iconColor: 'text-green-400',
    title: 'Billing & Account',
    description: 'Manage subscriptions, invoices, and user permissions.',
    action: 'View Billing',
    path: '/support/billing',
  },
  {
    icon: Lightbulb,
    iconBg: 'bg-slate-600/20',
    iconColor: 'text-slate-400',
    title: 'Feature Requests',
    description: 'Help us build Obsidian OS by suggesting new tools.',
    action: 'Submit Request',
    path: '/support/features',
  },
];

const faqs = [
  'How to add a new table to the layout?',
  'Printer connectivity issues and fixes',
  'How to export end-of-day sales reports?',
  'Setting up multi-user permissions',
];

const openFaq = ref<number | null>(null);

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index;
};
</script>

<template>
    
  <div class="flex h-screen bg-[#0a0f1e] overflow-hidden">

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-8">

      <!-- Hero Search -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-white tracking-tight mb-3">How can we help?</h1>
        <div class="relative max-w-md mx-auto">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for help articles, tutorials, or guides..."
            class="w-full bg-[#0d1525] border border-[#1e2d45] text-slate-300 placeholder-slate-500 text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <!-- Support Cards -->
      <div class="grid grid-cols-3 gap-4 mb-10">
        <router-link
          v-for="card in supportCards"
          :key="card.path"
          :to="card.path"
          class="group bg-[#0d1525] border border-[#1e2d45] hover:border-blue-500/50 rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 hover:bg-[#0f1e35]"
        >
          <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', card.iconBg]">
            <component :is="card.icon" :class="['w-5 h-5', card.iconColor]" />
          </div>
          <div>
            <h3 class="text-white font-semibold mb-1">{{ card.title }}</h3>
            <p class="text-slate-400 text-xs leading-relaxed">{{ card.description }}</p>
          </div>
          <div class="flex items-center gap-1 text-blue-400 text-xs font-bold uppercase tracking-widest mt-auto group-hover:gap-2 transition-all duration-150">
            {{ card.action }}
            <ArrowRight class="w-3 h-3" />
          </div>
        </router-link>
      </div>

      <!-- Bottom Two Columns -->
      <div class="grid grid-cols-2 gap-6">

        <!-- Common Questions -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-white font-semibold text-base">Common Questions</h2>
            <a href="#" class="text-blue-400 text-xs font-medium hover:underline">View all FAQ</a>
          </div>
          <div class="space-y-2">
            <div
              v-for="(faq, index) in faqs"
              :key="index"
              class="bg-[#0d1525] border border-[#1e2d45] rounded-lg overflow-hidden"
            >
              <button
                class="w-full flex items-center justify-between px-4 py-3 text-slate-300 text-sm hover:text-white transition-colors text-left"
                @click="toggleFaq(index)"
              >
                {{ faq }}
                <ChevronDown
                  class="w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200"
                  :class="{ 'rotate-180': openFaq === index }"
                />
              </button>
              <div v-if="openFaq === index" class="px-4 pb-3 text-slate-500 text-xs leading-relaxed">
                Documentation and step-by-step guides for this topic are available in the full help center.
              </div>
            </div>
          </div>
        </div>

        <!-- Get in Touch -->
        <div>
          <h2 class="text-white font-semibold text-base mb-4">Get in Touch</h2>

          <!-- Live Chat Card -->
          <div class="bg-blue-600 rounded-xl p-6 flex flex-col items-center text-center mb-3">
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
              <MessageCircle class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-white font-bold text-lg mb-1">Live Chat</h3>
            <p class="text-blue-200 text-xs mb-4">Average response time: 2 mins</p>
            <button class="w-full bg-white text-blue-600 font-semibold text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Start Chat Now
            </button>
          </div>

          <!-- Contact Details -->
          <div class="bg-[#0d1525] border border-[#1e2d45] rounded-xl p-4 space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-[#1e2d45] rounded-lg flex items-center justify-center shrink-0">
                <Mail class="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p class="text-slate-500 text-[10px] uppercase tracking-wider">Email Support</p>
                <p class="text-slate-300 text-xs">koko.restaurant@gmail.com</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-[#1e2d45] rounded-lg flex items-center justify-center shrink-0">
                <Phone class="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p class="text-slate-500 text-[10px] uppercase tracking-wider">Emergency Hotline</p>
                <p class="text-slate-300 text-xs">+855 12 345 678</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="mt-10 pt-6 border-t border-[#1e293b] flex items-center justify-center gap-2 text-xs text-slate-600">
        <span>© 2024 Obsidian OS v4.2.0</span>
        <span>•</span>
        <span>Status:</span>
        <span class="flex items-center gap-1 text-green-400 font-medium">
          <span class="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
          All Systems Operational
        </span>
      </div>

    </main>
  </div>
</template>