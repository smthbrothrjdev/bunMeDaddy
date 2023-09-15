import {Database} from 'bun:sqlite'
import {Users, type User} from "./models/Users";
import {request} from "http";
import {renderToReadableStream} from "react-dom/server";
import UserNotFound from "./views/UserNotFound.tsx";


const usersController = new Users(new Database("db.sqlite"))
usersController.initialize();

usersController.list().forEach((user) => {
  console.log(user.name + " " + user.password)
})

const server = Bun.serve({
  fetch: routeHandler
})

async function routeHandler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname === '' || url.pathname == "/") {
    return new Response(Bun.file("src/index.html"))
  }
  if (url.pathname == "/dist/output.css") {
    return new Response(Bun.file("dist/output.css"))
  }

  if (url.pathname == "/dev/close") {
    usersController.close()
    server.stop()
    return new Response("CLOSING")
  }
  if (url.pathname == "/enter-site" && req.method == "POST") {
    const indexNameInput = await req.json();
    const name = "num"

    const stream = await renderToReadableStream(
        <UserNotFound name={name}/>
    )

    if (usersController.findName(name) == undefined)
      return new Response(stream, {headers: {"Content-Type": "text/html"}})
  }

  if (url.pathname == '/new-password') {
    const request = await req.json()
    console.log(request)
    // const response = await usersController.setPassword(,newPassword)
    return new Response("yikes!")
  }
  return new Response("NotFound", {status: 404})
}
