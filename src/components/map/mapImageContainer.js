import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import hslMapStyle from 'hsl-map-style';
import mapValues from 'lodash/mapValues';

import { fetchMap } from 'util/map';
import promiseWrapper from 'util/promiseWrapper';
import MapImage from './mapImage';

const propsMapper = mapProps(({ options, components, date, extraLayers }) => {
  const mapStyle = hslMapStyle.generateStyle({
    components,
  });

  const sources = mapValues(mapStyle.sources, (value, key) => {
    // eslint-disable-next-line no-param-reassign
    value.url += `?date=${date}`;
    return value;
  });

  mapStyle.sources = sources;

  // Remove source containing bus routes (rail and subway routes have separate sources)
  if (components.routes && components.routes.enabled && components.routes.hideBusRoutes) {
    mapStyle.sources.routes = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    };
  }

  if (extraLayers) {
    mapStyle.layers = [...mapStyle.layers, ...extraLayers];
  }

  return { src: fetchMap(options, mapStyle) };
});

const hoc = compose(
  propsMapper,
  promiseWrapper('src'),
);

const MapImageContainer = hoc(MapImage);

MapImageContainer.defaultProps = {
  // Used only when routes or stops component is enabled
  date: null,
};

MapImageContainer.optionsShape = {
  center: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  scale: PropTypes.number,
};

MapImageContainer.propTypes = {
  options: PropTypes.shape(MapImageContainer.optionsShape).isRequired,
  components: PropTypes.objectOf(
    PropTypes.shape({
      enabled: PropTypes.bool.isRequired,
      hideBusRoutes: PropTypes.bool,
    }),
  ).isRequired,
  date: PropTypes.string,
  extraLayers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ),
};

export default MapImageContainer;
