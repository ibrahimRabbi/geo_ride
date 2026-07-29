// utils/getAddressFromCoords.ts
export const getAddressFromCoords = async (
    lat: number,
    lng: number
): Promise<string | null> => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.status !== 'OK' || !data.results?.length) {
            return null;
        }

        return data.results[0].formatted_address;
    } catch (error) {
        console.error('Reverse geocoding failed:', error);
        return null;
    }
};