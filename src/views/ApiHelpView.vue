<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
    <div class="max-w-5xl mx-auto space-y-8">
      
      <!-- Language Toggle -->
      <div class="flex justify-end">
        <div class="inline-flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 shadow-inner border border-slate-300 dark:border-slate-700">
          <button 
            @click="lang = 'en'"
            :class="['px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200', lang === 'en' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white']"
          >
            English
          </button>
          <button 
            @click="lang = 'km'"
            :class="['px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200', lang === 'km' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white']"
          >
            ភាសាខ្មែរ
          </button>
        </div>
      </div>

      <!-- Header -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <div class="flex items-center space-x-4 mb-4">
          <div class="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{{ t.header.title }}</h1>
        </div>
        <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {{ t.header.desc }}
        </p>
      </div>

      <!-- Beginner Concepts Section -->
      <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-800/50 overflow-hidden">
        <div class="border-b border-indigo-100 dark:border-indigo-800/50 px-6 py-4 bg-indigo-100/50 dark:bg-indigo-800/30">
          <h2 class="text-xl font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            {{ t.beginner.title }}
          </h2>
        </div>
        <div class="p-6 space-y-8">
          
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-3 text-indigo-600 dark:text-indigo-400">{{ t.beginner.base_url_title }}</h3>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed" v-html="t.beginner.base_url_desc"></p>
            <div class="mt-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg font-mono text-sm border border-slate-200 dark:border-slate-700">
              <span class="text-slate-500">// .env file</span><br>
              <span class="text-blue-600 dark:text-blue-400">VITE_API_BASE_URL</span>=<span class="text-green-600 dark:text-green-400">http://localhost:7444/api</span>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-3 text-indigo-600 dark:text-indigo-400">{{ t.beginner.interceptor_title }}</h3>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed" v-html="t.beginner.interceptor_desc"></p>
          </div>
        </div>
      </div>

      <!-- NEW: Real-World Scenarios -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div class="border-b border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <svg class="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            {{ t.realWorld.title }}
          </h2>
        </div>
        
        <div class="p-6 space-y-12">
          
          <!-- Scenario 1: User List -->
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-3">{{ t.realWorld.s1Title }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm mb-4">{{ t.realWorld.s1Desc }}</p>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- Code -->
              <div class="rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-700">
                <div class="px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
                  <span class="text-xs text-gray-400 font-mono">UserList.vue</span>
                </div>
                <pre class="p-4 overflow-x-auto text-sm font-mono text-gray-300">
<span class="text-pink-400">const</span> fetchUsers = <span class="text-pink-400">async</span> () => {
  <span class="text-pink-400">try</span> {
    <span class="text-gray-500">// Your backend returns a List&lt;RestUser&gt; directly</span>
    <span class="text-pink-400">const</span> response = <span class="text-pink-400">await</span> api.<span class="text-blue-400">get</span>(<span class="text-green-400">'/user/getAllUsers'</span>);
    
    <span class="text-gray-500">// The 'api' wrapper automatically extracts Axios response.data</span>
    users.value = response;
  } <span class="text-pink-400">catch</span> (err) {
    console.<span class="text-blue-400">error</span>(err);
  }
};</pre>
              </div>
              
              <!-- JSON Response -->
              <div class="rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-inner">
                <div class="px-4 py-2 bg-slate-800 border-b border-slate-700">
                  <span class="text-xs text-emerald-400 font-mono font-semibold">JSON Response (Real Data Example)</span>
                </div>
                <pre class="p-4 overflow-x-auto text-sm font-mono text-slate-300">
