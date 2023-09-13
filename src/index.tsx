import {Database} from 'bun:sqlite'
import {Users, type User} from "./models/Users";
import {request} from "http";

const usersController = new Users(new Database("db.sqlite"))
usersController.createTable();

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
    const {indexNameInput} = await req.json();
    const name = indexNameInput.toLowerCase();

  if (usersController.findName(name)==undefined)
    return new Response(Bun.file("src/views/createUserPrompt.html"))
  }
  return new Response("NotFound", {status: 404})
}
