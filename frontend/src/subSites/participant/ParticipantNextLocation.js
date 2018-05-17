import React from 'react';

import {Button, Grid} from 'semantic-ui-react';
import L from 'leaflet';
import {Map as LeafletMap, Marker, Tooltip, TileLayer} from 'react-leaflet';

import APIHandler from '../../handlers/APIHandler';
import ModalHandler from '../../handlers/ModalHandler';

export default class ParticipantNextLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAgreement: true,
      locations: new Map(),
      selectedPositions: new Map(),
      routing: false,
      routingLocation: undefined,
      loading: true,
      map: {
        location: undefined,
        zoom: 19
      }
    };

    this.getJSONHeader = APIHandler.getJSONHeader;
    this.getAgreement = ModalHandler.getAgreement.bind(this);

    this.mapref = React.createRef();
  }

  componentDidMount() {
    this.getNextLocation();
  }

  locate = () => this.mapref.current.leafletElement.locate();

  getNextLocation = () => {
    const locations = new Map([
      ['Schwamendingerplatz', [47.4048799, 8.5714819]],
      ['Heiden', [47.446416, 9.53677]],
      ['Zürich HB', [47.377923, 8.5401898]],
      ['HSR', [47.2233607, 8.8173627]]
    ]);

    this.setState({
      locations,
      selectedPositions: new Map(locations),
      loading: false
    });
  };

  handleZoom = event => {
    let map = {...this.state.map};
    map.zoom = this.mapref.current.leafletElement.getZoom();
    this.setState({map});
  };

  handleLocation = event => {
    let locations = new Map(this.state.locations);
    locations.set('currentPosition', [event.latlng.lat, event.latlng.lng]);
    this.setState({locations, selectedPositions: new Map(locations)});
  };

  handleSelection = event => {
    let locations = new Map(this.state.locations);
    if (!this.state.routing && event.target.options.id !== undefined) {
      locations = new Map([
        ['currentPosition', this.state.locations.get('currentPosition')],
        [
          event.target.options.id,
          this.state.locations.get(event.target.options.id)
        ]
      ]);

      this.setState({routing: false});
    }

    this.setState({selectedPositions: locations});
  };

  bounds = () => {
    const boundLocations =
      Array.from(this.state.selectedPositions.values()).length !== 0
        ? Array.from(this.state.selectedPositions.values())
        : [[0, 0]];

    return L.latLngBounds(boundLocations);
  };

  render() {
    const pointer = L.icon({
      iconUrl: require('../../images/icons/e-map.png'),
      iconSize: [50, 94],
      iconAnchor: [50, 0]
    });

    const protagonist = L.icon({
      iconUrl: require('../../images/icons/protagonist.png'),
      iconSize: [33, 92],
      iconAnchor: [16, 46]
    });

    return (
      <Grid padded>
        {this.state.showAgreement && this.getAgreement()}
        <Grid.Row id="mapContainer">
          <LeafletMap
            center={this.state.map.location || [0, 0]}
            bounds={this.bounds()}
            onLocationFound={this.handleLocation}
            onClick={this.handleSelection}
            zoom={this.state.map.zoom}
            onZoomEnd={this.handleZoom}
            ref={this.mapref}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Array.from(this.state.selectedPositions.keys()).map(element => (
              <Marker
                key={element}
                id={element}
                position={this.state.locations.get(element)}
                icon={element === 'currentPosition' ? protagonist : pointer}
                onClick={this.handleSelection}
              >
                <Tooltip
                  direction="left"
                  offset={element === 'currentPosition' ? [-16, 0] : [-50, 75]}
                  opacity={0.9}
                  permanent
                >
                  <span>{element}</span>
                </Tooltip>
              </Marker>
            ))}
          </LeafletMap>
        </Grid.Row>
        <Grid.Row centered>
          <Button
            positive
            content={'Standort aktualisieren'}
            icon="marker"
            onClick={this.locate}
          />
        </Grid.Row>
      </Grid>
    );
  }
}