[
  { 
    <span class="text-blue-400">"id"</span>: <span class="text-purple-400">1</span>, 
    <span class="text-blue-400">"employeeId"</span>: <span class="text-green-400">"EMP001"</span>,
    <span class="text-blue-400">"fullName"</span>: <span class="text-green-400">"Sok San"</span>,
    <span class="text-blue-400">"currentStatus"</span>: <span class="text-green-400">"ACTIVE"</span>,
    <span class="text-blue-400">"role"</span>: { <span class="text-blue-400">"id"</span>: <span class="text-purple-400">1</span>, <span class="text-blue-400">"roleName"</span>: <span class="text-green-400">"ADMIN"</span> }
  },
  { 
    <span class="text-blue-400">"id"</span>: <span class="text-purple-400">2</span>, 
    <span class="text-blue-400">"employeeId"</span>: <span class="text-green-400">"EMP002"</span>,
    <span class="text-blue-400">"fullName"</span>: <span class="text-green-400">"Bopha Devi"</span>,
    <span class="text-blue-400">"currentStatus"</span>: <span class="text-green-400">"ACTIVE"</span>,
    <span class="text-blue-400">"role"</span>: { <span class="text-blue-400">"id"</span>: <span class="text-purple-400">2</span>, <span class="text-blue-400">"roleName"</span>: <span class="text-green-400">"CASHIER"</span> }
  }
]</pre>
              </div>
            </div>
          </div>

          <!-- Scenario 2: Get By ID with Vue Router -->
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-3">{{ t.realWorld.s2Title }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm mb-4" v-html="t.realWorld.s2Desc"></p>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- Code -->
              <div class="rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-700">
                <div class="px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
                  <span class="text-xs text-gray-400 font-mono">UserDetail.vue</span>
                </div>
                <pre class="p-4 overflow-x-auto text-sm font-mono text-gray-300">
<span class="text-pink-400">import</span> { useRoute } <span class="text-pink-400">from</span> <span class="text-green-400">'vue-router'</span>;
<span class="text-pink-400">import</span> { api } <span class="text-pink-400">from</span> <span class="text-green-400">'@/utils/api'</span>;

<span class="text-pink-400">const</span> route = <span class="text-blue-400">useRoute</span>();
<span class="text-pink-400">const</span> userId = route.params.id; <span class="text-gray-500">// ex: '1'</span>

<span class="text-pink-400">const</span> fetchSingleUser = <span class="text-pink-400">async</span> () => {
  <span class="text-pink-400">try</span> {
    <span class="text-gray-500">// Dynamic Routing: GET /user/1</span>
    <span class="text-pink-400">const</span> user = <span class="text-pink-400">await</span> api.<span class="text-blue-400">get</span>(<span class="text-green-400">`/user/${userId}`</span>);
    currentUser.value = user;
  } <span class="text-pink-400">catch</span> (err) {
    console.<span class="text-blue-400">error</span>(<span class="text-green-400">'User not found'</span>);
  }
};</pre>
              </div>

              <!-- JSON Response -->
              <div class="rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-inner">
                <div class="px-4 py-2 bg-slate-800 border-b border-slate-700">
                  <span class="text-xs text-emerald-400 font-mono font-semibold">JSON Response</span>
                </div>
                <pre class="p-4 overflow-x-auto text-sm font-mono text-slate-300">
{ 
  <span class="text-blue-400">"id"</span>: <span class="text-purple-400">1</span>, 
  <span class="text-blue-400">"employeeId"</span>: <span class="text-green-400">"EMP001"</span>,
  <span class="text-blue-400">"fullName"</span>: <span class="text-green-400">"Sok San"</span>,
  <span class="text-blue-400">"emailAddress"</span>: <span class="text-green-400">"soksan@email.com"</span>,
  <span class="text-blue-400">"avatarUrl"</span>: <span class="text-green-400">"/assets/avatars/default-avatar.png"</span>,
  <span class="text-blue-400">"role"</span>: { 
    <span class="text-blue-400">"id"</span>: <span class="text-purple-400">1</span>, 
    <span class="text-blue-400">"roleName"</span>: <span class="text-green-400">"ADMIN"</span> 
  }
}</pre>
              </div>
            </div>
          </div>

          <!-- Scenario 3: Roles for Select Input -->
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-3">{{ t.realWorld.s3Title }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm mb-4">{{ t.realWorld.s3Desc }}</p>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- Code -->
              <div class="rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-700 flex flex-col">
                <div class="px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
                  <span class="text-xs text-gray-400 font-mono">RoleSelectForm.vue</span>
                </div>
                <pre class="p-4 overflow-x-auto text-sm font-mono text-gray-300 flex-1">
