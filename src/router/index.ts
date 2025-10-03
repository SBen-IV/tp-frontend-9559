import { createRouter, createWebHistory, type Router } from "vue-router";

import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Register from "../views/Register.vue";
import NewChange from "../views/NewChange.vue";
import Login from "../views/Login.vue";
import NotFound from "../views/NotFound.vue";
import NewConfigurationItem from "../views/NewConfigurationItem.vue";
import ConfigurationItem from "@/views/ConfigurationItem.vue";
import { useAuthStore } from "@/stores/auth";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  { path: "/config-items", component: ConfigurationItem },
  { path: "/config-items/new", component: NewConfigurationItem },
  { path: "/changes/new", component: NewChange },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (authRequired && !auth.isLoggedIn) {
    auth.returnUrl = to.fullPath;
    return "/login";
  }
});

export default router;
