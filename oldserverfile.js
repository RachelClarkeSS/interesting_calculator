const express = require('express');
const app = express();
var server = require('http').createServer(app);
const bodyParser = require("body-parser");
var path = require("path");
const e = require('express');
const port = 8080;
app.use(bodyParser.urlencoded({extended: true}));

function reformatDate(dateStr){
  dArr = dateStr.split("-");  // ex input "2010-01-18"
  return dArr[2]+ "/" +dArr[1]+ "/" +dArr[0].substring(2); //ex out: "18/01/10"
}

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
  });

  app.post('/showAnswer', (req,res)=>{ 
    var num1 = parseFloat(req.body.base0);
    var num2 = parseFloat(req.body.interest0);
    num2 = num2 / 100;
    var answer = (num2 * num1) / 365;
    var bodyobj = req.body.commence0;
    var saverobj = req.body.saver;
    delete req.body.saver; 
    var receiveobj = req.body.receive;
    var amountobj = req.body.amount;
    var reduced = false;
    delete req.body.receive;
    delete req.body.amount;
    var globalDays = 0;
    var globalInterest = 0;
    var arrayOfObjects = Object.values(req.body);
    var date1 = req.body.commence0;
    var date2 = req.body.terminate0;
    var base2 = -4;
    var interest2 = -3;
    var commence2 = -2;
    var terminate2 = -1;
    var receiveIndex = 0;
    var results = "<table class='table table-striped table-dark'><tr><th style='width: 40%'><p><b>"+
    "Period</b></p></th><th class='thead-dark' style='width: 15%'><p><b>Days</b></p></th><th class='thead-dark' style='width: 15%'><p>"+
    "<b>Rate</b></p></th><th class='thead-dark' style='width: 30%'><p><b>Interest</b></p></th>"

    // 1 rate, max 2 dates and no poa

    if (bodyobj[0].length == 1 && saverobj[0]=="S"){
      if (typeof receiveobj === 'undefined'){
        console.log("1 rate 2 periods only");
        console.log(req.body);
        var diff = Math.floor((Date.parse(date2) - Date.parse(date1)) / 86400000);
        answer = answer * diff;
        answer = answer.toFixed(2);
        answer = parseFloat(answer);
        globalDays += diff;
        globalInterest += answer;
        var answer9 = answer.toLocaleString("en", {minimumFractionDigits: 2});

        var date1y = reformatDate(date1);
        var date2z = reformatDate(date2);
        
        results += "<tr><td><p>" + 
        date1y + " " + "to" + " " + date2z +"</p></td><td"+
        "><p>" + diff + "</p></td>" + 
        "<td><p>"+req.body.interest0+"%</p></td><td><p>£"+answer9+"</td></tr>";

        // 1 rate, max 2 dates and 1 poa

      }else if(receiveobj[0].length == 1 && saverobj[0]=="S"){
        if (receiveobj > date1 && receiveobj < date2){
          var date3 = receiveobj;
          var diff1 = Math.floor((Date.parse(date3) - Date.parse(date1)) / 86400000);
          var diff2 = Math.floor((Date.parse(date2) - Date.parse(date3)) / 86400000);
          var answer1 = answer * diff1;
          answer1 = answer1.toFixed(2);
          answer1 = parseFloat(answer1);
          var answer2 = (num1 - amountobj);
          answer2 = (num2 * answer2) / 365;
          answer2 = answer2 * diff2;
          answer2 = answer2.toFixed(2);
          answer2 = parseFloat(answer2);
          globalDays += diff1 + diff2;
          globalInterest += answer1 + answer2;
          var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
          var answer10 = answer2.toLocaleString("en", {minimumFractionDigits: 2});
          amountobj = parseFloat(amountobj);
          var date1y = reformatDate(date1);
          var date2z = reformatDate(date2);
          var date3p = reformatDate(date3);
          var amountobj9 = amountobj.toLocaleString("en", {minimumFractionDigits: 2});
          results += "<tr><td><p>" + 
          date1y + " " + "to" + " " + date3p +"</p></td><td"+
          "><p>" + diff1 + "</p></td>" + 
          "<td><p>"+req.body.interest0+"%</p></td><td><p>£"+answer9+"</td></tr>";
          results += "<tr><td colspan='4'><p style='color: green;'>£"+amountobj9 + " " + 
          "POA received on" + " " + date3p+"</p></td></tr>";
          results += "<tr><td><p>" + 
          date3p + " " + "to" + " " + date2z +"</p></td><td"+
          "><p>" + diff2 + "</p></td>" + 
          "<td><p>"+req.body.interest0+"%</p></td><td><p>£"+answer10+"</td></tr>";
        }
      }
      
      //1 rate, more than 2 dates and no poa
 
    } else if (bodyobj[0].length > 1 && saverobj[0]=="S" && typeof receiveobj === 'undefined') { 

          console.log("1 rate and more than 2 periods")
          console.log(req.body);
          console.log(saverobj.length);
          for (i=0; i<date1.length; i++){
            var date1a = req.body.commence0[i];
            var date2a = req.body.terminate0[i];
            var diff = Math.floor((Date.parse(date2a) - Date.parse(date1a)) / 86400000);
            answer = (num2 * num1) / 365;
            answer = answer * diff;
            answer = answer.toFixed(2);
            answer = parseFloat(answer);
            var answer9 = answer.toLocaleString("en", {minimumFractionDigits: 2});

            var date1y = reformatDate(req.body.commence0[i]);
            var date2z = reformatDate(req.body.terminate0[i]);
      
            globalDays += diff;
            globalInterest += answer;
            results += "<tr><td><p>" + 
            date1y + " " + "to" + " " + date2z +
            "</p></td><td><p>" + diff + "</p></td><td><p>"+req.body.interest0+"%</p></td>"+
            "<td><p>£" + answer9 + "</p></td><td></td></tr>";
          }
        
    //1 rate, more than 2 dates and 1 poa

    } else if(bodyobj[0].length > 1 && saverobj[0]=="S" && receiveobj[0].length == 1){
        base2 += 4;
        interest2 += 4;
        commence2 += 4;
        terminate2 += 4;
        console.log("1 rate, more than 2 dates and 1 poa");
        for (i=0; i < arrayOfObjects[commence2].length; i++){
          if (receiveobj > arrayOfObjects[commence2][i] && receiveobj < arrayOfObjects[terminate2][i]){
            var date3 = receiveobj;
            var diff1 = Math.floor((Date.parse(date3) - Date.parse(arrayOfObjects[commence2][i])) / 86400000);
            var diff2 = Math.floor((Date.parse(arrayOfObjects[terminate2][i]) - Date.parse(date3)) / 86400000);
            var date1a = arrayOfObjects[commence2][i];
            var diff = Math.floor((Date.parse(date3) - Date.parse(date1a)) / 86400000);
            answer1 = (num2 * num1) / 365;
            answer1 = answer1 * diff;
            answer1 = answer1.toFixed(2);
            answer1 = parseFloat(answer1);
            var answer2 = (num1 - amountobj);
            var answer3 = answer2;
            answer2 = (num2 * answer2) / 365;
            answer2 = answer2 * diff2;
            console.log("1 rate, more than 2 dates and 1 poa");
            answer2 = answer2.toFixed(2);
            answer2 = parseFloat(answer2);
            globalDays += diff1 + diff2;
            reduced = true;
            globalInterest += answer1 + answer2;
            var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
            var answer10 = answer2.toLocaleString("en", {minimumFractionDigits: 2});
            amountobj = parseFloat(amountobj);
            var amountobj9 = amountobj.toLocaleString("en", {minimumFractionDigits: 2});

            var date1y = reformatDate(arrayOfObjects[commence2][i]);
            var date2z = reformatDate(arrayOfObjects[terminate2][i]);
            var date3p = reformatDate(receiveobj);

            results += "<tr><td><p>" + 
            date1y + " " + "to" + " " + date3p +"</p></td><td"+
            "><p>" + diff1 + "</p></td>" + 
            "<td><p>"+req.body.interest0+"%</p></td><td><p>£"+answer9+"</td></tr>";
            results += "<tr><td colspan='4'><p style='color: green;'>£"+amountobj9 + " " + 
            "POA received on" + " " + date3p+"</p></td></tr>";
            results += "<tr><td><p>" + 
            date3p + " " + "to" + " " + date2z +"</p></td><td"+
            "><p>" + diff2 + "</p></td>" + 
            "<td><p>"+req.body.interest0+"%</p></td><td><p>£"+answer10+"</td></tr>";
          } else{ //if payment on account not within 2 date periods
              let date1c = arrayOfObjects[commence2][i];
              let date2c = arrayOfObjects[terminate2][i];
              let diff = Math.floor((Date.parse(date2c) - Date.parse(date1c)) / 86400000);
              if (reduced == false){
                num1 = parseFloat(arrayOfObjects[base2]);
              } else{
                num1 = answer3;
                console.log(num1)
              }
              
              let num2 = parseFloat(arrayOfObjects[interest2]);
              num2 = num2 / 100;
              answer = (num2 * num1) / 365;
              answer = answer * diff;
              answer = answer.toFixed(2);
              answer = parseFloat(answer);
              var answer9 = answer.toLocaleString("en", {minimumFractionDigits: 2});

              var date1y = reformatDate(arrayOfObjects[commence2][i]);
              var date2z = reformatDate(arrayOfObjects[terminate2][i]);
        
              globalDays += diff;
              globalInterest += answer;
              results += "<tr><td><p>" + 
              date1y + " " + "to" + " " + date2z +
              "</p></td><td><p>" + diff + "</p></td><td><p>"+arrayOfObjects[interest2]+"%</p></td>"+
              "<td><p>£" + answer9 + "</p></td><td></td></tr>";
          }
        }

    //if more than 1 interest rate selected
    } else if (receiveobj[0].length == 0){
      console.log("more than 2 rates");
      var firstLoop = arrayOfObjects.length / 4;

      for (p=0; p < firstLoop; p++){
        base2 += 4;
        interest2 += 4;
        commence2 += 4;
        terminate2 += 4;

        console.log("coming here");

        //multiple rates, max 2 dates and no POA

        if (Array.isArray(arrayOfObjects[commence2])==false && typeof receiveobj === 'undefined'){
 
            var date1b = arrayOfObjects[commence2];
            var date2b = arrayOfObjects[terminate2];
            var diff = Math.floor((Date.parse(date2b) - Date.parse(date1b)) / 86400000);
            var num1 = parseFloat(arrayOfObjects[base2]);
            var num2 = parseFloat(arrayOfObjects[interest2]);
            num2 = num2 / 100;
            answer = (num2 * num1) / 365;
            answer = answer * diff;
            answer = answer.toFixed(2);
            answer = parseFloat(answer);
            var answer9 = answer.toLocaleString("en", {minimumFractionDigits: 2});
      
            globalDays += diff;
            globalInterest += answer;

            var date1y = reformatDate(arrayOfObjects[commence2]);
            var date2z = reformatDate(arrayOfObjects[terminate2]);

            results += "<tr><td><p>" + 
            date1y + " " + "to" + " " + date2z +
            "</p></td><td><p>" + diff + "</p></td><td><p>"+arrayOfObjects[interest2]+"%</p></td>"+
            "<td><p>£" + answer9 + "</p></td><td></td></tr>";
            console.log("more than 1 rate and only 2 dates and no POA")
          

        //multiple rates, multiple dates and no POA

      }else if (Array.isArray(arrayOfObjects[commence2])==true && typeof receiveobj === 'undefined'){

          for (i=0; i < arrayOfObjects[commence2].length; i++){
            let date1c = arrayOfObjects[commence2][i];
            let date2c = arrayOfObjects[terminate2][i];
            let diff = Math.floor((Date.parse(date2c) - Date.parse(date1c)) / 86400000);
            let num1 = parseFloat(arrayOfObjects[base2]);
            let num2 = parseFloat(arrayOfObjects[interest2]);
            console.log(num1);
            console.log(num2);
            num2 = num2 / 100;
            answer = (num2 * num1) / 365;
            answer = answer * diff;
            answer = answer.toFixed(2);
            answer = parseFloat(answer);
            console.log(answer);
            var answer9 = answer.toLocaleString("en", {minimumFractionDigits: 2});
      
            globalDays += diff;
            globalInterest += answer;

            var date1y = reformatDate(arrayOfObjects[commence2][i]);
            var date2z = reformatDate(arrayOfObjects[terminate2][i]);

            results += "<tr><td><p>" + 
            date1y + " " + "to" + " " + date2z +
            "</p></td><td><p>" + diff + "</p></td><td><p>"+arrayOfObjects[interest2]+"%</p></td>"+
            "<td><p>£" + answer9 + "</p></td><td></td></tr>";
            console.log("multiple rates and multiple dates");
          }
        
      } else{

        //multiple rates, single date and single poa

        if (receiveobj[0].length == 1 && arrayOfObjects[commence2][0].length == 1){
          if (receiveobj > arrayOfObjects[commence2] && receiveobj < arrayOfObjects[terminate2]){
            console.log("multiple rates, single date and single poa");
            console.log(receiveobj);
            console.log(arrayOfObjects[commence2]);
            console.log(arrayOfObjects[terminate2]);
            var date3 = receiveobj;
            var diff1 = Math.floor((Date.parse(date3) - Date.parse(arrayOfObjects[commence2])) / 86400000);
            var diff2 = Math.floor((Date.parse(arrayOfObjects[terminate2]) - Date.parse(date3)) / 86400000);
            var answer1 = answer * diff1;
            answer1 = answer1.toFixed(2);
            answer1 = parseFloat(answer1);
            var answer2 = (num1 - amountobj);
            answer2 = (num2 * answer2) / 365;
            answer2 = answer2 * diff2;
            answer2 = answer2.toFixed(2);
            answer2 = parseFloat(answer2);
            globalDays += diff1 + diff2;
            globalInterest += answer1 + answer2;
            var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
            var answer10 = answer2.toLocaleString("en", {minimumFractionDigits: 2});
            amountobj = parseFloat(amountobj);
            var date1y = reformatDate(date1);
            var date2z = reformatDate(date2);
            var date3p = reformatDate(date3);
            var amountobj9 = amountobj.toLocaleString("en", {minimumFractionDigits: 2});
            results += "<tr><td><p>" + 
            date1y + " " + "to" + " " + date3p +"</p></td><td"+
            "><p>" + diff1 + "</p></td>" + 
            "<td><p>"+req.body.interest0+"%</p></td><td><p>£"+answer9+"</td></tr>";
            results += "<tr><td colspan='4'><p style='color: green;'>£"+amountobj9 + " " + 
            "POA received on" + " " + date3p+"</p></td></tr>";
            results += "<tr><td><p>" + 
            date3p + " " + "to" + " " + date2z +"</p></td><td"+
            "><p>" + diff2 + "</p></td>" + 
            "<td><p>"+req.body.interest0+"%</p></td><td><p>£"+answer10+"</td></tr>";

            //multiple rates, single date and no poa

          } else{
              console.log("multiple rates, single date and no poa")
              
              var date1a = arrayOfObjects[commence2];
              var date2a = arrayOfObjects[terminate2];
              var diff = Math.floor((Date.parse(date2a) - Date.parse(date1a)) / 86400000);
              answer = (arrayOfObjects[interest2] * arrayOfObjects[base2]) / 365;
              answer = answer / 100;
              answer = answer * diff;
              answer = answer.toFixed(2);
              answer = parseFloat(answer);
              var answer9 = answer.toLocaleString("en", {minimumFractionDigits: 2});
  
              var date1y = reformatDate(arrayOfObjects[commence2]);
              var date2z = reformatDate(arrayOfObjects[terminate2]);
        
              globalDays += diff;
              globalInterest += answer;
              results += "<tr><td><p>" + 
              date1y + " " + "to" + " " + date2z +
              "</p></td><td><p>" + diff + "</p></td><td><p>"+arrayOfObjects[interest2]+"%</p></td>"+
              "<td><p>£" + answer9 + "</p></td><td></td></tr>";
          }

          //multiple rates, single date and multiple poas
          
        } else if (receiveobj[0].length != 1 && arrayOfObjects[commence2][0].length == 1){   

                //if payment on account between current date periods

                if (receiveobj[receiveIndex] < arrayOfObjects[terminate2] && receiveobj[receiveIndex] > arrayOfObjects[commence2]){
                  console.log("payment on account between current date periods");
                  var date3 = receiveobj[receiveIndex];

                  var diff1 = Math.floor((Date.parse(date3) - Date.parse(arrayOfObjects[commence2])) / 86400000);
                  var diff2 = Math.floor((Date.parse(arrayOfObjects[terminate2]) - Date.parse(date3)) / 86400000);
                  var answer1 = (arrayOfObjects[interest2] * arrayOfObjects[base2]) / 365;
                  answer1 = answer1 * diff1;
                  answer1 = answer1 / 100;
                  answer1 = answer1.toFixed(2);
                  answer1 = parseFloat(answer1);
                  var answer2 = (arrayOfObjects[base2] - amountobj[receiveIndex]);
                  answer2 = (arrayOfObjects[interest2] * answer2) / 365;
                  answer2 = answer2 * diff2;
                  answer2 = answer2 / 100;
                  answer2 = answer2.toFixed(2);
                  answer2 = parseFloat(answer2);
                  globalDays += diff1 + diff2;
                  globalInterest += answer1 + answer2;
                  var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
                  var answer10 = answer2.toLocaleString("en", {minimumFractionDigits: 2});
                  
                  var date1y = reformatDate(arrayOfObjects[commence2]);
                  var date2z = reformatDate(arrayOfObjects[terminate2]);
                  var date3p = reformatDate(date3);
                  var amountobj9 = amountobj[receiveIndex];
                  amountobj9 = parseFloat(amountobj9);
                  amountobj9 = amountobj9.toLocaleString("en", {minimumFractionDigits: 2});
                  results += "<tr><td><p>" + 
                  date1y + " " + "to" + " " + date3p +"</p></td><td"+
                  "><p>" + diff1 + "</p></td>" + 
                  "<td><p>"+arrayOfObjects[interest2]+"%</p></td><td><p>£"+answer9+"</td></tr>";
                  results += "<tr><td colspan='4'><p style='color: green;'>£"+amountobj9 + " " + 
                  "POA received on" + " " + date3p+"</p></td></tr>";
                  results += "<tr><td><p>" + 
                  date3p + " " + "to" + " " + date2z +"</p></td><td"+
                  "><p>" + diff2 + "</p></td>" + 
                  "<td><p>"+arrayOfObjects[interest2]+"%</p></td><td><p>£"+answer10+"</td></tr>";

                  reduced = true;
                  receiveIndex += 1;

                  //if payment on account not between current date periods

              } else if (receiveobj[receiveIndex] > arrayOfObjects[terminate2] && receiveobj[receiveIndex] < arrayOfObjects[commence2]) {
                console.log("payment on account not between current date periods");

                  var diff1 = Math.floor((Date.parse(arrayOfObjects[terminate2]) - Date.parse(arrayOfObjects[commence2])) / 86400000);

                  var answer1 = (arrayOfObjects[interest2] * arrayOfObjects[base2]) / 365;
                  answer1 = answer1 * diff1;
                  answer1 = answer1 / 100;
                  answer1 = answer1.toFixed(2);
                  answer1 = parseFloat(answer1);
                  
                  globalDays += diff1;
                  globalInterest += answer1;
                  var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
                  
                  var date1y = reformatDate(arrayOfObjects[commence2]);
                  var date2z = reformatDate(arrayOfObjects[terminate2]);

                  results += "<tr><td><p>" + 
                  date1y + " " + "to" + " " + date2z +"</p></td><td"+
                  "><p>" + diff1 + "</p></td>" + 
                  "<td><p>"+arrayOfObjects[interest2]+"%</p></td><td><p>£"+answer9+"</td></tr>";                  
              }

              //multiple rates, multiple dates and single poa

            } else if (receiveobj[0].length == 1 && arrayOfObjects[commence2][0].length > 1){
                console.log("multiple rates, multiple dates and single poa");

                for (i=0; i < arrayOfObjects[commence2].length; i++){

                  //if payment between two date periods

                  if (receiveobj < arrayOfObjects[terminate2][i] && receiveobj > arrayOfObjects[commence2][i]){
                    var date3 = receiveobj;

                    console.log("payment on account between two date periods");

                    var diff1 = Math.floor((Date.parse(date3) - Date.parse(arrayOfObjects[commence2][i])) / 86400000);
                    var diff2 = Math.floor((Date.parse(arrayOfObjects[terminate2][i]) - Date.parse(date3)) / 86400000);
                    var answer1 = (arrayOfObjects[interest2] * arrayOfObjects[base2]) / 365;
                    answer1 = answer1 * diff1;
                    answer1 = answer1 / 100;
                    answer1 = answer1.toFixed(2);
                    answer1 = parseFloat(answer1);
                    var answer2 = (arrayOfObjects[base2] - amountobj);
                    answer2 = (arrayOfObjects[interest2] * answer2) / 365;
                    answer2 = answer2 * diff2;
                    answer2 = answer2 / 100;
                    answer2 = answer2.toFixed(2);
                    answer2 = parseFloat(answer2);
                    globalDays += diff1 + diff2;
                    globalInterest += answer1 + answer2;
                    var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
                    var answer10 = answer2.toLocaleString("en", {minimumFractionDigits: 2});
                    
                    var date1y = reformatDate(arrayOfObjects[commence2][i]);
                    var date2z = reformatDate(arrayOfObjects[terminate2][i]);
                    var date3p = reformatDate(date3);
                    var amountobj9 = amountobj;
                    amountobj9 = parseFloat(amountobj9);
                    amountobj9 = amountobj9.toLocaleString("en", {minimumFractionDigits: 2});
                    results += "<tr><td><p>" + 
                    date1y + " " + "to" + " " + date3p +"</p></td><td"+
                    "><p>" + diff1 + "</p></td>" + 
                    "<td><p>"+arrayOfObjects[interest2]+"%</p></td><td><p>£"+answer9+"</td></tr>";
                    results += "<tr><td colspan='4'><p style='color: green;'>£"+amountobj9 + " " + 
                    "POA received on" + " " + date3p+"</p></td></tr>";
                    results += "<tr><td><p>" + 
                    date3p + " " + "to" + " " + date2z +"</p></td><td"+
                    "><p>" + diff2 + "</p></td>" + 
                    "<td><p>"+arrayOfObjects[interest2]+"%</p></td><td><p>£"+answer10+"</td></tr>";

                    reduced = true;

                  } else{
                      console.log("payment on account not between current date periods");
    
                      var diff1 = Math.floor((Date.parse(arrayOfObjects[terminate2][i]) - Date.parse(arrayOfObjects[commence2][i])) / 86400000);
    
                      if (reduced == false){
                        var newbase = arrayOfObjects[base2];

                      } else{
                        var newbase = arrayOfObjects[base2] - amountobj;
                      }

                      reduced = false;

                      var answer1 = (arrayOfObjects[interest2] * newbase) / 365;
                      answer1 = answer1 * diff1;
                      answer1 = answer1 / 100;
                      answer1 = answer1.toFixed(2);
                      answer1 = parseFloat(answer1);
                      
                      globalDays += diff1;
                      globalInterest += answer1;
                      var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
                      
                      var date1y = reformatDate(arrayOfObjects[commence2][i]);
                      var date2z = reformatDate(arrayOfObjects[terminate2][i]);
    
                      results += "<tr><td><p>" + 
                      date1y + " " + "to" + " " + date2z +"</p></td><td"+
                      "><p>" + diff1 + "</p></td>" + 
                      "<td><p>"+arrayOfObjects[interest2]+"%</p></td><td><p>£"+answer9+"</td></tr>"; 
                  }

                  
                }

                //multiple rates, multiple dates and multiple poas

            } else if (receiveobj[0].length > 1 && arrayOfObjects[commence2][0].length > 1){
                console.log("multiple rates, multiple dates and multiple poas")

                for (b=0; b < receiveobj.length; b++){

                  for (i=0; i < arrayOfObjects[commence2].length; i++){

                    //if payment between two date periods
  
                    if (receiveobj[b] < arrayOfObjects[terminate2][i] && receiveobj[b] > arrayOfObjects[commence2][i]){
                      var date3 = receiveobj[b];
  
                      console.log("payment on account between two date periods");
  
                      var diff1 = Math.floor((Date.parse(date3) - Date.parse(arrayOfObjects[commence2][i])) / 86400000);
                      var diff2 = Math.floor((Date.parse(arrayOfObjects[terminate2][i]) - Date.parse(date3)) / 86400000);
                      var answer1 = (arrayOfObjects[interest2] * arrayOfObjects[base2]) / 365;
                      answer1 = answer1 * diff1;
                      answer1 = answer1 / 100;
                      answer1 = answer1.toFixed(2);
                      answer1 = parseFloat(answer1);
                      var answer2 = (arrayOfObjects[base2] - amountobj[b]);
                      answer2 = (arrayOfObjects[interest2] * answer2) / 365;
                      answer2 = answer2 * diff2;
                      answer2 = answer2 / 100;
                      answer2 = answer2.toFixed(2);
                      answer2 = parseFloat(answer2);
                      globalDays += diff1 + diff2;
                      globalInterest += answer1 + answer2;
                      var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
                      var answer10 = answer2.toLocaleString("en", {minimumFractionDigits: 2});
                      
                      var date1y = reformatDate(arrayOfObjects[commence2][i]);
                      var date2z = reformatDate(arrayOfObjects[terminate2][i]);
                      var date3p = reformatDate(date3);
                      var amountobj9 = amountobj[b];
                      amountobj9 = parseFloat(amountobj9);
                      amountobj9 = amountobj9.toLocaleString("en", {minimumFractionDigits: 2});
                      results += "<tr><td><p>" + 
                      date1y + " " + "to" + " " + date3p +"</p></td><td"+
                      "><p>" + diff1 + "</p></td>" + 
                      "<td><p>"+arrayOfObjects[interest2]+"%</p></td><td><p>£"+answer9+"</td></tr>";
                      results += "<tr><td colspan='4'><p style='color: green;'>£"+amountobj9 + " " + 
                      "POA received on" + " " + date3p+"</p></td></tr>";
                      results += "<tr><td><p>" + 
                      date3p + " " + "to" + " " + date2z +"</p></td><td"+
                      "><p>" + diff2 + "</p></td>" + 
                      "<td><p>"+arrayOfObjects[interest2]+"%</p></td><td><p>£"+answer10+"</td></tr>";
  
                      reduced = true;
  
                    } else{
                        console.log("payment on account not between current date periods");
      
                        var diff1 = Math.floor((Date.parse(arrayOfObjects[terminate2][i]) - Date.parse(arrayOfObjects[commence2][i])) / 86400000);
      
                        if (reduced == false){
                          var newbase = arrayOfObjects[base2];
  
                        } else{
                          var newbase = arrayOfObjects[base2] - amountobj[b];
                        }
  
                        reduced = false;
  
                        var answer1 = (arrayOfObjects[interest2] * newbase) / 365;
                        answer1 = answer1 * diff1;
                        answer1 = answer1 / 100;
                        answer1 = answer1.toFixed(2);
                        answer1 = parseFloat(answer1);
                        
                        globalDays += diff1;
                        globalInterest += answer1;
                        var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
                        
                        var date1y = reformatDate(arrayOfObjects[commence2][i]);
                        var date2z = reformatDate(arrayOfObjects[terminate2][i]);
      
                        results += "<tr><td><p>" + 
                        date1y + " " + "to" + " " + date2z +"</p></td><td"+
                        "><p>" + diff1 + "</p></td>" + 
                        "<td><p>"+arrayOfObjects[interest2]+"%</p></td><td><p>£"+answer9+"</td></tr>"; 
                    }
                  }
                }
              } 
            } 
          } 

          //one rate and multiple payments on account

        } else if (receiveobj[0].length > 1){

          console.log("check if working");
          var firstLoop = arrayOfObjects.length / 4; //global number of loops

          for (p=0; p < firstLoop; p++){

            base2 += 4;
            interest2 += 4;
            commence2 += 4;
            terminate2 += 4;

            var newbaseobj = arrayOfObjects[base2];
            console.log(arrayOfObjects);

            for (i=0; i<arrayOfObjects[commence2].length; i++){
              if (receiveobj[receiveIndex]>arrayOfObjects[commence2][i] && receiveobj[receiveIndex]<arrayOfObjects[terminate2][i]){
                
                      var date3 = receiveobj[receiveIndex];
  
                      console.log("one of the payments on account is between two dates");

                      console.log(receiveobj[receiveIndex]+" "+ "is greater than"+" "+arrayOfObjects[commence2][i]+" "+"and less than"
                    +" "+arrayOfObjects[terminate2][i]);
  
                      var diff1 = Math.floor((Date.parse(date3) - Date.parse(arrayOfObjects[commence2][i])) / 86400000);
                      var diff2 = Math.floor((Date.parse(arrayOfObjects[terminate2][i]) - Date.parse(date3)) / 86400000);
                      var answer1 = (arrayOfObjects[interest2] * newbaseobj) / 365;

                      
                      console.log(newbaseobj);
                      console.log(answer1);
                      answer1 = answer1 * diff1;
                      answer1 = answer1 / 100;
                      answer1 = answer1.toFixed(2);
                      answer1 = parseFloat(answer1);
                      var answer2 = (newbaseobj - amountobj[receiveIndex]);
                      
                      answer2 = (arrayOfObjects[interest2] * answer2) / 365;
                      answer2 = answer2 * diff2;
                      answer2 = answer2 / 100;
                      answer2 = answer2.toFixed(2);
                      answer2 = parseFloat(answer2);
                      globalDays += diff1 + diff2;
                      globalInterest += answer1 + answer2;
                      var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
                      var answer10 = answer2.toLocaleString("en", {minimumFractionDigits: 2});
                      
                      var date1y = reformatDate(arrayOfObjects[commence2][i]);
                      var date2z = reformatDate(arrayOfObjects[terminate2][i]);
                      var date3p = reformatDate(date3);
                      var amountobj9 = amountobj[receiveIndex];
                      amountobj9 = parseFloat(amountobj9);
                      amountobj9 = amountobj9.toLocaleString("en", {minimumFractionDigits: 2});
                      results += "<tr><td><p>" + 
                      date1y + " " + "to" + " " + date3p +"</p></td><td"+
                      "><p>" + diff1 + "</p></td>" + 
                      "<td><p>"+arrayOfObjects[interest2]+"%</p></td><td><p>£"+answer9+"</td></tr>";
                      results += "<tr><td colspan='4'><p style='color: green;'>£"+amountobj9 + " " + 
                      "POA received on" + " " + date3p+"</p></td></tr>";
                      results += "<tr><td><p>" + 
                      date3p + " " + "to" + " " + date2z +"</p></td><td"+
                      "><p>" + diff2 + "</p></td>" + 
                      "<td><p>"+arrayOfObjects[interest2]+"%</p></td><td><p>£"+answer10+"</td></tr>";
  
                      reduced = true;
                      newbaseobj = newbaseobj - amountobj[receiveIndex];
                      receiveIndex += 1;

              } else if (receiveobj[receiveIndex]<arrayOfObjects[commence2][i] || receiveobj[receiveIndex]>arrayOfObjects[terminate2][i]){

                  console.log("one of the payments on account is not between two dates");

                  console.log(receiveobj[receiveIndex]+" "+ "is not within"+" "+arrayOfObjects[commence2][i]+" "+"and"
                    +" "+arrayOfObjects[terminate2][i]);
        
                  var diff1 = Math.floor((Date.parse(arrayOfObjects[terminate2][i]) - Date.parse(arrayOfObjects[commence2][i])) / 86400000);

                  if (reduced == false){
                    var newbase = arrayOfObjects[base2];

                  } else{
                    var newbase = arrayOfObjects[base2] - amountobj[p];
                  }

                  reduced = false;

                  var answer1 = (arrayOfObjects[interest2] * newbase) / 365;
                  answer1 = answer1 * diff1;
                  answer1 = answer1 / 100;
                  answer1 = answer1.toFixed(2);
                  answer1 = parseFloat(answer1);
                  
                  globalDays += diff1;
                  globalInterest += answer1;
                  var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
                  
                  var date1y = reformatDate(arrayOfObjects[commence2][i]);
                  var date2z = reformatDate(arrayOfObjects[terminate2][i]);

                  results += "<tr><td><p>" + 
                  date1y + " " + "to" + " " + date2z +"</p></td><td"+
                  "><p>" + diff1 + "</p></td>" + 
                  "<td><p>"+arrayOfObjects[interest2]+"%</p></td><td><p>£"+answer9+"</td></tr>"; 

                  receiveIndex += 1;
              }
            } 
          } 
        } 
    

    var daily = globalInterest / globalDays;
    totalSum = globalInterest.toFixed(2);
    totalSum = parseFloat(totalSum);
    var totalSum9 = totalSum.toLocaleString("en", {minimumFractionDigits: 2});
    daily1 = daily.toLocaleString("en", {minimumFractionDigits: 6});
  
    results += "<tr><td><p><b>Totals</b></p></td><td><p><b>" + globalDays + "</b></p></td>"+
    "<td><p><b></b></p></td><td><p><b>£" + totalSum9 + "</b></p></td></tr></table>";

res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legal Interest Calculator</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" 
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap" rel="stylesheet">
    
    <style>

        body {
            text-align: center;
            background-color: #202020;
        }


        h2 {
            text-align: center;   
            color: #D8D8D8; 
            font-family: 'Alfa Slab One', cursive;
        }

        h6 {
            color: powderblue; 
            font-family: Arial, Helvetica, sans-serif;
        }

        h5 {
            color: rgb(255, 255, 255); 
            font-family: Arial, Helvetica, sans-serif;
        }

        p {
            color: rgb(255, 255, 255); 
            font-family: Arial, Helvetica, sans-serif;
        }

        .center {
            margin-left: auto;
            margin-right: auto;
        }

        .button {
          margin-top: 20px;
          margin-botton: 20px;
        }

        .achievements-wrapper { 
          width: 100%; 
          overflow-y: scroll;
          text-align: center;
      }
      
         .topnav {

         background-color: #333;
         overflow: hidden;
         position: sticky;
         }

         .topnav a {
         float: left;
         color: #f2f2f2;
         text-align: center;
         padding: 22px 5%;
         text-decoration: none;
         font-size: 17px;
         }

        #days{
            color: white;
        }

    </style>
</head>
<body>
<div class="topnav fixed-top">
    <a href="/" style="width: 100%; background-color: black;"><h2><span class="iconify" 
        data-icon="typcn:calculator"></span>Legal 
        Interest Calculator</h2></a>
</div>

<div class="span4 achievements-wrapper">
    ${results}
</div><br>
<h5 style="color: grey; margin-left: 10%; margin-right: 10%;">The table above provides a quick summary of the figures.</h5><br>
<h5 style="color: grey; margin-left: 10%; margin-right: 10%;">If you would like a more detailed breakdown, click on the PDF 
button to see a comprehensive schedule.</h5><br>

<button type="button" onclick="goBack()" class="btn btn-primary" 
style="width: 45.2%; height: 45px; text-align: center; margin-bottom: 2%; margin-right: 2%;"><h5><b>Back
</b></h5></button>

<button type="button" onclick="goBack()" class="btn btn-light" style="width: 45.2%; height: 45px; text-align: center; margin-bottom: 2%;
"><h5 style="color: red;"><b>PDF</b> <i class="fa fa-file-pdf-o"></i><b></h5></button>


<script>
function goBack() {
  window.history.back();
}
</script>                                          
</body>
</html>`)
})


server.listen(process.env.PORT || 8080);

console.log("Running at Port 8080");