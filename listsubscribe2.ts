// Import stylesheets

function myLog(mess) {
  console.log(mess)
}

// e.g. s3 operation  
function myAsync(item,cb) {
  const wait=1000;
  
  setTimeout(()=>{ 
    myLog(" DONE "+ item)
    cb() },wait);

}

// My solution
function process(list,cb) {

  let item=list.pop()
  
  if (!item) {
    cb()
    return;
  }

  myAsync(item,() => {
    setTimeout(()=>{ process(list,cb) })
  })

}

let list=[1,2,3,4,5,6]

process(list,() => {
  myLog(" DONE ALL ")
}) 
