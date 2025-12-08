"use client";

import { useState, useCallback, useRef } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795,
};

interface Charity {
  _id: string;
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    formattedAddress: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export default function CharityMapSearch() {
  const [zipCode, setZipCode] = useState("");
  const [charities, setCharities] = useState<Charity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(4);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);

  // Map ref for accessing map instance
  const mapRef = useRef<google.maps.Map | null>(null);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Callback when map loads
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleSearch = async () => {
    if (!zipCode.trim()) {
      alert("Please enter a zip code");
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/charities/search?zipCode=${zipCode}`);

      if (response.ok) {
        const data = await response.json();
        setCharities(data.charities);

        // Center map on first charity if results exist
        if (data.charities.length > 0 && data.charities[0].address?.coordinates) {
          setMapCenter({
            lat: data.charities[0].address.coordinates.lat,
            lng: data.charities[0].address.coordinates.lng,
          });
          setMapZoom(12);
        }
      } else {
        alert("Failed to search charities");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search charities");
    } finally {
      setIsSearching(false);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading map</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Find Charities Near You
          </h1>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter zip code"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              maxLength={5}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>

          {charities.length > 0 && (
            <p className="text-gray-600 mb-4">
              Found {charities.length}{" "}
              {charities.length === 1 ? "charity" : "charities"} near {zipCode}
            </p>
          )}
        </div>

        {/* Google Map with Markers */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={mapZoom}
            onLoad={onMapLoad}
          >
            {charities.map((charity) => {
              if (!charity.address?.coordinates) return null;

              return (
                <Marker
                  key={charity._id}
                  position={{
                    lat: charity.address.coordinates.lat,
                    lng: charity.address.coordinates.lng,
                  }}
                  onClick={() => setSelectedCharity(charity)}
                />
              );
            })}

            {selectedCharity && selectedCharity.address?.coordinates && (
              <InfoWindow
                position={{
                  lat: selectedCharity.address.coordinates.lat,
                  lng: selectedCharity.address.coordinates.lng,
                }}
                onCloseClick={() => setSelectedCharity(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-1">{selectedCharity.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{selectedCharity.email}</p>
                  <p className="text-sm text-gray-700 mb-2">
                    {selectedCharity.address.formattedAddress ||
                      `${selectedCharity.address.street}, ${selectedCharity.address.city}, ${selectedCharity.address.state} ${selectedCharity.address.zipCode}`}
                  </p>
                  <a
                    href={`/Account/Profile/${selectedCharity._id}`}
                    className="text-green-600 hover:text-green-700 text-sm font-semibold"
                  >
                    View Profile →
                  </a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>

        {/* Charities List */}
        {charities.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Charities List
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {charities.map((charity) => (
                <div
                  key={charity._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-lg mb-2">{charity.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{charity.email}</p>
                  {charity.address && (
                    <p className="text-sm text-gray-700 mb-3">
                      {charity.address.city}, {charity.address.state}{" "}
                      {charity.address.zipCode}
                    </p>
                  )}
                  <a
                    href={`/Account/Profile/${charity._id}`}
                    className="text-green-600 hover:text-green-700 font-semibold text-sm"
                  >
                    View Profile →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 