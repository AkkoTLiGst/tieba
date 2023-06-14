import { createSSRApp } from "vue";
import uviewPlus from "uview-plus";
import "uview-plus/index.scss";
import {createPinia} from'pinia';
import App from "./App.vue";
import { createUnistorage } from 'pinia-plugin-unistorage'
import * as Pinia from 'pinia'

export function createApp() {
  const app = createSSRApp(App);

  const store = Pinia.createPinia();
  store.use(createUnistorage());

  app.use(uviewPlus);
  app.use(store);
  return {
    app,
    Pinia
  };
}
