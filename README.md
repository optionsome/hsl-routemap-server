HSL Routemap server
====================

This project is a spin off from HSL Map publisher, most of the logic used in this project was originally made for the Publisher. This project has been drifting away from the Publisher project, so we decided to make this project in to a whole separate repository.

### Dependencies

Install dependencies:

```
yarn
```

Install `pdftk`

### App


Start development server:
```
yarn start:hot
```

Test URL:
http://localhost:5000/?props={"mapOptions":{"zoom":12.774952540009707,"pitch":0,"scale":4.166666666666667,"width":288,"center":[24.670969761337066,60.13977797444001],"height":288,"bearing":0,"meterPerPxRatio":6},"configuration":{"date":"2018-09-01","name":"test1","nearBuses":false,"scaleLength":200,"scaleFontSize":12,"terminusWidth":170,"maxAnchorLength":60,"stationFontSize":12,"terminusFontSize":13,"intermediatePointWidth":50,"clusterSamePointsDistance":1000,"intermediatePointFontSize":9,"pointMinDistanceFromTerminus":100,"clusterDifferentPointsDistance":20}}

### Writing components

- Write CSS styles @ 72 dpi (i.e. 72 pixels will be 25.4 mm)
- Add components to `renderQueue` for async tasks (PDF is generated when `renderQueue` is empty)
- Use SVG files with unique IDs and no style tags (Illustrator exports)

### Server

Server and REST API for printing components to PDF files and managing their metadata in a Postgres database.

Start Postgres:
```
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres
```

Start server:
```
PG_CONNECTION_STRING=postgres://postgres:postgres@localhost:5432/postgres yarn server
```

### Running in Docker

Start a Postgres Docker container:
```
docker run -d --name publisher-postgres -e POSTGRES_PASSWORD=postgres postgres
```

Build and start the container:
```
docker build -t hsl-routemap-server .
docker run -d -p 4000:4000 -v $(pwd)/output:/output -v $(pwd)/fonts:/fonts --link publisher-postgres -e "PG_CONNECTION_STRING=postgres://postgres:postgres@publisher-postgres:5432/postgres" --shm-size=1G hsl-routemap-server
```

where `fonts` is a directory containing `Gotham Rounded` and `Gotham XNarrow` OpenType fonts.
