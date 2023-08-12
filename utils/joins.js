import { CONTENT_MAP } from "@/data/contentTypesData";
export const joinCards = (cards, usercards) => {
  // remove as user will always have at least 1 usercard
  if (!usercards) {
    return cards;
  }
  const joinedCards = cards.map((card) => {
    let collectionCard = usercards.filter(
      (c) => c.card.id === parseInt(card.id)
    )[0];

    if (collectionCard) {
      const mergedCard = {
        ...collectionCard,
        id: card.id,
        image: card.image,
        is_open: card.is_open,
        rarity: card.rarity,
        type: card.type,
        realm: card.realm,
        cost: card.cost,
        name: card.name,
        expansion: card.expansion,
        maxProgress: calculateCardMaxProgress(card.relationCount)
          .totalMaxProgress,
        progress: calculateCardProgress(collectionCard.progressMap)
          .totalProgress,
      };
      return mergedCard;
    }
    const defaultCard = {
      ...card,
      maxProgress: calculateCardMaxProgress(card.relationCount)
        .totalMaxProgress,
      progress: 0,
    };

    return defaultCard;
  });
  return joinedCards;
};

export const calculateCardMaxProgress = (relationCount) => {
  if (!relationCount) {
    return { maxPerContent: {}, totalMaxProgress: 0 };
  }
  const maxPerContent = {};
  let totalMaxProgress = 0;

  // Iterate over each content type in the CONTENT_MAP
  for (const contentType in CONTENT_MAP) {
    if (CONTENT_MAP.hasOwnProperty(contentType)) {
      // Get the count from the relationCount object or default to 0 if not present
      const count = relationCount[contentType] || 0;

      // Get the corresponding content type information from CONTENT_MAP
      const contentTypeInfo = CONTENT_MAP[contentType];

      // Get the max and single values from the content type information
      const { max, single } = contentTypeInfo;

      // Calculate the product and add it to the totalMaxProgress
      const maxProgressForContent = count * max;
      totalMaxProgress += maxProgressForContent;

      // Store the maxProgressForContent for the content type in maxPerContent object
      maxPerContent[contentType] = maxProgressForContent;
    }
  }

  return { maxPerContent, totalMaxProgress };
};

export const calculateCardProgress = (progressMap) => {
  if (!progressMap) {
    return { progressPerContent: {}, totalProgress: 0 };
  }

  const progressPerContent = {};
  let totalProgress = 0;

  // Initialize progressPerContent with 0 for each contentType in CONTENT_MAP
  for (const contentType in CONTENT_MAP) {
    if (CONTENT_MAP.hasOwnProperty(contentType)) {
      progressPerContent[contentType] = 0;
    }
  }

  // Iterate over each content type in the CONTENT_MAP
  for (const contentType in CONTENT_MAP) {
    if (CONTENT_MAP.hasOwnProperty(contentType)) {
      // Get the corresponding progress entries for the current content type from progressMap
      const contentProgress = progressMap[contentType];

      // Initialize the total completed count for the current content type
      let contentTypeTotal = 0;

      // Check if the contentProgress exists for the current content type
      if (contentProgress) {
        // Iterate over each content ID for the current content type
        for (const contentId in contentProgress) {
          if (contentProgress.hasOwnProperty(contentId)) {
            // Get the completed count for the current content ID
            const completed = contentProgress[contentId].completed || 0;

            // Add the completed count to the total completed count for the current content type
            contentTypeTotal += completed;
          }
        }
      }

      // Update the total completed count for the current content type in progressPerContent
      progressPerContent[contentType] = contentTypeTotal;

      // Add the total completed count for the current content type to the totalProgress
      totalProgress += contentTypeTotal;
    }
  }

  return { progressPerContent, totalProgress };
};
