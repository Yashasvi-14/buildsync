import express from 'express';

import { getTestMessage } from '../controllers/testControllers';

const router=express.Router();

router.get('/', getTestMessage);

export default router;