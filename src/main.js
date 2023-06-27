import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { setupStore } from './store/setup';
import { setupRouter } from './router/setup';
import { useDynamicLayout } from './plugins/dynamic-layout';

const app = createApp(App);

useDynamicLayout(app);

setupStore(app);
setupRouter(app);

app.mount('#app');
