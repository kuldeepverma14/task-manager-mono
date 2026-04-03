import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', taskController.getTasks);
router.post('/', taskController.create);
router.get('/:id', taskController.getOne);
router.patch('/:id', taskController.update);
router.delete('/:id', taskController.remove);
router.patch('/:id/toggle', taskController.toggle);

export default router;
