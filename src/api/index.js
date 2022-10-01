import axios from 'axios';
import { requestLockMiddleWare, refreshTokenMiddleWare, onErrorUnlockMiddleware } from './middlewares/main'

let api = axios.create();

api.interceptors.request.use(refreshTokenMiddleWare);
api.interceptors.request.use(requestLockMiddleWare);
api.interceptors.response.use(resp => resp, onErrorUnlockMiddleware)

export { api };