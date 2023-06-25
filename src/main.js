import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { setupStore } from './store/setup';

const app = createApp(App);

setupStore(app);

app.mount('#app');
