import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";
import type { User } from "@/models/users";

export const useUserStore = defineStore("user", {
  state: () => {
    const { cookies } = useCookies();
    // NOTE: There's something wrong here but it works
    const jsonUser: string | undefined = cookies.get("user");

    let parsedUser: User | null = null;
    try {
      const userString =
        typeof jsonUser === "object" ? JSON.stringify(jsonUser) : jsonUser;

      if (userString) {
        parsedUser = JSON.parse(userString) as User;
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }

    return {
      data: parsedUser,
    };
  },
  getters: {
    getData: (state) => {
      return state.data;
    },
  },
  actions: {
    set(user: User) {
      const { cookies } = useCookies();
      cookies.set("user", JSON.stringify(user));
      this.data = { ...user };
    },
    unset() {
      const { cookies } = useCookies();
      cookies.remove("user");
      this.data = null;
    },
  },
});
