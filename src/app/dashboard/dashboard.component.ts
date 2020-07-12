import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { HttpService } from '../http.service';
import { map, reduce } from 'rxjs/operators';
import { of } from 'rxjs';
import { Label, SingleDataSet, Color } from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets, ChartData } from 'chart.js';
import { Router } from '@angular/router';


class heel{
  confirmed: number = 0;
  recovered: number = 0;
  deceased: number = 0;
  tested: number = 0;
  migrated: number = 0;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  statesDetails= {};
  states = ["AN", "AP", "AR", "AS", "BR", "CH", "CT", "DL", "DN", "GA",
   "GJ", "HP", "HR", "JH", "JK", "KA", "KL", "LA", "LD", "MH", "ML", "MN",
    "MP", "MZ", "NL", "OR", "PB", "PY", "RJ", "SK", "TG", "TN", "TR", "TT",
     "UP", "UT", "WB"];

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


  //doughnut-chart variables
  doughnutChartLabels: Label[] = [];
  doughnutChartData: SingleDataSet = [];
  doughnutChartType: ChartType = 'doughnut';

  //bar-chart variables
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

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataSets[] = [{label: '', data: []},{label: '', data: []},{label: '', data: []}];
  barChartColors: Color[] = [
    {
      backgroundColor: 'red'
    },
    {
      backgroundColor: 'blue'
    },
    {
      backgroundColor: 'black'
    },
  ];
  barChartData2: ChartDataSets[] = [{label: '', data: []},{label: '', data: []},{label: '', data: []}];

  //line-chart variables
  lineChartData: ChartDataSets[]= [{data:[], label:''}];
  lineChartType: ChartType = 'line';
  lineChartLabels: Label[] = [];

  constructor(private http: HttpService, private route: Router) {
      
      this.startThings()
      setInterval(async ()=>{
        await this.clearThings();
        this.startThings();
      },300000)
   }

  ngOnInit(): void {
    
  }


  async startThings(){
    await this.getCount();
    this.loadDoughnutChart();
    console.log(this.barChartData)
    await this.getDailySheet()
    // })
  }
  
  async getDailySheet(){
    this.http.timeseries().subscribe(
      data=> {
        this.barChartData[0].label = 'Total Confirmed'
        this.barChartData2[0].label = 'Daily Confirmed'
        this.barChartData[1].label = 'Total Deceased'
        this.barChartData2[1].label = 'Daily Deceased'
        this.barChartData[2].label = 'Total Recovered'
        this.barChartData2[2].label = 'Daily Recovered'
        console.log(data, typeof data)
        data.cases_time_series.forEach(element => {
          this.barChartLabels.push(element.date);
          this.barChartData[0].data.push(element.totalconfirmed);
          this.barChartData[1].data.push(element.totaldeceased);
          this.barChartData[2].data.push(element.totalrecovered);
          this.barChartData2[0].data.push(element.dailyconfirmed);
          this.barChartData2[1].data.push(element.dailydeceased);
          this.barChartData2[2 ].data.push(element.dailyrecovered);
        });

        this.lineChartData[0].label = 'Total Tests'
        data.tested.forEach(element => {
          console.log(element)
          this.lineChartLabels.push(element.updatetimestamp.split(" ")[0])          
          this.lineChartData[0].data.push(element.totalsamplestested)
        });
      }
    )
  }

  loadDoughnutChart(){
    console.log("here")
    this.doughnutChartLabels = this.states;
    this.states.forEach(code=>{
      if(code != 'TT')
        this.doughnutChartData.push(this.statesDetails[code].total.confirmed)
    });
  }

  async getCount(): Promise<any>{    
    return new Promise((res, rej)=> {
      this.http.dailyCount().pipe(
        map(data => {
  
          let districtDetails: object = {};
          let temp: heel= new heel();
          let districts: Array<string> = [];
          for(let i of this.states){
  
            this.statesDetails[i] = {
              name: this.stateNames[i],
              total: {...temp, ...data[i].total},
              districts: {}
            }
  
            if(data[i].hasOwnProperty("districts")){
              districts = Object.keys(data[i].districts);
              for(let j of districts){
                districtDetails[j] = data[i].districts[j].total;
                this.statesDetails[i].districts[j] = districtDetails[j];
              }
            }
            
          }
          return this.statesDetails;
        }),
      ).subscribe(
        (data)=>{
          
          if(data.hasOwnProperty("TT")){
            console.log("done")
            return res("done")
          }
          
        }
      )
      
    });
  }

  logout(){
    localStorage.removeItem('covid19new');
    this.route.navigateByUrl('');
  }
  async clearThings(){
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    this.barChartLabels = [];
    this.barChartData = [{label: '', data: []},{label: '', data: []},{label: '', data: []}];
    this.barChartData2 = [{label: '', data: []},{label: '', data: []},{label: '', data: []}];
    this.lineChartData = [{data:[], label:''}];
    this.lineChartLabels = [];
  }

}
