import { createSSRApp } from "vue";
import uviewPlus from "uview-plus";
import "uview-plus/index.scss";
import {createPinia} from'pinia';
import App from "./App.vue";

export function createApp() {
  const app = createSSRApp(App);

  const store = createPinia();

  app.use(uviewPlus);
  app.use(store);
  return {
    app,
  };
}
