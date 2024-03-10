class Agency{
    constructor(location){
        Object.defineProperty(this, "location", {
            value: location,
            writable: false,
            configurable: false,
          });
    }
}

class Travel extends Upgrade{}

class Attraction extends Upgrade{}

class Hospitality extends Upgrade{}

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

class Location{
    #name;
    #spattraction;
    constructor(name, spattraction){
        this.#name=name;
        this.#spattraction = spattraction;
    }

    name(){
        return this.#name;
    }

    attraction(){
        return this.#spattraction;
    }
}