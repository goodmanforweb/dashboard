let list: number[] = [1, 2, 3];
let isDone: boolean = false;

let x: [string, number];
// Initialize it
x = ['hello', 10];


enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
let colorName: string = Color[2];


let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean

function warnUser(): void {
  alert("This is my warning message");
}

let unusable: void = undefined;
unusable = null;


let u: undefined = undefined;
let n: null = null;

let unknow: string | number | object = {};

function error(message: string): never {
  throw new Error(message);
}


let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
// let strLength: number = (someValue as string).length;


interface Point {
  readonly x: number;
  readonly y: number;
}


let p:Point = {x:23, y: 44};

export default list;