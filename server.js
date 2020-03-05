const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const Q = require('q');
const fs = require('fs');

var urls = [];

var companyName, jobTitle, location;

var json = {company:"", Title:"", place:""}

var results = [];

var titles = [];

var companies = [];

var places = [];

const app = express();

app.get('/scrape', (req,res) =>{

    url = "https://stackoverflow.com/jobs"

    request(url, function(error, response, html){
        var $ =cheerio.load(html)

        $(".mb4 fc-black-800 fs-body3").each(function(){
            var data =$(this)

            jobTitle = data.first().text()

            console.log(jobTitle)

            // json['Title'] = jobTitle
            
            // results.push(json)

            titles.push(jobTitle);

        })

        $(".source").each(function(){
            var data =$(this)

            companyName = data.children().first().text()

            console.log(companyName)

            // json['company'] = companyName
            
            // results.push(json)

            companies.push(companyName);
        })
        $(".meta").each(function(){
            var data =$(this)

            location = data.children().first().text()

            console.log(location)

            // json['place'] = location
            
            // results.push(json)

            places.push(location);

        });

        var temp_json = {};


        for(var i=0; i<titles.length; i++){
            //put array elements to temp json
            temp_json['title'] = titles[i];
            temp_json['company'] = companies[i];
            temp_json['place'] = places[i];

            results.push(temp_json);
            temp_json = {};
        }

        

        res.status(200).send(results);

        
        //let jsonString = JSON.stringify(results);
       // fs.writeFileSync('output.json', jsonString, 'utf-8');
        fs.writeFile("output.json", JSON.stringify(results, null, 3), function(error){
            console.log("flie has been created")
        })
    })
})
app.listen(3000, function(){
    console.log("server is listening on port 3000")
});