<span class="text-gray-500">&lt;!-- Vue Template --&gt;</span>
<span class="text-pink-400">&lt;select</span> <span class="text-yellow-300">v-model</span>=<span class="text-green-400">"selectedRole"</span><span class="text-pink-400">&gt;</span>
  <span class="text-pink-400">&lt;option</span> <span class="text-yellow-300">v-for</span>=<span class="text-green-400">"role in rolesList"</span> <span class="text-yellow-300">:key</span>=<span class="text-green-400">"role.id"</span> <span class="text-yellow-300">:value</span>=<span class="text-green-400">"role.id"</span><span class="text-pink-400">&gt;</span>
    &#123;&#123; role.roleName &#125;&#125;
  <span class="text-pink-400">&lt;/option&gt;</span>
<span class="text-pink-400">&lt;/select&gt;</span>

<span class="text-pink-400">&lt;script setup&gt;</span>
<span class="text-pink-400">const</span> rolesList = <span class="text-blue-400">ref</span>([]);
<span class="text-pink-400">const</span> selectedRole = <span class="text-blue-400">ref</span>(<span class="text-purple-400">null</span>);

<span class="text-blue-400">onMounted</span>(<span class="text-pink-400">async</span> () => {
  <span class="text-pink-400">const</span> res = <span class="text-pink-400">await</span> api.<span class="text-blue-400">get</span>(<span class="text-green-400">'/roles'</span>);
  rolesList.value = res.data; 
});
<span class="text-pink-400">&lt;/script&gt;</span></pre>
              </div>

              <!-- JSON Response -->
              <div class="rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-inner flex flex-col">
                <div class="px-4 py-2 bg-slate-800 border-b border-slate-700">
                  <span class="text-xs text-emerald-400 font-mono font-semibold">JSON Response</span>
                </div>
                <pre class="p-4 overflow-x-auto text-sm font-mono text-slate-300 flex-1">
[
  { <span class="text-blue-400">"id"</span>: <span class="text-purple-400">1</span>, <span class="text-blue-400">"roleName"</span>: <span class="text-green-400">"ADMIN"</span> },
  { <span class="text-blue-400">"id"</span>: <span class="text-purple-400">2</span>, <span class="text-blue-400">"roleName"</span>: <span class="text-green-400">"MANAGER"</span> },
  { <span class="text-blue-400">"id"</span>: <span class="text-purple-400">3</span>, <span class="text-blue-400">"roleName"</span>: <span class="text-green-400">"CASHIER"</span> }
]</pre>
              </div>
            </div>
          </div>
          
          <!-- Scenario 4: Categories -->
          <div class="mt-10">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-3">{{ t.realWorld.s4Title }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm mb-4">{{ t.realWorld.s4Desc }}</p>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- Code -->
              <div class="rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-700 flex flex-col">
                <div class="px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
                  <span class="text-xs text-gray-400 font-mono">CategoryList.vue</span>
                </div>
                <pre class="p-4 overflow-x-auto text-sm font-mono text-gray-300 flex-1">
<span class="text-pink-400">const</span> categories = <span class="text-blue-400">ref</span>([]);

