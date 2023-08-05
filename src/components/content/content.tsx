import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import { BOOKS_URL } from '../../constants/api';
import { MenuViewEnum } from '../../constants/menu-view';
import { NAV_MENU_ALL } from '../../constants/nav-menu-list';
import {
    bookListPaginationRequest,
    bookListPaginationRequestClean,
    sortingBy,
} from '../../store/books';
import { getBookCategories, getBookList, getBookListIsAll } from '../../store/books/selectors';
import { BookListItem } from '../../store/books/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { searchSelector } from '../../store/search/selectors';
import { Card } from '../card';

import styles from './content.module.scss';

type ContentProps = {
    menuView: string;
    checkBooking: boolean;
};

export const Content = ({ menuView, checkBooking }: ContentProps) => {
    const [data, setData] = useState<BookListItem[] | null>(null);
    const [activeCategory, setActiveCategory] = useState('');
    const dispatch = useAppDispatch();
    const { category } = useParams();
    const bookList = useAppSelector(getBookList);
    const bookCategories = useAppSelector(getBookCategories);
    const isAllDownloaded = useAppSelector(getBookListIsAll);
    const { filter, isSortedByRatingDesc, isSortedByAuthorDesc, isSortedByNameDesc, method } =
        useAppSelector(searchSelector);
    const [currentPage, setCurrentPage] = useState(1);

    const listClassName = classNames(
        menuView === MenuViewEnum.window ? styles.viewWindow : styles.viewList,
    );

    useEffect(() => {
        dispatch(bookListPaginationRequestClean());
    }, [dispatch]);

    useEffect(() => {
        bookCategories?.forEach(({ name, path }) => {
            if (path === category) {
                setActiveCategory(name);
            }
        });
    }, [category, bookCategories]);

    const getBookListPagination = () => {
        const filters = category === NAV_MENU_ALL.category ? '' : `${BOOKS_URL.filters}${category}`;

        dispatch(
            bookListPaginationRequest(
                `${BOOKS_URL.paginationPage}${currentPage}${BOOKS_URL.pageSize}${filters}`,
            ),
        );
    };

    useEffect(() => {
        const scrollHandler = (event: any) => {
            const { innerHeight } = window;
            const { scrollTop } = event.target.documentElement;
            const { offsetHeight } = event.target.documentElement;

            if (scrollTop + innerHeight >= offsetHeight - 50 && !isAllDownloaded) {
                setCurrentPage((currentPage: number) => currentPage + 1);
            }
        };

        document.addEventListener('scroll', scrollHandler);

        return () => {
            document.removeEventListener('scroll', scrollHandler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAllDownloaded]);

    useEffect(() => {
        getBookListPagination();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    useEffect(() => {
        if (category !== activeCategory) {
            dispatch(bookListPaginationRequestClean());

            if (currentPage === 1) {
                getBookListPagination();
            } else {
                setCurrentPage(1);
            }
        }

        setActiveCategory(category as string);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, activeCategory, dispatch]);

    useEffect(() => {
        if (bookList) {
            const searchResult =
                filter.length > 0
                    ? bookList.filter(({ title }) => title.toLowerCase().includes(filter))
                    : bookList;

            const sortedByRating = [...searchResult].sort((a, b) =>
                isSortedByRatingDesc ? b.rating - a.rating : a.rating - b.rating,
            );

            const sortedByAuthor = isSortedByAuthorDesc
                ? [...searchResult].sort((a, b) => {
                      if (a.authors > b.authors) {
                          return 1;
                      }
                      if (a.authors < b.authors) {
                          return -1;
                      }

                      return 0;
                  })
                : [...searchResult].sort((a, b) => {
                      if (b.authors > a.authors) {
                          return 1;
                      }
                      if (b.authors < a.authors) {
                          return -1;
                      }

                      return 0;
                  });

            const sortedByName = isSortedByNameDesc
                ? [...searchResult].sort((a, b) => {
                      if (a.title > b.title) {
                          return 1;
                      }
                      if (a.title < b.title) {
                          return -1;
                      }

                      return 0;
                  })
                : [...searchResult].sort((a, b) => {
                      if (b.title > a.title) {
                          return 1;
                      }
                      if (b.title < a.title) {
                          return -1;
                      }

                      return 0;
                  });

            if (method === 'byRating') {
                setData(sortedByRating);
                dispatch(sortingBy('byRating'));
            } else if (method === 'byAuthor') {
                setData(sortedByAuthor);
                dispatch(sortingBy('byAuthor'));
            } else if (method === 'byName') {
                setData(sortedByName);
                dispatch(sortingBy('byName'));
            } else {
                setData(sortedByRating);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filter,
        bookList,
        isSortedByRatingDesc,
        isSortedByAuthorDesc,
        isSortedByNameDesc,
        method,
        activeCategory,
    ]);

    return (
        <main data-test-id='content'>
            {bookList &&
                bookCategories &&
                (data && data.length === 0 ? (
                    filter ? (
                        <div
                            className={styles.emptyDataText}
                            data-test-id='search-result-not-found'
                        >
                            По запросу ничего не найдено
                        </div>
                    ) : (
                        <div className={styles.emptyDataText} data-test-id='empty-category'>
                            В этой категории книг ещё нет
                        </div>
                    )
                ) : (
                    <ul
                        className={classNames(
                            menuView === MenuViewEnum.window ? styles.viewWindow : styles.viewList,
                            listClassName,
                        )}
                        data-test-id='cards-list'
                    >
                        {data
                            ?.filter((book) => (checkBooking ? book.booking === null : book))
                            .map((book) => (
                                <Card data={book} key={book.id} menuView={menuView} />
                            ))}
                    </ul>
                ))}
        </main>
    );
};
