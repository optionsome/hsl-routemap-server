/* eslint-disable */

import hslMapStyle from "hsl-map-style";
import { fetchMap } from "util/map";

export default class MapAlphaChannelMatrix {
    constructor(mapOptions, mapComponents) {
        this.byteArray = new Int8Array(mapOptions.height * mapOptions.width);
        this.mapOptions = mapOptions;
        this.mapComponents = mapComponents;

        this.mapStyle = hslMapStyle.generateStyle({
            components: {
                ...mapComponents,
                base: { enabled: false },
            },
            glyphsUrl: "https://kartat.hsldev.com/",
        });

        this.scale = 5;
    }

    initialize(callback) {
        fetchMap(this.mapOptions, this.mapStyle).then((res) => {
            let canvas = document.createElement('canvas');
            //let canvas = document.getElementById('joakim');
            canvas.width = this.mapOptions.width * this.scale;
            canvas.height = this.mapOptions.height * this.scale;
            let ctx = canvas.getContext('2d');
            let img = new Image();
            img.src = res;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                for (let x = 0; x < this.mapOptions.width; x++) {
                    for (let y = 0; y < this.mapOptions.height; y++) {
                        this.byteArray[(x + this.mapOptions.width * y)] =
                            !!ctx.getImageData(x * this.scale, y * this.scale, 1, 1).data[3];
                    }
                }
                // console.log(this.byteArray);
                callback();
            }
        });
    }

    isOccupied(x, y) {
        return this.byteArray[(x + this.mapOptions.width * y)];
    }
}
