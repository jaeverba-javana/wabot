import {Router} from "express";
import {sharedCache} from "../utils/cache.js";

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

// 15 minutes TTL for deduplication of incoming messages
const FIFTEEN_MIN_MS = 15 * 60 * 1000;

router.post('/webhook', (req, res) => {
    try {
        const entry = req.body?.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;
        // message id varies based on object; try to extract safely
        const msg = value?.messages?.[0];
        const msgId = msg?.id || value?.statuses?.[0]?.id;

        if (msgId) {
            const cacheKey = `wab:msg:${msgId}`;
            if (sharedCache.has(cacheKey)) {
                // Duplicate delivery within 15m, acknowledge and exit
                return res.status(200).send("ok");
            }
            sharedCache.set(cacheKey, true, FIFTEEN_MIN_MS);
        }

        console.log(value);
        res.send("ok");
    } catch (e) {
        console.error("Error processing webhook:", e);
        res.status(200).send("ok"); // Always 200 to avoid retries flooding
    }
})

export default Router().use('/wab', router)