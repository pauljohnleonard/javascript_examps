import { Observable } from 'rxjs/Rx'
import { AsyncSubject } from 'rxjs/AsyncSubject'
import { Subject } from 'rxjs/Subject';

const data = [5, 4, 3, 2, 1]

const src = Observable.from(data)

const obs = new Subject()

let mess = ""

src.mergeMap(
    t => timeOut(t)
).subscribe(
    d => mess += d + "\n",
    err => console.log("ERROR"),
    () => {
        obs.next(mess)
      //  obs.complete()
    }
    )

obs.subscribe((message) =>
    console.log(message)
)

function timeOut(t: number): Observable<any> {
    const wait = new AsyncSubject();
    setTimeout(() => {
        wait.next(t)
        wait.complete()
    }, t * 300)
    return wait
} 
