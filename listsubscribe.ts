import { Observable } from 'rxjs/Observable'
//import { from } from 'rxjs/observable/from'


function getsrc(): Array<Observable<string>>{
    const data = ["A","B","C","D"]
    
    const srcs:Array<Observable<string>>  = [];


    data.forEach((item) => {
        srcs.push(Observable.of(item));
    }   );

    return srcs;
}

let src=getsrc();



Observable.forkJoin(...src).subscribe( (res) => {

    console.log(res);

});
