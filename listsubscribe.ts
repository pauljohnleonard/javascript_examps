// import { Observable } from 'rxjs'
// import { forkJoin, map } from 'rxjs/operators';


// function getsrc(): Array<Observable<string>> {
//     const data = ["A", "B", "C", "D"]

//     const srcs: Array<Observable<string>> = [];


//     data.forEach((item) => {
//         //   srcs.push(Observable.of(item));
//     });

//     return srcs;
// }

// let src = getsrc();


// //
// Observable.forkJoin(...src, Observable.create((obs) => {
//     obs.next('XXXX')
//     obs.complete();
// }
// )).subscribe((res) => {

//     console.log(res);

// });
