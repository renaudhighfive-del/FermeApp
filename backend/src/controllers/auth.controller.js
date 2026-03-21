import { loginUser, getMe } from '../services/auth.service.js'



export async function login(req, res, next) {
  try {
    const result = await loginUser(req.body ?? {});
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }	
}


export async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user.userId

    const user = await getMe(userId)

    return res.status(200).json(user)

  } catch (error) {
    return next(error)
  }
}



