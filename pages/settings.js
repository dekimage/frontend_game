// *** REACT ***

import { useContext, useEffect, useState } from "react";

import { Button } from "@/components/reusableUI";
import { Context } from "@/context/store";
import FeatureSuggestion from "@/components/FeatureSuggestion";
import Switch from "@/components/reusable/SwitchThumb";
import { logout } from "@/actions/auth";
import router from "next/router";
import styles from "@/styles/Settings.module.scss";
import { updateSettings, updateUserBasicInfo } from "@/actions/action";
import { useRouter } from "next/router";
import { withUser } from "@/Hoc/withUser";

const EmailSettings = ({ emailPreferences }) => {
  const [store, dispatch] = useContext(Context);
  const [settings, setSettings] = useState(emailPreferences);

  const handleSubmit = () => {
    updateSettings(dispatch, settings);
  };
  const handleToggle = (label) => {
    const newPreferences = {
      ...settings,
      [label]: !settings[label],
    };
    setSettings(newPreferences);
  };

  const emailSettingsArray = Object.entries(settings).map(
    ([value, isChecked]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      isChecked,
    })
  );
  return (
    <div>
      {emailSettingsArray.map((setting, i) => {
        return (
          <FlagSetting key={i} setting={setting} handleToggle={handleToggle} />
        );
      })}
      <Button
        type={"primary"}
        onClick={handleSubmit}
        children={"Save"}
        isLoading={store.isLoading}
        autofit
      />
    </div>
  );
};

const FlagSetting = ({ setting, handleToggle }) => {
  return (
    <div className={styles.flagItem}>
      <div className={styles.flagLabel}>{setting.label}</div>

      <Switch
        checked={setting.isChecked}
        onChange={() => handleToggle(setting.value)}
      />
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
    external: true,
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
  {
    label: "Terms & Conditions",
    link: "terms-of-service",
    external: true,
  },
  {
    label: "Privacy Policy",
    link: "privacy-policy",
    external: true,
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
      onClick={() => {
        if (settings.external) {
          router.push(`/${settings.link}`);
        } else {
          setActiveSettings(settings.link);
        }
      }}
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
  setActiveSettings,
  activeSettings,
}) => {
  const [store, dispatch] = useContext(Context);
  const [input, setInput] = useState(inputValue);
  const isGender = inputName === "Gender";
  const [genderSelected, setGenderSelected] = useState(isGender && inputValue);
  const getInputName = (inputName) => {
    if (inputName === "Name") {
      return "username";
    }
    return inputName.toLocaleLowerCase();
  };
  return (
    <div>
      {isGender && (
        <div className="flex_between">
          <Button
            type={genderSelected === "male" ? "primary" : "outline"}
            onClick={() => {
              setGenderSelected("male");
              setInput("male");
            }}
            children={"Male"}
          />
          <Button
            type={genderSelected === "female" ? "primary" : "outline"}
            onClick={() => {
              setGenderSelected("female");
              setInput("female");
            }}
            children={"Female"}
          />
          <Button
            type={genderSelected === "other" ? "primary" : "outline"}
            onClick={() => {
              setGenderSelected("other");
            }}
            children={"Other"}
          />
        </div>
      )}
      {(!genderSelected || (isGender && genderSelected === "other")) && (
        <div className="mt1 mb1">
          <div className={styles.accountValue}>
            {isGender ? "Other" : inputName}
          </div>
          <input
            onChange={(event) => setInput(event.target.value)}
            type={inputType}
            name={inputName}
            placeholder={inputValue}
            className="input mt5"
          />
        </div>
      )}

      <Button
        type={"primary"}
        className="mb1 mt1"
        onClick={() =>
          updateUserBasicInfo(dispatch, input, getInputName(inputName))
        }
        children={primaryBtn}
        isLoading={store.isLoading}
        autofit
      />
      <Button
        type={"outline"}
        onClick={() => handleBack(activeSettings, setActiveSettings)}
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

const Settings = ({ user, dispatch }) => {
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
              setActiveSettings={setActiveSettings}
              activeSettings={activeSettings}
            />
          )}
          {activeSettings === "editAge" && (
            <EditAccount
              inputType="number"
              inputName="Age"
              inputValue={user.age}
              primaryBtn="Save"
              setActiveSettings={setActiveSettings}
              activeSettings={activeSettings}
            />
          )}
          {activeSettings === "editGender" && (
            <EditAccount
              inputType="string"
              inputName="Gender"
              inputValue={user.gender}
              primaryBtn="Save"
              setActiveSettings={setActiveSettings}
              activeSettings={activeSettings}
            />
          )}

          {activeSettings === "email" && (
            <EmailSettings
              setActiveSettings={setActiveSettings}
              emailPreferences={user.email_preferences}
            />
          )}

          {activeSettings === "feature" && (
            <FeatureSuggestion type={"feature request"} />
          )}
        </div>
      </div>
    </div>
  );
};

export default withUser(Settings);
