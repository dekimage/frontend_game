import { ContentComponent } from "./ContentComponent";

export const Program = ({
  day,
  cardId,
  isTicketPurchased,
  isProgramMastered,
}) => {
  if (!day) {
    return null;
  }
  return (
    <div>
      {day.contents.map((c, i) => {
        const isLast = day.contents.length == i + 1;

        return (
          <ContentComponent
            content={c}
            cardId={cardId}
            isLast={isLast}
            index={i + 1}
            isTicketPurchased={isTicketPurchased}
            isProgramMastered={isProgramMastered}
            key={i}
          />
        );
      })}
    </div>
  );
};
