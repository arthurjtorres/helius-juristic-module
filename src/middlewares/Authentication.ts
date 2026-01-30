import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import Resp from "../utils/Response";

const secret = process.env.JWT_SECRET as string

interface MenuPermission {
  menu: string;
  permissions: string[];
}

interface JwtPayload {
  userId: string;
  userName: string;
  usertag: string;
  email: string;
  userType: string;
  clearance: string;
  moduleName: string;
  allowedMenus: MenuPermission[];
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return Resp.unauthorized('Token não fornecido');
    }
    const decoded = jwt.verify(token, secret) as JwtPayload;
    res.locals.user = decoded
    next();
  } catch (error) {
    return Resp.unauthorized('Token inválido');
  }
}

export { verifyToken };