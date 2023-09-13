import {type Database} from 'bun:sqlite'

export type User = {
  id: number,
  name: string
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
            NULL
        )`);

    createTableQuery.run();
  }

  add(name: string) {
    const usersAddQuery = this.db.query(`
        INSERT INTO users (name)
        VALUES ("${name}")
    `);
    usersAddQuery.run();
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


  close() {
    this.db.close()
  }
}
