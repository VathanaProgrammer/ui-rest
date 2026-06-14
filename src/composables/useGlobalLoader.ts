import { ref } from 'vue';

const isLoading = ref(false);
const activeRequests = ref(0);

export const showLoader = () => {
  activeRequests.value++;
  isLoading.value = true;
};

export const hideLoader = () => {
  activeRequests.value--;
  if (activeRequests.value <= 0) {
    activeRequests.value = 0;
    isLoading.value = false;
  }
};

export const useGlobalLoader = () => {
  return {
    isLoading
  };
};
