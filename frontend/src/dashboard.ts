import { createApp } from 'vue';
import Dashboard from './components/Dashboard.vue';

const app = createApp(Dashboard);
// The invites panel lives inside Dashboard; mount once the shell is ready.
app.mount('#app');
