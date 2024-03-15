import { Agency, Attraction, Hospitality, Location, Travel } from "./agency.js";

export class Tycoon{
    #user;
    #money;
    #agencies;
    #gain;
    #curragency;

    constructor(user, object){
        if (object == null){
            this.#user = user;
            this.#money = 5;
            this.#agencies = [];
            this.#agencies.push(new Agency(new Location("the Grand Canyon")));
            this.#curragency = 0;
            this.#gain = 0;
        }
        else{
            this.#user = user;
            this.#money = object.money;
            this.#curragency = object.curragency;
            this.#gain = object.gain;
            this.#agencies = [];
            for (let i = 0; i < object.agencies.length; i++){
                let toadd = object.agencies[i];
                let agency = new Agency(new Location(toadd.location.name));
                for (let j = 0; j < toadd.travel.length; j++){
                    let objtravel = toadd.travel[j];
                    let upgrade = new Travel(objtravel.name, objtravel.price, objtravel.clickgain);
                    agency.travel.push(upgrade);
                }
                for (let j = 0; j < toadd.attractions.length; j++){
                    let objattraction = toadd.attractions[j];
                    let upgrade = new Attraction(objattraction.name, objattraction.price, objattraction.clickgain);
                    agency.attractions.push(upgrade);
                }
                for (let j = 0; j < toadd.hospitality.length; j++){
                    let objhosp = toadd.hospitality[j];
                    let upgrade = new Hospitality(objhosp.name, objhosp.price, objhosp.clickgain);
                    agency.hospitality.push(upgrade);
                }
                for (let j = 0; j < toadd.availableLocations.length; j++){
                    let obj = toadd.availableLocations[j];
                    agency.hospitality.push(obj);
                }
                this.#agencies.push(agency);
            }
            this.calculateGain();
        }
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

    buy(price){
        if (price > this.#money){
            throw new Error("Not enough money!");
        }
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

    tojson(){
        let json = `{"money": ${this.#money},` +
            `"gain": ${this.#gain},`+ 
            `"curragency": ${this.#curragency},` +
            `"agencies":[`;
        let builder = "";
        for (let i = 0; i< this.#agencies.length-1; i++){
            builder = this.#agencies[i].tojson();
            json = json + builder + ",";
        }
        if (this.#agencies.length > 0){
            builder = this.#agencies[this.#agencies.length-1].tojson();
            json = json + builder;
        }
        json = json + "]}";
        return json;
    }
}