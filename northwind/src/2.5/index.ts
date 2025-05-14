import { runQueriesOnTemporaryDatabase } from '../helpers/sqlite';

runQueriesOnTemporaryDatabase({
  execPath: '2.5/exec.sql',
  queryPath: '2.5/query.sql',
});
