const server = Bun.serve({
  fetch: routeHandler
})

async function routeHandler(req:Request):Promise<Response>{
  const url = new URL(req.url);

  if (url.pathname ==='' || url.pathname=="/"){
    return new Response(Bun.file("src/index.html"))
  }
  if (url.pathname=="/dist/output.css"){
    return new Response(Bun.file("dist/output.css"))
  }
   return new Response("NotFound",{status:404})
}
