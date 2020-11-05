import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'arcgis-comitan-map';
  // Set our map properties
  mapCenter = [-102.01904296874999, 23.725011735951796];
  basemapType = 'gray-vector';
  mapZoomLevel = 4;

  mapLoadedEvent(status: boolean): void {
    console.log('the map loaded: ' + status);
  }

}
