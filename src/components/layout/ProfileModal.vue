<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { X, Upload, Check, AlertCircle } from 'lucide-vue-next';
import { api } from '../../utils/api';

const props = defineProps<{
  user: any;
}>();

const emit = defineEmits(['close', 'updated']);

const displayName = ref(props.user.displayName || props.user.fullName);
const avatarFile = ref<File | null>(null);
const avatarPreviewUrl = ref(import.meta.env.VITE_API_BASE_URL.replace('/api', '') + props.user.avatarUrl);
const loading = ref(false);
const error = ref('');
const success = ref(false);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    avatarFile.value = target.files[0];
    avatarPreviewUrl.value = URL.createObjectURL(avatarFile.value);
  }
};

const triggerFileInput = () => {
  const fileInput = document.getElementById('avatar-upload');
  if (fileInput) {
    fileInput.click();
  }
};

const handleSave = async () => {
  loading.value = true;
  error.value = '';
  success.value = false;

  const formData = new FormData();
  formData.append('displayName', displayName.value);
  
  if (avatarFile.value) {
    formData.append('avatar', avatarFile.value);
  }

  try {
    const res = await api.put('/profile/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 1) {
      success.value = true;
      emit('updated', res.data); // Return updated user to Sidebar
      setTimeout(() => {
        emit('close');
      }, 1500);
    } else {
      error.value = res.message || 'Failed to update profile';
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred while updating profile';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div class="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col transform transition-all">
      
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
        <h2 class="text-xl font-bold text-white">Edit Profile</h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white transition-colors rounded-full p-1 hover:bg-slate-700">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-6">
        
        <!-- Avatar Upload Section -->
        <div class="flex flex-col items-center justify-center space-y-3">
          <div class="relative group cursor-pointer" @click="triggerFileInput">
            <img :src="avatarPreviewUrl" alt="Profile" class="w-24 h-24 rounded-full border-4 border-slate-700 object-cover shadow-lg transition-opacity group-hover:opacity-50" />
            <div class="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload class="w-6 h-6 text-white mb-1" />
              <span class="text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">Change</span>
            </div>
            <input type="file" id="avatar-upload" accept="image/*" class="hidden" @change="handleFileChange" />
          </div>
          <p class="text-xs text-slate-400">Click to upload new image</p>
        </div>

        <div class="space-y-4">
          <!-- Read-only fields -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee ID</label>
              <div class="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-400 cursor-not-allowed">
                {{ user.employeeId }}
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</label>
              <div class="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-blue-400 font-medium cursor-not-allowed">
                {{ user.role?.roleName || 'UNKNOWN' }}
              </div>
            </div>
          </div>

          <!-- Editable Display Name -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Display Name</label>
            <input 
              type="text" 
              v-model="displayName" 
              class="w-full bg-slate-900 border border-slate-600 focus:border-blue-500 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Enter your display name"
            />
          </div>
        </div>

        <!-- Feedback Messages -->
        <div v-if="error" class="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          <p>{{ error }}</p>
        </div>
        <div v-if="success" class="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
          <Check class="w-4 h-4 flex-shrink-0" />
          <p>Profile updated successfully!</p>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="handleSave" 
          :disabled="loading || (!displayName && !avatarFile)"
          class="px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>

    </div>
  </div>
</template>
