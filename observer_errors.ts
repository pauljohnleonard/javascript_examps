import { Observable } from 'rxjs/Rx';




var observable = Observable.create(function (observer) {


    if (Math.random() >0.5) {
        observer.next("WAY TO GO1");
    } else {
        observer.error(Observable.of("OOOPS"))
    }
});

observable.catch(err=>err).map(res => "OK "+res).subscribe(
    
    (res) => console.log(res),
    
    (err) => {
        console.log(" Caught ")
    },
    (res) => { console.log(" THE END ") }

)



