import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validationPipe } from '../middleware/validation.pipe';
import { SignupDto, LoginDto } from '../dtos/auth.dto';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

router.post('/signup', validationPipe(SignupDto), AuthController.signup);
router.post('/login', validationPipe(LoginDto), AuthController.login);

export default router; 