import axios from 'axios';
import { refreshTokenMiddleWare } from './middlewares/main'

let api = axios.create();

api.interceptors.request.use(refreshTokenMiddleWare);

export { api };