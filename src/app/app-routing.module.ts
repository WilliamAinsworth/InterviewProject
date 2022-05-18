import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChartViewRouteComponent} from "./data-viewer/chart-view-route/chart-view-route.component";
import {TableViewComponent} from "./data-viewer/table-view/table-view.component";

const routes: Routes = [
  { path: 'charts', component: ChartViewRouteComponent  },
  { path: 'table', component: TableViewComponent  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
