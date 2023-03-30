export const joinCards = (cards, usercards) => {
  // remove as user will always have at least 1 usercard
  if (!usercards) {
    return cards;
  }
  const joinedCards = cards.map((card) => {
    let collectionCard = usercards.filter(
      (c) => c.card.id === parseInt(card.id)
    );
    if (collectionCard.length) {
      const mergedCard = {
        ...collectionCard[0],
        id: card.id,
        image: card.image,
        is_open: card.is_open,
        rarity: card.rarity,
        type: card.type,
        realm: card.realm,
        cost: card.cost,
        name: card.name,
        expansion: card.expansion,
      };
      return mergedCard;
    }
    return card;
  });
  return joinedCards;
};
