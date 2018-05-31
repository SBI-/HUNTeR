import React from 'react';

import {Map as LeafletMap, Marker, Tooltip, TileLayer} from 'react-leaflet';

import {map} from '../../config/hunterUiDefaults';

export default {
  addPosition(element) {
    if (Boolean(this.state.map.currentExercise)) {
      let newPositions = this.state.selectedPositions;
      newPositions.set(this.state.map.currentExercise, this.state.map.location);
      this.setState({selectedPositions: newPositions});
    }
    let map = {...this.state.map};
    map.currentExercise = element.id;
    map.popupText = element.name;
    if (!Boolean(this.state.selectedPositions.get(element.id))) {
      map.location = this.state.map.location;
    } else {
      map.location = this.state.selectedPositions.get(element.id);
    }
    this.setState({map: map});
  },

  getQuizMap() {
    const pointer = map.icons.pointer.icon;

    return (
      <LeafletMap
        center={this.state.map.location || map.baseLocation}
        onClick={this.handleClick}
        onLocationFound={this.handleLocation}
        zoom={this.state.map.zoom}
        onZoomEnd={this.handleZoom}
        ref={this.mapref}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {Boolean(this.state.map.location) && (
          <Marker position={this.state.map.location} icon={pointer}>
            {Boolean(this.state.map.popupText) && (
              <Tooltip direction="left" offset={map.icons.pointer.offset} opacity={map.icons.opacity} permanent>
                <span>{this.state.map.popupText}</span>
              </Tooltip>
            )}
          </Marker>
        )}
      </LeafletMap>
    );
  },

  getParticipantMap() {
    const pointer = map.icons.pointer.icon;
    const protagonist = map.icons.protagonist.icon;

    return (
      <LeafletMap
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
              offset={element === 'currentPosition' ? map.icons.protagonist.offset : map.icons.pointer.offset}
              opacity={map.icons.opacity}
              permanent
            >
              <span>{element}</span>
            </Tooltip>
          </Marker>
        ))}
      </LeafletMap>
    );
  }
};