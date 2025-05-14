import { runQueriesOnTemporaryDatabase } from '../helpers/sqlite';

runQueriesOnTemporaryDatabase({
  execPath: '2.4/exec.sql',
  queryPath: '2.4/query.sql',
});
