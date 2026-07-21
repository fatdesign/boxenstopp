export function getImageForCategory(categoryId: string): string {
  switch (categoryId) {
    case 'burger':
      return 'images/burger.png';
    case 'beilagen':
      return 'images/fries.png';
    case 'getraenke':
      return 'images/drinks.png';
    case 'warme-snacks':
    default:
      return 'images/schnitzel.png';
  }
}
