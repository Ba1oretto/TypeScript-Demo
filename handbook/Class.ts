// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

// region Class Members
class Animal {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
}

class Dog extends Animal {
    _age: number;

    constructor(name: string); // signature
    constructor(name: string, age: number);

    constructor(name: string, age: number = 0) { // implementation
        super(name);
        this._age = age;
    }

    squareAge(): void { // method
        this._age **= 2;
    }

    get age(): number { // getter
        return this._age;
    }

    set age(value: number | string) { // setter, cannot have return type annotation
        this._age = Number(value);
    }
}

class IndexSignature { // hard to use :(
    [index: string]: boolean | ((index: string) => boolean);

    check(index: string): boolean {
        return this[index] as boolean;
    }
}

// endregion

// region Class Heritage
interface Pingable {
    x: number;
    y?: number;

    ping(): void;

    log(content: string): void;
}

class Sonar implements Pingable {
    ping(): void {
        console.log("ping!");
    }

    // log(content): void { // Parameter 'content' implicitly has an 'any' type.
    log(content: string): void {
        content = content.toLowerCase(); // Notice no error here!
        console.log(content);
    }

    x: number = 0;
    // y? implementing an interface with an optional property doesn’t create that property!
}

class Base {
    animal: Animal;

    constructor(animal: Animal) {
        this.animal = animal;
    }

    greet(): void {
        console.log("greeting!")
    }
}

class Derived extends Base {
    declare animal: Dog; // only specific the type by using 'declare' keyword(don't need to have initializer in class 'Derived')

    constructor(dog: Dog) {
        super(dog);
    }

    move(): void {
        console.log("Moving along!")
    }

    greet(name?: string) { // override
        if (name === undefined) super.greet();
        else console.log(`Hello, ${name.toUpperCase()}`);
    }
}

class MsgError extends Error {
    constructor(msg: string) {
        super(msg);
    }

    sayHello() {
        return "hello " + this.message;
    }
}

// endregion

// region Member Visibility
class BaseMemberVisibility {
    protected x: number = 0;
}

class MemberVisibility extends BaseMemberVisibility {
    private y: number = 0; // soft private
    #z = 0; // hard private

    public greet() {
        console.log("hi!");
    }

    protected getName() {
        return "hi!";
    }

    private getX(base: BaseMemberVisibility) {
        // base.x // x can only be accessed through class 'MemberVisibility' and its subclass
    }

    getY(other: MemberVisibility) {
        console.log(other.y); // No error
    }
}

console.log(new MemberVisibility()["y"]); // OK
// endregion

// region static Blocks in Classes
class Foo {
    static #count = 0;

    get count(): number {
        return Foo.#count;
    }

    static {
        Foo.#count++;
    }
}

// endregion

// region Generic Classes
class GBox<Type> {
    contents: Type;

    constructor(value: Type) {
        this.contents = value;
    }
}

console.log(new GBox<string>("hello!").contents);
// endregion

// region this at Runtime in Classes
class MyClass {
    name: string = ":(";

    getNameArrow = () => {
        return this.name;
    };

    getNameNormal(this: MyClass): string {
        return this.name;
    }
}

const myClass = new MyClass();
const g1 = myClass.getNameArrow; // defined but without call it
console.log(g1()); // arrow function, 'this' refers to 'MyClass' instance
console.log(myClass.getNameNormal()); // with 'this' parameter, 'this' refers to 'MyClass' instance

// const g2 = myClass.getNameNormal; // 'this' is the caller of this method
// console.log(g2()); // caller
// endregion

// region this Types
class TBox {
    content: string = "";

    sameAs(other: this): boolean {
        return other.content === this.content;
    }
}

class DerivedTBox extends TBox {
    otherContent: string = "?";
}

const tBox = new TBox();
const derivedTBox = new DerivedTBox();
// derivedTBox.sameAs(tBox) // error, need instance of DerivedTBox or its subclass
// endregion

// region this-based type guards
class FileSystemObject {
    value?: string;

    hasValue(this: FileSystemObject): this is { value: string } {
        return this.value !== undefined;
    }

    isFile(): this is FileRep {
        return this instanceof FileRep;
    }

    isDir(): this is Directory {
        return this instanceof Directory;
    }

    isNetworked(): this is Networked & this {
        return this.networked;
    }

    constructor(public path: string, private networked: boolean) {
    }
}

class FileRep extends FileSystemObject {
    constructor(path: string, public content: string) {
        super(path, false);
    }
}

class Directory extends FileSystemObject {
    children: Array<FileSystemObject>;
}

interface Networked {
    host: string;
}

const fso: FileSystemObject = new FileRep("P:/test.txt", "foo");

if (fso.isFile()) {
    console.log(fso.content);
} else if (fso.isDir()) {
    console.log(fso.children);
} else if (fso.isNetworked()) {
    console.log(fso.host);
}
// endregion

// region Parameter Properties
class Params {
    constructor(public x: number, protected y: number, private z: number, readonly a: number) { // visibility default public
    }
}
// endregion

// region Class Expressions
const someClass = class<Type> {
    content: Type;
    constructor(value: Type) {
        this.content = value;
    }
};

const m = new someClass<string>("test");
// endregion

// region abstract Classes and Members
abstract class ABase {
    abstract getName(): string;

    printName() {
        console.log("Hello, " + this.getName());
    }
}

class ADerived extends ABase {
    getName(): string {
        return "barroit";
    }
}

new ADerived().printName();
// endregion

// region Abstract Construct Signatures
const greet = function <T extends ABase>(ctor: new () => T): T { // constructor signature
    return new ctor();
}

greet(ADerived).printName();
// endregion

// region Relationships Between Classes
class Point1 {
    x = 0;
    y = 0;
}

class Point2 {
    x = 0;
    y = 0;
}

const p: Point1 = new Point2(); // compared structurally

class Person {
    name: string;
    age: number;
}

class Employee {
    name: string;
    age: number;
    salary: number;
}

const h: Person = new Employee(); // Ok

class Empty {}

const fn = function (x: Empty) {
}

fn(window);
fn({});
fn(fn);
// endregion