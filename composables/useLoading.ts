import { ref } from 'vue';

export const useLoading = () => {
  const isLoading = ref(false);
  const loadingMessage = ref('');

  const start = (message = 'Chargement...') => {
    isLoading.value = true;
    loadingMessage.value = message;
  };

  const finish = () => {
    isLoading.value = false;
    loadingMessage.value = '';
  };

  return {
    isLoading,
    loadingMessage,
    start,
    finish
  };
};

export default useLoading;
