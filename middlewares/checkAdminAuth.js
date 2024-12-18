import jwt from 'jsonwebtoken'
import AdminModel from '../models/AdminModel.js'

var checkAdminAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]

      // Verify Token
      const { id } = jwt.verify(token, process.env.JWT_SECRET);

      // Get User from Token
      req.admin = await AdminModel.findById(id);

      next()
    } catch (error) {
      console.log(error)
      res.status(401).send({ "status": "failed", "message": "Unauthorized Admin" })
    }
  }
  if (!token) {
    res.status(401).send({ "status": "failed", "message": "Unauthorized Admin, No Token" })
  }
}

export default checkAdminAuth