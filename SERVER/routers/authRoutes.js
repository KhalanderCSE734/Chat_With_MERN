import express from 'express';

import { signup, login, logOut, checkAuthorisation, updateProfile } from '../controllers/authController.js';

import { userAuth } from  '../middlewares/jwtAuth.js';


import { getUser } from '../controllers/userController.js';


const router = express.Router();




router.post('/signup',signup);
router.post('/login',login);
router.post('/logOut',logOut);
router.put('/updateProfile',userAuth,updateProfile);


router.get('/authCheck',userAuth,checkAuthorisation);


router.get('/getUser',userAuth,getUser);


export default router;