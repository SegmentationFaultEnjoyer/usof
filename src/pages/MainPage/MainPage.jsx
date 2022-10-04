import './MainPage.scss';

import { useEffect, useRef, useState } from 'react';
import CookieConsent from 'react-cookie-consent';

import { getCookie } from '@/helpers';

import { api } from '@/api';



import { useUserInfo } from '@/hooks';
import { TriangleLoader, Modal, Notificator } from '@/common';

import { NavBar, PostsList } from '@/components';

export default function MainPage() {
    const { isLoading, getUserInfo } = useUserInfo();
   
    useEffect(getUserInfo, []);

    console.log('render main');

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
        <>
            <NavBar />
            <PostsList />
            <CookieConsent
                containerClasses='slide-top'
                style={{ background: "var(--primary-main)" }}
                buttonStyle={{ 
                    backgroundColor: "var(--secondary-main)", 
                    color: "var(--tertiary-main)",
                    borderRadius: "5px" }}>
                This website uses cookies to enhance the user experience.
            </CookieConsent>
        </>}
    </section>
)
}