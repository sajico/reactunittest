import { Box, Button, SxProps, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createOrUpdateBookAction } from '../store/booksSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { Book } from '../generated';

export const BookEditor = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const book = location.state as Book;
    const lodaingCounter = useSelector((state: RootState) => state.booksSlice.lodaingCounter);
    const [id, setId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [submit, setSubmit] = useState<boolean>(false);

    useEffect(() => {
        if (book !== null) {
            setId(book.id + '');
            setTitle(book.title + '');
            setAuthor(book.author + '');
        }
    }, [book]);

    useEffect(() => {
        if (submit && lodaingCounter === 0) {
            setSubmit(false);
            navigate(-1);
        }
    }, [lodaingCounter]);

    const createOrUpdateBook = async () => {
        setSubmit(true);
        dispatch(createOrUpdateBookAction({ title, author }, id));
    };

    const clearId = () => {
        setId('');
    };

    return (
        <Box sx={sx.container}>
            <form>
                <TextField id='id' label='id' variant='outlined' sx={sx.formTextInput} value={id}
                    fullWidth InputLabelProps={{ shrink: true }} inputProps={{ readOnly: true }} disabled />
                <TextField id='title' label='書籍名' variant='outlined' sx={sx.formTextInput} value={title}
                    fullWidth InputLabelProps={{ shrink: true }} required onChange={e => setTitle(e.target.value)} />
                <TextField id='author' label='著者' variant='outlined' sx={sx.formTextInput} value={author}
                    fullWidth InputLabelProps={{ shrink: true }} required onChange={e => setAuthor(e.target.value)} />
                <Button variant='contained' color='success' sx={sx.formButton} disabled={lodaingCounter > 0}
                    onClick={() => navigate(-1)}>戻る</Button>
                <Button variant='contained' color='primary' sx={sx.formButton} disabled={lodaingCounter > 0}
                    onClick={() => clearId()}>IDクリア</Button>
                <Button variant='contained' color='warning' sx={sx.formButton} disabled={lodaingCounter > 0}
                    onClick={() => createOrUpdateBook()}>登録・更新</Button>
            </form>
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
    formTextInput: {
        marginBottom: 1,
    },
    formButton: {
        marginTop: 1,
        marginRight: 2,
    },
};