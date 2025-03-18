import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { Document } from "mongoose";

declare global {
    namespace Express {
      export interface Request {
        user?: Document & InstanceType<typeof User>;
      }
    }
  }

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(400).json({ code: 400, message: "Vui lòng gửi kèm token!" });
            return;
        }

        const token: string = authHeader.split(" ")[1];

        const user = await User.findOne({ token, deleted: false }).select("-password");

        if (!user) {
            res.status(400).json({ code: 400, message: "Token không hợp lệ!" });
            return;
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(500).json({ code: 500, message: "Lỗi server!"});
    }
};
