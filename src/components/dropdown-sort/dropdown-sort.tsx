import React, { MouseEvent,useEffect, useState } from 'react';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    setSortByAuthorMethod,
    setSortByNameMethod,
    setSortByRatingMethod,
    setSortMethod,
} from '../../store/search';
import { searchSelector } from '../../store/search/selectors';

import arrow from './assets/arrow.svg';
import sortAsc from './assets/sort-asc.svg';
import sortDesc from './assets/sort-desc.svg';

import styles from './dropdown-sort.module.scss';

export type DropdownSortProps = {
    options: Array<{ value: string; label: string }>;
    isSearhView: boolean;
};

export const DropdownSort = ({ options, isSearhView }: DropdownSortProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useAppDispatch();
    const { isSortedByRatingDesc, isSortedByAuthorDesc, isSortedByNameDesc } =
        useAppSelector(searchSelector);

    const handleSort = (e: any) => {
        if (e.target.textContent === 'По рейтингу') {
            dispatch(setSortMethod('byRating'));
            dispatch(setSortByRatingMethod());
        }
        if (e.target.textContent === 'По автору') {
            dispatch(setSortMethod('byAuthor'));
            dispatch(setSortByAuthorMethod());
        }
        if (e.target.textContent === 'По названию') {
            dispatch(setSortMethod('byName'));
            dispatch(setSortByNameMethod());
        }
    };

    useEffect(() => {
        const handler = () => setShowMenu(false);

        document.addEventListener('click', handler);

        return () => {
            document.removeEventListener('click', handler);
        };
    }, [showMenu]);

    const handleInputClick = (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    return (
        <div className={classNames(styles.dropdownContainer, showMenu && styles.active)}>
            <div
                className={classNames(styles.dropdownInput)}
                role='presentation'
                onKeyDown={handleInputClick}
                onClick={handleInputClick}
            >
                <div className={classNames(styles.dropdownSelectedValue)}>Сортировка</div>
                <div className={classNames(styles.dropdownTools)}>
                    <div className={classNames(styles.dropdownTool)}>
                        <img src={arrow} width='15x' height='15px' alt='icon-sort' />
                    </div>
                </div>
            </div>
            {showMenu && (
                <div className={classNames(styles.dropdownMenu)}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            role='presentation'
                            onClick={handleSort}
                            className={classNames(styles.dropdownItem)}
                        >
                            {option.label}
                            {option.value === 'byRating' && (
                                <img
                                    src={isSortedByRatingDesc ? sortDesc : sortAsc}
                                    alt='icon-sort'
                                />
                            )}
                            {option.value === 'byAuthor' && (
                                <img
                                    src={isSortedByAuthorDesc ? sortDesc : sortAsc}
                                    alt='icon-sort'
                                />
                            )}
                            {option.value === 'byName' && (
                                <img
                                    src={isSortedByNameDesc ? sortDesc : sortAsc}
                                    alt='icon-sort'
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
