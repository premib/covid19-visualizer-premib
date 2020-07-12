import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { HttpService } from '../http.service';
import { Label, SingleDataSet, Color } from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-city-dashboard',
  templateUrl: './city-dashboard.component.html',
  styleUrls: ['./city-dashboard.component.css']
})
export class CityDashboardComponent implements OnInit {

  stateName: string;
  districts: Array<string> = [];
  districtDetails: object = {};
  stateCode: string;
  dates: Array<string> = [];
  districtRev: boolean = false;
  CSS_COLOR_NAMES = [
    "AliceBlue",
    "AntiqueWhite",
    "Aqua",
    "Aquamarine",
    "Azure",
    "Beige",
    "Bisque",
    "Black",
    "BlanchedAlmond",
    "Blue",
    "BlueViolet",
    "Brown",
    "BurlyWood",
    "CadetBlue",
    "Chartreuse",
    "Chocolate",
    "Coral",
    "CornflowerBlue",
    "Cornsilk",
    "Crimson",
    "Cyan",
    "DarkBlue",
    "DarkCyan",
    "DarkGoldenRod",
    "DarkGray",
    "DarkGrey",
    "DarkGreen",
    "DarkKhaki",
    "DarkMagenta",
    "DarkOliveGreen",
    "DarkOrange",
    "DarkOrchid",
    "DarkRed",
    "DarkSalmon",
    "DarkSeaGreen",
    "DarkSlateBlue",
    "DarkSlateGray",
    "DarkSlateGrey",
    "DarkTurquoise",
    "DarkViolet",
    "DeepPink",
    "DeepSkyBlue",
    "DimGray",
    "DimGrey",
    "DodgerBlue",
    "FireBrick",
    "FloralWhite",
    "ForestGreen",
    "Fuchsia",
    "Gainsboro",
    "GhostWhite",
    "Gold",
    "GoldenRod",
    "Gray",
    "Grey",
    "Green",
    "GreenYellow",
    "HoneyDew",
    "HotPink",
    "IndianRed",
    "Indigo",
    "Ivory",
    "Khaki",
    "Lavender",
    "LavenderBlush",
    "LawnGreen",
    "LemonChiffon",
    "LightBlue",
    "LightCoral",
    "LightCyan",
    "LightGoldenRodYellow",
    "LightGray",
    "LightGrey",
    "LightGreen",
    "LightPink",
    "LightSalmon",
    "LightSeaGreen",
    "LightSkyBlue",
    "LightSlateGray",
    "LightSlateGrey",
    "LightSteelBlue",
    "LightYellow",
    "Lime",
    "LimeGreen",
    "Linen",
    "Magenta",
    "Maroon",
    "MediumAquaMarine",
    "MediumBlue",
    "MediumOrchid",
    "MediumPurple",
    "MediumSeaGreen",
    "MediumSlateBlue",
    "MediumSpringGreen",
    "MediumTurquoise",
    "MediumVioletRed",
    "MidnightBlue",
    "MintCream",
    "MistyRose",
    "Moccasin",
    "NavajoWhite",
    "Navy",
    "OldLace",
    "Olive",
    "OliveDrab",
    "Orange",
    "OrangeRed",
    "Orchid",
    "PaleGoldenRod",
    "PaleGreen",
    "PaleTurquoise",
    "PaleVioletRed",
    "PapayaWhip",
    "PeachPuff",
    "Peru",
    "Pink",
    "Plum",
    "PowderBlue",
    "Purple",
    "RebeccaPurple",
    "Red",
    "RosyBrown",
    "RoyalBlue",
    "SaddleBrown",
    "Salmon",
    "SandyBrown",
    "SeaGreen",
    "SeaShell",
    "Sienna",
    "Silver",
    "SkyBlue",
    "SlateBlue",
    "SlateGray",
    "SlateGrey",
    "Snow",
    "SpringGreen",
    "SteelBlue",
    "Tan",
    "Teal",
    "Thistle",
    "Tomato",
    "Turquoise",
    "Violet",
    "Wheat",
    "White",
    "WhiteSmoke",
    "Yellow",
    "YellowGreen",
  ];
  stateNames= { 
    AN: 'Andaman and Nicobar Islands', 
    AP: 'Andhra Pradesh', 
    AR: 'Arunachal Pradesh', 
    AS: 'Assam', 
    BR: 'Bihar', 
    CH: 'Chandigarh', 
    CT: 'Chhattisgarh', 
    DL: 'Delhi', 
    DN: 'Dadra and Nagar Haveli and Daman and Diu', 
    GA: 'Goa', 
    GJ: 'Gujarat', 
    HP: 'Himachal Pradesh', 
    HR: 'Haryana', 
    JH: 'Jharkhand', 
    JK: 'Jammu and Kashmir', 
    KA: 'Karnataka', 
    KL: 'Kerala', 
    LA: 'Ladakh',
    LD: 'Lakshadweep', 
    MH: 'Maharashtra', 
    ML: 'Meghalaya', 
    MN: 'Manipur', 
    MP: 'Madhya Pradesh', 
    MZ: 'Mizoram', 
    NL: 'Nagaland', 
    OR: 'Odisha', 
    PB: 'Punjab', 
    PY: 'Puducherry', 
    RJ: 'Rajasthan', 
    SK: 'Sikkim', 
    TG: 'Telangana', 
    TN: 'Tamil Nadu', 
    TR: 'Tripura', 
    TT: 'Z-India',
    UT: 'Uttarakhand', 
    UP: 'Uttar Pradesh', 
    WB: 'West Bengal' 
  } 

