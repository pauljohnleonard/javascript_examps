'use strict'
import { Observable, bindCallback, from ,pipe ,of, forkJoin} from 'rxjs';
import { mergeMap,map,mergeAll } from 'rxjs/operators';


// import { filter} from 'rxjs/operators';

// const squareOdd = of(1, 2, 3, 4, 5)
//   .pipe(
//     filter(n => n % 2 !== 0),
//     map(n => n * n)
//   );

// Subscribe to get values
// squareOdd.subscribe(x => console.log(x));
namespace A {
    // e.g. s3 operation  

    function asyncFunc(item, cb) {
        const wait = 1000;
        setTimeout(() => {
            console.log(" DOING " + item)
            cb(item*item)
        }, wait);
    }

    const mySyncObserable = bindCallback(asyncFunc);

    //mySyncObs(5).subscribe((res)=>console.log(res));

    let list = [1, 2, 3, 4, 5, 6]

    forkJoin(from(list).pipe( mergeMap(i=>mySyncObserable(i)) )).subscribe((res)=>{console.log("ALL")})

   // from(list).pipe( mergeMap(i=>mySyncObs(i)) ).subscribe((res)=>{console.log(" ALL ")})


    //forkJoin(from(list).pipe( i=>mySyncObs(i))).subscribe((res)=>{console.log(" ALL ")})


//     //from(list).subscribe((item) => {console.log(item)})


   //   from(list).pipe(map(),mergeAll()).subscribe((res)=>console.log("ALL "+ res));  
    
    

    
//     // mergeMap<number>(item => mySyncObs(item)).subscribe((res)=> {console.log(res),console.log(" END ")})


//     //from(list).pipe(mergeMap(item => item, 1))
// }

}
