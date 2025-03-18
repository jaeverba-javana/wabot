import argon from "argon2";
import { Router } from "express";

import { User } from './../db/mongoDb/models/index.js'
import { MongooseError } from "mongoose";

const router = Router({
    strict: true
})

router.post('/auth/register', async (req, res, next) => {
    const { data } = req.body

    // console.log(data);
    

    const user = new User({
        email: data.email,
        password: await argon.hash(data.password),
        // username: /^[\w-+%][\w-+%.]+/.exec(req.body.email)![0],
        // containerName: container?.containerName,
    });

    // console.log('Created user =', user)

    user.save()
        .then((value) => {
            // console.log('valuue:', value);
            
            res.send(value)
        })
        .catch((reason) => {
            console.log(reason);
            
            
            if (reason instanceof ReferenceError)
                res.status(500).send(reason)
            else
                res.status(500).send({
                    message: "error when saving user",
                    reason: {
                        code: reason.errorResponse.code,
                        labels: Object.getOwnPropertyNames(reason.errorResponse.keyPattern),
                        values: reason.errorResponse.keyValue
                    }
            });
        });

})

export default router