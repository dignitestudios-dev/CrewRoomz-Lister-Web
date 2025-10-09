import { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";

// -------- Local helper types -------- //

interface LatLng {
  lat: number;
  lng: number;
}

interface GoogleMapComponentProps {
  onLocationSelect: (data: Address) => void;
  editAddress?: Address | null;
  distance?: number;
  showRadius?: boolean;
  isDisabled?: boolean;
  error?: string;
  isClear?: boolean;
}

// -------- Constants -------- //

const containerStyle = {
  width: "100%",
  height: "194px",
  borderRadius: "8px",
};

const defaultCenter: LatLng = {
  lat: 40.7128, // New York City
  lng: -74.006,
};

const libraries: "places"[] = ["places"];

// -------- Component -------- //

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  onLocationSelect,
  editAddress,
  showRadius = false,
  isDisabled = false,
  error,
  isClear = false,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const [mapCenter, setMapCenter] = useState<LatLng>(defaultCenter);
  const [marker, setMarker] = useState<LatLng>(defaultCenter);
  const [inputValue, setInputValue] = useState<string>("");

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // -------- Reset input when cleared -------- //
  useEffect(() => {
    if (isClear) setInputValue("");
  }, [isClear]);

  // -------- Handle edit mode pre-fill -------- //
  useEffect(() => {
    if (editAddress?.location?.coordinates?.length === 2) {
      const [lng, lat] = editAddress.location.coordinates;
      const coords = { lat, lng };
      setMapCenter(coords);
      setMarker(coords);
      setInputValue(editAddress.address || "");
    }
  }, [editAddress]);

  if (!isLoaded) return <div>Loading...</div>;

  // -------- Handle place selection -------- //
  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const addressComponents = place.address_components || [];

    const getComponent = (type: string): string =>
      addressComponents.find((c) => c.types.includes(type))?.long_name || "";

    const newAddress: Address = {
      country: getComponent("country"),
      city: getComponent("locality") || getComponent("sublocality") || "",
      state: getComponent("administrative_area_level_1"),
      zipCode: getComponent("postal_code"),
      address: place.formatted_address ?? "",
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };

    setMapCenter({ lat, lng });
    setMarker({ lat, lng });
    setInputValue(place.formatted_address ?? "");

    onLocationSelect(newAddress);
  };

  return (
    <div className="relative w-full h-full">
      {/* Search input with Autocomplete */}
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          value={inputValue}
          disabled={isDisabled}
          placeholder="Enter your street, city, state, zip"
          className="w-full p-2 rounded-md border border-gray-300 mb-2"
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);

            if (value === "") {
              onLocationSelect({
                address: "",
                city: "",
                state: "",
                country: "",
                zipCode: "",
                location: {
                  type: "Point",
                  coordinates: [0, 0],
                },
              });
            }
          }}
        />
      </Autocomplete>

      {error && <p className="text-red-500 text-[12px] font-medium">{error}</p>}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={showRadius ? 8 : 14}
      >
        <Marker position={marker} />
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
