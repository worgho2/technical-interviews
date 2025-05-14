import { runQueriesOnTemporaryDatabase } from '../helpers/sqlite';

runQueriesOnTemporaryDatabase({
  execPath: '2.1/exec.sql',
  queryPath: '2.1/query.sql',
});
