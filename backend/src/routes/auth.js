import express from 'express'
import { getLogout, postLogin, postSignup } from '../controller/auth.js';
import upload from '../utils/multer.js';

const router = express.Router()

router.post('/signup', upload.single('image'), postSignup)
router.post('/login', postLogin);

router.get('/logout', getLogout)

export default router;