  pieChartLabels: Label[] = [];
  pieChartData: SingleDataSet = [];
  pieChartType: ChartType = 'pie';
  pieChartColors: Color[] = [
    {
      backgroundColor: []
    }
  ]

  dailyLineChartLabels: Label[] = [];
  dailyLineChartData: SingleDataSet = [];
  dailyLineChartType: ChartType = 'line';
  dailyLineChartLegend = true;
  dailyLineChartOption: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataSets[] = [{label: '', data: []},{label: '', data: []},{label: '', data: []}];
  barChartColors: Color[] = [
    {
      backgroundColor: 'blue'
    },
    {
      backgroundColor: 'red'
    },
    {
      backgroundColor: 'black'
    },
  ];
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  
  constructor(ar: ActivatedRoute, public http: HttpService) {
    this.stateName = ar.snapshot.params.name;
    this.findStateCode();
    this.startThings();
  }

  async startThings(){
    await this.getStateData();
    await this.getLineChartData();
  }

  async getLineChartData(): Promise<any>{
    this.http.stateDailyData().subscribe(
      data=>{
        this.dates = Object.keys(data[this.stateCode])

        this.barChartLabels = this.dates;
        this.barChartData[0].label = "confirmed";
        this.barChartData[1].label = "Recovered";
        this.barChartData[2].label = "Deceased";
        
        this.dates.forEach(element=> {

          if(data[this.stateCode][element].hasOwnProperty("delta")){
            console.log(data[this.stateCode][element])
            this.dailyLineChartLabels.push(element);
            this.dailyLineChartData.push(data[this.stateCode][element].delta.confirmed);
          }
          this.barChartData[0].data.push(data[this.stateCode][element].total.confirmed);
          if(data[this.stateCode][element].total.hasOwnProperty("recovered")){
            this.barChartData[1].data.push(data[this.stateCode][element].total.recovered);
          }
          else{
            this.barChartData[1].data.push(0)
          }
          if(data[this.stateCode][element].total.hasOwnProperty("deceased")){
            this.barChartData[2].data.push(data[this.stateCode][element].total.deceased)
          }
          else{
            this.barChartData[2].data.push(0)
          }
        });
        console.log(this.barChartData)
      }
    );
  }

  async getStateData(){
    return new Promise((res, rej)=>{
      this.http.districtData().subscribe(
        data=>{
          let tempColors: Array<any> = [];
          this.districts = Object.keys(data[this.stateName].districtData);
          this.districts.sort();
          this.pieChartLabels = this.districts;
          let iterator = 0;
          this.districts.forEach(element=> {
            tempColors.push(this.CSS_COLOR_NAMES[iterator++]);            
            this.districtDetails[element] = {
              name: element,
              ...data[this.stateName].districtData[element]
            }
            this.pieChartData.push(data[this.stateName].districtData[element].active)
          });
          this.pieChartColors[0].backgroundColor  = tempColors;
          console.log(this.pieChartColors[0].backgroundColor)
          res("done")
        }
      )
    }); 
  }


  findStateCode(): void{
    for(let i in this.stateNames){
      if(this.stateNames[i] == this.stateName){
        console.log(i);
        this.stateCode = i;
      }
    }
  }

  sortDist(){
    this.districts.reverse()
  }

  ngOnInit(): void {
  }

}
