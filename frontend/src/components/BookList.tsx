import {
    Box, Button, Card, CardActions, CardContent,
    CircularProgress, SxProps, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Book } from '../generated';
import { AppDispatch, RootState } from '../store';
import {
    deleteBookByIdAction,
    getBooksAction
} from '../store/booksSlice';

export const BookList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const books = useSelector((state: RootState) => state.booksSlice.books);
    const lodaingCounter = useSelector((state: RootState) => state.booksSlice.lodaingCounter);
    const [prepare, setPrepare] = useState<boolean>(false);

    const getBooks = async () => {
        dispatch(getBooksAction());
    };
    const deleteBookById = async (id: number) => {
        dispatch(deleteBookByIdAction(id));
    };

    const editBook = (book: Book) => {
        navigate('/BookEditor', { state: book });
    };

    useEffect(() => {
        setPrepare(false);
        getBooks();
    }, []);

    useEffect(() => {
        if (lodaingCounter > 0) {
            setPrepare(true);
        }
    }, [lodaingCounter]);

    return (
        <Box sx={sx.container}>
            <Button variant='contained' color='success' disabled={lodaingCounter > 0}
                component={Link} to='/BookEditor'>新規登録フォームへ</Button>
            {!(prepare && lodaingCounter === 0)
                ? <CircularProgress sx={{ alignSelf: 'center' }} color='success' />
                : (books.length === 0
                    ? <Typography variant='body1'
                        sx={{ alignSelf: 'center' }}>書籍はありません</Typography>
                    : books.map((book) => (
                        <Card key={book.id} sx={sx.bookCard}>
                            <CardContent sx={sx.bookCardContent}>
                                <Typography variant='body2' color='text.secondary'>
                                    id : {book.id}
                                </Typography>
                                <Typography variant='body1'>
                                    title : {book.title}
                                </Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    author : {book.author}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant='outlined' color='error' size='small' disabled={lodaingCounter > 0}
                                    onClick={() => { deleteBookById(book.id!) }}>削除</Button>
                                <Button variant='outlined' color='success' size='small' disabled={lodaingCounter > 0}
                                    onClick={() => { editBook(book) }}>編集</Button>
                            </CardActions>
                        </Card>
                    )))}
        </Box>
    );
};

const sx: { [key: string]: SxProps } = {
    container: {
        margin: 0,
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    bookCard: {
        backgroundColor: 'bisque',
    },
    bookCardContent: {
        paddingBottom: 0,
    },
};
