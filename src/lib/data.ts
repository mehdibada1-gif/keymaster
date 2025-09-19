import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, query, where } from 'firebase/firestore';

export type Property = {
  id: string;
  name: string;
  type: 'Apartment' | 'Riad' | 'Villa' | 'Cottage';
  address: string;
  imageUrl: string;
  imageHint: string;
  googleMapsUrl: string;
  checkin_instructions: {
    wifi: { network: string; pass: string };
    door_code: string;
    rules: string[];
  };
  contract_template: string;
};

export type Reservation = {
  bookingReference: string;
  propertyId: string;
  guestName:string;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'verified' | 'checked-in' | 'checked-out' | 'failed';
};

const propertiesCollection = collection(db, 'properties');
const reservationsCollection = collection(db, 'reservations');

export const getPropertyById = async (id: string): Promise<Property | null> => {
  const docRef = doc(db, 'properties', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Property;
  }
  return null;
};

export const getAllProperties = async (): Promise<Property[]> => {
  const querySnapshot = await getDocs(propertiesCollection);
  const properties: Property[] = [];
  querySnapshot.forEach((doc) => {
    properties.push({ id: doc.id, ...doc.data() } as Property);
  });
  return properties;
};

export const addProperty = async (property: Omit<Property, 'id'>): Promise<void> => {
  const newDocRef = doc(propertiesCollection);
  await setDoc(newDocRef, property);
};

export const getReservationByBookingRef = async (bookingRef: string): Promise<Reservation | null> => {
  const q = query(reservationsCollection, where("bookingReference", "==", bookingRef));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { ...doc.data(), bookingReference: doc.id } as Reservation;
  }
  return null;
}

export const getAllReservations = async (): Promise<Reservation[]> => {
    const querySnapshot = await getDocs(reservationsCollection);
    const reservations: Reservation[] = [];
    querySnapshot.forEach((doc) => {
        reservations.push({ ...doc.data(), bookingReference: doc.id } as Reservation);
    });
    return reservations;
}

// Function to seed initial data
export const seedDatabase = async () => {
  console.log("Checking if seeding is necessary...");

  // Check properties
  const propertiesSnapshot = await getDocs(propertiesCollection);
  if (propertiesSnapshot.empty) {
    console.log("Seeding properties...");
    const mockProperties: Omit<Property, 'id'>[] = [
      {
          name: 'Paradise Villa',
          type: 'Villa',
          address: '123 Ocean Drive, Miami, FL',
          imageUrl: 'https://picsum.photos/seed/villa/1200/800',
          imageHint: 'tropical villa',
          googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=123+Ocean+Drive,Miami,FL',
          checkin_instructions: {
              wifi: { network: 'Villa_WiFi', pass: 'Sunshine123!' },
              door_code: '1984',
              rules: [
              'No smoking indoors.',
              'Quiet hours after 10 PM.',
              'Check-out is at 11 AM.',
              'Please leave the keys on the kitchen counter upon departure.',
              ],
          },
          contract_template: `
              <h2 class="text-xl font-bold mb-4">Short-Term Rental Agreement</h2>
              <p class="mb-2">This agreement is between the Host and the Guest, {{guest_name}}.</p>
              <p class="mb-2"><strong>Property:</strong> {{property_name}}</p>
              <p class="mb-2"><strong>Address:</strong> {{property_address}}</p>
              <p class="mb-2"><strong>Check-in:</strong> {{checkin_date}}</p>
              <p class="mb-2"><strong>Check-out:</strong> {{checkout_date}}</p>
              <h3 class="text-lg font-semibold mt-4 mb-2">House Rules</h3>
              <ul class="list-disc list-inside mb-4">
              <li>No smoking indoors.</li>
              <li>No parties or events.</li>
              <li>Quiet hours are from 10 PM to 8 AM.</li>
              </ul>
              <p>By signing below, you agree to all terms and conditions of this rental agreement.</p>
          `,
      },
      {
          name: 'Downtown Loft',
          type: 'Apartment',
          address: '456 Main Street, New York, NY',
          imageUrl: 'https://picsum.photos/seed/loft/1200/800',
          imageHint: 'city loft',
          googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=456+Main+Street,New+York,NY',
          checkin_instructions: {
              wifi: { network: 'LoftLife_5G', pass: 'CityLights!5G' },
              door_code: '9876',
              rules: [
              'No pets allowed.',
              'Please respect the neighbors.',
              'Check-out is at 12 PM.',
              ],
          },
          contract_template: `
              <h2 class="text-xl font-bold mb-4">Loft Rental Agreement</h2>
              <p class="mb-2">This agreement is made between the Host and {{guest_name}}.</p>
              <p class="mb-2"><strong>Property:</strong> {{property_name}}</p>
              <p class="mb-2"><strong>Address:</strong> {{property_address}}</p>
              <p class="mb-2"><strong>Check-in:</strong> {{checkin_date}}</p>
              <p class="mb-2"><strong>Check-out:</strong> {{checkout_date}}</p>
              <h3 class="text-lg font-semibold mt-4 mb-2">Apartment Rules</h3>
              <ul class="list-disc list-inside mb-4">
              <li>No smoking of any kind.</li>
              <li>Maximum 2 guests.</li>
              </ul>
              <p>Your signature below confirms your agreement to these terms.</p>
          `,
      },
    ];

    for (const prop of mockProperties) {
      const docRef = doc(propertiesCollection, prop.name.toLowerCase().replace(/\s+/g, '-'));
      await setDoc(docRef, prop);
    }
    console.log("Properties seeded.");
  }

  // Check reservations
  const reservationsSnapshot = await getDocs(reservationsCollection);
  if (reservationsSnapshot.empty) {
    console.log("Seeding reservations...");
    const mockReservations: Reservation[] = [
        {
            bookingReference: 'AIRBNB-11A',
            propertyId: 'paradise-villa',
            guestName: 'Elon Tusk',
            checkInDate: '2024-09-01',
            checkOutDate: '2024-09-08',
            status: 'pending',
        },
        {
            bookingReference: 'AIRBNB-22B',
            propertyId: 'downtown-loft',
            guestName: 'Ada Lovelace',
            checkInDate: '2024-09-05',
            checkOutDate: '2024-09-10',
            status: 'verified',
        },
    ];

    for (const res of mockReservations) {
      await addDoc(reservationsCollection, res);
    }
    console.log("Reservations seeded.");
  }
};
