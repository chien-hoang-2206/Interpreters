import React from 'react'
import Constants from 'utils/Constants'
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api'

const MapComponent = ({ selectedLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: Constants.REACT_APP_GOOGLE_MAPS_KEY
  })
  const mapRef = React.useRef()
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
  }, [])
  if (loadError) return 'Error'
  if (!isLoaded) return 'Maps'

  return (
    <div style={{ marginTop: '50px' }}>
      <GoogleMap
        mapContainerStyle={{
          height: '800px'
        }}
        center={selectedLocation}
        zoom={13}
        onLoad={onMapLoad}
      >
        <MarkerF
          position={selectedLocation}
          icon={'http://maps.google.com/mapfiles/ms/icons/green-dot.png'}
        />
      </GoogleMap>
    </div>
  )
}

export default MapComponent
