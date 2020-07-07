export default function MapLoader() {
  /* eslint-disable */
    return new Promise((resolve, reject) => {
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        var script = document.createElement("script"), scriptUi = document.createElement('script');
        script.type = "text/javascript";
        script.async = true;
        scriptUi.type = "text/javascript";
        script.src =
          "https://webapi.amap.com/maps?v=1.4.15&key=7d1b92244fe7d8cb9826c0ad6ff9e2c2&plugin=AMap.Geocoder,AMap.MarkerClusterer&callback=initAMap";
        scriptUi.src = "//webapi.amap.com/ui/1.0/main.js";
        scriptUi.onload =  () => {
          console.log("加载完毕");
          window.UI = true;
        }
        script.onerror = reject;
        document.head.appendChild(script);
      }
      window.UI =false;
      window.initAMap = () => {
        document.head.appendChild(scriptUi);
        resolve(window.AMap);
      };
    });
  }
