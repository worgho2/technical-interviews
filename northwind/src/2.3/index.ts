import { runQueriesOnTemporaryDatabase } from '../helpers/sqlite';

runQueriesOnTemporaryDatabase({
  execPath: '2.3/exec.sql',
  queryPath: '2.3/query.sql',
});
