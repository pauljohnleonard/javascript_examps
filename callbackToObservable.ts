import { Observable } from 'rxjs/Observable';

function methodWithCallback(arg0, arg1, cb) {
    setTimeout(function() {
      console.log("A")
      cb(arg0 );
    }, 200);
  }
  
var newMethod = Observable.bindCallback(methodWithCallback);
  
newMethod(2,3).subscribe( (res) => console.log(res) )
