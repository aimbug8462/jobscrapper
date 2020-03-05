const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const mongoose = require('mongoose');
const fs = require('fs');

var results = [];

var titles = [];

var companies = [];

var places = [];

const app = express();

mongoose.connect('mongodb://localhost/testdb', { useNewUrlParser: true});

var db = mongoose.connection;

if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

app.get('/scrape', (req,res) =>{

    url = "https://jobs.github.com/positions"

    request(url, function(error, response, html){
        var $ =cheerio.load(html)

        $(".title").each(function(){
            var data =$(this)

            jobTitle = data.children().first().text()

            console.log(jobTitle)

            titles.push(jobTitle);

        })

        $(".source").each(function(){
            var data =$(this)

            companyName = data.children().first().text()

            console.log(companyName)

            companies.push(companyName);
        })
        $(".meta").each(function(){
            var data =$(this)

            location = data.children().first().text()

            console.log(location)

            places.push(location);

        });

        var temp_json = {};


        for(var i=0; i<titles.length; i++){
            //put array elements to temp json
            temp_json['title'] = titles[i];
            temp_json['company'] = companies[i];
            temp_json['place'] = places[i];
            temp_json['id'] = i+1;

            results.push(temp_json);
            temp_json = {};
        }

        res.status(200).send(results);
        


        db.collection('jobs').insert(results);


        
        fs.writeFile("output.json", JSON.stringify(results, null, 3), function(error){
            console.log("flie has been created")
        })
    })
})

app.listen(3000, function(){
    console.log("server is listening on port 3000")
});