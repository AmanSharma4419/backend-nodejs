import { Router } from 'express';
import docsController from '../controllers/docs.controller';

const router = Router();

router.get('/', docsController.getDocs);

export default router; 