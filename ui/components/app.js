import React, { Component } from "react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import DatePicker from "material-ui/DatePicker";
import RaisedButton from "material-ui/RaisedButton";
import Divider from "material-ui/Divider";

import RadioGroup from "components/radioGroup";
import StopTable from "components/stopTable";

import { fetchStops } from "util/stops";

import styles from "./app.css";

const muiTheme = getMuiTheme({});

const labelsByComponent = {
    StopPoster: "Pysäkkijuliste",
    Timetable: "Aikataulu",
};

const tableTypes = {
    stops: "Pysäkit",
    groups: "Listat",
};

class App extends Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        fetchStops().then((stops) => {
            const data = {
                columns: ["Lyhyttunnus", "Pysäkkitunnus"],
                rows: stops.map(({ shortId, stopId }) => ({
                    isSelected: false,
                    values: [shortId, stopId],
                })),
            };
            this.setState({ data });
        });
    }

    render() {
        if (!this.state.data) return null;

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div className={styles.root}>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <h3>Tuloste</h3>
                            <RadioGroup items={labelsByComponent}/>
                        </div>

                        <div className={styles.column}>
                            <h3>Tyyppi</h3>
                            <RadioGroup items={tableTypes}/>
                        </div>

                        <div className={styles.column}>
                            <h3>Päivämäärä</h3>
                            <DatePicker defaultDate={new Date()}/>
                        </div>
                    </div>

                    <StopTable {...this.state.data}/>

                    <Divider/>
                    <br/>
                    <RaisedButton primary label="Generoi"/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
