import { Agency, Location, Travel } from "./agency.js";

export class Tycoon{
    #user
    #money
    #agencies
    #gain
    #curragency    
    
    constructor(user){
        this.#user = user;
        this.#money = 5;
        this.#agencies = [];
        this.#agencies.push(new Agency(
            new Location("Grand Canyon"))
            .travel.push(new Travel("Train", 5, "path.svg")));
        this.#gain = 0;
        this.#curragency = 0;
    }

    //adds money to account based on the gain
    bookTours(){
        this.money += this.gain;
    }

    moveLocation(index){
        if (index < 0 || index > this.agencies.length){
            throw "You can't go there!"
        }
        this.curragency = index;
    }

    calculateGain(){
        this.gain =0;

        for(agency in this.agencies){

            this.gain+= agency.calculateGain();
        }
    }

    user(){
        return this.#user;
    }

    money(){
        return this.#money;
    }

    currentAgency(){
        const agency = this.#agencies[this.#curragency];
        agency.location();
    }

}