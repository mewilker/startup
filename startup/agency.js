export class Agency{
    //TODO: make property collections of each type of upgrade

    constructor(location){
        Object.defineProperty(this, "place", {
            value: location,
            writable: false,
            configurable: false,
        });

        this.travel = [];
        this.attractions = [];
        this.hospitality = [];
    }

    calculateGain(){
        let result = 0;
        for (let tindex = 0; i < this.travel.length; tindex++){
            result += this.travel[tindex].price() *.1;
        }
        for (let aindex = 0; i < this.attractions.length; aindex++){
            result += this.attractions[aindex].price();
        }
        for (let hindex = 0; i < this.hospitality.length; hindex++){
            result += this.hospitality[hindex].price() *.1;
        }
        result + this.place.price();
        return result;
    }

    location(){
        return this.place;
    }
}

class Upgrade{
    #name;
    #price;
    #imgpath;
    constructor(name, price, imgpath){
        this.#name = name;
        this.#price = price;
        this.#imgpath = imgpath;
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

}

export class Travel extends Upgrade{
    constructor(type, price, imgpath){
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
                throw "That's not a vehicle you can buy!";
        }
        super(type, price, imgpath);
    }
}

export class Attraction extends Upgrade{
    constructor(type, price, imgpath){
        switch (type) {
            case "Tour Guide":
                break;
            case "Dining Experience":
                break;
            //case location spectial
            default:
                throw "That attraction doesn't exist!";
        }
        super(type, price, imgpath);
    }
}

export class Hospitality extends Upgrade{
    constructor(type, price, imgpath){
        switch (type) {
            case "Hostel":
                break;
            case "Bead and Breakfast":
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
                throw "That's not a vehicle you can buy!";
        }
        super(type, price, imgpath);
    }
}

export class Location{
    #name;
    #attraction;
    #price

    constructor(name){
        switch (name){
            case "Grand Canyon":
                this.#attraction = "Colorado Rapids";
                this.#price = 0;
                break;
            //TODO add more locations
            default:
                throw "That's not a place you can expand!"
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
}