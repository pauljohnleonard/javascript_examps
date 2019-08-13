// merges mine into other
// mine will overwrite or create fileds in other

// Assume 
// 1. no arrays
// 2. fields with name name are the same type (object or primative) 


function deletedKeys(origKeys, child) {

    const deleted = {};

    origKeys.forEach((key) => {
        if (!child[key]) deleted[key] = true;
    })
    return deleted
}

function removeKeys(orig, origKeys, maps) {
    origKeys.forEach()
}


function visit(o,a,b) {
    const map={};
}

function merge(orig, other, mine) {

    const myKeys = Object.keys(mine);
    const otherKeys = Object.keys(other);
    const origKeys = Object.keys(orig);

    const merged = {}

    const myDeletions = deletedKeys(origKeys, mine);

    const otherDeletions = deletedKeys(origKeys, other);

    // remove any deletions from origin object
    removeKeys(orig, origKeys, [myDeletions, otherDeletions]);


    myKeys.forEach((myKey) => {
        if (!(myKey in other)) {     // not in iother  then just put it in
            other[myKey] = mine[myKey]
        } else if (typeof other[myKey] === 'object') {    // duplicate keys and objects then recurse
            merge(orig[myKey], other[myKey], mine[myKey])
        } else {  // primitive overwrite
            other[myKey] = mine[myKey]
        }
    })
}



function clone(o) {
    return JSON.parse(JSON.stringify(o));
}

const o = {
    a: "oA",
    b: { a1: "oB_A1", b1: "oB_B1 ", sub: { x: "oB_SUB_X", y: "oB_SUB_Y" } },
}



const a = clone(o);

a.a = "aA";

const b = clone(o);


b.b.sub.x = "bB_SUB_X";


// Helper to return a value's internal object [[Class]]
// That this returns [object Type] even for primitives
function getClass(obj) {
    return Object.prototype.toString.call(obj);
}

/*
** @param a, b        - values (Object, RegExp, Date, etc.)
** @returns {boolean} - true if a and b are the object or same primitive value or
**                      have the same properties with the same values
*/

function objectTester(a, b) {

    // If a and b reference the same value, return true
    if (a === b) return true;

    // If a and b aren't the same type, return false
    if (typeof a != typeof b) return false;

    // Already know types are the same, so if type is number
    // and both NaN, return true
    if (typeof a == 'number' && isNaN(a) && isNaN(b)) return true;

    // Get internal [[Class]]
    var aClass = getClass(a);
    var bClass = getClass(b)

    // Return false if not same class
    if (aClass != bClass) return false;

    // If they're Boolean, String or Number objects, check values
    if (aClass == '[object Boolean]' || aClass == '[object String]' || aClass == '[object Number]') {
        return a.valueOf() == b.valueOf();
    }

    // If they're RegExps, Dates or Error objects, check stringified values
    if (aClass == '[object RegExp]' || aClass == '[object Date]' || aClass == '[object Error]') {
        return a.toString() == b.toString();
    }

    // Otherwise they're Objects, Functions or Arrays or some kind of host object
    if (typeof a == 'object' || typeof a == 'function') {

        // For functions, check stringigied values are the same
        // Almost certainly false if a and b aren't trivial
        // and are different functions
        if (aClass == '[object Function]' && a.toString() != b.toString()) return false;

        var aKeys = Object.keys(a);
        var bKeys = Object.keys(b);

        // If they don't have the same number of keys, return false
        if (aKeys.length != bKeys.length) return false;

        // Check they have the same keys
        if (!aKeys.every(function (key) { return b.hasOwnProperty(key) })) return false;

        // Check key values - uses ES5 Object.keys
        return aKeys.every(function (key) {
            return objectTester(a[key], b[key])
        });
    }
    return false;
}

// merge(other, my)
merge(o, a,b)

console.log(JSON.stringify(o, null, 2))
