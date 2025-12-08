"use client";

import { FormEvent, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];

export default function RegisterModal() {
  const router = useRouter();
  const [isCharity, setIsCharity] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    // Information for loading Google Maps autocomplete: https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete
    // https://medium.com/weekly-webtips/working-with-google-api-38d57d6a23e4
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (!place || !place.geometry) {
        return;
      }
      
      if (place.formatted_address) {
        setFormattedAddress(place.formatted_address);
      }
      if (place.place_id) {
        setPlaceId(place.place_id);
      }
      
      if (place.geometry?.location) {
        setCoordinates({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
      
      if (place.address_components) {
        let streetNumber = "";
        let route = "";
        
        place.address_components.forEach((component) => {
          const types = component.types;
          
          if (types.includes("street_number")) {
            streetNumber = component.long_name;
          }
          if (types.includes("route")) {
            route = component.long_name;
          }
          if (types.includes("locality")) {
            setCity(component.long_name);
          }
          if (types.includes("administrative_area_level_1")) {
            setState(component.short_name);
          }
          if (types.includes("postal_code")) {
            setZipCode(component.long_name);
          }
        });
        
        setStreet(`${streetNumber} ${route}`.trim());
      }
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    const userType = isCharity ? "charity" : "user";
    
    const address = isCharity ? {
      street,
      city,
      state,
      zipCode,
      formattedAddress,
      placeId,
      coordinates,
    } : undefined;

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, userType, address }),
    });

    if (response.ok) {
      setRegistrationSuccess(true);
      router.refresh();
    } else {
      alert((await response.json()).error);
    }
  }

  if (registrationSuccess) {
    return (
      <div className="flex flex-col items-center justify-center border-gray-400 border shadow-lg px-6 py-10 gap-6 rounded-xl w-1/3">
        <h2 className="text-2xl font-bold text-green-600">Registration Successful!</h2>
        <p className="text-gray-700">Your account has been created.</p>
        <Link 
          href="/Account/Profile" 
          className="btn"
          onClick={() => router.refresh()}
        >
          Go to Profile
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col  border-gray-400 border shadow-lg px-6 py-10 gap-6 rounded-xl w-1/3 h-[60%]"
    >
      <input
        className="input_box"
        type="text"
        name="name"
        placeholder="Name"
        required
      />
      <input
        className="input_box"
        type="email"
        name="email"
        placeholder="Email"
        required
      />
      <input
        className="input_box"
        type="password"
        name="password"
        placeholder="Password"
        required
      />
      <label className="flex items-center gap-2 text-gray-700">
        <input
          type="checkbox"
          name="isCharity"
          className="w-4 h-4"
          checked={isCharity}
          onChange={(e) => setIsCharity(e.target.checked)}
        />
        <span>Register as a charity organization</span>
      </label>
      <div className={`flex-col gap-4 ${isCharity ? 'flex' : 'hidden'}`}>
        {isLoaded ? (
          <Autocomplete
            onLoad={(autocomplete) => {
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              className="input_box"
              type="text"
              placeholder="Search for your address"
            />
          </Autocomplete>
        ) : (
          <input
            className="input_box"
            type="text"
            placeholder="Loading Google Maps"
            disabled
            readOnly
          />
        )}
        <input
          className="input_box"
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="Street Address"
          required={isCharity}
        />
        <input
          className="input_box"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          required={isCharity}
        />
        <input
          className="input_box"
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          required={isCharity}
        />
        <input
          className="input_box"
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Zip Code"
          required={isCharity}
        />
      </div>
      <button className="btn" type="submit">
        Register
      </button>
      <Link href="Login" className="text-red-500 hover:underline">
        Login
      </Link>
    </form>
  );
}
