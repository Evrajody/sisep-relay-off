import { ref } from 'vue';

export interface Toast {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  timeout?: number;
}

export const useToast = () => {
  const toasts = ref<Toast[]>([]);
  let toastId = 0;

  const add = (toast: Omit<Toast, 'id'>) => {
    const id = ++toastId;
    const timeout = toast.timeout || 5000;
    
    const newToast: Toast = {
      id,
      title: toast.title,
      description: toast.description,
      icon: toast.icon || 'i-heroicons-information-circle',
      color: toast.color || 'blue',
    };

    toasts.value.push(newToast);

    if (timeout > 0) {
      setTimeout(() => {
        remove(id);
      }, timeout);
    }

    return id;
  };

  const remove = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clear = () => {
    toasts.value = [];
  };

  return {
    toasts,
    add,
    remove,
    clear,
  };
};

export default useToast;
