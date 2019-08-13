import { ConflictPick, resolveNextConflict, hasConflicts } from './resolveconflict';

const conflictJSONstring = `{
"id": null,
<<<<<<< HEAD
"title": "Test test 7060",
"locationName": "changed location",
||||||| Revision 2018-04-19T08:44:52.192Z
"title": "Test test 7060",
"locationName": "wwewe derefetet",
=======
"title": "Test test 7060 - changed title",
"locationName": "wwewe derefetet",
>>>>>>> cf013e36b187014d6d7f4c94ea93b323d81767c6
"status": null,
"startDate": "2018-04-19T23:00:00.000Z",
"endDate": "2018-04-20T03:00:00.000Z"
}`;

const minestring = resolveNextConflict(conflictJSONstring, ConflictPick.MINE);
const oldstring = resolveNextConflict(conflictJSONstring, ConflictPick.OLD);
const yoursstring = resolveNextConflict(conflictJSONstring, ConflictPick.YOURS);

const mine = JSON.parse(minestring);
const old = JSON.parse(oldstring);
const yours = JSON.parse(yoursstring);











