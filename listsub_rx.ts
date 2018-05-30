'use strict'
import { Observable, bindCallback, from, pipe, of, forkJoin } from 'rxjs';
import { mergeMap, map, mergeAll, take, bufferCount, concat, merge, concatAll, concatMap, delay } from 'rxjs/operators';

// Use name space toavoid duplicate names. 
namespace A {

    // e.g. s3 operation  
    function asyncFunc(item, cb) {
        const wait = (6 - item) * 300;
        console.log(" DO " + item)
        setTimeout(() => {
            console.log(" DONE " + item)
            cb(item * item)
        }, wait);
    }

    const mySyncObserable = bindCallback(asyncFunc);

    let list = [1, 2, 3, 4, 5, 6]

    let ii:string = "forEach";

    switch (ii) {

        // forEach + subscribe
        case "forEach":  // Simle subscription (all in parallel)
            list.forEach((i) => mySyncObserable(i).subscribe(res => console.log("HELLO ", res)));
            break;

        // pipe    
        case "pipe1": // showing how a pipe works.  
            from(list).pipe(map(i => { console.log(i); return i ** 2 }), map(i => i / 2)).subscribe(res => console.log(" HELLO", res));
            break;

        case "pipe2": // create observable form i in the pipe ( but it does not get used !!!!)
            from(list).pipe(map(i => { console.log("IN ", i); return mySyncObserable(i) })).subscribe(res => console.log(" HELLO", res));
            break;

        // mergeMap to resolve obserable in the pipe
        case "mergeMap": // Use mergeMap to put the return val from mySyncObservable into the pipe  (no gain over 0 yet)
            from(list).pipe(mergeMap(i => { console.log("IN ", i); return mySyncObserable(i) })).subscribe(res => console.log(" HELLO", res));
            break;

        // mergeAll  to limit number of subscriptions
        case "mergeAll1": // Put the observeable into the pipe line. mergeAll subscribes but does not return control to pipe unit it is resolved.
            from(list).pipe(map(i => { console.log("IN ", i); return mySyncObserable(i) }), mergeAll(1)).subscribe(res => console.log(" HELLO", res));
            break;

        case "mergeAll3": // Put the observeable into the pipe line. mergeAll subscribes to at most 3 then blocks until one is resolved.
            from(list).pipe(map(i => { console.log("IN ", i); return mySyncObserable(i) }), mergeAll(3)).subscribe(res => console.log(" HELLO", res));
            break;


        // concatMap
        case "concatMap":  // One at a time.  subscription see each result  
            from(list).pipe(concatMap((i) => { return mySyncObserable(i) })).subscribe((res) => { console.log("HELLO", res) })
            break;


        // forkJoin   is used to wait for all the subsciptions to resolve.

        case "forkJoin1": // One at a time. notify when finished using concatMap 
            forkJoin(from(list).pipe(concatMap((i) => { return mySyncObserable(i) }))).subscribe((res) => { console.log("HELLO") })
            break;


        case "forkJoin2":
            forkJoin( from(list).pipe(  map((i)=>{return mySyncObserable(i)}), mergeAll(1)  )).subscribe((res)=>{console.log("HELLO",res)})
            break;
        }

}
