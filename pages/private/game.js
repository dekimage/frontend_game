import { useState } from "react";
import styles from "@/styles/private/game.module.scss";
import cx from "classnames";
const resources = {
  common: [
    { name: "wood", rarity: "common", id: 1 },
    { name: "stone", rarity: "common", id: 2 },
    { name: "iron", rarity: "common", id: 3 },
    { name: "leather", rarity: "common", id: 4 },
    { name: "fiber", rarity: "common", id: 5 },
    { name: "herbs", rarity: "common", id: 6 },
  ],
  rare: [
    { name: "silverOre", rarity: "rare", id: 7 },
    { name: "mysticCloth", rarity: "rare", id: 8 },
    { name: "arcaneCrystal", rarity: "rare", id: 9 },
    { name: "dragonScale", rarity: "rare", id: 10 },
  ],
  epic: [
    { name: "phoenixFeather", rarity: "epic", id: 11 },
    { name: "elderwood", rarity: "epic", id: 12 },
  ],
};
const items = [
  {
    id: 1,
    name: "Sword of Flames",
    cost: { stone: 2, elderwood: 1 },
    vp: 1,
    power: { fire: 1, earth: 1 },
  },
  {
    id: 2,
    name: "Emerald Staff",
    cost: { herbs: 1, elderwood: 2 },
    vp: 1,
    power: { nature: 1, shadow: 1 },
  },
  {
    id: 3,
    name: "Aegis of Light",
    cost: { stone: 1, phoenixFeather: 2 },
    vp: 1,
    power: { light: 1, earth: 1 },
  },
  {
    id: 4,
    name: "Shadow Dagger",
    cost: { iron: 3 },
    vp: 1,
    power: { shadow: 1, earth: 1 },
  },
  {
    id: 5,
    name: "Oceanic Trident",
    cost: { stone: 2, iron: 2 },
    vp: 2,
    power: { water: 1, nature: 1 },
  },
  {
    id: 6,
    name: "Elemental Bow",
    cost: { wood: 2, fiber: 2 },
    vp: 2,
    power: { fire: 1, nature: 1 },
  },
  {
    id: 7,
    name: "Mystic Cloak",
    cost: { mysticCloth: 3, herbs: 3 },
    vp: 3,
    power: { shadow: 2, light: 1 },
  },
  {
    id: 8,
    name: "Dragonbone Shield",
    cost: { dragonScale: 4, elderwood: 2 },
    vp: 3,
    power: { fire: 2, earth: 1 },
  },
  {
    id: 9,
    name: "Staff of the Ancients",
    cost: { arcaneCrystal: 3, elderwood: 3 },
    vp: 3,
    power: { light: 2, nature: 1 },
  },
  {
    id: 10,
    name: "Enchanted Scepter",
    cost: { iron: 4, mysticCloth: 2 },
    vp: 3,
    power: { water: 1, fire: 2 },
  },
  {
    id: 11,
    name: "Crystalized Sword",
    cost: { arcaneCrystal: 4, stone: 2 },
    vp: 3,
    power: { fire: 2, earth: 1 },
  },
  {
    id: 12,
    name: "Storm Bringer",
    cost: { phoenixFeather: 2, elderwood: 4 },
    vp: 3,
    power: { water: 1, nature: 2 },
  },
  {
    id: 13,
    name: "Lunar Staff",
    cost: { mysticCloth: 4, herbs: 2 },
    vp: 3,
    power: { light: 2, shadow: 1 },
  },

  {
    id: 14,
    name: "Demon Claw",
    cost: { dragonScale: 2, iron: 4 },
    vp: 3,
    power: { shadow: 2, earth: 1 },
  },
  {
    id: 15,
    name: "Thorn Whip",
    cost: { elderwood: 3, herbs: 3 },
    vp: 3,
    power: { nature: 2, shadow: 1 },
  },
  {
    id: 16,
    name: "Thunder Hammer",
    cost: { iron: 5, stone: 1 },
    vp: 3,
    power: { earth: 2, water: 1 },
  },
  {
    id: 17,
    name: "Healer’s Scepter",
    cost: { mysticCloth: 4, herbs: 2 },
    vp: 3,
    power: { light: 2, nature: 1 },
  },
  {
    id: 18,
    name: "Void Blade",
    cost: { arcaneCrystal: 5, shadow: 1 },
    vp: 3,
    power: { shadow: 2, fire: 1 },
  },
  {
    id: 19,
    name: "Frost Bow",
    cost: { elderwood: 4, phoenixFeather: 2 },
    vp: 3,
    power: { water: 2, nature: 1 },
  },
  {
    id: 20,
    name: "Earthbreaker",
    cost: { stone: 5, iron: 1 },
    vp: 3,
    power: { earth: 2, fire: 1 },
  },
];

