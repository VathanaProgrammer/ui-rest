<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-12 font-sans flex flex-col items-center">
    
    <!-- Language Toggle -->
    <div class="w-full max-w-6xl flex justify-end mb-12">
      <div class="inline-flex bg-white dark:bg-slate-800 rounded-full p-1 shadow-sm border border-slate-200 dark:border-slate-700">
        <button 
          @click="lang = 'en'"
          :class="['px-5 py-2 rounded-full text-sm font-bold transition-all duration-300', lang === 'en' ? 'bg-indigo-600 shadow-md text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white']"
        >
          English
        </button>
        <button 
          @click="lang = 'km'"
          :class="['px-5 py-2 rounded-full text-sm font-bold transition-all duration-300', lang === 'km' ? 'bg-indigo-600 shadow-md text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white']"
        >
          ភាសាខ្មែរ
        </button>
      </div>
    </div>

    <!-- Main Title -->
    <div class="text-center mb-16 max-w-2xl">
      <div class="inline-flex items-center justify-center p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-6">
        <svg class="w-12 h-12 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      </div>
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">{{ t.title }}</h1>
      <p class="text-xl text-slate-600 dark:text-slate-400">{{ t.subtitle }}</p>
    </div>

    <!-- Navigation Cards -->
    <div class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <!-- API Card -->
      <router-link to="/help/api" class="group block h-full outline-none focus:ring-4 focus:ring-emerald-500 rounded-3xl">
        <div class="bg-white dark:bg-slate-800 h-full p-8 rounded-3xl shadow-xl border-b-8 border-transparent group-hover:border-emerald-500 group-hover:shadow-2xl group-hover:shadow-emerald-500/30 transform transition-all duration-300 group-hover:-translate-y-3 group-active:translate-y-1 flex flex-col relative overflow-hidden">
          
          <!-- Badge -->
          <div class="absolute top-6 right-6 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 text-xs font-black uppercase tracking-wider py-1.5 px-3 rounded-full animate-pulse">
            {{ lang === 'en' ? 'Start Here' : 'ចាប់ផ្តើមទីនេះ' }}
          </div>

          <div class="bg-emerald-100 dark:bg-emerald-900/50 p-5 inline-flex rounded-2xl mb-6 self-start group-hover:scale-110 transition-transform duration-300">
            <svg class="w-12 h-12 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-emerald-500 transition-colors">{{ t.api.title }}</h2>
          <p class="text-slate-600 dark:text-slate-400 text-lg flex-1 mb-8">{{ t.api.desc }}</p>
          
          <!-- Fake Button CTA -->
          <div class="mt-auto flex items-center justify-center w-full bg-emerald-50 dark:bg-slate-700 group-hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 group-hover:text-white font-bold py-4 px-6 rounded-xl transition-colors duration-300">
            <span class="text-lg">{{ lang === 'en' ? 'Click to Explore API' : 'ចុចដើម្បីមើល API' }}</span>
            <svg class="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7-7m7 7H3"></path></svg>
          </div>
        </div>
      </router-link>

      <!-- FLOW Card -->
      <router-link to="/help/flow" class="group block h-full outline-none focus:ring-4 focus:ring-blue-500 rounded-3xl">
        <div class="bg-white dark:bg-slate-800 h-full p-8 rounded-3xl shadow-xl border-b-8 border-transparent group-hover:border-blue-500 group-hover:shadow-2xl group-hover:shadow-blue-500/30 transform transition-all duration-300 group-hover:-translate-y-3 group-active:translate-y-1 flex flex-col relative overflow-hidden">
          
          <!-- Badge -->
          <div class="absolute top-6 right-6 bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 text-xs font-black uppercase tracking-wider py-1.5 px-3 rounded-full animate-bounce">
            {{ lang === 'en' ? 'Highly Visual' : 'រូបភាពច្បាស់ៗ' }}
          </div>

          <div class="bg-blue-100 dark:bg-blue-900/50 p-5 inline-flex rounded-2xl mb-6 self-start group-hover:scale-110 transition-transform duration-300">
            <svg class="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-500 transition-colors">{{ t.flow.title }}</h2>
          <p class="text-slate-600 dark:text-slate-400 text-lg flex-1 mb-8">{{ t.flow.desc }}</p>
          
          <!-- Fake Button CTA -->
          <div class="mt-auto flex items-center justify-center w-full bg-blue-50 dark:bg-slate-700 group-hover:bg-blue-500 text-blue-600 dark:text-blue-400 group-hover:text-white font-bold py-4 px-6 rounded-xl transition-colors duration-300">
            <span class="text-lg">{{ lang === 'en' ? 'Click to View Flow' : 'ចុចដើម្បីមើលលំហូរ' }}</span>
            <svg class="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7-7m7 7H3"></path></svg>
          </div>
        </div>
      </router-link>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const lang = ref<'en' | 'km'>('en');

const dictionary = {
  en: {
    title: "Help & Documentation",
    subtitle: "Choose a topic below to learn more about how the system works.",
    api: { 
      title: "API Integration Guide", 
      desc: "Learn how the frontend communicates with the Spring Boot backend, complete with real code examples and JSON data structures." 
    },
    flow: { 
      title: "Operational Flowchart", 
      desc: "A highly visual, step-by-step flowchart showing how an order moves from the customer all the way to the kitchen and the table." 
    }
  },
  km: {
    title: "មជ្ឈមណ្ឌលជំនួយ និងឯកសារ",
    subtitle: "ជ្រើសរើសប្រធានបទឯកសារខាងក្រោមដើម្បីស្វែងយល់បន្ថែមអំពីប្រព័ន្ធ។",
    api: { 
      title: "ឯកសារភ្ជាប់ API (API Guide)", 
      desc: "ស្វែងយល់ពីរបៀបដែល Frontend ទំនាក់ទំនងជាមួយ Spring Boot backend ព្រមទាំងមានឧទាហរណ៍កូដនិងទិន្នន័យ JSON ជាក់ស្តែង។" 
    },
    flow: { 
      title: "លំហូរប្រតិបត្តិការប្រព័ន្ធ", 
      desc: "គំនូសបំព្រួញបង្ហាញមួយជំហានម្តងៗយ៉ាងច្បាស់ អំពីរបៀបដែលការបញ្ជាទិញចេញពីអតិថិជនទៅកាន់ផ្ទះបាយ និងរហូតដល់ការបម្រើជូនភ្ញៀវ។" 
    }
  }
};

const t = computed(() => dictionary[lang.value]);
</script>
