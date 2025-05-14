import sqlite3 from 'sqlite3';
import fs from 'fs';

export const runQueriesOnTemporaryDatabase = (input: {
  execPath: string;
  queryPath: string;
}): void => {
  const database = new sqlite3.Database(':memory:');

  fs.readFileSync(input.execPath, 'utf8')
    .toString()
    .split(';')
    .forEach((command) => {
      if (!command.trim()) return;

      database.exec(command, (err) => {
        if (err) {
          console.error('Error executing SQL:', err);
        }
      });
    });

  fs.readFileSync(input.queryPath, 'utf8')
    .toString()
    .split(';')
    .forEach((command) => {
      if (!command.trim()) return;

      console.log(command);

      database.all(command, (err, rows) => {
        if (err) {
          console.error('Error executing SQL:', err);
        }

        console.log('Result:', rows);
      });
    });

  database.close();
};
