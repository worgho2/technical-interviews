import { runQueriesOnTemporaryDatabase } from '../helpers/sqlite';

runQueriesOnTemporaryDatabase({
  execPath: '2.6/exec.sql',
  queryPath: '2.6/query.sql',
});
