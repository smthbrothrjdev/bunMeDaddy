import {type Database} from 'bun:sqlite'

export type User = {
  id: number,
  name: string
  password?: string
}

export class Users {
  db: Database;

  constructor(db: Database) {
    this.db = db
  }

  createTable() {
    console.log("creating table")
    const createTableQuery = this.db.query(`
        CREATE TABLE IF NOT EXISTS users
        (
            id
            INTEGER
            PRIMARY
            KEY
            AUTOINCREMENT,

            name
            TEXT
            UNIQUE
            NOT
            NULL,

            password
            TEXT
        )`);

    createTableQuery.run();
  }

  add(name: string) {
    const usersAddQuery = this.db.query(`
        INSERT
        OR IGNORE INTO users (name)
        VALUES ("${name}")
    `);
    usersAddQuery.run();
  }

  async setPassword(name: string, password: string): Promise<string> {
    const user = this.findName(name);
    if (user == null) {
      throw new Error("cannot find user to reset password")
    }

    if (user.password) {
      return "Not Found"
    }
    const passwordHash = await Bun.password.hash(password)
    const passwordQuery = this.db.query(`
        UPDATE users
        SET password = ${passwordHash}
        WHERE name = ${name};
    `)
    passwordQuery.run()
    return "Password Updated"
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
