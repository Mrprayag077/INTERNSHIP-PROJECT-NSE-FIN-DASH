const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const prettier = require('prettier');
const mongoose = require("mongoose");
//const User = require("./users");
const { MongoClient } = require("mongodb");
const axios = require("axios");
const app = express();

// 1 async () =>{}

// 2 async function funname( ){}




// (async () => {
//     const browser = await puppeteer.launch({
//         args: ['--disable-setuid-sandbox', '--no-sandbox']
//     });
//     const page = await browser.newPage();
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
//     await page.goto('https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY');
//     console.log('Page loaded successfully!');

//     console.log('scroll over');
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     console.log('Timeout over');

//     await page.waitForSelector('pre');

//     // Extract the text content of the pre tag
//     const preContent = await page.evaluate(() => {
//         const preTag = document.querySelector('pre');
//         return preTag.textContent;
//     });

//     // Parse the JSON data from the pre tag content
//     const jsonData = JSON.parse(preContent);

//     // Extract only the "filtered.data" array from the JSON data
//     const filteredData = jsonData.filtered.data;

//     console.log(filteredData);

//     await page.screenshot({ path: './pages/example.png' });
//     console.log('Screenshot saved successfully!');




//     await browser.close();
// })();

mongoose.set('strictQuery', false);

