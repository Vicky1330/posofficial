import React, { useEffect, useState, useRef } from "react";
import { Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Cordinates {
  Lng: number | undefined;
  Lat: number | undefined;
}

type Library = "places" | "drawing" | "visualization";

const DeliveryModal: React.FC<DeliveryModalProps> = ({ isOpen, onClose }) => {
  const [restaurantLatitude, setRestaurantLatitude] = useState<number>(0);
  const [restaurantLongitude, setRestaurantLongitude] = useState<number>(0);
  const [valDistance, setValDistance] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [usersCordinated, setUsersCordinated] = useState<Cordinates>();
  const [userAddress, setUserAddress] = useState<string | undefined>("");
  const [deliveryZones, setDeliveryZones] = useState<any[]>([]);

  const libraries: Library[] = ["places"];
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
          }
        } else {
          setError("Failed to load profile.");
        }
      } catch (err) {
        setError("An error occurred while fetching the profile.");
        console.error("Error fetching profile:", err);
      }
    };
    fetchDeliveryZones();
    fetchProfile();
  }, []);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      setUserAddress(place.formatted_address);
      if (place.geometry) {

        const userLatitude = place.geometry.location?.lat();
        const userLongitude = place.geometry.location?.lng();

        setUsersCordinated({
          Lng: userLongitude,
          Lat: userLatitude,
        })
        if (userLatitude !== undefined && userLongitude !== undefined && restaurantLatitude && restaurantLongitude) {
          const service = new google.maps.DistanceMatrixService();
          const request = {
            origins: [{ lat: userLatitude, lng: userLongitude }],
            destinations: [{ lat: restaurantLatitude, lng: restaurantLongitude }],
            travelMode: google.maps.TravelMode.DRIVING,
          };

          service.getDistanceMatrix(request, (response, status) => {
            if (status === google.maps.DistanceMatrixStatus.OK) {
              const distance = response?.rows[0].elements[0].distance.value; // distance in meters
              if (distance) {
                setValDistance(distance / 1000);
              }
            } else {
              setError("Error calculating distance.");
            }
          });
        } else {
          setError("Invalid location coordinates.");
        }
      }
    }
  };

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

  const setOrderTye = async (event: React.FormEvent) => {
    event.preventDefault();
    const minZone = deliveryZones.reduce((minZone, currentZone) => {
      const isMatch = currentZone.DistanceValue >= (valDistance || 0);
      if ((isMatch && !minZone) || (isMatch && currentZone.DistanceValue < minZone.DistanceValue)) {
        return currentZone;
      }
      return minZone;
    }, null);

    const params = {
      orderTypeId: 3,
      isScheduleOrder: 0,
      scheduleDate: "",
      scheduleTime_24HoursFormat: "",
      customerDeliveryAddress: userAddress,
      customerLatitude: usersCordinated?.Lat,
      customerLongitude: usersCordinated?.Lng,
      distance_btw_CustomerRestaurantLocation: valDistance,
      customerDistanceTypeId: 1,
      zoneId: minZone.Id
    }

    const wpToken = localStorage.getItem("guest_wptoken");
    const apiendpoint = `${import.meta.env.VITE_API_URL}/api/customer/set/ordertype`;
    try {


      const response = await axios.post(apiendpoint, params, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${wpToken}`
        }
      })

      if (response.data.status === 1) {
        console.log(response)

      }
    }
    catch {
      setError("Something went wrong while setting order type.");
    }
    finally {
      onClose();
    }
  }

  if (loadError || error) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      top="true"
      size="sm"
      aria-labelledby="modal_delivery_Label_ForMobile"
      backdrop="static"
      className="fixed inset-0 bg-black bg-opacity-75 z-9 min-h-screen"
    >
      <Modal.Body className="mb-0 pb-1">
        <h6>Enter Your Delivery Address</h6>
        <Form onSubmit={setOrderTye}>
          <Form.Group controlId="autocomplete_dl">
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={handlePlaceChanged}
            >
              <Form.Control
                type="text"
                placeholder="Enter your address"
                autoComplete="off"
                className="pac-target-input"
                id="autocomplete_dl"
              />
            </Autocomplete>
          </Form.Group>
          <div className="flex flex-nowrap p-1 justify-center gap-2 mt-3">
          <button
              // id="btn_insert_del_address_mobile"
              type="submit"
            style={{
              backgroundColor: "#fe8e3c",
              color: "white",
              border: "none",
              padding: "6px 8px",
              borderRadius: "4px",
            }}
              // onClick={setOrderTye}
          >
            Add Address
          </button>
            <button className="bg-red-600 font-semibold text-white rounded-sm px-2 py-1 " onClick={onClose}>Back</button>

        </div>
        </Form>
        {/* {valDistance !== null && (
          <div>
            <p>Distance to restaurant: {valDistance.toFixed(2)} km</p>
          </div>
        )} */}
        {/* {error && <p className="text-danger">{error}</p>} */}
      </Modal.Body>
    </Modal>
  );
};

export default DeliveryModal;
