import express from 'express';


import { getUsersForSideBar, getMessages, sendMessages } from '../controllers/messageController.js';

import { userAuth } from '../middlewares/jwtAuth.js';

const router = express.Router();

router.get("/users",userAuth,getUsersForSideBar);
router.post("/send/:id",userAuth,sendMessages);
router.get("/:id",userAuth,getMessages);



export default router;