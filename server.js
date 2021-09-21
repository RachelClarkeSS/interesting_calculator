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

  var receiveobj = req.body.receive;
  var amountobj = req.body.amount; 

  delete req.body.receive;
  delete req.body.amount;
  delete req.body.saver; 

  var arrayOfObjects = Object.values(req.body);
  console.log(arrayOfObjects);
  console.log(receiveobj);
  console.log(amountobj);
  var globalDays = 0;
  var globalInterest = 0;
  var baseTotal = arrayOfObjects[0];
  
  var base2 = -4;
  var interest2 = -3;
  var commence2 = -2;
  var terminate2 = -1;
  var receiveIndex = 4;

  var firstLoop = arrayOfObjects.length / 4;

  var morethantwodates = false;
  var multiplerates = false;
  var singlepoa = false;
  var multiplepoa = false;
  var poas = false;
  var countdates = 2;
  var countloops = 1;
  var reduced = false;

  var answer = (arrayOfObjects[1] * arrayOfObjects[0]) / 365;
  answer = answer / 100;

  //check whether multiple dates or multiple rates have been entered

  if (arrayOfObjects.length == 4){
    if (arrayOfObjects[2][0].length == 1){
      morethantwodates = false;
      multiplerates = false;
    } else {
      morethantwodates = true;
      multiplerates = false;
    }   
  } else if (arrayOfObjects.length > 4){
      multiplerates = true;
      for (i=0; i < arrayOfObjects.length / 4; i++){
        if (arrayOfObjects[countdates][0].length > 1){
          morethantwodates = true;
          break
        } else{
          morethantwodates = false;
        }
      }
  }

  //check whether single or multiple payments on account have been made

  if (typeof receiveobj !== 'undefined' && receiveobj[0].length == 1){
    singlepoa = true;
    poas = true;
  } else if (typeof receiveobj !== 'undefined' && receiveobj[0].length > 1){
    multiplepoa = true;
    poas = true;;
  } else{
    singlepoa = false;
    multiplepoa = false;
    poas = false;
  }

  var results = "<table class='table table-striped table-dark'><tr><th style='width: 40%'><p><b>"+
    "Period</b></p></th><th class='thead-dark' style='width: 15%'><p><b>Days</b></p></th><th class='thead-dark' style='width: 15%'><p>"+
    "<b>Rate</b></p></th><th class='thead-dark' style='width: 30%'><p><b>Interest</b></p></th>";

  //no poas, only 1 date, only 1 rate

  if (poas == false && morethantwodates == false && multiplerates == false){
    console.log("no poas, only 1 date, only 1 rate");
    var diff = Math.floor((Date.parse(arrayOfObjects[3]) - Date.parse(arrayOfObjects[2])) / 86400000);
    answer = answer * diff;
    answer = answer.toFixed(2);
    answer = parseFloat(answer);
    globalDays += diff;
    var totalInterest = answer;
    var answer9 = answer.toLocaleString("en", {minimumFractionDigits: 2});

    var date1y = reformatDate(arrayOfObjects[2]);
    var date2z = reformatDate(arrayOfObjects[3]);
    
    results += "<tr><td><p>" + 
    date1y + " " + "to" + " " + date2z +"</p></td><td"+
    "><p>" + diff + "</p></td>" + 
    "<td><p>"+arrayOfObjects[1]+"%</p></td><td><p>£"+answer9+"</td></tr>";

    //has poas, only 1 date, only 1 rate

  } if (poas == true && morethantwodates == false && multiplerates == false){
      console.log("has poas, only 1 date, only 1 rate");

      if (singlepoa == true){
        console.log('only 1 poa, only 1 date, only 1 rate');

        var date3 = receiveobj;
        var diff1 = Math.floor((Date.parse(date3) - Date.parse(arrayOfObjects[2])) / 86400000);
        var diff2 = Math.floor((Date.parse(arrayOfObjects[3]) - Date.parse(date3)) / 86400000);
        var answer1 = answer * diff1;
        answer1 = answer1.toFixed(2);
        answer1 = parseFloat(answer1);
        var totalInterest = answer1;
        console.log(answer1);
        var answer2 = (arrayOfObjects[0] - amountobj);
        answer2 = (arrayOfObjects[1] * answer2) / 365;
        answer2 = answer2 / 100;
        answer2 = answer2 * diff2;
        answer2 = answer2.toFixed(2);
        answer2 = parseFloat(answer2);
        totalInterest += answer2;
        console.log(answer2);
        console.log(totalInterest);

        globalDays += diff1 + diff2;
        var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
        var answer10 = answer2.toLocaleString("en", {minimumFractionDigits: 2});
        amountobj = parseFloat(amountobj);
        var date1y = reformatDate(arrayOfObjects[2]);
        var date2z = reformatDate(arrayOfObjects[3]);
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
          "<td><p>"+arrayOfObjects[1]+"%</p></td><td><p>£"+answer10+"</td></tr>";
        

        // multiple poas, only 1 date, only 1 rate

      } else if (multiplepoa == true){
          console.log('multiple poas, only 1 date, only 1 rate');
          var newcommence = [];
          var newterminate = [];

          newcommence.push(arrayOfObjects[2]);

          for (i=0; i<receiveobj.length;i++){
            if(receiveobj[i] > arrayOfObjects[2] && receiveobj[i] < arrayOfObjects[3]){
              newcommence.push(receiveobj[i]);
            }
          }

          for (i=1; i<newcommence.length; i++){
            newterminate.push(newcommence[i]);
          }

          newterminate.push(arrayOfObjects[3]);

          arrayOfObjects[2] = newcommence;
          arrayOfObjects[3] = newterminate;

          var amountcount = 0;
          
          console.log(arrayOfObjects);
          console.log('amountobject is'+' '+amountobj);

          console.log(amountobj.length);

          var poasplit = 0;

          var twoloop = amountobj.length-1;

          if (amountobj.length==2){
            twoloop = amountobj.length+1;
          }

          for (i=0; i < twoloop; i++){

            //obtains date periods for calculation

            var date1y = (arrayOfObjects[2][poasplit]);
            var date2y = (arrayOfObjects[3][poasplit]);
            var date3y = (arrayOfObjects[2][poasplit+1]);
            var date4y = (arrayOfObjects[3][poasplit+1]);
            var diff1 = Math.floor((Date.parse(date2y) - Date.parse(date1y)) / 86400000);
            var diff2 = Math.floor((Date.parse(date4y) - Date.parse(date3y)) / 86400000);

            globalInterest += answer11;
            globalInterest += answer12;

            if (i==0){

              var answer1 = (arrayOfObjects[0] * arrayOfObjects[1]) / 365;
              answer1 = answer1 * diff1;
              answer1 = answer1 / 100;
              answer1 = answer1.toFixed(2);
              answer1 = parseFloat(answer1);
              var totalInterest = answer1;
              
              
              var answer2 = (arrayOfObjects[0] - amountobj[i]);
              answer2 = (arrayOfObjects[1] * answer2) / 365;
              answer2 = answer2 * diff2;
              answer2 = answer2 / 100;
              answer2 = answer2.toFixed(2);
              answer2 = parseFloat(answer2);
              totalInterest += answer2;
              
                 
              var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});
              var answer10 = answer2.toLocaleString("en", {minimumFractionDigits: 2});
              arrayOfObjects[0] = arrayOfObjects[0] - amountobj[i];


            } else {
              arrayOfObjects[0] = arrayOfObjects[0] - amountobj[countloops];
              var answer3 = (arrayOfObjects[0] * arrayOfObjects[1]) / 365;
              answer3 = answer3 * diff1;
              answer3 = answer3 / 100;
              answer3 = answer3.toFixed(2);
              answer3 = parseFloat(answer3);
                       
              var answer4 = (arrayOfObjects[0] - amountobj[countloops+1]);
              answer4 = (arrayOfObjects[1] * answer4) / 365;
              answer4 = answer4 * diff2;
              answer4 = answer4 / 100;
              answer4 = answer4.toFixed(2);
              answer4 = parseFloat(answer4); 
               
              var answer11 = answer3.toLocaleString("en", {minimumFractionDigits: 2});
              var answer12 = answer4.toLocaleString("en", {minimumFractionDigits: 2});

            } 


            if (i==0){

              date1y = reformatDate(arrayOfObjects[2][poasplit]);
              date2y = reformatDate(arrayOfObjects[3][poasplit]);
              date3y = reformatDate(arrayOfObjects[2][poasplit+1]);
              date4y = reformatDate(arrayOfObjects[3][poasplit+1]);

              var poamount = amountobj[amountcount];
              poamount = parseFloat(poamount);
              poamount = poamount.toLocaleString("en", {minimumFractionDigits: 2});

              results += "<tr><td><p>" + 
              date1y + " " + "to" + " " + date2y +"</p></td><td"+
              "><p>" + diff1 + "</p></td>" + 
              "<td><p>"+arrayOfObjects[1]+"%</p></td><td><p>£"+answer9+"</td></tr>";
              results += "<tr><td colspan='4'><p style='color: green;'>£"+poamount + " " + 
              "POA received on" + " " + date3y+"</p></td></tr>";
              results += "<tr><td><p>" + 
              date3y + " " + "to" + " " + date4y +"</p></td><td"+
              "><p>" + diff2 + "</p></td>" + 
              "<td><p>"+arrayOfObjects[1]+"%</p></td><td><p>£"+answer10+"</td></tr>";

              globalDays += diff1
              globalDays += diff2;
              
            } else if (i!=amountobj.length-1 || amountobj.length==2){

                if (typeof date4y !== 'undefined' && amountobj.length !== 2){

                  date1y = reformatDate(arrayOfObjects[2][poasplit]);
                  date2y = reformatDate(arrayOfObjects[3][poasplit]);
                  date3y = reformatDate(arrayOfObjects[2][poasplit+1]);
                  date4y = reformatDate(arrayOfObjects[3][poasplit+1]);

                  var poamount = amountobj[countloops];
                  poamount = parseFloat(poamount);
                  poamount = poamount.toLocaleString("en", {minimumFractionDigits: 2});

                  console.log('this if one being used');
                  amountcount ++;
                  results += "<tr><td colspan='4'><p style='color: green;'>£"+poamount + " " + 
                  "POA received on" + " " + date1y+"</p></td></tr>";
                  results += "<tr><td><p>" + 
                  date1y + " " + "to" + " " + date2y +"</p></td><td"+
                  "><p>" + diff1 + "</p></td>" + 
                  "<td><p>"+arrayOfObjects[1]+"%</p></td><td><p>£"+answer11+"</td></tr>";
                  
                  arrayOfObjects[0] = arrayOfObjects[0] - amountobj[countloops+1];
                  answer12 = (arrayOfObjects[0]);
                  answer12 = (arrayOfObjects[1] * answer12) / 365;
                  answer12 = answer12 * diff2;
                  answer12 = answer12 / 100;

                  answer12 = answer12.toFixed(2);
                  answer12 = parseFloat(answer12);
                  answer12 = answer12.toLocaleString("en", {minimumFractionDigits: 2});
                  console.log(answer4);    

                  var poamount = amountobj[countloops+1];
                  poamount = parseFloat(poamount);
                  poamount = poamount.toLocaleString("en", {minimumFractionDigits: 2});

                  results += "<tr><td colspan='4'><p style='color: green;'>£"+poamount + " " + 
                  "POA received on" + " " + date3y+"</p></td></tr>";
                  results += "<tr><td><p>" + 
                  date3y + " " + "to" + " " + date4y +"</p></td><td"+
                  "><p>" + diff2 + "</p></td>" + 
                  "<td><p>"+arrayOfObjects[1]+"%</p></td><td><p>£"+answer12+"</td></tr>";

                        
                  globalDays += diff1
                  globalDays += diff2;

                  totalInterest += answer3;
                  totalInterest += answer4;

                  console.log(amountobj.length)

                  countloops += 2;
                  

                } else if (typeof date1y !== 'undefined' && amountobj.length !== 2){

                    if (countloops > 0 && amountobj.length !== 4){
                      console.log('i is'+' '+i)
                      i += 1;
                      console.log('now i is'+' '+i)
                    }
                    date1y = reformatDate(arrayOfObjects[2][poasplit]);
                    date2y = reformatDate(arrayOfObjects[3][poasplit]);

                    console.log('this else if one is being used');
                    console.log(arrayOfObjects[0]);
                    //arrayOfObjects[0] = arrayOfObjects[0] - amountobj[i+1];
                    console.log(amountobj[i+1]);
                    console.log(arrayOfObjects[0]);
                    var answer4 = (arrayOfObjects[0]);
                    answer4 = (arrayOfObjects[1] * answer4) / 365;
                    answer4 = answer4 * diff1;
                    answer4 = answer4 / 100;

                    answer4 = answer4.toFixed(2);
                    answer4 = parseFloat(answer4);
                    console.log(answer4);     
                    var answer11 = answer4.toLocaleString("en", {minimumFractionDigits: 2});

                    var poamount = amountobj[countloops];
                    poamount = parseFloat(poamount);
                    poamount = poamount.toLocaleString("en", {minimumFractionDigits: 2});

                    results += "<tr><td colspan='4'><p style='color: green;'>£"+poamount + " " + 
                    "POA received on" + " " + date1y+"</p></td></tr>";
                    results += "<tr><td><p>" + 
                    date1y + " " + "to" + " " + date2y +"</p></td><td"+
                    "><p>" + diff1 + "</p></td>" + 
                    "<td><p>"+arrayOfObjects[1]+"%</p></td><td><p>£"+answer11+"</td></tr>";

                    totalInterest += answer4;
                    
                    globalDays += diff1


                } else if (i == 1 && amountobj.length == 2){

                    date1y = reformatDate(arrayOfObjects[2][poasplit]);
                    date2y = reformatDate(arrayOfObjects[3][poasplit]);
              
                    console.log('number 2 being used');
                    console.log(arrayOfObjects[0]);
                    console.log(amountobj[i]);
                    console.log(arrayOfObjects[0]);
                    var answer4 = (arrayOfObjects[0]);
                    answer4 = (arrayOfObjects[1] * answer4) / 365;
                    answer4 = answer4 * diff1;
                    answer4 = answer4 / 100;
                    
                    answer4 = answer4.toFixed(2);
                    answer4 = parseFloat(answer4);
                    console.log(answer4);     

                    var poamount = amountobj[i];
                    poamount = parseFloat(poamount);
                    poamount = poamount.toLocaleString("en", {minimumFractionDigits: 2});

                    var answer11 = answer4.toLocaleString("en", {minimumFractionDigits: 2});
                    results += "<tr><td colspan='4'><p style='color: green;'>£"+poamount + " " + 
                    "POA received on" + " " + date1y+"</p></td></tr>";
                    results += "<tr><td><p>" + 
                    date1y + " " + "to" + " " + date2y +"</p></td><td"+
                    "><p>" + diff1 + "</p></td>" + 
                    "<td><p>"+arrayOfObjects[1]+"%</p></td><td><p>£"+answer11+"</td></tr>";

                    globalDays += diff1;
                    totalInterest += answer4;
                    
                }  
            } 
            
            
            poasplit += 2;
            amountcount += 1;

          }
        }

    //has poas, more than 2 dates, only 1 rate

  } if (poas == true && morethantwodates == true && multiplerates == false){
      console.log("has poas, more than 2 dates, only 1 rate");
      if (singlepoa == true){
        console.log('only 1 poa, more than 2 dates, only 1 rate');

        console.log("1 rate, more than 2 dates and 1 poa");
        for (i=0; i < arrayOfObjects[2].length; i++){
          if (receiveobj > arrayOfObjects[2][i] && receiveobj < arrayOfObjects[3][i]){
            var date3 = receiveobj;
            var diff1 = Math.floor((Date.parse(date3) - Date.parse(arrayOfObjects[2][i])) / 86400000);
            var diff2 = Math.floor((Date.parse(arrayOfObjects[3][i]) - Date.parse(date3)) / 86400000);
            var date1a = arrayOfObjects[2][i];
            var diff = Math.floor((Date.parse(date3) - Date.parse(date1a)) / 86400000);
            answer1 = (arrayOfObjects[1] * arrayOfObjects[0]) / 365;
            answer1 = answer1 / 100;
            answer1 = answer1 * diff;
            answer1 = answer1.toFixed(2);
            answer1 = parseFloat(answer1);
            var answer2 = (arrayOfObjects[0] - amountobj);
            answer2 = answer2 / 100;
            var answer3 = answer2;
            answer2 = (arrayOfObjects[1] * answer2) / 365;
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

            var date1y = reformatDate(arrayOfObjects[2][i]);
            var date2z = reformatDate(arrayOfObjects[3][i]);
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

            if (i == 0){
              totalInterest = answer1 + answer2;
            } else {
              totalInterest += answer1 + answer2;
            }
            
            console.log('answer1 is'+' '+answer1)
            console.log('answer2 is'+' '+answer2)
            console.log('answer1 + answer2 ='+' '+(answer1+answer2))
            console.log(totalInterest);

          } else{

              console.log('POA not between these two dates');
              let date1c = arrayOfObjects[2][i];
              let date2c = arrayOfObjects[3][i];
              let diff = Math.floor((Date.parse(date2c) - Date.parse(date1c)) / 86400000);
              if (reduced == false){
                num1 = parseFloat(arrayOfObjects[0]);
                num1 = num1 / 100;
              } else{
                num1 = answer3;
                console.log('num1 is'+' '+num1)
              }
              
              let num2 = parseFloat(arrayOfObjects[1]);
              num2 = num2;
              answer = (num2 * num1) / 365;
              answer = answer * diff;
              answer = answer.toFixed(2);
              answer = parseFloat(answer);
              var answer9 = answer.toLocaleString("en", {minimumFractionDigits: 2});

              var date1y = reformatDate(arrayOfObjects[2][i]);
              var date2z = reformatDate(arrayOfObjects[3][i]);
              globalDays += diff;
              
              results += "<tr><td><p>" + 
              date1y + " " + "to" + " " + date2z +
              "</p></td><td><p>" + diff + "</p></td><td><p>"+arrayOfObjects[1]+"%</p></td>"+
              "<td><p>£" + answer9 + "</p></td><td></td></tr>";

              if (i ==0){
                totalInterest = answer;
              } else {
                  totalInterest += answer;
              }
             
          }
        }

        // multiple poas, more than 2 dates, only 1 rate

      } else if (multiplepoa == true){
          console.log('multiple poas, more than 2 dates, only 1 rate');
          var combinedarray = [];
          var splitarray = [];
          var allin = [];
          var splitcount = 0;
          var poacount = 2;
          var balance = -1;
          var paydate = 0;
          var dateindex = 0;

          for (i=0; i<arrayOfObjects[2].length; i++){
            combinedarray.push(arrayOfObjects[2][i])
          }

          for (i=0; i<arrayOfObjects[3].length; i++){
            combinedarray.push(arrayOfObjects[3][i])
          }

          for (p=0; p<receiveobj.length; p++){

            for (i=0;i<arrayOfObjects[2].length;i++){
              if (receiveobj[p] > arrayOfObjects[2][i] && receiveobj[p] < arrayOfObjects[3][i+1]);
                combinedarray.push(receiveobj[p]);
                combinedarray.push(receiveobj[p]);
                i=arrayOfObjects[2].length-1;
            }
          }

          combinedarray.sort();

          for (p=0; p<receiveobj.length;p++){
            for(i=0; i<combinedarray.length;i=i+2){
              if(receiveobj[p]==combinedarray[i]){
                //take off payment on account and split date periods
                baseTotal = baseTotal - amountobj[p];
                splitarray.push(i);
                splitarray.push(baseTotal);
                splitarray.push(combinedarray[i]);
                splitarray.push(combinedarray[i+1]);
              } 
            }
          }
        }


        for (i=0; i < combinedarray.length; i++){
          for (k=0; k < splitarray.length; k++){
            if (combinedarray[i] == splitarray[poacount]){
              if (combinedarray[i+1] == splitarray[poacount+1]){
                console.log('poacount is'+' '+poacount);
                allin.push(splitarray[poacount]);
                allin.push(splitarray[poacount+1]);
                arrayOfObjects[0] = arrayOfObjects[0] - amountobj[splitcount];
                allin.push(arrayOfObjects[0]);
                splitcount++;
                poacount+=4;
                k = splitarray.length-1;
                i++;
              }
              
            } else if (combinedarray[i] != splitarray[poacount]){
                if (combinedarray[i+1] != splitarray[poacount+1]){
                  allin.push(combinedarray[i]);
                  allin.push(combinedarray[i+1]);
                  allin.push(arrayOfObjects[0]);
                  k = splitarray.length-1;
                  i++;
                }
              }
            }
          }

      var newbalance = allin[i];

      for (i=2; i<allin.length; i=i+3){
        newbalance = (allin[i]);

        var date1y = allin[dateindex];
        var date2y = allin[dateindex+1];

        date1y = reformatDate(date1y);
        date2y = reformatDate(date2y);

        if (i==2){
          newbalance = (allin[i]);
          
        }
                
        if (i>2){
          //console.log(allin[i-3]);
          if (allin[i] - allin[i - 3]){
            balance = (allin[i-3] - allin[i]);
            //console.log(`PoA received in the sum of £${balance} on ${receiveobj[paydate]}`);
            results += "<tr><td colspan='4'><p style='color: green;'>£"+balance + " " + 
                      "POA received on" + " " + date1y+"</p></td></tr>";
            paydate++;
          }
          //console.log(allin[i]);  
          
        }
        
        
        var diff1 = Math.floor((Date.parse(allin[dateindex+1]) - Date.parse(allin[dateindex])) / 86400000);

        var answer1 = (arrayOfObjects[1] * newbalance) / 365;
        answer1 = answer1 / 100;
        answer1 = answer1 * diff1;
        answer1 = answer1.toFixed(2);
        answer1 = parseFloat(answer1);

        globalDays += diff1;

        if (i==2){
          totalInterest = (answer1);
        } else{
          totalInterest += answer1;
        }
        

        var answer9 = answer1.toLocaleString("en", {minimumFractionDigits: 2});

        amountobj[paydate] = parseFloat(amountobj[paydate]);

        var amountobj9 = newbalance.toLocaleString("en", {minimumFractionDigits: 2});
        results += "<tr><td><p>" + 
        date1y + " " + "to" + " " + date2y +"</p></td><td"+
        "><p>" + diff1 + "</p></td>" + 
        "<td><p>"+arrayOfObjects[1]+"%</p></td><td><p>£"+answer9+"</td></tr>";

        dateindex += 3;
        
      } 

    //no poas, only 1 date, more than 1 rate

  } if (poas == false && morethantwodates == false && multiplerates == true){
      console.log("no poas, only 1 date, more than 1 rate");  

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

            if (p==0){
              totalInterest = answer;
            } else{
              totalInterest += answer;
            }
            

            var date1y = reformatDate(arrayOfObjects[commence2]);
            var date2z = reformatDate(arrayOfObjects[terminate2]);

            results += "<tr><td><p>" + 
            date1y + " " + "to" + " " + date2z +
            "</p></td><td><p>" + diff + "</p></td><td><p>"+arrayOfObjects[interest2]+"%</p></td>"+
            "<td><p>£" + answer9 + "</p></td><td></td></tr>";
            console.log("more than 1 rate and only 2 dates and no POA")
          }
        }

    //has poas, only 1 date, more than 1 rate

  } if (poas == true && morethantwodates == false && multiplerates == true){
      console.log("has poas, only 1 date, more than 1 rate");  
      if (singlepoa == true){
          console.log('only 1 poa, only 1 date, more than 1 rate');  
      } else if (multiplepoa == true){
          console.log('multiple poas, only 1 date, more than 1 rate');
      }
      
    //no poas, more than 2 dates, more than 1 rate

  } if (poas == false && morethantwodates == true && multiplerates == true){
      console.log("no poas, more than 2 dates, more than 1 rate");  

    //no poas, more than 2 dates, only 1 rate

  } if (poas == false && morethantwodates == true && multiplerates == false){
      console.log("no poas, more than 2 dates, only 1 rate");  
  
    //has poas, more than 2 dates, more than 1 rate

  } if (poas == true && morethantwodates == true && multiplerates == true){
      console.log("has poas, more than 2 dates, more than 1 rate");  
      if (singlepoa == true){
          console.log('only 1 poa, more than 2 dates, more than 1 rate');
      } else if (multiplepoa == true){
          console.log('multiple poas, more than 2 dates, more than 1 rate');
      }
  }

    var daily = totalInterest / globalDays;
    var totalSum = totalInterest;
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