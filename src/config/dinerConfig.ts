export interface MenuItem { id: string; name: string; description: string; price: string; isVegetarian?: boolean; isPopular?: boolean; }
export interface MenuCategory { id: string; name: string; items: MenuItem[]; }
export const DINER_INFO = {
  name: "BOXENSTOPP im Handelszentrum", slogan: "Schnell. Heiss. Lecker.", phone: "+43 662 123456",
  address: { street: "Handelszentrum", city: "Bergheim bei Salzburg", zip: "5101", country: "AT" },
  openingHours: {
    monday: { open: "08:00", close: "18:00" }, tuesday: { open: "08:00", close: "18:00" }, wednesday: { open: "08:00", close: "18:00" },
    thursday: { open: "08:00", close: "18:00" }, friday: { open: "08:00", close: "18:00" }, saturday: { open: "09:00", close: "14:00" }, sunday: null
  }
};
export const MENU: MenuCategory[] = [
  { id: "warme-snacks", name: "Warme Snacks", items: [
      { id: "leberkaese", name: "Leberkäse-Semmel", description: "Klassiker, heiß aus dem Ofen.", price: "3.80", isPopular: true },
      { id: "bosna", name: "Bosna", description: "Bratwurst, Zwiebel, Senf & Curry.", price: "4.50" },
      { id: "kaesekrainer", name: "Käsekrainer im Weckerl", description: "Mit Senf oder Ketchup.", price: "4.90" },
      { id: "currywurst", name: "Currywurst", description: "Mit hauseigener Currysauce.", price: "5.50" },
  ]},
  { id: "burger", name: "Burger & Klassiker", items: [
      { id: "boxenstopp-burger", name: "Boxenstopp-Burger", description: "Rind, Cheddar, Salat, Haussauce.", price: "8.90", isPopular: true },
      { id: "cheeseburger", name: "Cheeseburger", description: "Der Klassiker, kompromisslos.", price: "7.90" },
      { id: "crispy-chicken", name: "Crispy-Chicken-Burger", description: "Knuspriges Hähnchen, Coleslaw.", price: "8.50" },
      { id: "veggie-burger", name: "Veggie-Burger", description: "Pflanzlich, voller Geschmack.", price: "8.90", isVegetarian: true },
  ]},
  { id: "beilagen", name: "Beilagen", items: [
      { id: "pommes", name: "Pommes frites", description: "Goldgelb & knusprig.", price: "3.50" },
      { id: "suesskartoffel", name: "Süßkartoffel-Pommes", description: "Knusprige Süßkartoffeln.", price: "4.50" },
      { id: "wedges", name: "Wedges", description: "Mit Sour-Cream-Dip.", price: "4.20" },
  ]},
  { id: "getraenke", name: "Getränke", items: [
      { id: "softdrinks", name: "Softdrinks", description: "Cola, Limo & Co.", price: "2.50" },
      { id: "wasser", name: "Mineralwasser", description: "Still oder prickelnd.", price: "2.00" },
      { id: "kaffee", name: "Kaffee", description: "Für den schnellen Wachmacher.", price: "2.80" },
      { id: "energy", name: "Energy & Eistee", description: "Erfrischende Kaltgetränke.", price: "3.00" },
  ]}
];