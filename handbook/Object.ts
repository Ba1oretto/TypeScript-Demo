// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols,JSPrimitiveTypeWrapperUsage,JSSuspiciousNameCombination,JSUnusedAssignment

// region Property Modifiers
// region Optional Properties
interface PaintOptions {
    shape: "circle" | "square";
    xPos?: number;
    yPos?: number;
}

// due to js syntax, do not specify type in parameter deconstructing
const paintShape = function ({shape, xPos = 0, yPos = 0}: PaintOptions): void { // argument with default value
    console.log("shape ", shape);
    console.log("x coordinate at ", xPos);
    console.log("y coordinate at ", yPos);
}
// endregion

// region readonly Properties
interface ReadonlyProp {
    readonly id: number;
    readonly resident: {
        name: string;
        age: number;
    };
}

function visitForBirthday(p: ReadonlyProp): void {
    console.log(p.id);
    p.resident.age++ // OK
    p.resident.name = "another people" // OK
    // p.resident = { name: "test", age: 1 }; // NO
}

interface Person {
    name: string;
    age: number;
}

interface ReadonlyPerson {
    readonly name: string;
    readonly age: number;
}

let writablePerson: Person = {
    name: "barroit",
    age: 17,
};

let readonlyPerson: ReadonlyPerson = writablePerson;
console.log(readonlyPerson.age);
writablePerson.age++; // properties of readonlyPerson can be change via writablePerson
console.log(readonlyPerson.age);
// endregion

// region Index Signatures
interface StringArray {
    [index: number]: string;
}

interface Animal {
    readonly name: string;
}

interface Dog extends Animal {
    breed: string;
}

interface DogAnimal {
    [x: number]: Dog; // Ok
    [x: string]: Animal;
}

interface NumberOrStringDictionary {
    [index: string]: number | string; // the index maps to properties which is length and name
    length: number; // type number in union type number | string
    name: string; // type string in union type number | string
}

interface ReadonlyDictionary {
    readonly [index: string]: string;
}

const readonlyDictionaryFn = function (o: ReadonlyDictionary) {
    // o[2] = "test" // Index signature in type 'ReadonlyDictionary' only permits reading
}
// endregion
// endregion

// region Extending Types
interface EColorful {
    color: string;
}

interface ECircle {
    radius: number;
}

interface EColorfulCircle extends EColorful, ECircle {
}

const cc: EColorfulCircle = {
    color: "red",
    radius: 42,
};
// endregion

// region Intersection Types
interface IColorful {
    color: string;
}

interface ICircle {
    radius: number;
}

const draw = function (circle: IColorful & ICircle): void {
    console.log(`Color was ${circle.color}`);
    console.log(`Radius was ${circle.radius}`);
}
// endregion

// region Generic Object Types
interface Box<Type> {
    contents: Type;
}

interface Apple {
}

let box: Box<string>;

const setContents = function <Type>(box: Box<Type>, newContents: Type): void {
    box.contents = newContents;
}

// helper types
type OrNull<Type> = Type | null;
type OneOrMore<Type> = Type | Type[];
type OneOrMoreOrNull<Type> = OrNull<OneOrMore<Type>>;
type OneOrManyOrNullStrings = OneOrMoreOrNull<string>;
// endregion

// region The Array Type
function doSomething(value: Array<string>) {
    value.forEach(v => console.log(v));
}

// either of these work!
doSomething(["hello", "world"]);
doSomething(new Array("hello", "world"));
// endregion

// region The ReadonlyArray Type
const doStuff = function (values: ReadonlyArray<string>) {
    const copy = values.slice();
    console.log(copy);
};

// const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
const roArray: readonly string[] = ["red", "green", "blue"]; // equivalent to above

doStuff(roArray);

let x: readonly string[] = [];
let y: string[] = [];

x = y;
// y = x; // unlike the readonly property modifier, the type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'
// endregion

// region Tuple Types
type StringNumberPair = [string, number, number?];

const tDoSomething = function (pair: StringNumberPair) {
    const [s, n, u] = pair;
    console.log(s);
    console.log(n);
    console.log(u);
    console.log(`Provided coordinates had ${pair.length} dimensions`)
};

tDoSomething(["hello", 2]);

type StringNumberBooleans = [string, number, ...boolean[]];

function readButtonInput(...args: [string, number, ...boolean[]]) { // tuple types with destructing
    const [name, version, ...input] = args;
    // ...
}
// function readButtonInput(name: string, version: number, ...input: boolean[]) { // equivalent to above
//     // ...
// }

readButtonInput("barroit", 1, true);
// endregion

// region readonly Tuple Types
const rDoSomething = function (...pair: readonly [string, number]) {
    // ...
};

let point = [3, 4] as const;

const distanceFromOrigin = function ([x, y]: readonly [number, number]): number { // tuple(array) parameter destructing
    return Math.sqrt(x ** 2 + y ** 2);
};

distanceFromOrigin(point);
// endregion