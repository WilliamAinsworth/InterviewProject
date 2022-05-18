import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from "@angular/common/http";
import {PieChartComponent} from "./data-viewer/pie-chart/pie-chart.component";
import {DataControllerComponent} from './data/data-controller/data-controller.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatSliderModule} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {LineChartComponent} from './data-viewer/line-chart/line-chart.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatDialogModule} from "@angular/material/dialog";
import { AppRoutingModule } from './app-routing.module';
import { ChartViewRouteComponent } from './data-viewer/chart-view-route/chart-view-route.component';
import { TableViewComponent } from './data-viewer/table-view/table-view.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    AppComponent,
    PieChartComponent,
    DataControllerComponent,
    LineChartComponent,
    ChartViewRouteComponent,
    TableViewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatSliderModule,
    FormsModule,
    MatSlideToggleModule,
    MatDialogModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
