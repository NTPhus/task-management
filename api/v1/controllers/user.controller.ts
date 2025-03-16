import { Request, Response } from "express";
import md5 from "md5";
import User from "../models/user.model";
import { generateRandomString } from "../../../helpers/generate";

export const register = async (req: Request, res: Response) => {
    
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (existEmail) {
        res.json({
            code: 400,
            message: "Email đã tồn tại!",
        });
    } else {
        req.body.password = md5(req.body.password);
        req.body.token = generateRandomString(20);
        const user = new User(req.body);
        await user.save();
        const token = user.token;
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "Tạo tài khoản thành công!",
            token: token,
        });
    }
}