export default class Location{
    #name;
    #attraction;
    #price
    #latitude
    #longitude
    #picsumid

    constructor(name){
        switch (name){
            case "the Grand Canyon":
                this.#attraction = "Colorado Rafting";
                this.#price = 0;
                this.#latitude = 36.0544;
                this.#longitude = -112.1401;
                this.#picsumid = 564;
                break;
            case "New York":
                this.#attraction = "Broadway";
                this.#price = 1000;
                this.#latitude = 40.7128;
                this.#longitude = -74.006;
                this.#picsumid = 411;
                break;
            case "Banff":
                this.#attraction = "Ski Pass";
                this.#price = 70000;
                this.#latitude = 51.1784;
                this.#longitude = -115.5708;
                this.#picsumid = 450;
                break;
            case "Cabo San Lucas":
                this.#attraction = "Zipline and High Adventure";
                this.#price = 500000;
                this.#latitude = 22.8948;
                this.#longitude = -109.9152;
                this.#picsumid = 244;
                break;
            case "Hawaii":
                this.#attraction = "Surf";
                this.#price = 10000000;
                this.#latitude = 19.8987;
                this.#longitude = -155.6659;
                this.#picsumid = 360;
                break;
            case "the British Virgin Isles":
                this.#attraction = "Sailboating";
                this.#price = 83200000;
                this.#latitude = 18.4207;
                this.#longitude = -64.64;
                this.#picsumid = 700
                break;
            case "Australia":
                this.#attraction = "Great Barrier Reef Snorkeling";
                this.#price = 0;
                this.#latitude = -16.9203;
                this.#longitude = 145.771;
                this.#picsumid = 615;
                break;
            case "London":
                this.#attraction = "Crown Jewel Tour";
                this.#price = 0;
                this.#latitude = 51.5072;
                this.#longitude = 0.1276;
                this.#picsumid = 618;
                break;
            case "Japan":
                this.#attraction = "Shrine and Temple";
                this.#price = 0;
                this.#latitude = 35.0116
                this.#longitude = 135.7681
                this.#picsumid = 371
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

    coordinates(){
        return [this.#latitude, this.#longitude];
    }

    picsumid(){
        return this.#picsumid;
    }

    tojson(){
        return `{"name": "${this.#name}"}`;
    }
}