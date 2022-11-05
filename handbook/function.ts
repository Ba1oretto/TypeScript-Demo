// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

// region Function Type Expressions
function greeter1(fn: (a: string) => void) {
    fn("hello world");
}

function printToConsole(s: string) {
    console.log(s);
}

greeter1(printToConsole);

// or
type GreetFunction = (a: string) => void;

function greeter2(fn: GreetFunction) {
    // ...
}

// endregion

// region Call Signatures
type DescribableFunction = {
    description: string;
    (someArg: number): boolean;
}

function doSomething(fn: DescribableFunction) {
    console.log(fn.description + " returned " + fn(6));
}

let does = <DescribableFunction>function (n: number) {
    return n === 6
}

does.description = "test"

doSomething(does)
// endregion

// region Construct Signatures
class SomeObject {
}

type SomeConstructor = {
    new(s: string): SomeObject;
}

function fn1(ctor: SomeConstructor) {
    return new ctor("hello");
}

fn1(SomeObject);

interface CallOrConstruct {
    new(s: string): Date;

    (n?: number): number;
}

function fn2(c: CallOrConstruct) {
    c(123)
    return new c("20050406")
}

// endregion

// region Generic Functions
// region Inference
function firstElement<Type>(arr: Type[]): Type | undefined {
    return arr[0];
}

function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
    return arr.map(func);
}

const parsed = map(["1", "2", "3"], n => parseInt(n));
// endregion

// region Constraints
function longest<Type extends { length: number }>(a: Type, b: Type) {
    return a.length > b.length ? a : b;
}

console.log(longest([1], [1, 2]));
console.log(longest("alice", "bob"));
// endregion

// region Specifying Type Arguments
function combine<Type>(arr1: Type[], arr2: Type[]) {
    return arr1.concat(arr2);
}

console.log(combine<number | string>([1, 2, 3], ["hello"]));
// endregion

// endregion

// region Optional Parameters
function f1(x?: number) {
    // ...
}

f1();
f1(10);

// default value
function f2(x = 10) {
    // ...
}

declare function f3(x?: number): void;

// f3()
// f3(10)
// f3(undefined) // pass undefined as argument, ok

// endregion

// region Function Overloads
function os(x: string): void; // signature 1
function os(x: string, y: number): void; // signature 2
function os(x: string, y?: number): void { // implementation for signature above, cannot be seen from outside
    console.log(1);
}

os("");
// endregion

// region Declaring this in a Function
const user = {
    id: 123,
    admin: false,
    becomeAdmin: function () {
        this.admin = true;
    }
}

type User = {
    id: number;
    admin: boolean;
}

interface DB {
    userList: User[]

    filterUser(filter: (this: User) => boolean): User[];
}

const db: DB = {
    userList: [],
    filterUser(filter: (this: User) => boolean): User[] {
        return this.userList.filter(filter);
    }
};

db.filterUser(function (this: User) { // 'this' in arrow function represent global value
    return this.admin
});
// endregion

// region Other Types to Know About
function returnVoid(): void {
    return;
}

function objectParameter(obj: object): void {
    console.log(obj);
}

function anyType(a: any): void {
    a.b() // ok
}

function unknownType(a: unknown): void {
    // a.b() // Property 'b' does not exist on type 'unknown'.
}

function neverType(x: string | number): never {
    switch (typeof x) {
        case "string":
            console.log("string");
            break;
        case "number":
            console.log("number");
            break;
        default:
            console.log(x); // typeof x: never
    }
    throw new Error(":(");
}

function functionType(fn: Function): any {
    return fn(1, 2, 3);
}

function functionTypeSafer(fn: () => void): void {
    fn();
}

// endregion

// region Rest Parameters and Arguments
// region Rest Parameters
function restParameter(x: number, ...y: number[]): number[] { // the type of rest parameter must be Array<T> or T[]
    return y.map(v => v * x);
}

console.log(restParameter(10, 1, 2, 3, 4));
// endregion

// region Rest Arguments
const restArr1 = [1, 2, 3];
const restArr2 = [4, 5, 6];
restArr1.push(...restArr2);
console.log(restArr1);
const restArgs = [8, 5] as const; // Inferred as 2-length tuple
const angle = Math.atan2(...restArgs)
// endregion
// endregion

// region Parameter Destructuring
type ABC = { a: number; b: number; c: number };

function parameterDestructionSum({a, b, c}: ABC): number {
    return a + b + c;
}

// endregion

// region Assignability of Functions(Return type void)
type voidFn = () => void; // the returned value will be ignored(return void instead)
const vf1: voidFn = () => {
    return true;
}
const vf2: voidFn = () => true;
const vf3: voidFn = function () {
    return true;
}

const src = [1, 2, 3];
const dest = [0];
src.forEach(v => dest.push(v));
console.log(dest);

function ef1(): void {
    // @ts-ignore
    return true;
}

const ef2 = function (): void {
    // @ts-ignore
    return true;
}
// endregion