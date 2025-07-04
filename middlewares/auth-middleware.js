import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel.js'

var checkUserAuth = async (req, res, next) => {
  let token
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]

      // Verify Token
      const { userId, tokenInvalidBefore } = jwt.verify(token, process.env.JWT_SECRET)

      // Get User from Token
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(401).send({ "status": "failed", "message": "Unauthorized User" });
      }
      // If user's tokenInvalidBefore is set and is newer than the token's, invalidate the token
      if (user.tokenInvalidBefore && (!tokenInvalidBefore || new Date(tokenInvalidBefore) < new Date(user.tokenInvalidBefore))) {
        return res.status(401).send({ "status": "failed", "message": "Session expired. Please log in again." });
      }
      req.user = user;

      next()
    } catch (error) {
      console.log(error)
      res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
    }
  }
  if (!token) {
    res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
  }
}

export default checkUserAuth