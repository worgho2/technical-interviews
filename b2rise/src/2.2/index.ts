import { runQueriesOnTemporaryDatabase } from '../helpers/sqlite';

runQueriesOnTemporaryDatabase({
  execPath: '2.2/exec.sql',
  queryPath: '2.2/query.sql',
});
