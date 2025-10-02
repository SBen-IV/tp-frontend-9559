import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";
import router from "@/router/index";

export const useAuthStore = defineStore("auth", {
  state: () => {
    const { cookies } = useCookies();
    return {
      token: cookies.get("token") || null,
      returnUrl: null,
    };
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    getToken: (state) => {
      return state.token;
    },
  },
  actions: {
    login(token: string) {
      const { cookies } = useCookies();
      cookies.set("token", token);
      this.token = token;

      router.push(this.returnUrl || "/");
    },
    logout() {
      const { cookies } = useCookies();
      cookies.remove("token");
      this.token = null;
    },
  },
});
