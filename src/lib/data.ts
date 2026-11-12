// Static homepage fixtures. Keep these separate from future API-backed services.
export type PetStatus = "lost" | "found" | "reunited";
export type Species = "dog" | "cat" | "bird" | "other";

export interface Pet {
  id: string;
  name: string | null;
  species: Species;
  breed: string;
  status: PetStatus;
  /** Original report type, kept after a case is resolved. */
  kind: "lost" | "found";
  title: string;
  description: string;
  image: string;
  gallery: string[];
  age: string;
  sex: "Male" | "Female" | "Unknown";
  color: string;
  size: "Small" | "Medium" | "Large";
  date: string;
  zone: string;
  address: string;
  lat: number;
  lng: number;
  distanceKm: number;
  radiusKm?: number;
  safekeeping?: boolean;
  microchip?: boolean;
  ownerId: string;
  views: number;
  shares: number;
  sightings: number;
}

export const pets: Pet[] = [
  {
    id: "luna-retiro",
    name: "Luna",
    species: "dog",
    breed: "Golden Retriever",
    status: "lost",
    kind: "lost",
    title: "Luna ran off near El Retiro after fireworks",
    description:
      "Luna got scared by fireworks on Saturday evening and slipped out of her harness near Puerta de Alcalá. She is very friendly but can be shy with strangers when frightened. She wears a red collar with a heart-shaped tag. Please do not chase her — call her name softly and let me know where you saw her.",
    image: "/images/pets/luna.png",
    gallery: ["/images/pets/luna.png"],
    age: "2 years",
    sex: "Female",
    color: "Golden",
    size: "Large",
    date: "2026-10-19T21:30:00+02:00",
    zone: "Retiro",
    address: "Puerta de Alcalá, Retiro",
    lat: 40.4153,
    lng: -3.6845,
    distanceKm: 0.8,
    radiusKm: 3,
    microchip: true,
    ownerId: "lucia",
    views: 1842,
    shares: 312,
    sightings: 4,
  },
  {
    id: "milo-chamberi",
    name: "Milo",
    species: "cat",
    breed: "European Shorthair",
    status: "lost",
    kind: "lost",
    title: "Milo escaped from a balcony in Chamberí",
    description:
      "Indoor cat who jumped from our first-floor balcony. Orange tabby with green eyes and a white chest. He is probably hiding under cars or in building courtyards nearby. He responds to the sound of a treat bag.",
    image: "/images/pets/milo.png",
    gallery: ["/images/pets/milo.png"],
    age: "4 years",
    sex: "Male",
    color: "Orange tabby",
    size: "Medium",
    date: "2026-10-20T08:15:00+02:00",
    zone: "Chamberí",
    address: "Calle de Fuencarral, Chamberí",
    lat: 40.434,
    lng: -3.704,
    distanceKm: 1.6,
    radiusKm: 1,
    microchip: true,
    ownerId: "javier",
    views: 624,
    shares: 88,
    sightings: 1,
  },
  {
    id: "toby-lavapies",
    name: null,
    species: "dog",
    breed: "Beagle",
    status: "found",
    kind: "found",
    title: "Beagle wandering alone around Lavapiés",
    description:
      "Seen a tricolor beagle walking alone on Calle Argumosa, no leash, blue collar without tag. Looked healthy but disoriented. He followed me for a block and then went towards Plaza de Lavapiés.",
    image: "/images/pets/toby.png",
    gallery: ["/images/pets/toby.png"],
    age: "Adult",
    sex: "Male",
    color: "Tricolor",
    size: "Medium",
    date: "2026-10-21T09:40:00+02:00",
    zone: "Lavapiés",
    address: "Calle de Argumosa, Lavapiés",
    lat: 40.4086,
    lng: -3.701,
    distanceKm: 1.2,
    safekeeping: false,
    ownerId: "carmen",
    views: 410,
    shares: 64,
    sightings: 2,
  },
  {
    id: "nala-malasana",
    name: "Nala",
    species: "cat",
    breed: "Tuxedo",
    status: "lost",
    kind: "lost",
    title: "Nala is missing from Malasaña",
    description:
      "Black and white cat with a small white spot on her nose. She left through an open window two days ago. She is sterilised and microchipped, very vocal and loves people.",
    image: "/images/pets/nala.png",
    gallery: ["/images/pets/nala.png"],
    age: "3 years",
    sex: "Female",
    color: "Black & white",
    size: "Small",
    date: "2026-10-18T17:00:00+02:00",
    zone: "Malasaña",
    address: "Plaza del Dos de Mayo, Malasaña",
    lat: 40.426,
    lng: -3.705,
    distanceKm: 1.1,
    radiusKm: 1.5,
    microchip: true,
    ownerId: "sofia",
    views: 902,
    shares: 140,
    sightings: 3,
  },
  {
    id: "rocky-latina",
    name: null,
    species: "dog",
    breed: "Terrier mix",
    status: "found",
    kind: "found",
    title: "Small terrier found — safe at home with me",
    description:
      "Found this little guy near Mercado de la Cebada, very friendly and clearly used to people. He is now safe at my place and well fed. Looking for his family! If you think he is yours, tell me something unique about him.",
    image: "/images/pets/rocky.png",
    gallery: ["/images/pets/rocky.png"],
    age: "Approx. 5 years",
    sex: "Male",
    color: "Brown",
    size: "Small",
    date: "2026-10-20T19:20:00+02:00",
    zone: "La Latina",
    address: "Plaza de la Cebada, La Latina",
    lat: 40.411,
    lng: -3.711,
    distanceKm: 1.0,
    safekeeping: true,
    ownerId: "diego",
    views: 733,
    shares: 121,
    sightings: 0,
  },
  {
    id: "kiwi-casa-de-campo",
    name: null,
    species: "bird",
    breed: "Budgerigar",
    status: "found",
    kind: "found",
    title: "Green budgie spotted at Casa de Campo",
    description:
      "A green and yellow budgie was sitting on a low branch near the lake, very tame. It let me get quite close — clearly a pet. I have not been able to catch it yet.",
    image: "/images/pets/kiwi.png",
    gallery: ["/images/pets/kiwi.png"],
    age: "Unknown",
    sex: "Unknown",
    color: "Green & yellow",
    size: "Small",
    date: "2026-10-21T07:50:00+02:00",
    zone: "Casa de Campo",
    address: "Lago de Casa de Campo",
    lat: 40.418,
    lng: -3.747,
    distanceKm: 3.7,
    safekeeping: false,
    ownerId: "carmen",
    views: 198,
    shares: 22,
    sightings: 1,
  },
  {
    id: "coco-salamanca",
    name: "Coco",
    species: "dog",
    breed: "Bichon Frisé",
    status: "lost",
    kind: "lost",
    title: "Coco got lost on a walk in Salamanca",
    description:
      "Coco slipped her leash on Calle de Serrano while chasing a pigeon. Small, fluffy and white. She is 9 years old and needs daily medication for her heart, so time matters a lot.",
    image: "/images/pets/coco.png",
    gallery: ["/images/pets/coco.png"],
    age: "9 years",
    sex: "Female",
    color: "White",
    size: "Small",
    date: "2026-10-20T12:10:00+02:00",
    zone: "Salamanca",
    address: "Calle de Serrano, Salamanca",
    lat: 40.43,
    lng: -3.678,
    distanceKm: 2.4,
    radiusKm: 2,
    microchip: true,
    ownerId: "lucia",
    views: 1210,
    shares: 205,
    sightings: 2,
  },
  {
    id: "simba-arganzuela",
    name: null,
    species: "cat",
    breed: "British Shorthair",
    status: "found",
    kind: "found",
    title: "Grey cat hiding under cars in Arganzuela",
    description:
      "A grey, round-faced cat has been hiding under parked cars on Paseo de las Delicias for two days. Looks well cared for, maybe an indoor cat who got out. Neighbours are leaving water.",
    image: "/images/pets/simba.png",
    gallery: ["/images/pets/simba.png"],
    age: "Adult",
    sex: "Unknown",
    color: "Grey",
    size: "Medium",
    date: "2026-10-19T14:30:00+02:00",
    zone: "Arganzuela",
    address: "Paseo de las Delicias, Arganzuela",
    lat: 40.399,
    lng: -3.699,
    distanceKm: 2.3,
    safekeeping: false,
    ownerId: "sofia",
    views: 356,
    shares: 47,
    sightings: 3,
  },
  {
    id: "bruno-moncloa",
    name: "Bruno",
    species: "dog",
    breed: "Labrador Retriever",
    status: "reunited",
    kind: "lost",
    title: "Bruno is home after 3 days!",
    description:
      "Bruno went missing near Parque del Oeste. Thanks to a sighting reported by a neighbour on RASTRO, we found him safe near the Templo de Debod. Thank you, community!",
    image: "/images/pets/bruno.png",
    gallery: ["/images/pets/bruno.png"],
    age: "6 years",
    sex: "Male",
    color: "Black",
    size: "Large",
    date: "2026-10-12T10:00:00+02:00",
    zone: "Moncloa",
    address: "Parque del Oeste, Moncloa",
    lat: 40.435,
    lng: -3.719,
    distanceKm: 2.1,
    radiusKm: 2,
    microchip: true,
    ownerId: "lucia",
    views: 2410,
    shares: 498,
    sightings: 6,
  },
  {
    id: "canela-tetuan",
    name: "Canela",
    species: "dog",
    breed: "Mixed breed",
    status: "reunited",
    kind: "lost",
    title: "Canela is back with her family",
    description:
      "Canela was found 4 km away from home, at a petrol station. The attendant recognised her from a RASTRO alert.",
    image: "/images/pets/canela.png",
    gallery: ["/images/pets/canela.png"],
    age: "5 years",
    sex: "Female",
    color: "Brown & white",
    size: "Medium",
    date: "2026-10-08T18:00:00+02:00",
    zone: "Tetuán",
    address: "Bravo Murillo, Tetuán",
    lat: 40.46,
    lng: -3.698,
    distanceKm: 4.4,
    ownerId: "sofia",
    views: 3105,
    shares: 640,
    sightings: 9,
  },
  {
    id: "pelusa-usera",
    name: "Pelusa",
    species: "cat",
    breed: "Calico",
    status: "reunited",
    kind: "lost",
    title: "Pelusa came home after 11 days",
    description:
      "After 11 days missing, Pelusa was found in a garage two streets away. A neighbour saw the poster on the RASTRO map.",
    image: "/images/pets/pelusa.png",
    gallery: ["/images/pets/pelusa.png"],
    age: "7 years",
    sex: "Female",
    color: "Calico",
    size: "Small",
    date: "2026-09-29T09:00:00+02:00",
    zone: "Usera",
    address: "Calle de Marcelo Usera",
    lat: 40.389,
    lng: -3.709,
    distanceKm: 3.5,
    radiusKm: 1,
    ownerId: "diego",
    views: 1540,
    shares: 233,
    sightings: 5,
  },
];

