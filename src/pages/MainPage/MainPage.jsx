import './MainPage.scss';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux'
import { setUser } from '@/store/slices/userSlice';

import { getCookie, setCookie } from '@/helpers/main';

import { api } from '@/api/main';
import { Notificator } from '@/common/main'


export default function MainPage() {
    const token = getCookie('token');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) navigate('/');

        else {
            const fetchInfo = async () => {
                try {
                    let resp = await api.get('/auth');

                    dispatch(setUser({
                        ...resp.data.data.attributes,
                        id: resp.data.data.id
                    }));

                } catch (error) {
                    let error_msg = error.message;

                    if (error.response) {
                        const { title, detail } = error.response.data.errors;
                        console.error(title, detail, error);
                        error_msg = detail;
                    }

                    Notificator.error(error_msg);

                    setCookie('token', '', 0);
                    setCookie('refresh_token', '', 0);

                    navigate('/');
                }

            }
            fetchInfo();
        }

    }, [token])

return (
    <div className="main-page">
        MAIN PAGE
    </div>
)
}