import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '.';
import { Book, StoreBook } from '../generated';
import { bookApi } from '../api/BookApi';

export type BooksState = {
    books: Book[];
    editingBook?: Book;
    lodaingCounter: number;
    errorMessage: string;
};

const initialState: BooksState = {
    books: [],
    lodaingCounter: 0,
    errorMessage: '',
};

export const getBooksAction = () =>
    async (dispatch: AppDispatch) => {
        dispatch(increaseLoadingCounter());
        try {
            const books: Book[] = await bookApi.books.listupBooks();
            dispatch(setBooks(books));
        } catch (error) {
            dispatch(setErrorMessage('書籍一覧取得に失敗しました。'));
        }
        dispatch(decreaseLoadingCounter());
    };

export const createOrUpdateBookAction = (book: StoreBook, id: string = '') =>
    async (dispatch: AppDispatch) => {
        dispatch(increaseLoadingCounter());
        if (id === '') {
            try {
                await bookApi.books.createBook(book);
                dispatch(getBooksAction());
            } catch (error) {
                dispatch(setErrorMessage('書籍登録に失敗しました。'));
            }
        } else {
            try {
                await bookApi.books.updateBook(Number(id), book);
                dispatch(getBooksAction());
            } catch (error) {
                dispatch(setErrorMessage('書籍更新に失敗しました。'));
            }
        }
        dispatch(decreaseLoadingCounter());
    };

export const deleteBookByIdAction = (id: number) =>
    async (dispatch: AppDispatch) => {
        dispatch(increaseLoadingCounter());
        try {
            await bookApi.books.deleteBook(id);
            dispatch(getBooksAction());
        } catch (error) {
            dispatch(setErrorMessage('書籍削除に失敗しました。'));
        }
        dispatch(decreaseLoadingCounter());
    };

export const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setBooks: (state: BooksState, action: PayloadAction<Book[]>) => {
            state.books = action.payload;
        },
        setErrorMessage: (state: BooksState, action: PayloadAction<string>) => {
            state.errorMessage = action.payload;
        },
        increaseLoadingCounter: (state: BooksState, action: PayloadAction<void>) => {
            state.lodaingCounter++;
        },
        decreaseLoadingCounter: (state: BooksState, action: PayloadAction<void>) => {
            state.lodaingCounter--;
        },
    },
});

export const {
    setBooks, setErrorMessage,
    increaseLoadingCounter, decreaseLoadingCounter
} = booksSlice.actions;

export default booksSlice.reducer;