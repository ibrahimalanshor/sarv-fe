import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref(null);
    const me = ref({});
    const isLoggedIn = ref(false);

    async function login(data) {
      token.value = data.token;
      me.value = data.me;
      isLoggedIn.value = true;
    }
    async function logout() {
      token.value = null;
      me.value = null;
      isLoggedIn.value = false;
      localStorage.clear();
    }
    async function setMe(value) {
      me.value = value;
    }

    return { token, me, setMe, isLoggedIn, login, logout };
  },
  { persist: true }
);
