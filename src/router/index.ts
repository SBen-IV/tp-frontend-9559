import { createRouter, createWebHistory, type Router } from "vue-router";

import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import NotFound from "../views/NotFound.vue";
import NewConfigurationItem from "../views/NewConfigurationItem.vue";
import ConfigurationItem from "@/views/ConfigurationItem.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  { path: "/config-items", component: ConfigurationItem },
  { path: "/config-items/new", component: NewConfigurationItem },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
