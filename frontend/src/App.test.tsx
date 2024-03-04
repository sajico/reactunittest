import {
  render, screen, waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from './App';
import { BooksService } from './generated';

describe('書籍管理画面のテスト', () => {

  // jest.setTimeout(10000);
  const waitForOptions = undefined; // { timeout: 3000 };
  const user = userEvent.setup();

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
    await act(async () => { await user.click(form_link); });

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
    await act(async () => {
      await user.type(title, '書籍名あああ');
      await user.type(author, '著者いいい');
      await user.click(submit);
    });
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
    await act(async () => { await user.click(edits.slice(-1)[0]); });

    const submit = await screen.findByText('登録・更新');
    expect(submit).toBeInTheDocument();

    const title = await screen.findByRole('textbox', { name: '書籍名' });
    const author = await screen.findByRole('textbox', { name: '著者' });
    await act(async () => {
      await user.type(title, '追加あああ');
      await user.type(author, '追加いいい');
      await user.click(submit);
    });
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
    await act(async () => { await user.click(edits.slice(-1)[0]); });

    const progressbar_2 = await screen.findByRole('progressbar');
    await waitForElementToBeRemoved(progressbar_2, waitForOptions);

    const no_books = await screen.findByText('書籍はありません');
    expect(no_books).toBeInTheDocument();
  });

});

describe('書籍管理画面のテスト（mock版）', () => {
  const spy = jest.spyOn(BooksService.prototype, 'listupBooks');

  test('トップページが初期表示される', () => {
    spy.mockResolvedValueOnce(
      [{ "id": 0, "title": "abc", "author": "def" }]);
    render(<App />);

    const form_link = screen.getByText('新規登録フォームへ');
    expect(form_link).toBeInTheDocument();
  });

  test('トップページに一覧データが1件で取得される', async () => {
    spy.mockResolvedValueOnce(
      [{ "id": 0, "title": "abc", "author": "def" }]);
    render(<App />);

    const title_data = await screen.findByText(/abc/);
    expect(title_data).toBeInTheDocument();

    expect(spy).toHaveBeenCalled();
  });
});
