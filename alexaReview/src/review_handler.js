"use strict"; 
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

const readStream = fs.createReadStream('alexa.json');
const ostream = new stream();
const rl = readline.createInterface(readStream, ostream);


const months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];

class ReviewHandler {

    constructor() {
        this.totalRating = {
            fiveStars: 0,
            fourStars: 0,
            threeStars: 0,
            twoStars: 0,
            oneStar: 0
        }
        this.isFileReadCompleted = false;

        this.iTunesStore = {
            totalRating: {
                ...this.totalRating
            },
            reviewsCount:0,
            monthlyAvg:{}
        };
        this.goolgePlayStore = {
            totalRating: {
                ...this.totalRating
            },
            reviewsCount:0,
            monthlyAvg:{}
        }
    }

    readFile() {
        rl.on('line', (line) => {
            try{
                const data = JSON.parse(line);
                this.ProcessRatings(data);
            }catch(err){
                console.log(err);
            }

        });

        rl.on('close', () => {
            this.isFileReadCompleted = true;
        });

    }
    async getReviewByfilter(filter) {

        const reviews =[];
        const readStream2 = fs.createReadStream('alexa.json');
        const ostream2 = new stream();
        const rl2 = readline.createInterface(readStream2, ostream2);

        let  isFilterAvailabe=false;
        if(filter !=undefined ){
            isFilterAvailabe=true
            if(filter.rating !=undefined){
                filter.rating =parseInt(filter.rating);
            }
        }
        //TODO: Filter should be validated for invalid values ex: rating 6 and review source=xyz;

        rl2.on('line', (line) => {
            const data = JSON.parse(line);
            if(isFilterAvailabe){

                if(this.isValidfilterReview(filter, data)){
                    reviews.push(data);
                }
                
            }else{
                reviews.push(data);
            }

        });

        return new Promise((resolve, reject)=>{
            rl2.on('close', () => {
                resolve(reviews);
          });
        })
    }

    async addReview(req) {
        const data = req.body;

        let msg = this.validateReview(data);

        if(msg !=null){
            throw 'Missing Parameters: '+msg;
        }

        return new Promise((resolve, reject)=>{
            fs.appendFile('alexa.json', JSON.stringify(data) +'\r\n' , (err)=>{
                if(err){
                    reject(err);
                }else{
                    this.ProcessRatings(data);
                    resolve(data);                  
                }    
            })
        })
    }

   async getMonthlyAvgByStore() {

        // This might required for very very big files.
        if(this.isFileReadCompleted == false){
            return new Promise((resolve,reject)=>{
                rl.on('close', () => {
                    this.isFileReadCompleted = true;
                    resolve(this.getMonthlyAvg());
                   
                });
            });
        }else{
            return this.getMonthlyAvg();
        }
    }

    async totalRatings() {

        // This might required for very very big files.
        if(this.isFileReadCompleted == false){
            return new Promise((resolve,reject)=>{
                rl.on('close', () => {
                    this.isFileReadCompleted = true;
                    resolve(this.getTotalRatings());
                   
                });
            });
        }else{
            return this.getTotalRatings();
        }
    }

    // Helper functions 

    getTotalRatings(){
        return {
            iTunes:{
                ...this.iTunesStore.totalRating
            },
            GooglePlayStore:{
                ...this.goolgePlayStore.totalRating
            },
        } 
    }

    ProcessRatings(data){

        if (data.review_source == "GooglePlayStore") {
            this.goolgePlayStore.reviewsCount++;
            this.filterRating(this.goolgePlayStore.totalRating, data.rating)
            this.filterRatingsByMonth(this.goolgePlayStore.monthlyAvg, data.reviewed_date, data.rating);

        } else if (data.review_source == "iTunes") {
            this.iTunesStore.reviewsCount++;
            this.filterRating(this.iTunesStore.totalRating, data.rating)
            this.filterRatingsByMonth(this.iTunesStore.monthlyAvg, data.reviewed_date, data.rating);
        }

    }

    filterRatingsByMonth(avgObj, reviewDate, rating) {

        const date = new Date(reviewDate);
        if (avgObj[date.getMonth()]) {
            avgObj[date.getMonth()].push(rating);
        } else {
            avgObj[date.getMonth()] = [rating]
        }
    }

    filterRating(obj, rating) {

        if (!rating) {
            return;
        }
        // Todo: switch case
        if (rating == 5) {
            obj.fiveStars++;
        } else if (rating == 4) {
            obj.fourStars++;
        } else if (rating == 3) {
            obj.threeStars++;
        } else if (rating == 2) {
            obj.twoStars++;
        } else {
            obj.oneStar++;
        }
    }

    calcAvg(avgObj) {

        for (let obj in avgObj) {
            if (avgObj[obj] && avgObj[obj].length != 0) {
                const sum =  avgObj[obj].reduce((a,b)=> a+b,0);

                avgObj[months[parseInt(obj)]] = sum/avgObj[obj].length;

                delete avgObj[obj];
            }
        }
    }

    validateReview(data){

        // TODo: Need to validate the values.ex: rating can't be more than 5
        let mesg=null;
        if(!data.review){
            mesg='Review '
        } 
        
        if(!data.review_source){
            mesg='review_source '
        }

        if(!data.rating){
            mesg='rating '
        }

        if(!data.reviewed_date){
            mesg='reviewed_date '
        }
        return mesg;
    }

    isValidfilterReview(filters, data){

        let valid=true;

        for(let filter in filters){
            
            if(filters[filter] == undefined ||  filters[filter] != data[filter]){
                valid= false;
                break;
            }
        }
        return valid;
    }

    getMonthlyAvg(){

        let iTunesMontRatings=JSON.parse(JSON.stringify(this.iTunesStore.monthlyAvg));

        this.calcAvg(iTunesMontRatings);

        const goolgePlayStoreMonthRatins=JSON.parse(JSON.stringify(this.goolgePlayStore.monthlyAvg));

        this.calcAvg(goolgePlayStoreMonthRatins);

        return {
            'iTunes':iTunesMontRatings,
            'GoolgePlayStore':goolgePlayStoreMonthRatins
        }
    }

}

module.exports.ReviewHandler = ReviewHandler;