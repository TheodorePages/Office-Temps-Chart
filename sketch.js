var chart;
var data;
var options;
var chartReady=false;
var downloadButton;
var catchupButton;
var loadTimer=0;
google.charts.load("current", {packages:["corechart"]}); 
google.charts.setOnLoadCallback(chartInitialization);
var singleTempUpdateAddress="http://data.theodoretech.com/OfficeTempCurrent/?key=8385";
var todayTempUpdateAddress="http://data.theodoretech.com/OfficeTempsToday/?key=8385";
function windowResized()
{

buttonLocs();
}

function setup() {
downloadButton=createButton('download');
downloadButton.mousePressed(downloadButtonCB);
catchupButton = createButton("GetToday's Temps");
catchupButton.mousePressed(catchupButtonCB);
buttonLocs();
}

function buttonLocs()
{if(windowWidth<displayWidth/2)
  {
  catchupButton.position(windowWidth/2,windowHeight*1/20);
  downloadButton.position(windowWidth/2,windowHeight*1.75/20);
  }
else{
  catchupButton.position(windowWidth*1/3,windowHeight*1/20);
  downloadButton.position(windowWidth/2,windowHeight*1/20);
  }
if(chartReady){
  options = {
        legend: 'none',
        'width':windowWidth*.9,
        'height':windowHeight/2,
        'hAxis': { 'title': 'Time'},
        'vAxis': { 'title': 'Temperature',
                viewWindow: {
                    min: 0,
                    max: 150
                    }
        }//,
        //animation: {
          //duration: 10,
          //easing: 'inAndOut',
        //}
      };
  }
}

function draw() {

if(chartReady)
  {  
  if(millis()-loadTimer>10000||loadTimer==0)
    {loadStrings(singleTempUpdateAddress,liveDataUpdate) 
    loadTimer=millis();
    }
  }
}


function liveDataUpdate(data)
{println(data);
var dataSplit=splitTokens(String(data),",");
println(dataSplit[0]);
var timeOfTemp=splitTokens(dataSplit[1],":");
var temp=float(dataSplit[2]);
addDataPoint(timeOfTemp,float(dataSplit[2]),false);

}

function catchupButtonCB()
{
loadStrings(todayTempUpdateAddress,catchupToday) 
}

function catchupToday(data)
{
println(data);

var dataSplit=splitTokens(String(data),"_");
for(var i=0; i<dataSplit.length-1; i++)
  {
  var dataSplit2=splitTokens(dataSplit[i],",");
  var timeOfTemp=splitTokens(dataSplit2[1],":");
  var temp=float(dataSplit2[2]);
  addDataPoint(timeOfTemp,float(dataSplit2[2]),true);
  }
var dataSplit2=splitTokens(dataSplit[dataSplit.length-1],",");
  var timeOfTemp=splitTokens(dataSplit2[1],":");
  var temp=float(dataSplit2[2]);
  addDataPoint(timeOfTemp,float(dataSplit2[2]),false);
}

function addDataPoint(timeVal,value,holdDraw)
{//println(value);
data.addRow([[int(timeVal[0]),int(timeVal[1]),int(timeVal[2])],value]);
//wait to draw if more data is coming
if(holdDraw==false)
  {
  chart.draw(data,options);
  }
}

function downloadButtonCB()
{

}

function chartInitialization()
{data = new google.visualization.DataTable();
chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
data.addColumn('timeofday', 'Time of Day');
//data.addColumn('number','Temp');
data.addColumn('number','Temp');
//data.addRow([2,4]);
//data.addRow([[int(hour()),int(minute()),int(second())],float(2)]);
options = {
        legend: 'none',
        'width':windowWidth*.9,
        'height':windowHeight/2,
        'hAxis': { 'title': 'Time'},
        'vAxis': { 'title': 'Temperature',
                viewWindow: {
                    min: 0,
                    max: 150
                    }
        }//,
        //animation: {
          //duration: 10,
          //easing: 'inAndOut',
        //}
      };
chart.draw(data,options);
drawToolbar();
chartReady=true;
println("chartReady");
}

function drawToolbar() {
      var components = [
          {type: 'html', datasource: todayTempUpdateAddress},
          {type: 'csv', datasource: todayTempUpdateAddress}
      ];

      var container = document.getElementById('toolbar_div');
      google.visualization.drawToolbar(container, components);
    };






