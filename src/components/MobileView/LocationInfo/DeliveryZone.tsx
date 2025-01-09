import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import { Autocomplete, GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Skeleton from "react-loading-skeleton";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// const containerStyle = {
//   width: "100%",
//   height: "400px",
// };

const DeliveryZone: React.FC = () => {

  const [deliveryZones, setDeliveryZones] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [markerPosition, setMarkerPosition] = useState<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
  const [restaurantLatitude, setRestaurantLatitude] = useState<number>(0);
  const [restaurantLongitude, setRestaurantLongitude] = useState<number>(0);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [valDistance, setValDistance] = useState<number | null>(null);

  // fetch restaurant profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/get/restaurant/profile?restaurantLoginId=0`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        if (response.data.data.restaurantDetail.Latitude && response.data.data.restaurantDetail.Longitude) {
          setRestaurantLatitude(parseFloat(response.data.data.restaurantDetail.Latitude));
          setRestaurantLongitude(parseFloat(response.data.data.restaurantDetail.Longitude));
          // setAddress(response.data.data.restaurantDetail.Address);
        }

      } else {
        setError("Failed to load profile.");
      }
    } catch (err) {
      setError("An error occurred while fetching the profile.");
      console.error("Error fetching profile:", err);
    } 
  };

  // fetch delivery zones
  const fetchDeliveryZones = async () => {
    try {
      const wpToken = localStorage.getItem("guest_wptoken");

      if (!wpToken) {
        setError("Authentication token is missing.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}api/restaurant/delivery/zones/data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${wpToken}`,
        },
      });
      const data = await response.json();

      if (data.status === 1) {
        setDeliveryZones(data.data.restaurantDeliveryZoneData);
      } else {
        setError("Failed to fetch delivery zones.");
      }
    } catch (error) {
      setError("Something went wrong while fetching delivery zones.");
    }
  };

  const [map, setMap] = useState<any>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [minDistanceZone, setMinDistanceZone] = useState<any | null>(null);

  const onPlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.error("Place details not found");
        return;
      }

      const destination = place.geometry.location;
      if (destination) {
        setMarkerPosition({ lat: destination.lat(), lng: destination.lng() });

        // Calculate and display the route
        if (directionsServiceRef.current && directionsRendererRef.current) {
          const request: google.maps.DirectionsRequest = {
            origin: { lat: restaurantLatitude, lng: restaurantLongitude },
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
          };

          directionsServiceRef.current.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRendererRef.current?.setDirections(result);

              const distance = result?.routes?.[0]?.legs?.[0]?.distance?.text;

              if (distance) {
                const distanceValue = parseFloat(distance.split(" ")[0]);
                setValDistance(distanceValue);
              } else {
                console.error("Distance not available.");
              }
            } else {
              console.error("Directions request failed due to " + status);
              console.log(map);
            }
          });
        }
      }
    }
  };

  useEffect(() => {
    setMarkerPosition({ lat: restaurantLatitude, lng: restaurantLongitude });
  }, [restaurantLatitude, restaurantLongitude]);

  useEffect(() => {
    fetchProfile();
    fetchDeliveryZones();
  }, []);

  useEffect(() => {
    const minZone = deliveryZones.reduce((minZone, currentZone) => {
      const isMatch = currentZone.DistanceValue >= (valDistance || 0);
      if ((isMatch && !minZone) || (isMatch && currentZone.DistanceValue < minZone.DistanceValue)) {
        return currentZone;
      }
      return minZone;
    }, null);

    setMinDistanceZone(minZone);
  }, [deliveryZones, valDistance]);

  if (error) {
    <div>{error}</div>
  }

  return (
    <div>
      <div id="DeliveryZoneMobileView">
        <div className="delivery-address">
          <div className="container-fluid">
            <div className="delivery-row" style={{ marginBottom: "65px" }}>
              <div className="delivery-col">
                <div className="input-btn">
                </div>

                <div className="w-full p-3 m-1">
                  {true ? (<LoadScript
                    googleMapsApiKey={apiKey}
                    libraries={["places"]}
                  >
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '400px' }}
                      center={markerPosition}
                      zoom={10}
                      onLoad={(mapInstance) => {
                        setMap(mapInstance);
                        // Initialize DirectionsService and DirectionsRenderer
                        directionsServiceRef.current = new google.maps.DirectionsService();
                        directionsRendererRef.current = new google.maps.DirectionsRenderer();
                        directionsRendererRef.current.setMap(mapInstance);
                      }}
                    >
                      {/* Autocomplete input */}
                      <Autocomplete onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)} onPlaceChanged={onPlaceChanged}>
                        <input
                          type="text"
                          placeholder="Search for a location"
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            padding: "10px",
                            zIndex: 9,
                            width: "300px",
                          }}
                        />
                      </Autocomplete>

                      <Marker position={markerPosition} />
                    </GoogleMap>
                  </LoadScript>) : (<Skeleton height={400} width={350} />)}

                </div>

                <div className="delivery-table">
                  <table className="table-hover" id="tbl_DeliveryZoneListMobile">
                    <thead>
                      <tr>
                        <th colSpan={3} scope="col">
                          Area
                        </th>
                        <th scope="col" className="text-center">
                          Delivery Fee
                        </th>
                        <th scope="col" className="text-right">
                          Distance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryZones.length > 0 ? (
                        deliveryZones.map((zone) => {

                          const isSmallest = zone.Id === minDistanceZone?.Id;

                          if (valDistance != null) {
                            if (valDistance > zone.DistanceValue) {
                              Swal.fire({
                                icon: 'error',
                                title: 'Sorry!',
                                text: 'We are not delivering to this location.',
                              });
                            }
                          }

                          return (
                            <tr key={zone.Id}
                            className={isSmallest && (valDistance != null ? zone.DistanceValue >= valDistance : false) ? 'bg-warning' : ''}
                            >
                              <td colSpan={3}>{zone.ZoneName}</td>
                              <td className="text-center">${zone.DeliveryFee}</td>
                              <td className="text-right">{zone.DistanceValue} KM</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center">
                            No delivery zones available.
                          </td>
                        </tr>
                      )}
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryZone;