// async function main() {
mongoose.connect("mongodb+srv://prayag_SIHH:pp1234@cluster0.tuna9.mongodb.net/nse_intern_proj02?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });


const open_inSchema = {
    timestamp: String,
    current_time: String,
    cummulative_openinterest: Number,
    company_name: String,
    dataa: [
        {

            strikePrice: Number,
            expiryDate: String,
            PE: {
                strikePrice: String,
                expiryDate: String,
                underlying: String,
                identifier: String,
                openInterest: String,
                changeinOpenInterest: String,
                pchangeinOpenInterest: String,
                totalTradedVolume: String,
                impliedVolatility: String,
                lastPrice: String,
                change: String,
                pChange: String,
                totalBuyQuantity: String,
                totalSellQuantity: String,
                bidihoQty: Number,
                bidprice: String,
                askQty: String,
                askPrice: String,
                underlyingValue: String,
            },
            CE: {
                strikePrice: String,
                expiryDate: String,
                underlying: String,
                identifier: String,
                openInterest: String,
                changeinOpenInterest: String,
                pchangeinOpenInterest: String,
                totalTradedVolume: String,
                impliedVolatility: String,
                lastPrice: String,
                change: String,
                pChange: String,
                totalBuyQuantity: String,
                totalSellQuantity: String,
                bidQty: String,
                bidprice: String,
                askQty: String,
                askPrice: String,
                underlyingValue: Number,
            },
        }
    ]

}

const open_in = mongoose.model("open_in", open_inSchema);  //open_in== coll name


// (async () => {

let count = 0;
async function fetchData() {


    try {

        count++;
        var flag;

        // const browser = await puppeteer.launch({ args: ['--disable-setuid-sandbox', '--no-sandbox'] });
        const browser = await puppeteer.launch({ headless: false, args: ['--disable-setuid-sandbox', '--no-sandbox'] });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
        // await page.goto('https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY');
        await page.goto('https://www.nseindia.com/api/option-chain-equities?symbol=ABB');
        console.log('Page loaded successfully!');
        console.log('scroll over');
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('Timeout over');

        const isNotFound = await page.evaluate(() => {
            const div = document.querySelector('div');
            return div && div.innerHTML.includes("Resource not found");
        });

        console.log(`Function ran ${count} times.`);

        if (isNotFound) {

            console.log("Resource not found");
            flag = 1;
            setTimeout(fetchData, 5000);
            await browser.close();
            return;

            // set your var value to true here
        }



        else {
            console.log("Resource found");
            // set your var value to false here
            flag = 0;
            console.log(`Function ran ${count} times.`);

        }


        await page.waitForSelector('pre');

        // Extract the text content of the pre tag
        const preContent = await page.evaluate(() => {
            const preTag = document.querySelector('pre');
            return preTag.textContent;
        });

        const jsonData = JSON.parse(preContent);
        const dataArr = jsonData.filtered.data;
        // console.log(dataArr);

        const timestamp_json = jsonData.filtered.data;


        const formattedData = prettier.format(JSON.stringify(dataArr), { parser: 'json' });
        // write the filtered data to output.json file
        fs.writeFileSync('./pages/output.json', formattedData);

        await page.screenshot({ path: './pages/example.png' });
        console.log('Screenshot saved successfully!');
        await browser.close();





        const currentDate = new Date();
        let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
        console.log('timestamp' + time);


        const dataa = dataArr;





        const timestampp = jsonData.records.timestamp;



        const company_name = jsonData.filtered.data[0].CE.underlying;

        const options = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };

        const date = new Date();
        const formattedDate = date.toLocaleString('en-IN', options);


        let formattedDate1 = formattedDate.slice(0, 11) + ' ' + formattedDate.slice(13, 21);


        // MAIN BLCOK
        const data22 = jsonData.filtered.data;


        // VARS FOR cummulative_openinterest1 SUM
        const strikePrices_all_array = [];
        const changeinopen1_all_array = [];
        const changeinopen1_all_array_PE = [];

        // Loop through the data array and push the strikePrice value of each object into the strikePrices array
        for (let i = 0; i < data22.length; i++) {
            strikePrices_all_array.push(data22[i].strikePrice);
        }



        // SUM OF ALL CE OPEN INTEREST

        for (let i = 0; i < data22.length; i++) {

            changeinopen1_all_array.push(data22[i].CE.changeinOpenInterest);
            // const ceData = data22[i].CE;
            // const middleIndex = Math.floor(ceData.length / 2);
            // const startIndex = middleIndex - 6;
            // const endIndex = middleIndex + 6;
            // const selectedData = changeinOpenInterestArr.slice(startIndex, endIndex + 1);
            // const sum = selectedData.reduce((acc, val) => acc + val, 0);
            // changeinopen1_all_array.push(sum);
        }
        const middleIndex = Math.floor(changeinopen1_all_array.length / 2);

        const startIndex = Math.max(0, middleIndex - 6);
        const endIndex = Math.min(changeinopen1_all_array.length - 1, middleIndex + 6);
        const ceChangeInOpenInterestSubset = changeinopen1_all_array.slice(startIndex, endIndex + 1);

        const sum_CE_OPENINTEREST = ceChangeInOpenInterestSubset.reduce((accumulator, currentValue) => accumulator + currentValue);


        // SUM OF ALL PE OPEN INTEREST

        for (let i = 0; i < data22.length; i++) {
            console.log('hiiiii');
            if (data22[i].PE && typeof data22[i].PE.changeinOpenInterest !== 'undefined') {

                changeinopen1_all_array_PE.push(data22[i].PE.changeinOpenInterest);

            }

            else {
                console.log('value not found skipped' + data22[i].strikePrice)
            }
            // const ceData = data22[i].CE;
            // const middleIndex = Math.floor(ceData.length / 2);
            // const startIndex = middleIndex - 6;
            // const endIndex = middleIndex + 6;
            // const selectedData = changeinOpenInterestArr.slice(startIndex, endIndex + 1);
            // const sum = selectedData.reduce((acc, val) => acc + val, 0);
            // changeinopen1_all_array.push(sum);
        }
        const middleIndex1 = Math.floor(changeinopen1_all_array_PE.length / 2);

        // Get the top 6, middle, and next 6 elements
        const startIndex1 = Math.max(0, middleIndex1 - 6);
        const endIndex1 = Math.min(changeinopen1_all_array_PE.length - 1, middleIndex1 + 6);
        const ceChangeInOpenInterestSubset_PE = changeinopen1_all_array_PE.slice(startIndex1, endIndex1 + 1);

        // Calculate the sum of the subset
        const sum_PE_OPENINTEREST = ceChangeInOpenInterestSubset_PE.reduce((accumulator, currentValue) => accumulator + currentValue);

        console.log("Subset:", ceChangeInOpenInterestSubset_PE);
        // console.log("Sum of CE:", sum_PE_OPENINTEREST);

        // const cummulative_openinterest1 = sum_CE_OPENINTEREST - sum_PE_OPENINTEREST;



        // console.log('cummulative open interest for time=' + ' ' + cummulative_openinterest1 + ' ')




        const existingNote = await open_in.findOne({ timestamp: timestampp });

        if (existingNote) {
            console.log('Note already exists');
        }


        else {
            let newNote = new open_in({
                timestamp: timestampp,
                current_time: formattedDate1,
                cummulative_openinterest: cummulative_openinterest1,
                company_name: company_name,
                dataa,
            }); //schema complete



            newNote.save(function (error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('data saved successfully!');
                    console.log('fetching again in 20 secs');
                }



            }); // note save completed



        } //else complete


    } catch (err) {
        console.error(err);
    }

}

fetchData();







// (async () => {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto('https://www.nseindia.com/option-chain');
//     // await page.type('#select_symbol', 'ABB');
//     await page.waitForSelector('[aria-labelledby="selectSymbolLbl"] > select');
//     await page.select('[aria-labelledby="selectSymbolLbl"] > select', 'ABB');

//     await new Promise(resolve => setTimeout(resolve, 3000));
//     await page.waitForSelector('#optionChainTable-indices');
//     const optionChain = await page.evaluate(() => {
//         const tableRows = Array.from(document.querySelectorAll('#optionChainTable-indices > tr'));
//         return tableRows.map(row => Array.from(row.querySelectorAll('td')).map(cell => cell.innerText.trim()));
//     });
//     console.log(optionChain);
//     await browser.close();
// })();


app.listen(3000, () => console.log('listening on port 3000'));



