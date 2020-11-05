import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'arcgis-comitan-map';
  // Set our map properties
  mapCenter = [-92.133333, 16.25];
  basemapType = 'gray-vector';
  mapZoomLevel = 12;

  mapLoadedEvent(status: boolean): void {
    console.log('the map loaded: ' + status);
  }

}
