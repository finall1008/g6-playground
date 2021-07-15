import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import Nav from "./components/Nav.vue";
import FinallTest1 from "./components/FinallTest1.vue";

// vue-router 规则
const routes = [
  { path: "/", component: Nav },
  { path: "/final-test-1/", component: FinallTest1 },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createApp(App)
  .use(router)
  .mount("#app");
