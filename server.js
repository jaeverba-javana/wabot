import fs from 'node:fs/promises'
import express from 'express'
import cookieParser from 'cookie-parser';

import {BASE as base, IS_PRODUCTION as isProduction} from "./server/utils/contants.js";
import { isAuthenticated } from './server/api/auth.js';

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/index.html', 'utf-8')
  : ''

// Create http server
const app = express()

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Add cookie parser
app.use(cookieParser())

// Serve HTML
app.use('*all', async (req, res) => {
  console.log(req.originalUrl)

  const user = await isAuthenticated(req)

  if ((["/login", "/signup"].includes(req.baseUrl)) && user) res.redirect("/")
  else if (!(["/login", "/signup"].includes(req.baseUrl)) && !user) res.redirect("/login")
  else

  try {
    const url = req.originalUrl.replace(base, '')

    /** @type {string} */
    let template
    /** @type {import('./src/entry-server.ts').render} */
    // let render

    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      // render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
    } else {
      template = templateHtml
      // render = (await import('./dist/server/entry-server.js')).render
    }

    // const rendered = await render(url)

    // const html = template
    //   .replace(`<!--app-head-->`, rendered.head ?? '')
    //   .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(template)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

export default app