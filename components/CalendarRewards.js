import React, { useContext } from "react";
import cx from "classnames";
import styles from "@/styles/Calendar.module.scss";
import rewardsCalendar from "@/data/rewards";
import { Context } from "@/context/store";
import { ImageUI } from "./reusableUI";
import iconCheckmark from "@/assets/checkmark.svg";
import { claimCalendarReward } from "@/actions/action";

function mergeCalendarData(userClaimedDays, rewardsCalendar, startDate) {
  const today = new Date();
  const daysSinceStart =
    Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const mergedRewardsCalendar = {};

  for (let day = 1; day <= 7; day++) {
    const rewardInfo = rewardsCalendar[day];
    const isClaimed = userClaimedDays.includes(day);
    const isReadyToClaim = day === daysSinceStart;

    mergedRewardsCalendar[day] = {
      ...rewardInfo,
      isClaimed,
      isReadyToClaim: isReadyToClaim,
    };
  }

  return mergedRewardsCalendar;
}

const CalendarDay = ({ day, rewardCalendarData, isBig = false }) => {
  const [store, dispatch] = useContext(Context);
  const today = new Date();
  const currentDay = today.getDate();

  const dayNumber = parseInt(day);
  const rewardInfo = rewardCalendarData[dayNumber];
  const isClaimed = rewardCalendarData[dayNumber]?.isClaimed;
  const isReadyToClaim = rewardInfo.isReadyToClaim && dayNumber <= currentDay;

  const isMissed = dayNumber < currentDay && !isClaimed;
  console.log({ isMissed });

  const boxClassName = cx(styles.dayBox, {
    [styles.readyToClaim]: isReadyToClaim && !isClaimed,
    [styles.claimed]: isClaimed,
    [styles.big]: isBig,
    [styles.missed]: isMissed,
  });

  return (
    <div
      key={dayNumber}
      className={boxClassName}
      onClick={() => {
        if (isReadyToClaim && !isClaimed) {
          claimCalendarReward(dispatch);
        }
      }}
    >
      {isMissed && <div className={styles.missedDay}>missed</div>}
      <div className={styles.dayLabel}>Day {dayNumber}</div>
      <div className={styles.rewardInfo}>
        <ImageUI url={"/stars.png"} isPublic alt="Reward" />
        <span>{rewardInfo.amount}</span>
        {isClaimed && (
          <img className={styles.checkmark} src={iconCheckmark} height="25px" />
        )}
      </div>
    </div>
  );
};

const CalendarRewards = (daysSinceStart) => {
  const [store, dispatch] = useContext(Context);
  const user = store.user;

  const rewardCalendarData = mergeCalendarData(
    user.tutorial.calendar.claimed_days,
    rewardsCalendar,
    new Date(user.tutorial.calendar.startDate)
  );

  const daysArray = Object.keys(rewardCalendarData);
  const lastDay = daysArray.pop();
  return (
    <div className="background_dark">
      <div className="header mb1">Calendar Rewards</div>
      <div className="subHeader mb1">
        7 Days of Rewards Await - Log In Daily and Claim!
      </div>
      <div className={styles.calendar}>
        {daysArray.map((day) => (
          <CalendarDay
            day={day}
            rewardCalendarData={rewardCalendarData}
            key={day}
          />
        ))}
        <CalendarDay
          day={lastDay}
          rewardCalendarData={rewardCalendarData}
          isBig
        />
      </div>
      <div className="flex_center mt1">
        <div
          className="btn btn-primary"
          onClick={() => {
            daysSinceStart > 7 && claimCalendarReward(dispatch);
            dispatch({ type: "CLOSE_CALENDAR" });
          }}
        >
          Okay
        </div>
      </div>
    </div>
  );
};

export default CalendarRewards;
