import {
  render, screen, waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { BookEditor } from './components/BookEditor';
import { Book, BooksService } from './generated';
import { store } from './store';

jest.setTimeout(10000);
const waitForOptions = { timeout: 3000 };
const user = userEvent.setup();

describe('書籍管理画面のテスト', () => {

  test('トップページが初期表示される', () => {
    render(<App />);

    const form_link = screen.getByText('新規登録フォームへ');
    expect(form_link).toBeInTheDocument();
  });

  test('トップページに一覧データが0件で取得される', async () => {
    render(<App />);

    const progressbar = await screen.findByRole('progressbar');
    await waitForElementToBeRemoved(progressbar, waitForOptions);

    const no_books = await screen.findByText('書籍はありません');
    expect(no_books).toBeInTheDocument();
  });

  test('新規登録画面に遷移できる', async () => {
    render(<App />);

    const progressbar = await screen.findByRole('progressbar');
    await waitForElementToBeRemoved(progressbar, waitForOptions);

    const no_books = await screen.findByText('書籍はありません');
    expect(no_books).toBeInTheDocument();

    const form_link = screen.getByText('新規登録フォームへ');
    await user.click(form_link);

    const submit = await screen.findByText('登録・更新');
    expect(submit).toBeInTheDocument();
  });

  test('新規登録後に一覧に反映される', async () => {
    render(<App />);

    // 既にURLは遷移ずみ
    const submit = await screen.findByText('登録・更新');
    expect(submit).toBeInTheDocument();

    const title = await screen.findByRole('textbox', { name: '書籍名' });
    const author = await screen.findByRole('textbox', { name: '著者' });
    await user.type(title, '書籍名あああ');
    await user.type(author, '著者いいい');
    await user.click(submit);
    await waitForElementToBeRemoved(submit, waitForOptions);

    const progressbar = await screen.findByRole('progressbar');
    await waitForElementToBeRemoved(progressbar, waitForOptions);

    const title_data = await screen.findByText(/書籍名あああ/);
    const author_data = await screen.findByText(/著者いいい/);
    expect(title_data).toBeInTheDocument();
    expect(author_data).toBeInTheDocument();
  });

  test('編集できる', async () => {
    render(<App />);

    const progressbar = await screen.findByRole('progressbar');
    await waitForElementToBeRemoved(progressbar, waitForOptions);

    const edits = screen.getAllByText('編集');
    await user.click(edits.slice(-1)[0]);

    const submit = await screen.findByText('登録・更新');
    expect(submit).toBeInTheDocument();

    const title = await screen.findByRole('textbox', { name: '書籍名' });
    const author = await screen.findByRole('textbox', { name: '著者' });
    await user.type(title, '追加あああ');
    await user.type(author, '追加いいい');
    await user.click(submit);
    await waitForElementToBeRemoved(submit, waitForOptions);

    const progressbar_2 = await screen.findByRole('progressbar');
    await waitForElementToBeRemoved(progressbar_2, waitForOptions);

    const title_data = await screen.findByText(/書籍名あああ追加あああ/);
    const author_data = await screen.findByText(/著者いいい追加いいい/);
    expect(title_data).toBeInTheDocument();
    expect(author_data).toBeInTheDocument();
  });

  test('削除できる', async () => {
    render(<App />);

    const progressbar = await screen.findByRole('progressbar');
    await waitForElementToBeRemoved(progressbar, waitForOptions);

    const edits = screen.getAllByText('削除');
    await user.click(edits.slice(-1)[0]);

    const progressbar_2 = await screen.findByRole('progressbar');
    await waitForElementToBeRemoved(progressbar_2, waitForOptions);

    const no_books = await screen.findByText('書籍はありません');
    expect(no_books).toBeInTheDocument();
  });

});

describe('書籍管理画面のテスト（mock版）', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('トップページに一覧データが0件で取得される', async () => {
    const spy = jest.spyOn(BooksService.prototype, 'listupBooks');
    spy.mockResolvedValueOnce([]);
    render(<App />);

    const form_link = screen.getByText('新規登録フォームへ');
    expect(form_link).toBeInTheDocument();

    const no_books = await screen.findByText('書籍はありません');
    expect(no_books).toBeInTheDocument();

    expect(spy).toHaveBeenCalled();
  });

  test('トップページに一覧データが1件で取得される', async () => {
    const spy = jest.spyOn(BooksService.prototype, 'listupBooks');
    spy.mockResolvedValueOnce(
      [{ id: 0, title: 'abc', author: 'def' }]);
    render(<App />);

    const title_data = await screen.findByText(/abc/);
    expect(title_data).toBeInTheDocument();

    expect(spy).toHaveBeenCalled();
  });


  test('新規登録画面に遷移できる', async () => {
    const spy = jest.spyOn(BooksService.prototype, 'listupBooks');
    spy.mockResolvedValueOnce([]);
    render(<App />);

    const no_books = await screen.findByText('書籍はありません');
    expect(no_books).toBeInTheDocument();

    const form_link = screen.getByText('新規登録フォームへ');
    await user.click(form_link);

    const submit = await screen.findByText('登録・更新');
    expect(submit).toBeInTheDocument();
  });

  test('新規登録できる', async () => {
    const spy = jest.spyOn(BooksService.prototype, 'createBook');
    const book: Book = {
      id: 123,
      title: '書籍名あああ',
      author: '著者いいい',
    };
    spy.mockResolvedValueOnce(book);
    render(<App />);

    // 既にURLは遷移ずみ
    const submit = await screen.findByText('登録・更新');
    expect(submit).toBeInTheDocument();

    const title = await screen.findByRole('textbox', { name: '書籍名' });
    const author = await screen.findByRole('textbox', { name: '著者' });
    await user.type(title, book.title);
    await user.type(author, book.author);
    await user.click(submit);

    expect(spy).toHaveBeenCalledWith({
      title: book.title,
      author: book.author,
    });
  });

  test('編集できる', async () => {
    const spy = jest.spyOn(BooksService.prototype, 'updateBook');
    const book: Book = {
      id: 123,
      title: '書籍名あああ',
      author: '著者いいい',
    };
    const route = {
      pathname: '/BookEditor',
      state: book,
    };
    render(
      <MemoryRouter initialEntries={[route]}>
        <Provider store={store}>
          <BookEditor />
        </Provider>
      </MemoryRouter>
    );

    // 既にURLは遷移ずみ
    const submit = await screen.findByText('登録・更新');
    expect(submit).toBeInTheDocument();

    const title = await screen.findByRole('textbox', { name: '書籍名' });
    const author = await screen.findByRole('textbox', { name: '著者' });
    await user.type(title, '追記あああ');
    await user.type(author, '追記いいい');
    await user.click(submit);

    expect(spy).toHaveBeenCalledWith(
      123, {
      title: '書籍名あああ追記あああ',
      author: '著者いいい追記いいい',
    });
  });

});
