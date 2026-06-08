import { ref } from 'vue';
import { api } from '../../utils/api';

export interface UserRole {
  id: number;
  roleName: string;
}

export function useRoles() {
  const roles = ref<UserRole[]>([]);
  const loading = ref(true);

  const fetchRoles = async () => {
    loading.value = true;
    try {
      const res = await api.get<any>('/roles');
      if (res.status === 1) {
        roles.value = res.data;
      }
    } catch (e) {
      console.error('Failed to fetch roles:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    roles,
    loading,
    fetchRoles
  };
}
