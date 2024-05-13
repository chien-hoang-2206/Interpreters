import React, { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useTranslation } from 'react-i18next'

const containerStyle = {
  width: '100%',
  height: '400px'
}

const GoogleMapCustom = (props) => {
  const { lng, lat, } = props
  const [clickedLatLng, setClickedLatLng] = useState({ lat: Number(lat), lng: Number(lng) })
  const { t } = useTranslation()
  useEffect(() => {
    setClickedLatLng({ lat: Number(lat), lng: Number(lng) })
  }, [lat, lng])


  return (
    <>
      {lng && lat && (
        <div style={{ padding: 10, width: '100%' }}>
          <LoadScript >

            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: clickedLatLng.lat, lng: clickedLatLng.lng }}
              zoom={20}
            >
              <Marker
                position={{ lat: clickedLatLng.lat, lng: clickedLatLng.lng }}
              />
            </GoogleMap>
          </LoadScript>
        </div>
      )}
    </>
  )
}

export default GoogleMapCustom
