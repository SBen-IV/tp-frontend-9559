import { createApp } from "vue";
import "./styles/globals.css";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import { globalCookiesConfig } from "vue3-cookies";

globalCookiesConfig({
  expireTimes: "7d",
  path: "/",
  domain: "",
  secure: true,
  sameSite: "None",
});

const pinia = createPinia();
createApp(App).use(router).use(pinia).mount("#app");
