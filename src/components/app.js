import React, { Component } from "react";

import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";


import StopPoster from "components/stopPoster/stopPosterContainer";
import Timetable from "components/timetable/timetableContainer";
import RouteMap from "components/routeMap/routeMapContainer";
import renderQueue from "util/renderQueue";

const components = {
    StopPoster,
    Timetable,
    RouteMap,
};

const client = new ApolloClient({
    link: createHttpLink({ uri: "http://dev-kartat.hsldev.com/jore/graphql" }),
    cache: new InMemoryCache(),
});

class App extends Component {
    static handleError(error) {
        if (window.callPhantom) {
            window.callPhantom({ error: error.message });
            return;
        }
        console.error(error); // eslint-disable-line no-console
    }

    componentDidMount() {
        if (this.root) {
            renderQueue.onEmpty((error) => {
                if (error) {
                    App.handleError(error);
                    return;
                }
                if (window.callPhantom) {
                    window.callPhantom({
                        width: this.root.offsetWidth,
                        height: this.root.offsetHeight,
                    });
                }
            });
        }
    }

    // eslint-disable-next-line class-methods-use-this
    componentDidCatch(error, info) {
        // eslint-disable-next-line no-console
        console.log(info);
        App.handleError(error);
    }

    render() {
        let ComponentToRender;
        let props;
        let componentName;

        try {
            const params = new URLSearchParams(window.location.search.substring(1));
            componentName = params.get("component");
            ComponentToRender = components[componentName];

            props = JSON.parse(params.get("props"));
        } catch (error) {
            App.handleError(new Error("Failed to parse url fragment"));
            return null;
        }

        if (!ComponentToRender || !props) {
            App.handleError(new Error("Invalid component or props"));
            return null;
        }

        let rootStyle = {};

        if (componentName === "RouteMap") {
            rootStyle = {
                display: "inline-block",
                width: props.mapOptions.width,
                height: props.mapOptions.height,
            };
        } else if (!props.printTimetablesAsA4) {
            rootStyle = {
                display: "inline-block",
                width: props.width,
                height: props.height,
            };
        }

        return (
            <div
                style={rootStyle}
                ref={(ref) => { this.root = ref; }}
            >
                <ApolloProvider client={client}>
                    <ComponentToRender {...props}/>
                </ApolloProvider>
            </div>
        );
    }
}

export default App;
