export class Agency{
    //TODO: make property collections of each type of upgrade

    constructor(location){
        this.location = location;
        this.travel = [];
        this.attractions = [];
        this.hospitality = [];
    }

    calculateGain(){
        let result = 0;
        for (let tindex = 0; tindex < this.travel.length; tindex++){
            result += this.travel[tindex].clickgain();
        }
        for (let aindex = 0; aindex < this.attractions.length; aindex++){
            result += this.attractions[aindex].clickgain();
        }
        for (let hindex = 0; hindex < this.hospitality.length; hindex++){
            result += this.hospitality[hindex].clickgain();
        }
        result + this.location.price();
        return result;
    }

    place(){
        return this.location.name();
    }

    countAllUpgrades(){
        return this.travel.length + this.attractions.length + this.hospitality.length;
    }

    specialAttraction(){
        return this.location.attraction();
    }

    tojson(){
        let json =`{"location":`;
        let builder = this.location.tojson();
        json = json + builder + ",";
        builder = `"travel":[`;
        json = json + builder;
        for (let i = 0; i< this.travel.length-1; i++){
            builder = this.travel[i].tojson();
            json = json + builder + ",";
        }
        if (this.travel.length > 0){
            builder = this.travel[this.travel.length-1].tojson();
            json = json + builder;
        }
        json = json + "],";

        builder = `"attractions":[`;
        json = json + builder;
        for (let i = 0; i< this.attractions.length-1; i++){
            builder = this.attractions[i].tojson();
            json = json + builder + ",";
        }
        if (this.attractions.length > 0){
            builder = this.attractions[this.attractions.length-1].tojson();
            json = json + builder;
        }
        json = json + "],";

        builder = `"hospitality":[`;
        json = json + builder;
        for (let i = 0; i< this.hospitality.length-1; i++){
            builder = this.hospitality[i].tojson();
            json = json + builder + ",";
        }
        if (this.hospitality.length > 0){
            builder = this.hospitality[this.hospitality.length-1].tojson();
            json = json + builder;
        }
        json = json + "]}";
        return json;
    }

}

class Upgrade{
    #name;
    #price;
    #imgpath;
    #clickgain;
    constructor(name, price, imgpath, clickgain){
        this.#name = name;
        this.#price = price;
        this.#imgpath = imgpath;
        this.#clickgain = clickgain;
    }

    type(){
        return this.#name;
    }

    price(){
        return this.#price;
    }

    imgpath(){
        return this.#imgpath;
    }

    clickgain(){
        return this.#clickgain;
    }

    tojson(){
        return `{"name": "${this.#name}",` +
        `"price": ${this.#price},` + 
        `"clickgain": ${JSON.stringify(this.#clickgain)}}`;
    }

}

export class Travel extends Upgrade{
    constructor(type, price, clickgain){
        switch (type) {
            case "Train":
                break;
            case "Bus":
                break;
            case "Cruise Ship":
                break;
            case "Plane":
                break;
            case "Jet":
                break;
            default:
                throw new Error("That's not a vehicle you can buy!");
        }
        super(type, price, "plane-departure-solid.svg", clickgain );
    }
}

export class Attraction extends Upgrade{
    constructor(type, price, clickgain){
        switch (type) {
            case "Tour Guide":
                break;
            case "Dining Experience":
                break;
            case "Exp":
                break;
            default:
                throw new Error("That attraction doesn't exist!");
        }
        super(type, price, "binoculars-solid.svg", clickgain);
    }
}

export class Hospitality extends Upgrade{
    constructor(type, price, clickgain){
        switch (type) {
            case "Hostel":
                break;
            case "Bed and Breakfast":
                break;
            case "Inn":
                break;
            case "Motel":
                break;
            case "Hotel":
                break;
            case "Resort":
                break;
            default:
                throw new Error("That's not hospitality!");
        }
        super(type, price, "hotel-solid.svg", clickgain);
    }
}

export class Location{
    #name;
    #attraction;
    #price

    constructor(name){
        switch (name){
            case "the Grand Canyon":
                this.#attraction = "Colorado Rafting";
                this.#price = 0;
                break;
            case "New York":
                this.#attraction = "Broadway";
                this.#price = 1000;
                break;
            case "Banff":
                this.#attraction = "Ski Pass";
                this.#price = 0;
                break;
            case "Cabo San Lucas":
                this.#attraction = "Zipline and High Adventure";
                this.#price = 0;
                break;
            case "Hawaii":
                this.#attraction = "Surf";
                this.#price = 0;
                break;
            case "the British Virgin Isles":
                this.#attraction = "Sailboating";
                this.#price = 0;
                break;
            case "Australia":
                this.#attraction = "Great Barrier Reef Snorkeling";
                this.#price = 0;
                break;
            case "London":
                this.#attraction = "Crown Jewel Tour";
                this.#price = 0;
                break;
            case "Japan":
                this.#attraction = "Shrine and Temple";
                this.#price = 0;
                break;
            default:
                throw new Error ("That's not a place you can expand!");
            }
        this.#name = name;
    }

    name(){
        return this.#name;
    }

    attraction(){
        return this.#attraction;
    }

    price(){
        return this.#price;
    }

    tojson(){
        return `{"name": "${this.#name}"}`;
    }
}