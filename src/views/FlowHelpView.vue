<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-12 font-sans flex flex-col items-center">
    
    <!-- Language Toggle -->
    <div class="w-full max-w-6xl flex justify-end mb-8 relative z-50">
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
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">{{ t.title }}</h1>
      <p class="text-xl text-slate-600 dark:text-slate-400">{{ t.subtitle }}</p>
    </div>

    <!-- Full Visual Flowchart -->
    <div class="w-full max-w-4xl relative flex flex-col items-center pb-24">
      
      <!-- ================= LEVEL 1: DUAL ENTRY ================= -->
      <div class="flex flex-col md:flex-row justify-between w-full items-center gap-8 md:gap-16 relative z-10">
        
        <!-- CUSTOMER BOOKING CARD -->
        <div class="flex-1 flex flex-col items-center w-full">
          <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border-t-8 border-emerald-500 w-full flex-1 flex flex-col items-center text-center transform transition duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div class="bg-emerald-100 dark:bg-emerald-900/50 p-5 rounded-full mb-4">
              <svg class="w-12 h-12 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">{{ t.customer.title }}</h2>
            <p class="text-slate-600 dark:text-slate-400 text-base">{{ t.customer.desc }}</p>
          </div>
        </div>

        <!-- POS STAFF CARD -->
        <div class="flex-1 flex flex-col items-center w-full">
          <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border-t-8 border-blue-500 w-full flex-1 flex flex-col items-center text-center transform transition duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div class="bg-blue-100 dark:bg-blue-900/50 p-5 rounded-full mb-4">
              <svg class="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">{{ t.staff.title }}</h2>
            <p class="text-slate-600 dark:text-slate-400 text-base">{{ t.staff.desc }}</p>
          </div>
        </div>

      </div>

      <!-- ARROWS POINTING TO SYSTEM -->
      <div class="hidden md:block relative h-24 w-full z-0 my-[-20px]">
        <!-- Left Arrow -->
        <svg class="absolute top-0 left-[25%] w-[25%] h-full text-slate-300 dark:text-slate-600" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M 50 0 C 50 50, 100 50, 100 100" fill="transparent" stroke="currentColor" stroke-width="3" stroke-dasharray="6 6" />
          <polygon points="95,90 105,90 100,100" fill="currentColor" />
        </svg>
        <!-- Right Arrow -->
        <svg class="absolute top-0 right-[25%] w-[25%] h-full text-slate-300 dark:text-slate-600" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M 50 0 C 50 50, 0 50, 0 100" fill="transparent" stroke="currentColor" stroke-width="3" stroke-dasharray="6 6" />
          <polygon points="5,90 -5,90 0,100" fill="currentColor" />
        </svg>
      </div>
      
      <!-- Mobile Fallback Arrow -->
      <div class="block md:hidden flex justify-center py-6 text-slate-300 dark:text-slate-600">
         <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </div>

      <!-- ================= LEVEL 2: CENTRAL SYSTEM ================= -->
      <div class="w-full max-w-lg z-10">
        <div class="bg-indigo-600 text-white p-8 rounded-3xl shadow-2xl border-4 border-indigo-400 text-center transform transition duration-500 hover:scale-105">
           <div class="bg-indigo-500 p-4 inline-block rounded-full mb-4 ring-8 ring-indigo-500/50">
              <svg class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
           </div>
           <h2 class="text-2xl font-black mb-2">{{ t.system.title }}</h2>
           <p class="text-indigo-100 text-base">{{ t.system.desc }}</p>
        </div>
      </div>

      <!-- DOWN ARROW -->
      <div class="flex justify-center py-6 text-slate-300 dark:text-slate-600 z-0">
         <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </div>

      <!-- ================= LEVEL 3: KITCHEN ================= -->
      <div class="w-full max-w-lg z-10">
        <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border-t-8 border-orange-500 text-center transform transition duration-500 hover:scale-105">
           <div class="bg-orange-100 dark:bg-orange-900/50 p-4 inline-block rounded-full mb-4">
              <svg class="w-12 h-12 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
              </svg>
           </div>
           <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">{{ t.kitchen.title }}</h2>
           <p class="text-slate-600 dark:text-slate-400 text-base">{{ t.kitchen.desc }}</p>
        </div>
      </div>

      <!-- DOWN ARROW -->
      <div class="flex justify-center py-6 text-slate-300 dark:text-slate-600 z-0">
         <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </div>

      <!-- ================= LEVEL 4: READY NOTIFICATION ================= -->
      <div class="w-full max-w-lg z-10">
        <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border-t-8 border-teal-500 text-center transform transition duration-500 hover:scale-105">
           <div class="bg-teal-100 dark:bg-teal-900/50 p-4 inline-block rounded-full mb-4 relative">
              <svg class="w-12 h-12 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <!-- Bouncing indicator -->
              <div class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-bounce"></div>
           </div>
           <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">{{ t.ready.title }}</h2>
           <p class="text-slate-600 dark:text-slate-400 text-base">{{ t.ready.desc }}</p>
        </div>
      </div>

      <!-- DOWN ARROW -->
      <div class="flex justify-center py-6 text-slate-300 dark:text-slate-600 z-0">
         <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </div>

      <!-- ================= LEVEL 5: COMPLETE ================= -->
      <div class="w-full max-w-lg z-10">
        <div class="bg-slate-900 dark:bg-slate-950 text-white p-8 rounded-3xl shadow-2xl border-t-8 border-purple-500 text-center transform transition duration-500 hover:-translate-y-2 ring-1 ring-slate-800">
           <div class="bg-purple-500 p-4 inline-block rounded-full mb-4 ring-8 ring-purple-500/30">
              <svg class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
           </div>
           <h2 class="text-2xl font-black mb-2 text-white">{{ t.complete.title }}</h2>
           <p class="text-slate-300 text-base">{{ t.complete.desc }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const lang = ref<'en' | 'km'>('en');

const dictionary = {
  en: {
    title: "Complete Order Flow",
    subtitle: "A step-by-step visual map of how an order moves through the entire restaurant system.",
    customer: { 
      title: "Customer Booking", 
      desc: "Customer places order via mobile app or self-service kiosk." 
    },
    staff: { 
      title: "POS Staff", 
      desc: "Staff inputs order manually using the POS terminal for walk-ins." 
    },
    system: { 
      title: "Central Order System", 
      desc: "Both sources instantly merge into a single unified order queue." 
    },
    kitchen: { 
      title: "Kitchen Display (KDS)", 
      desc: "Chef sees the new order pop up in real-time and starts cooking." 
    },
    ready: { 
      title: "Order Ready!", 
      desc: "Chef marks food as ready. Waiter tracking screen flashes a notification." 
    },
    complete: { 
      title: "Serve & Complete", 
      desc: "Waiter serves the hot food to the customer and closes the ticket." 
    }
  },
  km: {
    title: "លំហូរការបញ្ជាទិញពេញលេញ",
    subtitle: "ផែនទីបង្ហាញពីដំណើរការមួយជំហានម្តងៗនៃការបញ្ជាទិញទូទាំងប្រព័ន្ធភោជនីយដ្ឋាន។",
    customer: { 
      title: "ការកក់របស់អតិថិជន", 
      desc: "អតិថិជនបញ្ជាទិញតាមកម្មវិធីទូរស័ព្ទ ឬកន្លែងកុម្ម៉ង់ដោយខ្លួនឯង (Kiosk)។" 
    },
    staff: { 
      title: "បុគ្គលិក POS", 
      desc: "បុគ្គលិកបញ្ចូលការបញ្ជាទិញដោយផ្ទាល់តាមរយៈម៉ាស៊ីន POS សម្រាប់ភ្ញៀវផ្ទាល់។" 
    },
    system: { 
      title: "ប្រព័ន្ធបញ្ជាទិញកណ្តាល", 
      desc: "ការបញ្ជាទិញពីប្រភពទាំងពីរត្រូវបានបញ្ចូលគ្នាទៅក្នុងបញ្ជីរង់ចាំតែមួយ។" 
    },
    kitchen: { 
      title: "អេក្រង់ផ្ទះបាយ (KDS)", 
      desc: "ការបញ្ជាទិញលោតលើអេក្រង់ផ្ទះបាយភ្លាមៗ ហើយចុងភៅចាប់ផ្តើមចម្អិន។" 
    },
    ready: { 
      title: "រួចរាល់ហើយ!", 
      desc: "ចុងភៅចុចរួចរាល់។ អេក្រង់អ្នករត់តុលោតសារជូនដំណឹងភ្លាមៗ។" 
    },
    complete: { 
      title: "បម្រើ និងបញ្ចប់", 
      desc: "អ្នករត់តុយកអាហារក្តៅៗទៅជូនអតិថិជន ហើយបញ្ចប់វិក្កយបត្រ។" 
    }
  }
};

const t = computed(() => dictionary[lang.value]);
</script>
