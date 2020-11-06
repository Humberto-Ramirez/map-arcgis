import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

import {loadModules} from 'esri-loader';
import {mxShape} from './shapes/mx_shape';
import {comitanShape} from './shapes/comitan_shape';
import {colorsShapes} from './colors_shapes';
import {urbanShapes} from './shapes/urban_shapes';
import {ruralShapes} from './shapes/rural_shapes';
import {urbanPoints} from './shapes/urban_points';
import {ruralPoints} from './shapes/rural_points';
import esri = __esri;

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild('mapViewNode', {static: true}) private mapViewEl: ElementRef;

  /**
   * _zoom sets map zoom
   * _center sets map center
   * _basemap sets type of map
   * _loaded provides map loaded status
   */
  private _zoom = 10;
  private _center: Array<number> = [0.1278, 51.5074];
  private _basemap = 'streets';
  private _loaded = false;
  private _view: esri.MapView = null;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  constructor() {
  }

  async initializeMap() {
    try {
// Load the modules for the ArcGIS API for JavaScript
      const [EsriMap, EsriMapView, Graphic, GraphicsLayer, Viewpoint, Bookmark, Bookmarks, Expand] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/Graphic',
        'esri/layers/GraphicsLayer',
        'esri/Viewpoint',
        'esri/webmap/Bookmark',
        'esri/widgets/Bookmarks',
        'esri/widgets/Expand'
      ]);

      const mxShapeP = {
        type: 'polyline',
        paths: mxShape
      };

      const comitanShapeP = {
        type: 'polyline',
        paths: comitanShape
      };

      const mxBM = new Bookmark({
        name: 'México',
        extent: {
          xmax: -49380296.044373505,
          xmin: -53421063.10763999,
          ymax: 3544598.359519775,
          ymin: 1930248.322137282,
          spatialReference: {
            wkid: 102100
          }
        }
      });

      const chiapasBM = new Bookmark({
        name: 'Chiapas',
        extent: {
          xmax: -10045128.360041605,
          xmin: -10550224.242949916,
          ymax: 2045105.9155128468,
          ymin: 1722847.4042626293,
          spatialReference: {
            wkid: 102100
          }
        }
      });

      const comitanBM = new Bookmark({
        name: 'Comitán',
        extent: {
          xmax: -50322702.79662613,
          xmin: -50338487.042967,
          ymax: 1837662.9265893954,
          ymin: 1830019.223760888,
          spatialReference: {
            wkid: 102100
          }
        }
      });

      const simpleFillSymbol = {
        type: 'simple-fill',
        outline: {
          color: [27, 176, 223],
          width: 2
        }
      };

      const polygonMxGraphic = new Graphic({
        geometry: mxShapeP,
        symbol: simpleFillSymbol
      });

      const comitanGraphic = new Graphic({
        geometry: comitanShapeP,
        symbol: {
          type: 'simple-fill',
          outline: {
            color: [122, 114, 101],
            width: 2
          }
        }
      });

      const graphicsLayer = new GraphicsLayer();
      graphicsLayer.add(polygonMxGraphic);
      graphicsLayer.add(comitanGraphic);
      addGraphics();
      addPoints();

      function addGraphics(): void {
        urbanShapes.forEach(shape => {
          const gp = new Graphic({
            geometry: shape,
            symbol: getSymbol()
          });
          graphicsLayer.add(gp);
        });
        ruralShapes.forEach(shape => {
          const gp = new Graphic({
            geometry: shape,
            symbol: getSymbol()
          });
          graphicsLayer.add(gp);
        });
      }

      function addPoints(): void {
        urbanPoints.forEach(po => {
          // Add text below the pin
          const textGraphic = new Graphic({
            geometry: {
              type: 'point',
              longitude: po.point[0],
              latitude: po.point[1]
            },
            symbol: {
              type: 'text',
              color: [25, 25, 25],
              haloColor: [255, 255, 255],
              haloSize: '1px',
              text: po.name,
              xoffset: 0,
              yoffset: -5,
              font: {
                size: 10
              }
            }
          });
          graphicsLayer.add(textGraphic);
        });

        ruralPoints.forEach(po => {
          // Add text below the pin
          const textGraphic = new Graphic({
            geometry: {
              type: 'point',
              longitude: po.point[0],
              latitude: po.point[1]
            },
            symbol: {
              type: 'text',
              color: [25, 25, 25],
              haloColor: [255, 255, 255],
              haloSize: '1px',
              text: po.name,
              xoffset: 0,
              yoffset: -5,
              font: {
                size: 10
              }
            }
          });
          graphicsLayer.add(textGraphic);
        });

      }

      function getSymbol(): any {
        const randomValue = colorsShapes[Math.floor(Math.random() * colorsShapes.length)];
        return {
          type: 'simple-fill',
          outline: {
            color: randomValue,
            width: 2
          }
        };
      }

      // Configure the Map
      const mapProperties: esri.MapProperties = {
        basemap: this._basemap
      };
      const map: esri.Map = new EsriMap(mapProperties);
      // map.add(graphicsLayer);
      map.add(graphicsLayer);

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map
      };

      this._view = new EsriMapView(mapViewProperties);

      const bm = new Bookmarks({
        view: this._view,
        editingEnabled: false,
        // whenever a new bookmark is created, a 100x100 px
        // screenshot of the view will be taken and the rotation, scale, and extent
        // of the view will not be set as the viewpoint of the new bookmark
        bookmarkCreationOptions: {
          takeScreenshot: true,
          captureViewpoint: true,
          screenshotSettings: {
            width: 100,
            height: 100
          }
        },
        bookmarks: [mxBM, chiapasBM, comitanBM]
      });

      const bkExpand = new Expand({
        view: this._view,
        content: bm,
        expanded: true
      });

      this._view.ui.add(bkExpand, 'top-right');


      await this._view.when();
      return this._view;
    } catch (error) {
      console.log('EsriLoader: ', error);
    }
  }

  ngOnInit(): void {
    this.initializeMap().then(mapView => {
      // The map has been initialized
      console.log('mapView ready: ', this._view.ready);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
    });
  }

  ngOnDestroy(): void {
    if (this._view) {
      // destroy the map view
      this._view.container = null;
    }
  }

}
