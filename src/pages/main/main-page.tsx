import { useState } from 'react';

import { Content } from '../../components/content';
import { Menu } from '../../components/menu';
import { MenuViewEnum } from '../../constants/menu-view';

import styles from './main-page.module.scss';

export const MainPage = () => {
    const [menuView, setMenuView] = useState(MenuViewEnum.window);
    const [checkBooking, setCheckBooking] = useState(false);

    const onBookingCheck = () => {
        setCheckBooking(!checkBooking);
    };

    return (
        <section className={styles.mainPage} data-test-id='main-page'>
            <Menu menuView={menuView} setMenuView={setMenuView} onBookingCheck={onBookingCheck} />
            <Content menuView={menuView} checkBooking={checkBooking} />
        </section>
    );
};
