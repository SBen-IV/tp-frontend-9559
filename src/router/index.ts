import { createRouter, createWebHistory, type Router } from "vue-router";

import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Register from "../views/Register.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/register", component: Register },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
