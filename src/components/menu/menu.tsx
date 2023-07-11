import React, { useState } from 'react';
import classNames from 'classnames';

import { MenuViewEnum } from '../../constants/menu-view';
import { getBookList } from '../../store/books/selectors';
import { useAppSelector } from '../../store/hooks';
import { Button } from '../button';
import { DropdownSort } from '../dropdown-sort';
import { Search } from '../search';

import displayList from './assets/icon-line.svg';
import displayListActive from './assets/icon-line-active.svg';
import displayWindow from './assets/icon-square.svg';
import displayWindowActive from './assets/icon-square-active.svg';

import styles from './menu.module.scss';

export type MenyProps = {
    menuView: MenuViewEnum;
    setMenuView: (onChangeText: MenuViewEnum) => void;
};

export const Menu = ({ menuView, setMenuView }: MenyProps) => {
    const [isSearhView, setSearhView] = useState(true);
    const bookList = useAppSelector(getBookList);
    const [checked, setChecked] = useState(false);
    const [viewList, setViewList] = useState(false);

    const options = [
        { value: 'byRating', label: 'По рейтингу' },
        { value: 'byAuthor', label: 'По автору' },
        { value: 'byName', label: 'По названию' },
    ];

    const handleChangeCheck = () => {
        setChecked(!checked);
    };

    return (
        <div className={classNames(styles.menu, !isSearhView && styles.menuSearh)}>
            {bookList && (
                <React.Fragment>
                    <div
                        className={classNames(
                            styles.searchSortBlock,
                            !isSearhView && styles.searchSortBlockNoGap,
                        )}
                    >
                        <Search isSearhView={isSearhView} setSearhView={setSearhView} />

                        <DropdownSort options={options} isSearhView={isSearhView} />
                    </div>
                    {isSearhView && (
                        <div className={styles.display} style={{ border: '2px solid red' }}>
                            <div className={classNames(styles.displayCheck)}>
                                <div>
                                    <input
                                        className={classNames(styles.check)}
                                        type='checkbox'
                                        id='booking'
                                        checked={checked}
                                        onChange={handleChangeCheck}
                                    />
                                    <label htmlFor='booking'>Скрыть бронь</label>
                                </div>
                                {viewList ? (
                                    <Button
                                        classButton={classNames(
                                            styles.buttonDisplay,
                                            menuView === MenuViewEnum.window &&
                                                styles.buttonDisplayActive,
                                        )}
                                        onClick={() => {
                                            setMenuView(MenuViewEnum.window);
                                            setViewList(false);
                                        }}
                                        dataTestId='button-menu-view-window'
                                    >
                                        <img
                                            src={
                                                menuView === MenuViewEnum.window
                                                    ? displayWindowActive
                                                    : displayWindow
                                            }
                                            alt='icon-window'
                                        />
                                    </Button>
                                ) : (
                                    <Button
                                        classButton={classNames(
                                            styles.buttonDisplay,
                                            menuView === MenuViewEnum.list &&
                                                styles.buttonDisplayActive,
                                        )}
                                        onClick={() => {
                                            setMenuView(MenuViewEnum.list);
                                            setViewList(true);
                                        }}
                                        dataTestId='button-menu-view-list'
                                    >
                                        <img
                                            src={
                                                menuView === MenuViewEnum.list
                                                    ? displayListActive
                                                    : displayList
                                            }
                                            alt='icon-list'
                                        />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};
