import React from 'react';
import './App.css';
import { BookList } from './components/BookList';
import { store } from './store'
import { Provider } from 'react-redux'
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import { BookEditor } from './components/BookEditor';

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <BookList />,
        },
        {
            path: '/BookEditor',
            element: <BookEditor />,
        },
    ]);
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

export default App;