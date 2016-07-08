google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
var data;
var dataStrings=[];
var chart;
var options;
var lastValue=0;
var currentVal=0;
var lastUpdated;
var maxValue=0;
var timer;
var lastTimer=0;
var button;

function setup()
{
button=createButton('download');
button.position(windowWidth/2,windowHeight*7/10);
button.mousePressed(downloadText);
}

function windowResized()
{
options.width=windowWidth;
options.height=windowHeight/2;
button.position=windowWidth/2,windowHeight*7/10;
}

function downloadText()
{var filename="Session-"+hour()+"_"+minute()+"_"+second()+".txt";

saveStrings(dataStrings,filename);
}

function draw()
{
if((millis()-lastTimer)<3000||lastTimer==0)
  {//updateData();
  lastTimer=millis();
  var datajson;
  datapass(datajson);
  }  
}

function updateData()
{
var address="http://data.theodoretech.com/OfficeTemps.json/?key=8385";
loadJSON(address,datapass);
println(address);
}

function datapass(newData)
{
//if(!isNaN(newData.OfficeTemp))
  //{var newVal=newData.OfficeTemp;
 // currentVal=newData.OfficeTemp;
  currentVal=random(70,80)//temporary commit random numbers while server is down for testing
  lastUpdated=hour()+":"+minute()+":"+second();
  println(currentVal);
  data.addRow([[hour(),minute(),second()],currentVal]);
  chart.draw(data, options);
  var textDat = document.getElementById("textData");
  textDat.innerHTML +="<br>"+hour()+":"+minute()+":"+second()+", "+currentVal;
  dataStrings=append(dataStrings,hour()+":"+minute()+":"+second()+", "+currentVal);
  if(currentVal>maxValue)
    {maxValue=currentVal;
    var maxDat = document.getElementById("maxData");
    maxDat.innerHTML =" Max Temperature is: "+currentVal;
    }
  //}
}


function drawChart() {
      data = new google.visualization.DataTable();
      data.addColumn('timeofday', 'Time of Day');
      data.addColumn('number','Temp');

      // Our central point, which will jiggle.
      //data.addRow([0, 0]);
      
      options = {
        legend: 'none',
        'width':windowWidth,
        'height':windowHeight/2,
        'hAxis': { 'title': 'Time'},
        'vAxis': { 'title': 'Temperature',
                viewWindow: {
                    min: 0,
                    max: 250
                    }
        },
        animation: {
          duration: 200,
          easing: 'inAndOut',
        }
      };

      chart = new google.visualization.ScatterChart(document.getElementById('animatedshapes_div'));

      // Start the animation by listening to the first 'ready' event.
      google.visualization.events.addOneTimeListener(chart, 'ready', datapass);

      // Control all other animations by listening to the 'animationfinish' event.
      google.visualization.events.addListener(chart, 'animationfinish', datapass);

      chart.draw(data, options);
    }
