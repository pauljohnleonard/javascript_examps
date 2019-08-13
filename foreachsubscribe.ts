import { Observable, from } from 'rxjs'
import { AsyncSubject } from 'rxjs'
import { Subject } from 'rxjs';
import { mergeMap, timeout } from 'rxjs/operators';

const data = [5, 4, 3, 2, 1]

const src = from(data)

const obs = new Subject()

let mess = ""

src.pipe(

    mergeMap(
        (t: number) => {
            return timeout(t);
        }
    )
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