<span class="text-blue-400">onMounted</span>(<span class="text-pink-400">async</span> () => {
  <span class="text-gray-500">// Fetch from /categories endpoint</span>
  <span class="text-pink-400">const</span> res = <span class="text-pink-400">await</span> api.<span class="text-blue-400">get</span>(<span class="text-green-400">'/categories'</span>);
  
  <span class="text-gray-500">// Extract the 'data' array from ApiResponse</span>
  categories.value = res.data.data; 
});</pre>
              </div>

              <!-- JSON Response -->
              <div class="rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-inner flex flex-col">
                <div class="px-4 py-2 bg-slate-800 border-b border-slate-700">
                  <span class="text-xs text-emerald-400 font-mono font-semibold">ApiResponse JSON</span>
                </div>
                <pre class="p-4 overflow-x-auto text-sm font-mono text-slate-300 flex-1">
{
  <span class="text-blue-400">"status"</span>: <span class="text-purple-400">1</span>,
  <span class="text-blue-400">"message"</span>: <span class="text-green-400">"Success"</span>,
  <span class="text-blue-400">"data"</span>: [
    { <span class="text-blue-400">"id"</span>: <span class="text-purple-400">1</span>, <span class="text-blue-400">"categoryName"</span>: <span class="text-green-400">"Appetizers"</span>, <span class="text-blue-400">"isActive"</span>: <span class="text-purple-400">true</span> },
    { <span class="text-blue-400">"id"</span>: <span class="text-purple-400">2</span>, <span class="text-blue-400">"categoryName"</span>: <span class="text-green-400">"Main Course"</span>, <span class="text-blue-400">"isActive"</span>: <span class="text-purple-400">true</span> }
  ]
}</pre>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <!-- Advanced Examples (Simplified Container) -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div class="border-b border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white">{{ t.advanced.title }}</h2>
        </div>
        
        <div class="p-6 space-y-10">
          <div>
            <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-3">{{ t.advanced.s2Title }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm mb-4">{{ t.advanced.s2Desc }}</p>
            <div class="rounded-xl overflow-hidden bg-[#1e1e1e]">
              <pre class="p-4 overflow-x-auto text-sm font-mono text-gray-300">
