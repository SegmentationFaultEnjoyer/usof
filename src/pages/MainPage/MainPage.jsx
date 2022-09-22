import './MainPage.scss';

import { useEffect, useRef, useState } from 'react';

import { getCookie } from '@/helpers/main';

import { api } from '@/api/main';
import { Notificator } from '@/common/main';

import { useUserInfo } from '@/hooks/main';
import { TriangleLoader, Modal } from '@/common/main';

import NavBar from '@/components/NavBar/NavBar';


export default function MainPage() {
    const { isLoading, getUserInfo } = useUserInfo();
   
    useEffect(getUserInfo, []);

    // const modalRef = useRef(null);
    // const [isModalShown, setIsModalShown] = useState(false);

    // const modalExample = <Modal
    // ref={modalRef}
    // isShown={isModalShown}
    // setIsShown={setIsModalShown}
    // >
    //     <p>modal contains</p>
    // </Modal>

return (
    <section className="main-page">
        {isLoading ? 
        <div className="main-page__loader-container">
            <p>Loading...</p>
            <TriangleLoader /> 
        </div>
       : 
        <div>
            <NavBar />
        </div>}
    </section>
)
}