import hslMapStyle from "hsl-map-style";
import { fetchMap } from "util/map";

function getIfOccupied(byteArray, mapOptions) {
    return (x, y) => byteArray[(Math.floor(x) + (mapOptions.width * Math.floor(y)))];
}

class Matrix {
    constructor(mapOptions, mapComponents) {
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
        const byteArray = new Int8Array(this.mapOptions.height * this.mapOptions.width);
        fetchMap(this.mapOptions, this.mapStyle).then((res) => {
            const canvas = document.createElement("canvas");
            canvas.width = this.mapOptions.width * this.scale;
            canvas.height = this.mapOptions.height * this.scale;
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.src = res;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                for (let x = 0; x < this.mapOptions.width; x++) {
                    for (let y = 0; y < this.mapOptions.height; y++) {
                        byteArray[(x + (this.mapOptions.width * y))] =
                            !!ctx.getImageData(x * this.scale, y * this.scale, 1, 1).data[3];
                    }
                }
                callback(byteArray);
            };
        });
    }
}

export {
    getIfOccupied,
    Matrix,
};
