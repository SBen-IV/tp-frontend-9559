import { createApp } from "vue";
import "./styles/globals.css";
import App from "./App.vue";
import router from "./router/index";
import { globalCookiesConfig } from "vue3-cookies";

globalCookiesConfig({
  expireTimes: "7d",
  path: "/",
  domain: "",
  secure: true,
  sameSite: "None",
});

createApp(App).use(router).mount("#app");

