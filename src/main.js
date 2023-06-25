import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { setupStore } from './store/setup';
import { setupRouter } from './router/setup';

const app = createApp(App);

setupStore(app);
setupRouter(app);

app.mount('#app');
