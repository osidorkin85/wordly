import {NextApiRequest, NextApiResponse} from "next";
import moment from "moment";
import {C} from "../../../utils/const";
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {date} = req.query

    if (date === moment().format(C.DDMMYYYY)) { // today => can save
        if (req.method === "POST") {
            res.status(200).json(
                await prisma.text.upsert(
                    {
                        where: {createdAt: date},
                        update: {
                            text: req.body
                        },
                        create: {
                            text: req.body,
                            createdAt: date
                        }
                    }
                ))
        }

        if (req.method === "GET") {
            const text = await prisma.text.findUnique(
                {
                    where: {createdAt: date},
                }
            )

            if (text) {
                res.status(200).json(text)
            } else {
                const text = await prisma.text.create(
                    {
                        data: {
                            createdAt: date,
                            text: ''
                        }
                    }
                )
                res.status(200).json(text)
            }


        }
    }

}