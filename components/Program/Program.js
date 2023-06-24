import { ContentComponent } from "./ContentComponent";

export const Program = ({
  day,
  completedContents,
  cardId,
  isTicketPurchased,
  isSubscribed,
}) => {
  if (!day) {
    return null;
  }
  return (
    <div>
      {day.contents.map((c, i) => {
        const isLast = day.contents.length == i + 1;
        const isCompleted = completedContents.includes(c.index);

        return (
          <ContentComponent
            content={c}
            cardId={cardId}
            isLast={isLast}
            isCompleted={isCompleted}
            index={i + 1}
            isTicketPurchased={isTicketPurchased}
            isSubscribed={isSubscribed}
            key={i}
          />
        );
      })}
    </div>
  );
};
