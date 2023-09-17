import {type Database} from 'bun:sqlite'

export type User = {
    id: number,
    name: string,
    password?: string,
    isAuth?: boolean,
    money?: number
}

export class Users {
    db: Database;

    constructor(db: Database) {
        this.db = db
    }

    createTable() {
        console.log("Setup Users table")
        const createTableQuery = this.db.query(`
            CREATE TABLE IF NOT EXISTS users
            (
                id
                    INTEGER
                    PRIMARY
                        KEY,

                name
                    TEXT
                    UNIQUE
                    NOT
                        NULL,

                password
                    TEXT,

                money
                    INTEGER
            )`);

        createTableQuery.run();
    }

    add(name: string) {
        const usersAddQuery = this.db.query(`
            INSERT OR IGNORE
            INTO users (name)
            VALUES ("${name}")
        `);
        usersAddQuery.run();
    }

     setMoney(name: string, money: number, op: string): number{
        const user = this.findName(name);
        let value = 0
        if (user == null) {
            throw new Error("cannot find user to set money or money is null")
        }

        if (user.money) {
            switch (op) {
                case 'add':
                    value = user.money + money;
                    break;
                case 'minus':
                    value = user.money - money;
                    break;
                case 'set':
                    value = money
                    break;
                default:
                    throw new Error("invalid op parameter")
            }
        }

        const moneyQuery = this.db.query(`
            UPDATE users
            SET money = "${value}"
            WHERE name = "${name}";
        `)
        moneyQuery.run()

         return value
    }

     async setPassword(name: string, password: string): Promise<boolean> {
        const user = this.findName(name);
        if (user == null) {
            throw new Error("cannot find user to reset password")
        }

        if (user.password) {
            return false
        }
        const passwordHash = password == '' ? password : await Bun.password.hash(password)
        const passwordQuery = this.db.query(`
            UPDATE users
            SET password = "${passwordHash}"
            WHERE name = "${name}";
        `)
        passwordQuery.run()
         this.setMoney(user.name, 0, 'set')
        return true
    }


    list(): User[] {
        const usersQuery = this.db.query('SELECT * FROM users');
        return usersQuery.all() as unknown[] as User[];
    }

    findName(name: string): User | null {
        const userQuery = (this.db.query(`SELECT *
                                          FROM users
                                          WHERE name = "${name}"`))
        return userQuery.all().at(0) as unknown as User | null;
    }

    initialize() {
        this.createTable();
        this.add(`emily`);
        this.add('parents');
    }

    close() {
        this.db.close()
    }
}
