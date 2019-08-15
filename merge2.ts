declare var require;

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
function getType(obj, key) {
  // These are all the classes we expect to see in a JSON.parsed object.
  const classMap = {
    "[object Number]": itemType.number,
    "[object String]": itemType.string,
    "[object Array]": itemType.array,
    "[object Object]": itemType.object,
    "[object Null]": itemType.null,
    "[object Undefined]": itemType.undefined
  };

  if (obj === undefined || obj === null) {
    return { undefined: true };
  }

  const item = obj[key];

  const className = Object.prototype.toString.call(item);
  const type = classMap[className];

  switch (type) {
    case itemType.number:
    case itemType.string:
      return { isvalue: true, value: item };
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

  if (all.isvalue) {
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
    const typeA = getType(a, key);
    const typeB = getType(b, key);
    const typeO = getType(o, key);
    const primative = primitiveCheck(typeA, typeB, typeO);

    if (primative) {
      map[key] = { _$_primitive: true, o: typeO, a: typeA, b: typeB };
    } else {
      map[key] = makeMap(o[key], a[key], b[key]);
    }
  });
  return map;
}

function resolvePrimitive(entry, key, res, favor) {
  if (entry.o.isvalue) {
    // it existed in the ancestor
    if (entry.b.isvalue && entry.a.isvalue) {
      // both versions have a value for this path
      if (entry.o.value === entry.a.value) {
        //   a not changed equal so take b
        res[key] = entry.b.value;
      } else if (entry.o.value === entry.b.value) {
        //  b not changed take a
        res[key] = entry.a.value;
      } else if (favor === "a") {
        // here then both have changed
        res[key] = entry.a.value;
      } else if (favor === "b") {
        res[key] = entry.b.value;
      } else {
        throw Error("entry.b.isvalue && entry.a.isvalue  has not been handled");
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
  } else {
    // here then it did not exist in original
    if (entry.a.undefined || favor === "b") {
      res[key] = entry.b.value;
    } else if (entry.b.undefined || favor === "a") {
      res[key] = entry.a.value;
    } else {
      throw new Error(` Could not handle ${JSON.stringify(entry, null, 2)}`);
    }
  }
}

function resolveMap(map, favor) {
  if (!(favor === "a" || favor === "b")) {
    throw new Error(` favor = ${favor} is not valid`);
  }

  const keys = Object.keys(map);
  const res = {};

  keys.forEach(key => {
    const entry = map[key];
    if (entry._$_primitive) {
      resolvePrimitive(entry, key, res, favor);
    } else {
      res[key] = resolveMap(entry, favor);
    }
  });
  return res;
}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

function getTest(n) {
  const o: any = { x: 1 };
  const a: any = { x: 1 };
  const b: any = { x: 2 };
  const res: any = { x: 2 };
  let desc = " Keep a value that changes";
  let favor = "a";

  switch (n) {
    case 0:
      break;
    case 1:
      o.x = undefined;
      a.x = 1;
      b.x = 2;
      res.x = 1;
      desc = " Use favour value when both new.";
      break;

    case 2:
      o.x = 0;
      a.x = 1;
      b.x = 2;
      res.x = 1;
      desc = " Use favour value when both changed";
      break;

    case 3:
      o.x = 0;
      a.x = 1;
      b.x = 2;
      res.x = 2;
      desc = " Use favour value when both changed favor b";
      favor = "b";
      break;

    case 4:
      a.item = { text: "Blah Blah Blah" };
      b.item = { text: "Oh no Oh no" };
      res.item = a.item;
      desc = " Use favour value when both new (sub object)";
      break;

    case 5:
      o.item = { text: "Blah Blah Blah" };
      a.item = { text: "Blah Blah Blah" };
      b.item = { text: undefined };
      res.item = { text: undefined };
      desc = " Delete if unchaged in a but deleted in b";
      break;

    case 6:
      o.item = { text: "Blah Blah Blah" };
      b.item = { text: "Blah Blah Blah" };
      a.item = { text: undefined };
      res.item = { text: undefined };
      desc = " Delete if unchaged in b but delted in a";
      break;

    case 7:
      o.item = { text: "Blah Blah Blah" };
      b.item = { text: "Blah Blah Blah" };
      a.item = {};
      res.item = { text: undefined };
      desc = " Check empty object is like a deleted object";
      break;

    case 8:
      o.item = { text: "Blah Blah Blah" };
      b.item = { text: "Blah Blah Blah" };
      a.item = null;
      res.item = { text: undefined };
      desc = " Check null object is like a deleted object";
      break;
  }

  let ret = {
    o: o,
    a: a,
    b: b,
    favor: favor,
    res: res,
    desc: desc
  };
  return ret;
}

function doMerge(test) {
  const map = makeMap(test.o, test.a, test.b);

  // console.log(JSON.stringify(map, null, 2));

  const out = resolveMap(map, test.favor);

  const ok = JSON.stringify(out) === JSON.stringify(test.res);

  if (ok) {
    console.log(`OK   ${test.desc}`);
  } else {
    console.log(`FAIL ${test.desc}`);
    console.log("EXPECTED >>>>>>>>>>>>>>>>");
    console.log(JSON.stringify(test.res, null, 2));
    console.log("ACTUAL >>>>>>>>>>>>>>>>>>");
    console.log(JSON.stringify(out, null, 2));
  }
}

var tests = [8];
function doit1() {
  tests.forEach(i => {
    const test = getTest(i);
    doMerge(test);
  });
}

doit1();
