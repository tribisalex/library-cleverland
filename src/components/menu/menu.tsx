import React, { useState } from 'react';
import classNames from 'classnames';

import { MenuViewEnum } from '../../constants/menu-view';
import { sortingBy } from '../../store/books';
import { getBookList, getSortBy } from '../../store/books/selectors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSortMethod } from '../../store/search';
import { searchSelector } from '../../store/search/selectors';
import { Button } from '../button';
import { DropdownSort } from '../dropdown-sort';
import { Search } from '../search';

import actionIcon from './assets/Icon_Action.png';
import displayList from './assets/icon-line.svg';
import displayListActive from './assets/icon-line-active.svg';
import displayWindow from './assets/icon-square.svg';
import displayWindowActive from './assets/icon-square-active.svg';

import styles from './menu.module.scss';

export type MenyProps = {
    menuView: MenuViewEnum;
    setMenuView: (onChangeText: MenuViewEnum) => void;
    onBookingCheck: () => void;
};

export const Menu = ({ menuView, setMenuView, onBookingCheck }: MenyProps) => {
    const [isSearhView, setSearhView] = useState(true);
    const bookList = useAppSelector(getBookList);
    const { isSortedByRatingDesc, isSortedByAuthorDesc, isSortedByNameDesc, method } =
        useAppSelector(searchSelector);
    const [checked, setChecked] = useState(false);
    const [viewList, setViewList] = useState(false);
    const dispatch = useAppDispatch();

    const options = [
        { value: 'byRating', label: 'По рейтингу' },
        { value: 'byAuthor', label: 'По автору' },
        { value: 'byName', label: 'По названию' },
    ];

    const cleanSort = () => {
        dispatch(sortingBy(''));
        dispatch(setSortMethod(''));
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
                        <div className={styles.display}>
                            <div className={classNames(styles.displayCheck)}>
                                <div className={classNames(styles.checkBlock)}>
                                    <input
                                        className={classNames(styles.check)}
                                        type='checkbox'
                                        id='booking'
                                        checked={checked}
                                        onClick={onBookingCheck}
                                        onChange={() => setChecked(!checked)}
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
                    {method !== '' && (
                        <div className={classNames(styles.showSortMethod)}>
                            <span className={classNames(styles.showSortText)}>
                                По
                                {method === 'byRating'
                                    ? isSortedByRatingDesc
                                        ? ' снижению рейтинга'
                                        : ' возрастанию рейтинга'
                                    : method === 'byName'
                                    ? isSortedByNameDesc
                                        ? ' убыванию названия'
                                        : ' возрастанию названия'
                                    : method === 'byAuthor'
                                    ? isSortedByAuthorDesc
                                        ? ' убыванию автора'
                                        : ' возрастанию автора'
                                    : null}
                            </span>
                            <span
                                className={classNames(styles.iconAction)}
                                role='presentation'
                                onKeyDown={() => cleanSort()}
                                onClick={() => cleanSort()}
                            >
                                <img src={actionIcon} width='15x' height='15px' alt='icon action' />
                            </span>
                        </div>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};
