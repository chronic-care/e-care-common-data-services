import App from '@/app';
import ObservationsRoute from '@/routes/observations.route';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new ObservationsRoute()]);

app.listen();
