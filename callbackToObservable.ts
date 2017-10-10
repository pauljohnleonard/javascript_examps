import { Observable } from 'rxjs/Rx';

function methodWithCallback(arg0, arg1, cb) {
    setTimeout(function() {
      cb(arg0 + arg1);
    }, 2000);
  }
  
var newMethod = Observable.bindCallback(methodWithCallback);
  
newMethod(2,3).subscribe( (res) => console.log(res) )
