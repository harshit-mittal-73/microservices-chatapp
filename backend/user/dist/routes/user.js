import express from 'express';
import { loginUser, verifyUser, myProfile, updateName, getAllUsers, getAUser } from '../controllers/user.js';
import { isAuth } from '../middleware/isAuth.js';
const router = express.Router();
router.post('/login', loginUser);
router.post('/verify', verifyUser);
router.get('/me', isAuth, myProfile);
router.post('/update/user', isAuth, updateName);
router.get('/user/all', isAuth, getAllUsers);
router.get('/user/:id', getAUser);
export default router;
//# sourceMappingURL=user.js.map