"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
// サーバー機能を実現する express を使う準備
const app = (0, express_1.default)();
// このサーバーは http://localhost:3001 でアクセスできるようにする
const protocol = 'http';
const host = 'localhost';
const port = 3001;
const message = 'Backend listening on '
    + `${protocol}://${host}:${port}`;
// frontendのページにこのサーバーとのデータ共有を許可する
app.use((0, cors_1.default)({
    // origin: ['http://localhost:3000','http://localhost:18512','http://localhost:5173','http://localhost:4173'],
    origin: '*',
    optionsSuccessStatus: 200
}));
// このサーバーは json でやりとりできるようにする
app.use(express_1.default.json());
// テスト用に処理時間を引き延ばす
// const sleep = (msec: number) =>
//     new Promise(resolve => setTimeout(resolve, msec));
// app.use(async (req, res, next) => {
//     await sleep(1000);
//     next();
// });
// サーバーを起動してターミナルにメッセージを出力する
app.listen(port, host, () => { console.log(message); });
// データベースの代わりにファイルを使う
const dataFilePath = './data.json';
/**
 * データベース代わりのファイルにデータを json 化して書き込む
 * @param data 書き込むデータオブジェクト
 */
const writeData = async (data) => {
    try {
        const dataText = JSON.stringify(data, null, 4);
        await promises_1.default.writeFile(dataFilePath, dataText);
    }
    catch (error) {
        console.error(error);
    }
};
/**
 * データベース代わりのファイルを読み込みオブジェクト化して返す
 * @returns 読み込んだデータオブジェクト
 */
const readData = async () => {
    let dataText = '{}';
    try {
        const dataFile = await promises_1.default.readFile(dataFilePath);
        dataText = dataFile.toString();
    }
    catch (error) {
        console.error(error);
    }
    return JSON.parse(dataText);
};
/**
 * URL          http://localhost:3000
 * Method       GET
 * Summary      動作確認用文字列を返す
 * Response     動作確認用文字列
 */
app.get('/', (req, res) => { res.send(message); });
/**
 * URL          http://localhost:3000/books
 * Method       GET
 * Summary      book を全件取得する
 * Response     bookList の json
 *              bookList が無ければ空の配列の json
 */
app.get('/books', async (req, res) => {
    const data = await readData();
    if (data.bookList && data.bookList.length > 0) {
        res.json(data.bookList);
    }
    else {
        res.json([]);
    }
});
/**
 * URL          http://localhost:3000/books
 * Method       POST
 * Summary      book を追加する
 * Request      id を除く book データの全項目
 * Response     id を含む新しく追加した book データの json
 */
app.post('/books', async (req, res) => {
    const data = await readData();
    const { title, author } = req.body;
    let book = undefined;
    if (data.bookList && data.bookList.length > 0) {
        const id = data.bookList
            .map(t => Number(t.id))
            .reduce((a, b) => a > b ? a : b) + 1;
        book = { id, title, author };
        data.bookList = [...data.bookList, book];
    }
    else {
        book = { id: 0, title, author };
        data.bookList = [book];
    }
    await writeData(data);
    res.json(book);
});
/**
 * URL          http://localhost:3000/books/:id
 * Method       GET
 * Summary      id が一致する book を取得する
 * Response     id が一致する book の json
 *              id が一致する book が無ければ
 *              HTTPステータスコード 404
 */
app.get('/books/:id', async (req, res) => {
    const data = await readData();
    const id = parseInt(req.params?.id);
    let book = undefined;
    if (data.bookList && data.bookList.length > 0) {
        book = data.bookList.find(t => t.id === id);
    }
    if (book !== undefined) {
        res.json(book);
    }
    else {
        res.sendStatus(404);
    }
});
/**
 * URL          http://localhost:3000/books/:id
 * Method       PUT
 * Summary      id が一致する book を更新する
 * Response     更新後の book の json
 *              id が一致する book が無ければ
 *              HTTPステータスコード 404
 */
app.put('/books/:id', async (req, res) => {
    const data = await readData();
    const id = parseInt(req.params?.id);
    const { title, author } = req.body;
    let book = undefined;
    if (data.bookList && data.bookList.length > 0) {
        const taskIndex = data.bookList
            .findIndex(t => t.id === id);
        if (taskIndex > -1) {
            book = {
                ...data.bookList[taskIndex],
                title, author
            };
            data.bookList[taskIndex] = book;
        }
    }
    await writeData(data);
    if (book !== undefined) {
        res.json(book);
    }
    else {
        res.sendStatus(404);
    }
});
/**
 * URL          http://localhost:3000/books/:id
 * Method       DELETE
 * Summary      id が一致する book を削除する
 * Response     削除した book の json
 *              id が一致する book が無ければ
 *              HTTPステータスコード 404
 */
app.delete('/books/:id', async (req, res) => {
    const data = await readData();
    const id = parseInt(req.params?.id);
    let book = undefined;
    if (data.bookList && data.bookList.length > 0) {
        const taskIndex = data.bookList
            .findIndex(t => t.id === id);
        if (taskIndex > -1) {
            book = data.bookList[taskIndex];
            data.bookList.splice(taskIndex, 1);
        }
    }
    await writeData(data);
    if (book !== undefined) {
        res.json(book);
    }
    else {
        res.sendStatus(404);
    }
});
