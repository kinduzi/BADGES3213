import { React, ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import { useProxy } from "@vendetta/storage";

const { FormSection, FormInput, FormRow, FormDivider } = Forms;
const { View, Text, ScrollView } = ReactNative;

export default function Settings() {
  useProxy(storage); // Makes the UI update when storage changes

  const [userId, setUserId] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [tooltip, setTooltip] = React.useState("");

  // Initialize storage if it doesn't exist
  if (!storage.badges) storage.badges = {};

  const addBadge = () => {
    const id = userId.trim();
    const url = imageUrl.trim();

    if (!id || !url) {
      showToast("User ID and Image URL are required");
      return;
    }

    if (!storage.badges[id]) {
      storage.badges[id] = [];
    }

    storage.badges[id].push({
      image: url,
      tooltip: tooltip.trim() || "Custom Badge",
    });

    setUserId("");
    setImageUrl("");
    setTooltip("");
    showToast("Badge added!");
  };

  const removeBadge = (uid: string, index: number) => {
    storage.badges[uid].splice(index, 1);

    if (storage.badges[uid].length === 0) {
      delete storage.badges[uid];
    }

    showToast("Badge removed");
  };

  const clearAll = () => {
    storage.badges = {};
    showToast("All badges cleared");
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <FormSection title="Add Custom Badge">
        <FormInput
          title="User ID"
          value={userId}
          onChange={setUserId}
          placeholder="123456789012345678"
        />
        <FormInput
          title="Image URL"
          value={imageUrl}
          onChange={setImageUrl}
          placeholder="https://i.imgur.com/example.png"
        />
        <FormInput
          title="Tooltip (optional)"
          value={tooltip}
          onChange={setTooltip}
          placeholder="Cool Badge"
        />
        <FormRow
          label="Add Badge"
          onPress={addBadge}
        />
      </FormSection>

      <FormSection title="Current Badges">
        {Object.keys(storage.badges || {}).length === 0 ? (
          <FormRow label="No badges added yet" />
        ) : (
          Object.entries(storage.badges).map(([uid, badges]: [string, any[]]) => (
            <View key={uid}>
              <FormRow
                label={`User: ${uid}`}
                style={{ fontWeight: "bold" }}
              />
              {badges.map((badge, i) => (
                <FormRow
                  key={i}
                  label={badge.tooltip}
                  subLabel={badge.image}
                  onPress={() => removeBadge(uid, i)}
                  trailing={
                    <Text style={{ color: "#f04747" }}>Remove</Text>
                  }
                />
              ))}
              <FormDivider />
            </View>
          ))
        )}
      </FormSection>

      <FormSection title="Danger Zone">
        <FormRow
          label="Clear All Badges"
          onPress={clearAll}
          style={{ color: "#f04747" }}
        />
      </FormSection>
    </ScrollView>
  );
}