export const communityStats = {
  members: 18420,
  reunited: 3216,
  activeReports: 412,
  sightingsThisWeek: 1287,
};

export function getPet(id: string) {
  return pets.find((pet) => pet.id === id);
}

export function displayName(pet: Pet) {
  return pet.name ?? `${pet.breed} ${pet.status === "found" ? "(found)" : ""}`.trim();
}

export const successStories = [
  {
    petId: "canela-tetuan",
    quote:
      "I had lost all hope after two days. A petrol station attendant recognised Canela from an alert on RASTRO. I cried for an hour.",
    author: "Sofía H.",
    days: 2,
  },
  {
    petId: "pelusa-usera",
    quote:
      "Pelusa was hiding two streets away the whole time. A neighbour I had never met saw her on the map and sent me a photo.",
    author: "Diego N.",
    days: 11,
  },
  {
    petId: "bruno-moncloa",
    quote:
      "Six neighbours reported sightings in one afternoon. We followed the dots on the map and Bruno was waiting near the temple.",
    author: "Lucía F.",
    days: 3,
  },
];

export function relativeTime(iso: string) {
  const referenceTime = new Date("2026-10-21T12:00:00+02:00");
  const diffMs = new Date(iso).getTime() - referenceTime.getTime();
  const minutes = Math.round(diffMs / 60000);
  const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(minutes) < 60) return relativeFormat.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeFormat.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return relativeFormat.format(days, "day");
  return relativeFormat.format(Math.round(days / 30), "month");
}
