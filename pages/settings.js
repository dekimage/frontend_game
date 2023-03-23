// *** REACT ***

import { useContext, useEffect, useState } from "react";

import { Button } from "../components/reusableUI";
import { Context } from "../context/store";
import FaqList from "../components/reusable/Faq";
import FeatureSuggestion from "../components/FeatureSuggestion";
import Switch from "../components/reusable/SwitchThumb";
import { logout } from "../actions/auth";
import router from "next/router";
import styles from "../styles/Settings.module.scss";
import { useRouter } from "next/router";
import { withUser } from "../Hoc/withUser";

const emailSettings = [
  { value: "newsletter", label: "Newsletter", isChecked: true },
  { value: "promotions", label: "Promotions", isChecked: true },
  { value: "content", label: "New Cards", isChecked: true },
  { value: "updates", label: "New Features", isChecked: true },
  { value: "reminders", label: "Reminders", isChecked: true },
  { value: "unsubscribe", label: "Unsubscribe All", isChecked: false },
];

const EmailSettings = () => {
  return (
    <div>
      {emailSettings.map((setting, i) => {
        return <FlagSetting key={i} setting={setting} />;
      })}
    </div>
  );
};

const FlagSetting = ({ setting, activeSettings, setActiveSettings }) => {
  return (
    <div className={styles.flagItem}>
      <div className={styles.flagLabel}>{setting.label}</div>

      <Switch checked={setting.isChecked} onChange={() => {}} />
    </div>
  );
};

const settings = [
  {
    label: "Account",
    link: "account",
  },
  {
    label: "Email Preference",
    link: "email",
  },
  {
    label: "FAQ",
    link: "faq",
  },
  // {
  //   label: "Notifications",
  //   link: "notifications",
  // },
  {
    label: "Subscription",
    link: "subscription",
  },
  {
    label: "Purchases",
    link: "purchases",
  },
  {
    label: "Feature Request",
    link: "feature",
  },
  {
    label: "Report a Bug",
    link: "bug",
  },
  {
    label: "Contact Us",
    link: "contact",
  },
  // {
  //   label: "My Data",
  //   link: "data",
  // },
  {
    label: "Terms & Conditions",
    link: "terms",
  },
  {
    label: "Privacy Policy",
    link: "privacy",
  },
];

const AccountItem = ({
  label,
  value,
  activeSettings,
  actionLabel,
  setActiveSettings,
}) => {
  return (
    <div className="flex_between p1">
      <div className="flex_start flex_column">
        <div className={styles.accountLabel}>{label}</div>
        <div className={styles.accountValue}>{value}</div>
      </div>
      <div
        className={styles.actionLabel}
        onClick={() => {
          if (activeSettings === "editPassword") {
            router.push("/auth/forgot-password");
          }
          setActiveSettings(activeSettings);
        }}
      >
        {actionLabel}
      </div>
    </div>
  );
};

const Account = ({ setActiveSettings, accountData }) => {
  return (
    <div>
      {accountData.map((data, i) => {
        return (
          <AccountItem
            key={i}
            {...data}
            setActiveSettings={setActiveSettings}
          />
        );
      })}
    </div>
  );
};

const Setting = ({ settings, setActiveSettings }) => {
  return (
    <div
      className={styles.settingsItem}
      onClick={() => setActiveSettings(settings.link)}
    >
      {settings.label}
    </div>
  );
};

const EditAccount = ({
  inputType = "email",
  inputName = "",
  inputValue = "",
  primaryBtn = "Save",
}) => {
  const [store, dispatch] = useContext(Context);
  const [input, setInput] = useState(inputValue);
  return (
    <div>
      <div className={styles.accountValue}>{inputName}</div>
      <input
        onChange={(event) => setInput(event.target.value)}
        type={inputType}
        name={inputName}
        placeholder={inputValue}
        className="input"
      />
      <Button
        type={"primary"}
        className="mb1 mt1"
        onClick={() => {}}
        children={primaryBtn}
        isLoading={store.isLoading}
        autofit
      />
      <Button
        type={"outline"}
        onClick={() => {}}
        children={"Cancel"}
        isLoading={store.isLoading}
        autofit
      />
    </div>
  );
};

