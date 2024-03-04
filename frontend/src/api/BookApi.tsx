import { BookApiClient } from '../generated';

// https://github.com/ferdikoomen/openapi-typescript-codegen/issues/477
const bookApiClientOption = { HEADERS: { accept: 'text/plain' } };
export const bookApi = new BookApiClient(bookApiClientOption);