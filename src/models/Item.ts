import {type Database} from 'bun:sqlite'
import {User} from "./Users.ts";

export type Item = {
    id: number,
    itemName: string,
    price: number,
}

export class Stores {
    db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    createTable() {
        console.log("Setup Store table")
        const createTableQuery = this.db.query(`
            CREATE TABLE IF NOT EXISTS store
            (
                id
                    INTEGER
                    PRIMARY
                        KEY,

                item_name
                    TEXT
                    UNIQUE
                    NOT
                        NULL,

                price
                    INTEGER
            )`);

        createTableQuery.run();
    }
    findItemName(name: string): Item | null {
        const userQuery = (this.db.query(`SELECT *
                                          FROM store
                                          WHERE item_name = "${name}"`))
        return userQuery.all().at(0) as unknown as Item | null;
    }
    add(itemName: string, price: number): string {

        const item = this.findItemName(itemName)
        const usersAddQuery = this.db.query(`
            INSERT OR IGNORE
            INTO store (item_name, price)
            VALUES ("${itemName}", price)
        `);
//todo fix this
    }
}