const Game = () => {
  const [player, setPlayer] = useState({ inventory: [], collection: [] });
  const [lootboxQty, setLootboxQty] = useState(50);
  const [lastBoxDrop, setLastBoxDrop] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);

  function drawCards(x) {
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledItems.slice(0, x);
    setDrawnCards(selectedCards);
  }

  function getRandomResource(rarity) {
    const resourcesArray = resources[rarity];
    const randomIndex = Math.floor(Math.random() * resourcesArray.length);
    return resourcesArray[randomIndex];
  }

  function craftItem(itemId) {
    const item = items.find((i) => i.id === itemId);

    if (!item) {
      return "Item not found";
    }

    let newPlayer = JSON.parse(JSON.stringify(player));

    const missingResources = {};

    for (const [resource, requiredQty] of Object.entries(item.cost)) {
      const inventoryItem = newPlayer.inventory.find(
        (i) => i.name.toLowerCase() === resource
      );
      const hasQty = inventoryItem ? inventoryItem.qty : 0;

      if (hasQty < requiredQty) {
        missingResources[resource] = { required: requiredQty, has: hasQty };
      }
    }

    if (Object.keys(missingResources).length > 0) {
      return { message: "Not enough resources", missingResources };
    }

    // Deduct resources from the inventory
    for (const [resource, requiredQty] of Object.entries(item.cost)) {
      const inventoryItem = newPlayer.inventory.find(
        (i) => i.name.toLowerCase() === resource
      );
      inventoryItem.qty -= requiredQty;

      // Remove item from inventory if quantity is zero
      if (inventoryItem.qty === 0) {
        newPlayer.inventory = newPlayer.inventory.filter(
          (i) => i.id !== inventoryItem.id
        );
      }
    }

    // Add item to the player's collection
    newPlayer.collection.push(item);

    setPlayer(newPlayer);

    return { message: "Item crafted successfully", item };
  }

  function lootBoxOpen(qty) {
    let newPlayer = JSON.parse(JSON.stringify(player));
    const loot = {};

    for (let i = 0; i < qty; i++) {
      const random = Math.random();
      let resource;

      if (random < 0.6) {
        resource = getRandomResource("common");
      } else if (random < 0.9) {
        resource = getRandomResource("rare");
      } else {
        resource = getRandomResource("epic");
      }

      if (loot[resource.id]) {
        loot[resource.id].qty += 1;
      } else {
        loot[resource.id] = { ...resource, qty: 1 };
      }
    }

    saveToInventory(newPlayer, Object.values(loot));
    setPlayer(newPlayer);
    setLastBoxDrop(Object.values(loot)); // Add this line
    setLootboxQty(lootboxQty - 1);
  }

  function saveToInventory(newPlayer, loot) {
    loot.forEach((item) => {
      const inventoryItem = newPlayer.inventory.find((i) => i.id === item.id);
      if (inventoryItem) {
        inventoryItem.qty += item.qty;
      } else {
        newPlayer.inventory.push(item);
      }
    });
  }

  const Item = ({ item }) => {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h4>{item.name}</h4>
        </div>
        <div className={styles.cardImage}>
          {/* You can add an image for the item here */}
        </div>
        <div className={styles.cardBody}>
          <p>
            <strong>Cost:</strong>
          </p>
          <ul className={styles.resources}>
            {Object.entries(item.cost).map(([resource, qty]) => (
              <li key={resource}>
                {/* Optionally, you can add an image for each resource here */}
                {resource}: {qty}
              </li>
            ))}
          </ul>
          <p>
            <strong>Victory Points:</strong> {item.vp}
          </p>
          <p>
            <strong>Powers:</strong>
          </p>
          <ul className={styles.powers}>
            {Object.entries(item.power).map(([type, power]) => (
              <li key={type} className={styles[type]}>
                {type}: {power}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <div
        className="btn btn-primary"
        onClick={() => lootboxQty > 0 && lootBoxOpen(5)}
      >
        LOOT BOX ({lootboxQty})
      </div>
      <div className="btn btn-primary" onClick={() => drawCards(2)}>
        Draw 2 Card
      </div>
      Inventory:
      <div className={styles.inventory}>
        {player.inventory.map((resource) => (
          <div
            key={resource.id}
            className={cx([styles[resource.rarity]], [styles.item])}
          >
            {resource.name} x {resource.qty}
          </div>
        ))}
      </div>
      Collection:
      <div className={styles.inventory}>
        {player.collection.map((item) => (
          <div key={resource.id} className={styles.item}>
            {item.name}
          </div>
        ))}
      </div>
      YOU GOT:
      <div className={styles.inventory}>
        {lastBoxDrop.map((resource) => (
          <div
            key={resource.id}
            className={cx([styles[resource.rarity]], [styles.item])}
          >
            {resource.name} x {resource.qty}
          </div>
        ))}
      </div>
      <div>
        Drawn Cards:
        <div className={styles.cardsContainer}>
          {drawnCards.map((item) => (
            <Item item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
