// Import stylesheets
import './style.css';
import { Observable} from 'rxjs/observable';

import { mergeMap } from 'rxjs/operators';
function myLog(mess) {
    console.log(mess)
}
// e.g. s3 operation  

function myAsync(item,cb) {
  const wait=1000;
  
  setTimeout(()=>{ 
    myLog(" DONE "+ item)
    cb() },wait);
}

const mySyncObs=Observable.bindCallback(myAsync);


let list=[1,2,3,4,5,6]

//Observable.from(list).pipe(mergeMap(item => item, 1))

Observable.from(list).subscribe((item)=>myLog(item))

