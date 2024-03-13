import { Agency, Location, Travel } from "./agency.js";

export class Tycoon{
    #user;
    #money;
    #agencies;
    #gain;
    #curragency;

    constructor(user){
        this.#user = user;
        this.#money = 5;
        this.#agencies = [];
        this.#agencies.push(new Agency(new Location("the Grand Canyon")));
        this.#curragency = 0;
        this.#gain = 0;
    }

    //adds money to account based on the gain
    bookTours(){
        this.#money += this.#gain;
    }

    moveLocation(index){
        if (index < 0 || index > this.#agencies.length){
            throw "You can't go there!";
        }
        this.#curragency = index;
    }

    calculateGain(){
        this.#gain =0;

        for(let i = 0; i < this.#agencies.length; i++){

            this.#gain+= this.#agencies[i].calculateGain();
        }
    }

    buy(price, agency){
        if (price > this.#money){
            throw new Error("Not enough money!");
        }
        this.#agencies[this.#curragency] = agency;
        this.#money -= price;
    }

    currentAgency(){
        return this.#agencies[this.#curragency];
    }

    user(){
        return this.#user;
    }

    money(){
        return this.#money;
    }
}