<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../utils/api';
import Skeleton from '../components/ui/Skeleton.vue';

const currentShift = ref<any>(null);
const startingCash = ref<number>(0);
const actualCash = ref<number>(0);
const notes = ref<string>('');
const loading = ref(false);
const initialLoad = ref(true);

const fetchCurrentShift = async () => {
    initialLoad.value = true;
    try {
        const res = await api.get<any>('/shifts/current');
        if (res.status === 1 && res.data) {
            currentShift.value = res.data;
        } else {
            currentShift.value = null;
        }
    } catch(err) {
        console.error(err);
    } finally {
        initialLoad.value = false;
    }
}

const clockIn = async () => {
    loading.value = true;
    try {
        const res = await api.post<any>('/shifts/clock-in', { startingCash: startingCash.value });
        if (res.status === 1) {
            currentShift.value = res.data;
        }
    } catch(err) {
        alert('Failed to clock in');
    } finally {
        loading.value = false;
    }
}

const clockOut = async () => {
    loading.value = true;
    try {
        const res = await api.put<any>('/shifts/clock-out', { actualCash: actualCash.value, notes: notes.value });
        if (res.status === 1) {
            currentShift.value = null;
            startingCash.value = 0;
            actualCash.value = 0;
            notes.value = '';
            alert('Clocked out successfully!');
        }
    } catch(err) {
        alert('Failed to clock out');
    } finally {
        loading.value = false;
    }
}

onMounted(() => fetchCurrentShift());
</script>

<template>
    <div class="shift-page">
        <h1 class="text-2xl font-bold text-white mb-6">Shift Management</h1>
        
        <div class="card p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-lg">
            <!-- Loading Skeleton -->
            <div v-if="initialLoad">
                <Skeleton class="h-6 w-48 mb-6" />
                <Skeleton class="h-4 w-40 mb-3" />
                <Skeleton class="h-12 w-full rounded-lg mb-4" />
                <Skeleton class="h-12 w-full rounded-xl" />
            </div>

            <div v-else-if="!currentShift">
                <h2 class="text-lg text-slate-200 mb-4 font-semibold">Start Your Shift</h2>
                <div class="mb-4">
                    <label class="block text-slate-400 text-sm mb-2">Starting Cash Drawer ($)</label>
                    <input v-model="startingCash" type="number" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
                </div>
                <button @click="clockIn" :disabled="loading" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-colors">
                    Clock In
                </button>
            </div>

            <div v-else>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-lg text-emerald-400 font-semibold">Shift In Progress</h2>
                    <span class="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">Started: {{ new Date(currentShift.clockInTime).toLocaleTimeString() }}</span>
                </div>
                
                <div class="mb-4">
                    <label class="block text-slate-400 text-sm mb-2">Actual Cash at End of Shift ($)</label>
                    <input v-model="actualCash" type="number" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
                </div>
                <div class="mb-6">
                    <label class="block text-slate-400 text-sm mb-2">Shift Notes (Discrepancies, incidents, etc.)</label>
                    <textarea v-model="notes" rows="3" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></textarea>
                </div>
                <button @click="clockOut" :disabled="loading" class="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl transition-colors">
                    Clock Out & End Shift
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.shift-page {
    padding: 2rem;
    min-height: 100vh;
    background: #0b1120;
}
</style>
