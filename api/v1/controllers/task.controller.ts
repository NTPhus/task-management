import { Request, Response } from "express";

import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

export const index = async (req: Request, res: Response) => {
    //Find
    interface Find {
        deleted: boolean,
        status?: string,
        title?: RegExp,
    }

    const find: Find = {
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    //End Find

    //search
    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }
    //end search

    //Sort
    interface Sort {
        [key: string]: 1 | -1; // Use this to dynamically assign sort fields
    }

    const sort: Sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        const sortOrder = req.query.sortValue === "asc" ? 1 : -1; // Convert to 1 or -1
        sort[req.query.sortKey.toString()] = sortOrder; // It strictly requires numeric values—1 for ascending and -1 for descending.
    }
    // End Sort

    //pagination
    let initPagination = {
        currentPage: 1,
        limitItem: 2,
    };

    const countTask = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTask
    );
    //end pagination

    console.log(objectPagination)
    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip || 0);

    res.json(tasks);
}

export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;
    const task = await Task.find({
        _id: id,
        deleted: false
    });

    res.json(task);
}

export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const status: string = req.body.status;

        await Task.updateOne(
            {
                _id: id,
            },
            {
                status: status,
            }
        );

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại",
        });
    }
}

export const changeMulti = async (req: Request, res: Response) => {
    try {
        const ids: string[] = req.body.ids;
        const key: string = req.body.key;
        const value: string = req.body.value;

        switch (key) {
            case "status":
                await Task.updateMany(
                    {
                        _id: { $in: ids },
                    },
                    {
                        status: value,
                    }
                );
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công",
                });
                break;
            case "delete":
                await Task.updateMany(
                    {
                        _id: { $in: ids },
                    },
                    {
                        deleted: true,
                        deletedAt: new Date()
                    }
                );
                res.json({
                    code: 200,
                    message: "Xóa thành công",
                });
                break;

            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại",
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại",
        });
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const task = new Task(req.body);
        const data = await task.save();

        res.json({
            code: 200,
            data: data,
            message: "Tạo thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi",
        });
    }
}

export const edit = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        await Task.updateOne({ _id: id }, req.body);

        res.json({
            code: 200,
            message: "Cập nhật thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi",
        });
    }
}