import { storage } from "@vendetta/plugin";
import { findByProps, findByStoreName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import Settings from "./settings"; // ← import the settings page

// Make sure storage exists
if (!storage.badges) storage.badges = {};

const patches: (() => void)[] = [];

export default {
  onLoad() {
    console.log("[LocalBadges] Loaded");

    // You will need to add the actual badge injection code here later
    // (this is the part that makes badges appear on profiles)
  },

  onUnload() {
    // Remove all patches when the plugin is disabled
    patches.forEach((unpatch) => unpatch());
    console.log("[LocalBadges] Unloaded");
  },

  // Connect the settings page
  settings: Settings,
};
