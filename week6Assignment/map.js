var Main;

// Assuming you're using a bundler or ES module-compatible environment

import Map from "https://js.arcgis.com/4.33/@arcgis/core/Map.js";
import Graphic from "https://js.arcgis.com/4.33/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/GraphicsLayer.js";
import ElevationLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/ElevationLayer.js";
import SceneView from "https://js.arcgis.com/4.33/@arcgis/core/views/SceneView.js";

Main = (function() {
    const layer = new ElevationLayer({
        url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    });
    const map = new Map({
        basemap: "hybrid",
        ground: {
            layers: [layer]
         },
    });
    
    const view = new SceneView({
        container: "map",
        viewingMode: "global",
        map: map,
        camera: {
            position: {
                x: -105.503,
                y: 44.270,
                z: 20000000,
                spatialReference: {
                    wkid: 4326
    
                }
            },
            heading: 0,
            tilt: 0
        },
        popup: {
            dockEnabled: true,
            dockOptions: {
                breakpoint: false
            }
        },
        // enable shadows to be cast from the features
        environment: {
            lighting: {
                directShadowsEnabled: false
            }
        }
    });
                
    const initMap = function(){
                          
        const graphicsLayer = new GraphicsLayer();               
        map.add(graphicsLayer);

        for (const [key, value] of Object.entries(myStuff)){                       
            console.log(key, value)
                        
            const point = {                        
                type: "point",                             
                x: value.coord[0],                        
                y: value.coord[1],                            
                z: 10000                          
            };
                                
            const markerSymbol = {                            
                type: "simple-marker",                             
                color: [255, 102, 0, 0.8],  
                size: 12,
                style: "diamond",                          
                outline: {
                              
                    // autocasts as new SimpleLineSymbol()                              
                    color: [255, 255, 255],                             
                    width: 1.5
                            
                }
                          
            };
                                                
            const pointGraphic = new Graphic({                            
                geometry: point,                            
                symbol: markerSymbol,                            
                popupTemplate: {                                
                     title: key,
  content: `
    <b>City:</b> ${value.city}<br>
    <b>State:</b> ${value.state}<br>
    <b>Coordinates:</b> ${value.coord.join(", ")}
  `                            
                }                  
            });
                          
            graphicsLayer.add(pointGraphic);
            view.on("click", function(event) {
    view.hitTest(event).then(function(response) {
        const result = response.results[0];
        if (result && result.graphic && result.graphic.geometry.type === "point") {
            view.goTo({
                target: result.graphic.geometry,
                zoom: 8
            });
        }
    });
});
                    
                    
        }
                                    
    }
                
    initMap()
    const cities = {
        "Minneapolis":[-93.2650, 44.9778],
         "Laramie": [-105.578, 41.3114],
         "Casper": [-106.3131, 42.8501],
         "Grand Canyon": [-112.1401, 36.0544]
    
    };

    const searchInput = document.createElement("input");
    searchInput.type ="text";
    searchInput.paceholder ="Search city...";
searchInput.style.position = "absolute";
searchInput.style.top = "10px";
searchInput.style.left = "10px";
searchInput.style.padding = "6px";
searchInput.style.zIndex = "10";
searchInput.style.borderRadius = "6px";
document.body.appendChild(searchInput);

searchInput.addEventListener("change", function() {
    const city = searchInput.value.trim();
    if (cities[city]) {
        const [x, y] = cities[city];
        view.goTo({
            target: { type: "point", x: x, y: y, z: 20000 },
            zoom: 8
        });
    } else {
        alert("City not found. Try one of: Minneapolis, Laramie, Casper, Grand Canyon, Denver");
    }
}); 
                
    return {};

            
})();



    
