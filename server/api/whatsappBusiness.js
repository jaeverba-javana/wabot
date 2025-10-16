import {Router} from "express";

const router = Router({strict: true})

const requireAuth = (req, res, next) => {
    // console.log(req)
    const {hub} = req.queries

    if (!hub.verify_token || hub.verify_token !== process.env.WHATSAPP_WEBHOOK_TOKEN)
        return res.status(403).end()

    // res.status(200).send(hub.challenge)
    next()
}

const reStructQuery = (req, res, next) => {
    // if (!req.query || !req.query.length) return next()
    console.log(req.query)
    if (!req.query || Object.keys(req.query).length === 0) return next()

    req.queries = {}

    for (const [fullKey, value] of Object.entries(req.query)) {
        const keys = fullKey.split('.')
        let current = req.queries

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]

            if (i === keys.length - 1) {
                current[key] = value
            } else {
                if (!current[key] || typeof current[key] !== 'object') {
                    current[key] = {}
                }

                current = current[key]
            }
        }

    }

    next()
}

router.get('/webhook', reStructQuery, requireAuth, (req, res) => {
    console.log(req.query)
    console.log(req.body)

    res.send(req.queries.hub.challenge)
})

router.post('/webhook', (req, res) => {

    console.log(req.body.entry[0].changes[0].value)

    res.send("ok")
})

export default router