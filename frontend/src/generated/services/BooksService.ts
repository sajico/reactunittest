/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Book } from '../models/Book';
import type { StoreBook } from '../models/StoreBook';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class BooksService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * 書籍リスト取得
     * 全書籍のリストを絞り込みなしで取得します。
     * @returns Book 書籍リストを正常に取得しました。
     * @throws ApiError
     */
    public listupBooks(): CancelablePromise<Array<Book>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/books',
        });
    }

    /**
     * 書籍登録
     * 書籍を登録し登録後の書籍を取得します。
     * @param requestBody StoreBook
     * @returns Book 書籍を正常に登録しました。
     * @throws ApiError
     */
    public createBook(
        requestBody?: StoreBook,
    ): CancelablePromise<Book> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/books',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * 書籍取得
     * 書籍を取得します。
     * @param id
     * @returns Book 書籍を正常に取得しました。
     * @throws ApiError
     */
    public getBook(
        id: number,
    ): CancelablePromise<Book> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/books/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `取得対象の書籍が存在しません。`,
            },
        });
    }

    /**
     * 書籍更新
     * 書籍を更新し更新後の書籍を取得します。
     * @param id
     * @param requestBody StoreBook
     * @returns Book 書籍を正常に更新しました。
     * @throws ApiError
     */
    public updateBook(
        id: number,
        requestBody?: StoreBook,
    ): CancelablePromise<Array<Book>> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/books/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `更新対象の書籍が存在しません。`,
            },
        });
    }

    /**
     * 書籍削除
     * 書籍を削除します。
     * @param id
     * @returns Book 書籍を正常に削除しました。
     * @throws ApiError
     */
    public deleteBook(
        id: number,
    ): CancelablePromise<Array<Book>> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/books/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `削除対象の書籍が存在しません。`,
            },
        });
    }

}
