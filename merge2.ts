export var x = {};

enum itemType {
  number,
  string,
  object,
  null,
  undefined,
  array
}

// return an object with a key set depending on the type of object.
function getType(item) {
  // These are all the classes we expect to see in a JSON.parsed object.
  const classMap = {
    "[object Number]": itemType.number,
    "[object String]": itemType.string,
    "[object Array]": itemType.array,
    "[object Object]": itemType.object,
    "[object Null]": itemType.null,
    "[object Undefined]": itemType.undefined
  };

  const className = Object.prototype.toString.call(item);
  const type = classMap[className];

  switch (type) {
    case itemType.number:
    case itemType.string:
      return { value: item };
    case itemType.array:
      return { array: true };
    case itemType.object:
      return { object: true };
    case itemType.undefined:
    case itemType.null:
      return { undefined: true };
  }
}

// see if all objects can be treated as primitives
// also do some sanity checking.
function primitiveCheck(o, a, b) {
  const all = Object.assign({}, a);
  Object.assign(all, b);
  Object.assign(all, o);

  if (all.value) {
    // any values
    if (all.object) {
      throw new Error(" item is value and object");
    }
    if (all.array) {
      throw new Error(" item is value and object");
    }
    return true;
  }

  if (all.object && all.array) {
    throw new Error(" item is array and object");
  }

  if (all.object) {
    return false;
  }

  if (all.array) {
    throw new Error(" not ready for arrays ");
  }
}

// construct the map needed to merge the objects
function makeMap(o, a, b) {
  const all = {};
  Object.assign(all, a);
  Object.assign(all, b);
  Object.assign(all, o);
  const keys = Object.keys(all); // Here we have all the possible keys

  const map = {};

  keys.forEach(key => {
    const typeA = getType(a[key]);
    const typeB = getType(b[key]);
    const typeO = getType(o[key]);
    const primative = primitiveCheck(typeA, typeB, typeO);

    if (primative) {
      map[key] = { _$_primitive: true, o: typeO, a: typeA, b: typeB };
    } else {
      map[key] = makeMap(o[key], a[key], b[key]);
    }
  });
  return map;
}


function resolvePrimitive(entry,key,res,favor) {
  if (entry.o.value) {
    // it existed in the ancestor
    if (entry.b.value && entry.a.value) {
      // both versions have a value for this path
      if (entry.o.value === entry.a.value) {
        //   a not changed equal so take b
        res[key] = entry.b.value;
      } else if (entry.o.value === entry.b.value) {
        res[key] = entry.a.value;
      } else if (favor === "a") {
        // here then both have changed
        res[key] = entry.a.value;
      } else if (favor === "b") {
        res[key] = entry.b.value;
      } else {
        throw Error("entry.b.value && entry.a.value  has not been handled");
      }
    } else {
      // looks like one or more of the versions has been deleted
      if (entry.a.undefined && entry.b.undefined) {
        // both versions have been deleted so skip this key
      } else if (entry.a.undefined) {
        if (entry.o.value !== entry.b.value) {
          // only set if b is updated
          res[key] = entry.b.value;
        }
      } else if (entry.b.undefined) {
        if (entry.o.value !== entry.b.value) {
          // only set if b is updated
          res[key] = entry.b.value;
        }
      } else {
        throw new Error(" expected either a or b version to be undefined");
      }
    } 
  } else {   // here then it did not exist in original

  }
}

function resolveMap(map, favor) {
  const keys = Object.keys(map);
  const res = {};

  keys.forEach(key => {
    const entry = map[key];
    if (entry._$_primitive) {
      resolvePrimitive(entry,key,res,favor);
    } else { 
      res[key]=resolveMap(entry,favor)
    }
  });
}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

function getTest(n) {
  const o = { x: 1 };
  const a = { x: 1 };
  const b = { x: 2 };
  const res = { x: 2 };

  const ret = { o: o, a: a, b: b, res: res };

  if (n === 0) {
    return ret;
  }
}

function doit1() {
  const test = getTest(0);
  const map = makeMap(test.o, test.a, test.b);
  const out = resolveMap(map,"a");
  console.log(JSON.stringify(map, null, 2));
}

doit1();
