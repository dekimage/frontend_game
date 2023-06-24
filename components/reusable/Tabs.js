import cx from "classnames";
import styles from "@/styles/Tabs.module.scss";

export const Tabs = ({
  tabState,
  setTab,
  tabs,
  callback = false,
  value = false,
}) => {
  const tabWidth = 100 / tabs.length + "%";

  const TabHoc = ({ children, tab, setTab, tabState, link, tabWidth }) => {
    return (
      <>
        {link ? (
          <a href={link ? `#${link}` : ""}>
            <div
              className={cx(
                styles.tabsButton,
                tabState === tab.label && styles.active
              )}
              onClick={() => {
                setTab(tab.label);
                callback && callback(value);
              }}
              style={{ width: tabWidth }}
            >
              <div>{children}</div>
            </div>
          </a>
        ) : (
          <div
            className={cx(
              styles.tabsButton,
              tabState === tab.label && styles.active
            )}
            onClick={() => {
              setTab(tab.label);
              callback && callback(value);
            }}
            style={{ width: tabWidth }}
          >
            <div>{children}</div>
          </div>
        )}
      </>
    );
  };
  const Tab = ({ tabState, setTab, tab, link }) => {
    return (
      <TabHoc
        tab={tab}
        tabState={tabState}
        link={link}
        tabWidth={tabWidth}
        setTab={setTab}
        children={
          <div className="flex_center">
            {tab.label}
            {tab.count !== -1 && (
              <div className={styles.tabCounter}>
                {tab.count ? tab.count : 0}
              </div>
            )}
          </div>
        }
      />
    );
  };
  return (
    <div className={styles.tabs}>
      {tabs.map((t, i) => {
        return (
          <Tab
            key={i}
            tabState={tabState}
            setTab={setTab}
            tab={t}
            link={t.link}
            tabWidth={tabWidth}
          />
        );
      })}
    </div>
  );
};
