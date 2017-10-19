import { Observable } from 'rxjs'

function rejectify() {

    return new Promise((resolve, reject) => {
        reject(' I reject !');
    });
}

rejectify().then((res) => {
    console.log(" I will never print ")
}, (reason) => {
    console.log(" Reject because " + reason)
})

const obs = Observable.fromPromise(
    rejectify())
    
    
 obs.subscribe(

    () => {
        return " I will never print 2"
    },
    (err) => {
        console.log(" Reject 2 because " + err)
    })