const getTitle = (activeSettings) => {
  switch (activeSettings) {
    case "default":
      return "Settings";
    case "account":
      return "Account";
    case "notifications":
      return "Notifications";
    case "email":
      return "Email Preference";
    case "subscription":
      return "Subscription";
    case "purchases":
      return "Purchases";
    case "faq":
      return "FAQ";
    case "feature":
      return "Feature Request";
    case "bug":
      return "Report a Bug";
    case "contact":
      return "Contact Us";
    case "data":
      return "My Data";
    case "editName":
      return "Edit your name";
    case "editAge":
      return "Edit your age";
    case "editGender":
      return "Edit your gender";

    default:
      return "Settings";
  }
};

const handleBack = (activeSettings, setActiveSettings) => {
  switch (activeSettings) {
    case "default":
      return router.back();
    case "account":
      return setActiveSettings("default");
    case "email":
      return setActiveSettings("default");
    case "notifications":
      return setActiveSettings("default");
    case "subscription":
      return setActiveSettings("default");
    case "purchases":
      return setActiveSettings("default");
    case "faq":
      return setActiveSettings("default");
    case "feature":
      return setActiveSettings("default");
    case "bug":
      return setActiveSettings("default");
    case "contact":
      return setActiveSettings("default");
    case "data":
      return setActiveSettings("default");
    case "editName":
      return setActiveSettings("account");
    case "editAge":
      return setActiveSettings("account");
    case "editGender":
      return setActiveSettings("account");
  }
};

const Settings = ({ user, dispatch, store }) => {
  const router = useRouter();
  const [activeSettings, setActiveSettings] = useState("default");

  const accountData = [
    {
      label: "Name",
      value: user.username,
      activeSettings: "editName",
      actionLabel: "Edit",
    },
    {
      label: "Age",
      value: user.age || "Not set",
      activeSettings: "editAge",
      actionLabel: "Edit",
    },
    {
      label: "Gender",
      value: user.gender || "Not set",
      activeSettings: "editGender",
      actionLabel: "Edit",
    },
    {
      label: "Password",
      value: "*************",
      activeSettings: "editPassword",
      actionLabel: "Edit",
    },
  ];

  return (
    <div className="background_dark">
      <div className="section_container">
        <div className={styles.header}>
          <div
            className={styles.back}
            onClick={() => handleBack(activeSettings, setActiveSettings)}
          >
            <ion-icon name="chevron-back-outline"></ion-icon>
          </div>

          <div className={styles.title}>{getTitle(activeSettings)}</div>
        </div>
        <div className="section">
          {activeSettings === "default" && (
            <div>
              {settings.map((set, i) => {
                return (
                  <Setting
                    setActiveSettings={setActiveSettings}
                    settings={set}
                    key={i}
                  />
                );
              })}
              <div className={styles.footer}>
                <div>Logged in as: {user.email}</div>
                <div>Version 1.0.0.4 (2210)</div>
                <div
                  className="btn btn-primary btn-stretch mt1"
                  onClick={() => logout(dispatch)}
                >
                  Log Out
                </div>
              </div>
            </div>
          )}
          {activeSettings === "account" && (
            <Account
              accountData={accountData}
              setActiveSettings={setActiveSettings}
            />
          )}
          {activeSettings === "editName" && (
            <EditAccount
              inputType="text"
              inputName="Name"
              inputValue={user.username}
              primaryBtn="Save"
            />
          )}
          {activeSettings === "editAge" && (
            <EditAccount
              inputType="number"
              inputName="Age"
              inputValue={user.age}
              primaryBtn="Save"
            />
          )}
          {activeSettings === "editGender" && (
            <EditAccount
              inputType="string"
              inputName="Gender"
              inputValue={user.gender}
              primaryBtn="Save"
            />
          )}

          {activeSettings === "email" && (
            <EmailSettings setActiveSettings={setActiveSettings} />
          )}
          {activeSettings === "faq" && <FaqList />}
          {activeSettings === "feature" && (
            <FeatureSuggestion type={"feature request"} />
          )}
        </div>
      </div>
    </div>
  );
};

export default withUser(Settings);
