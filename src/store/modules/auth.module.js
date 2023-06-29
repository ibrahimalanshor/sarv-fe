import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref(null);
    const me = ref(null);
    const isLoggedIn = ref(false);

    async function login(data) {
      token.value = data.token;
      me.value = data.me;
      isLoggedIn.value = true;
    }

    return { me, isLoggedIn, login };
  },
  { persist: true }
);
