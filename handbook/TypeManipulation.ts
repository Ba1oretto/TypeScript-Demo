// noinspection JSUnusedGlobalSymbols

// region Generic Types
const identity = function <Type>(arg: Type): Type {
    return arg;
};

let myIdentity1: <Input>(i: Input) => Input = identity;

let myIdentity2: { <Type>(arg: Type): Type; } = identity;

interface GenericIdentityFn1 {
    <Type>(arg: Type): Type;
}

let myIdentity3: GenericIdentityFn1 = identity;

interface GenericIdentityFn2<Type> {
    (arg: Type): Type;
}

let myIdentity4: GenericIdentityFn2<string> = identity;
// endregion

// region The keyof type operator
type KPoint = {
    x: number;
    y: number;
};

type KP = keyof KPoint; // "x" | "y"

type Arrayish = {
    [n: number]: unknown;
};

type A = keyof Arrayish; // index signature type

type Mapish = {
    [k: string]: boolean;
};

type M = keyof Mapish; // "string" | "number", index signature key are always coerced to a string
// endregion

// region The typeof type operator
function f() {
    return {x: 10, y: 3};
}

type P = ReturnType<typeof f>
// endregion

// region Indexed Access Types
type IPerson = {
    age: number;
    name: string;
    alive: boolean;
};

type Age = IPerson["age"];
type I1 = IPerson["age" | "name"];
type I2 = IPerson[keyof IPerson];
type AliveOrName = "alive" | "name";
type I3 = IPerson[AliveOrName];

const myArray = [
    {name: "Alice", age: 15},
    {name: "Bob", age: 23},
    {name: "Eve", age: 38},
];
type APerson = typeof myArray[number];
type Age1 = typeof myArray[number]["age"];
type Age2 = APerson["age"];
type key = "age";
type Age3 = APerson[key];
// endregion

// region Conditional Types
interface Animal {
    live(): void;
}

interface Dog extends Animal {
    woof(): void;
}

type Example1 = Dog extends Animal ? number : string;
type Example2 = RegExp extends Animal ? number : string;

interface IdLabel {
    id: number;
}

interface NameLabel {
    name: string;
}

type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;

type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
    message: string;
}

type EmailMessageContents = MessageOf<Email>;

type Flatten<T> = T extends Array<unknown> ? T[number] : T;

type Str = Flatten<string[]>;
type Num = Flatten<number>;

type IFlatten<T> = T extends Array<infer I> ? I : T;

type GetReturnType<F> = F extends (...args: unknown[]) => infer R ? R : never;
type INum = GetReturnType<() => number>;
type IStr = GetReturnType<(x: boolean) => string>;
type IBools = GetReturnType<(a: string, b: object) => Array<boolean>>;

declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

type LastSignatureT = ReturnType<typeof stringOrNum>;
// endregion

// region Distributive Conditional Types
type ToArray<T> = T extends any ? T[] : never;
type TOArrayNonDist<T> = [T] extends [any] ? Array<T> : never;

type StrArrOrNumArr = TOArrayNonDist<string | number>;
// endregion

// region Mapped Types
type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean;
};

type FeatureFlags = {
    darkMode: () => void;
    newUserProfile: () => void;
};

type featureOptions = OptionsFlags<FeatureFlags>;

// region Mapping Modifiers
type CreateMutable<T> = {
    -readonly [Property in keyof T]: T[Property];
};

type Concrete<T> = {
    [Property in keyof T]-?: T[Property];
}

type LockedAccount = {
    readonly id: string;
    readonly name: string;
};

type MaybeUser = {
    id: string;
    name?: string;
    age?: number;
};

type UnlockedAccount = CreateMutable<LockedAccount>;
type CUser = Concrete<MaybeUser>;
// endregion

// region Key Remapping via as
type Getters<T> = {
    [P in keyof T as `get${Capitalize<P & string>}`]: () => T[P];
};

type GPerson = {
    name: string;
    age: number;
    location: string;
};

type LazyPerson = Getters<GPerson>;

type RemoveKindField<T> = {
    [P in keyof T as Exclude<P, "kind">]: T[P];
};

interface Circle {
    kind: "circle";
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;

type EventConfig<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
};

type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>;

type ExtractPII<T> = {
    [P in keyof T]: T[P] extends { pii: true } ? true : false;
};

type DBField = {
    id: { format: "incrementing" };
    name: { type: string, pii: true };
};

type ObjectNeedingGDPRDeletion = ExtractPII<DBField>;
// endregion
// endregion

// region Template Literal Types
type World = "world";

type Greeting = `hello ${World}`;

type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`

type PropEventSource<T> = {
    on<K extends keyof T>(eventName: `${K & string}Changed`, callback: (newValue: T[K]) => void): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

const person = makeWatchedObject({
    firstName: "Saoirse",
    lastName: "Ronan",
    age: 26
});

person.on("ageChanged", (newValue) => {
    console.log(`firstName was changed to ${newValue}!`);
});
// endregion

// region Intrinsic String Manipulation Types
type UASCIICacheKey<S extends string> = `ID-${Uppercase<S>}`;
type UMainID = UASCIICacheKey<"my_app">;

type LASCIICacheKey<S extends string> = `id-${Lowercase<S>}`;
type LMainID = LASCIICacheKey<"MY_APP">;

type CapitalizeGreeting = Capitalize<"hello, world">;
type UnCapitalizeGreeting = Uncapitalize<"HELLO, WORLD">;
// endregion