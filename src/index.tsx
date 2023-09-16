import {Database} from 'bun:sqlite'
import {Users} from "./models/Users";
import {renderToReadableStream} from "react-dom/server";
import UserNotFound from "./views/UserNotFound.tsx";
import {Stores} from "./models/Item.ts";
import Store from "./views/Store.tsx";


const usersController = new Users(new Database("db.sqlite"))
const storeController = new Stores(new Database("db.sqlite"))
usersController.initialize();
storeController.initialize();

usersController.list().forEach((user) => {
    console.log(user.name + " " + user.password + " " + user.money)
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
        const {principle} = await req.json();
        const userObject = usersController.findName(principle)
        console.log(userObject)


        if (!userObject) {
            throw new Error("User Lookup in db failed")
        }

        if (userObject.password == null) {
            const stream = await renderToReadableStream(
                <UserNotFound name={principle}/>
            )
            return new Response(stream, {headers: {"Content-Type": "text/html"}})
        }

        const stream = await renderToReadableStream(
            <Store principle={principle} store={storeController}/>
        )
        return new Response(stream, {headers: {"Content-Type": "text/html"}})
    }


    if (url.pathname == '/new-password' && req.method == 'POST') {
        const {principle, newPassword} = await req.json()

        usersController.setPassword(principle, Bun.escapeHTML(newPassword))

        return newPassword == ''
            ? new Response("no password needed next time!")
            : new Response("Password updated successfully!")
    }
    return new Response("NotFound", {status: 404})
}
