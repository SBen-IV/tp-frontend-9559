import { createRouter, createWebHistory, type Router } from "vue-router";

import Home from "../views/Home.vue";
import About from "../views/About.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