<span class="text-gray-500">// {{ t.advanced.s2CodeComment1 }}</span>
<span class="text-pink-400">const</span> newOrder = <span class="text-pink-400">await</span> api.<span class="text-blue-400">post</span>(<span class="text-green-400">'/orders'</span>, {
  itemId: <span class="text-purple-400">42</span>,
  quantity: <span class="text-purple-400">2</span>
});</pre>
            </div>
          </div>
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
    header: {
      title: 'API Client Documentation',
      desc: 'A powerful, generic, and highly reusable Axios wrapper designed for our Vue application.'
    },
    beginner: {
      title: "Beginner Concepts",
      base_url_title: "Where is the data coming from?",
      base_url_desc: "The API client connects to <code>http://localhost:7444/api</code>. You can change this in your <code>.env</code> file via <code>VITE_API_BASE_URL</code>.",
      interceptor_title: "What is an Interceptor?",
      interceptor_desc: "It acts as a security guard, automatically catching 401 (Unauthorized) errors and attaching session cookies securely."
    },
    realWorld: {
      title: "Real-World Scenarios",
      s1Title: "1. Fetching a User List",
      s1Desc: "When fetching a list, the backend returns an array of User objects directly. Notice how we assign the response straight to the variable since the API client automatically extracts the data payload.",
      s2Title: "2. Fetching by ID using Vue Router",
      s2Desc: "Often, you navigate to a page like <code>/users/1</code>. You can extract the `1` using Vue Router's <code>useRoute()</code> and inject it directly into the `/user/${userId}` URL.",
      s3Title: "3. Fetching Roles for a Dropdown Select",
      s3Desc: "A very common task in admin panels is fetching a list of roles (RestUserRole) to populate a <code>&lt;select&gt;</code> input in a form.",
      s4Title: "4. Fetching Categories (ApiResponse Wrapper)",
      s4Desc: "When fetching from `/categories`, the response uses our custom `ApiResponse` wrapper. You must access `res.data.data` to get the actual array of categories."
    },
    advanced: {
      title: 'Advanced Usage',
      s2Title: 'Creating & Updating (POST, PUT)',
      s2Desc: 'Sending data is easy. Pass the payload as the second argument.',
      s2CodeComment1: 'Create a new order (POST)',
    }
  },
  km: {
    header: {
      title: 'ឯកសារអំពី API Client',
      desc: 'ឧបករណ៍ជំនួយ Axios ដែលមានអនុភាព និងអាចប្រើឡើងវិញបានច្រើនដងសម្រាប់កម្មវិធី Vue របស់យើង។'
    },
    beginner: {
      title: "គោលគំនិតសម្រាប់អ្នកចាប់ផ្តើម",
      base_url_title: "តើទិន្នន័យបានមកពីណា?",
      base_url_desc: "API client ភ្ជាប់ទៅកាន់ <code>http://localhost:7444/api</code>។ អ្នកអាចប្តូរវានៅក្នុងឯកសារ <code>.env</code> តាមរយៈ <code>VITE_API_BASE_URL</code>។",
      interceptor_title: "តើអ្វីទៅជា Interceptor?",
      interceptor_desc: "វាប្រៀបដូចជាសន្តិសុខ ដែលចាប់កំហុស 401 ដោយស្វ័យប្រវត្តិ និងភ្ជាប់ Session cookies ដើម្បីសុវត្ថិភាព។"
    },
    realWorld: {
      title: "សេណារីយ៉ូប្រើប្រាស់ជាក់ស្តែង",
      s1Title: "១. ការទាញយកបញ្ជីអ្នកប្រើប្រាស់ (User List)",
      s1Desc: "នៅពេលទាញយកទិន្នន័យបញ្ជី Backend ផ្តល់ត្រលប់មកវិញនូវ Array ផ្ទាល់តែម្តង។ សូមសង្កេតមើលរបៀបដែលយើងកំណត់ response ទៅកាន់អថេរដោយផ្ទាល់ ព្រោះ API client បានទាញយក data payload ដោយស្វ័យប្រវត្តិរួចទៅហើយ។",
      s2Title: "២. ការទាញយកតាម ID ដោយប្រើ Vue Router",
      s2Desc: "ជាញឹកញាប់ អ្នកចូលទៅកាន់ទំព័រដូចជា <code>/users/1</code>។ អ្នកអាចទាញយកលេខ `1` នោះតាមរយៈ <code>useRoute()</code> របស់ Vue Router ហើយយកវាទៅភ្ជាប់ជាមួយ API `/user/${userId}`។",
      s3Title: "៣. ការទាញយកតួនាទី (Roles) សម្រាប់ Dropdown Select",
      s3Desc: "កិច្ចការទូទៅមួយនៅក្នុងផ្ទាំង Admin គឺការទាញយកបញ្ជីតួនាទី (RestUserRole) ដើម្បីបង្ហាញនៅក្នុង <code>&lt;select&gt;</code> input។",
      s4Title: "៤. ការទាញយកប្រភេទមុខម្ហូប (Categories - ApiResponse)",
      s4Desc: "នៅពេលទាញយកពី `/categories` ការឆ្លើយតបប្រើប្រាស់ `ApiResponse` wrapper របស់យើង។ អ្នកត្រូវប្រើ `res.data.data` ដើម្បីទទួលបានបញ្ជីពិតប្រាកដ។"
    },
    advanced: {
      title: 'ការប្រើប្រាស់កម្រិតខ្ពស់',
      s2Title: 'ការបង្កើត និងកែប្រែទិន្នន័យ (POST, PUT)',
      s2Desc: 'ការបញ្ជូនទិន្នន័យគឺងាយស្រួលណាស់។ គ្រាន់តែដាក់ payload ជាប៉ារ៉ាម៉ែត្រទីពីរ។',
      s2CodeComment1: 'បង្កើតការបញ្ជាទិញថ្មី (POST)',
    }
  }
};

const t = computed(() => dictionary[lang.value]);
</script>
