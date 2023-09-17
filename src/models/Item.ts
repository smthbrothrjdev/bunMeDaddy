import {type Database} from 'bun:sqlite'
import {User} from "./Users.ts";

export type Item = {
    id: number,
    item_name: string,
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


    addItem(itemName: string, price: number): string {

        const item = this.findItemName(itemName)
        const usersAddQuery = this.db.query(`
            INSERT OR IGNORE
            INTO store (item_name, price)
            VALUES ("${itemName}", ${price})
        `);
        if (!item){
            usersAddQuery.run()
            return `Added ${itemName}: \$${price}.00 to the store`
        }
        return 'unable to add item to store'
    }

    list(): Item[] {
        const itemsQuery = this.db.query('SELECT * FROM store');
        return itemsQuery.all() as unknown[] as Item[];
    }

    initialize(){
        this.createTable()
        this.addItem("Item one",10)
        this.addItem("Item two",1)
        this.addItem("Long Name Item 3",100)
        this.addItem("Long Name Item 4",1)
        this.addItem("Long Name Item 5",10)
    }

}
