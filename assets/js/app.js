const STORAGE_KEYS = {
  formState: "mada-format-generator-state",
  fixedName: "mada-format-generator-fixed-name",
  fixedCommandTag: "mada-format-generator-fixed-command-tag",
  discordWebhook: "mada-format-generator-discord-webhook",
  imageState: "mada-format-generator-image-state",
  imageLinkState: "mada-format-generator-image-link-state",
};

const IMAGE_FIELD_TYPE = "image";
const IMAGE_ATTACHED_TEXT = "צורפה תמונה";
const IMAGE_REQUIRED_MESSAGE = "יש לצרף תמונה.";
const IMAGE_UPLOAD_HELPER_TEXT = "הדביקו תמונה לכאן (Ctrl+V)";
const IMAGE_UPLOAD_SUBTEXT = "אפשר גם לגרור תמונה מהמחשב";
const IMAGE_PREVIEW_ALT = "תצוגה מקדימה של תמונת הניידת";
const IMAGE_PERSIST_WARNING = "התמונה צורפה זמנית בלבד ולא נשמרה בדפדפן.";
const IMAGE_LOAD_ERROR = "לא ניתן היה לטעון את התמונה. נסו קובץ אחר.";
const IMAGE_LINK_COPY_SUCCESS_MESSAGE = "נוצר קישור ציבורי לתמונה והפורמט הועתק";
const IMAGE_LINK_COPY_ERROR_MESSAGE = "לא ניתן היה ליצור קישור ציבורי לתמונה. נסו שוב.";
const PUBLIC_IMAGE_UPLOAD_URL = "https://tmpfiles.org/api/v1/upload";
const MAX_PERSISTED_IMAGE_LENGTH = 900000;
const MAX_IMAGE_DIMENSION = 1280;
const IMAGE_COMPRESSION_QUALITY = 0.82;

const legacyFormatDefinitions = [
  {
    id: "role-exit",
    tabTitle: "ירידה מתפקיד",
    tabCopy: "ליצירת פורמט מסודר על ירידה מתפקיד.",
    title: "פורמט ירידה מתפקיד",
    fields: [
      { id: "name", label: "שם", placeholder: "הקלידו שם" },
      { id: "reason", label: "סיבה", placeholder: "מהי הסיבה?" },
      { id: "amount", label: "כמות ירידה מתפקיד", placeholder: "הקלידו כמות" },
      { id: "mdaAmount", label: "כמות המדא שיש", placeholder: "הקלידו כמות" },
      { id: "commandTag", label: "תיוג הפיקוד האישי", placeholder: "הקלידו תיוג" },
    ],
    buildOutput(values) {
      return [
        "פורמט ירידה מתפקיד",
        `שם: ${values.name}`,
        `סיבה: ${values.reason}`,
        `כמות ירידה מתפקיד: ${values.amount}`,
        `כמות המדא שיש: ${values.mdaAmount}`,
        `תיוג הפיקוד האישי: ${values.commandTag}`,
      ].join("\n");
    },
  },
  {
    id: "vehicle-abandonment",
    tabTitle: "הפקרת ניידות",
    tabCopy: "טופס מהיר לדיווח מסודר על הפקרת ניידות.",
    title: "פורמט הפקרת ניידות",
    fields: [
      { id: "name", label: "שם", placeholder: "הקלידו שם" },
      { id: "reason", label: "סיבה", placeholder: "מהי הסיבה?" },
      { id: "location", label: "מיקום", placeholder: "ציינו מיקום" },
      {
        id: "image",
        type: IMAGE_FIELD_TYPE,
        label: "תמונה של הניידת",
        helperText: IMAGE_UPLOAD_HELPER_TEXT,
        subText: IMAGE_UPLOAD_SUBTEXT,
        removeLabel: "הסר תמונה",
      },
      {
        id: "mapImage",
        type: IMAGE_FIELD_TYPE,
        label: "תמונה של המפה",
        helperText: IMAGE_UPLOAD_HELPER_TEXT,
        subText: IMAGE_UPLOAD_SUBTEXT,
        removeLabel: "הסר תמונה",
      },
      { id: "commandTag", label: "תיוג הפיקוד האישי", placeholder: "הקלידו תיוג" },
    ],
    buildOutput(values) {
      return [
        "פורמט הפקרת ניידות",
        `שם: ${values.name}`,
        `סיבה: ${values.reason}`,
        `מיקום: ${values.location}`,
        `תמונה של הניידת: ${values.image}`,
        `תמונה של המפה: ${values.mapImage}`,
        `תיוג הפיקוד האישי: ${values.commandTag}`,
      ].join("\n");
    },
  },
  {
    id: "food-purchase",
    tabTitle: "קניית אוכל",
    tabCopy: "יצירת הודעה נקייה ומוכנה לשליחה על רכישת אוכל.",
    title: "קניית אוכל",
    fields: [
      { id: "mdaName", label: "שם המדא", placeholder: "הקלידו את שם המדא" },
      { id: "quantity", label: "כמות", placeholder: "הקלידו כמות" },
      { id: "restaurant", label: "מאיזו מסעדה קניתם", placeholder: "הקלידו שם מסעדה" },
      { id: "commandTag", label: "תיוג הפיקוד האישי", placeholder: "הקלידו תיוג" },
    ],
    buildOutput(values) {
      return [
        "קניית אוכל",
        `שם המדא: ${values.mdaName}`,
        `כמות: ${values.quantity}`,
        `מאיזו מסעדה קניתם: ${values.restaurant}`,
        `תיוג הפיקוד האישי: ${values.commandTag}`,
      ].join("\n");
    },
  },
];

const legacyPersistentSettingDefinitions = [
  {
    id: "discordWebhook",
    storageKey: STORAGE_KEYS.discordWebhook,
    inputId: "discord-webhook-input",
    saveButtonId: "discord-webhook-save",
    clearButtonId: "discord-webhook-clear",
    feedbackId: "discord-webhook-feedback",
    emptyMessage: "יש להזין קישור Webhook לפני שמירה.",
    saveMessage: "קישור ה-Webhook נשמר בהצלחה",
    clearMessage: "קישור ה-Webhook נמחק",
    targets: {},
  },
  {
    id: "fixedName",
    storageKey: STORAGE_KEYS.fixedName,
    inputId: "fixed-name-input",
    saveButtonId: "fixed-name-save",
    clearButtonId: "fixed-name-clear",
    feedbackId: "fixed-name-feedback",
    emptyMessage: "יש להזין שם לפני שמירה.",
    saveMessage: "השם הקבוע נשמר",
    clearMessage: "השם הקבוע נמחק",
    targets: {
      "role-exit": "name",
      "vehicle-abandonment": "name",
      "food-purchase": "mdaName",
    },
  },
  {
    id: "fixedCommandTag",
    storageKey: STORAGE_KEYS.fixedCommandTag,
    inputId: "fixed-command-tag-input",
    saveButtonId: "fixed-command-tag-save",
    clearButtonId: "fixed-command-tag-clear",
    feedbackId: "fixed-command-tag-feedback",
    emptyMessage: "יש להזין תיוג לפני שמירה.",
    saveMessage: "התיוג הקבוע נשמר",
    clearMessage: "התיוג הקבוע נמחק",
    targets: {
      "role-exit": "commandTag",
      "vehicle-abandonment": "commandTag",
      "food-purchase": "commandTag",
    },
  },
];

function formatFieldLine(label, value) {
  return `${label}: ${value}`;
}

function buildFormatOutput(title, lines) {
  return [title, "", ...lines].join("\n");
}

function getFieldDefaultValue(field) {
  if (isImageField(field)) {
    return "";
  }

  return typeof field.defaultValue === "string" ? field.defaultValue : "";
}

const formatDefinitions = [
  {
    id: "role-exit",
    tabTitle: "ירידה מתפקיד",
    tabCopy: "פורמט מהיר לירידה מתפקיד.",
    title: "פורמט ירידה מתפקיד",
    fields: [
      { id: "name", label: "שם", placeholder: "הקלידו שם" },
      { id: "reason", label: "סיבה", placeholder: "הקלידו סיבה" },
      {
        id: "roleExitCount",
        label: "כמות ירידה מתפקיד",
        placeholder: "הקלידו כמות",
        defaultValue: "0/3",
      },
      {
        id: "mdaAmount",
        label: "כמות המדא בתפקיד",
        placeholder: "הקלידו כמות",
      },
      {
        id: "commandTag",
        label: "תיוג פיקוד",
        placeholder: "הקלידו תיוג פיקוד",
      },
    ],
    buildOutput(values) {
      return buildFormatOutput("פורמט ירידה מתפקיד", [
        formatFieldLine("שם", values.name),
        formatFieldLine("סיבה", values.reason),
        formatFieldLine("כמות ירידה מתפקיד", values.roleExitCount),
        formatFieldLine("כמות המדא בתפקיד", values.mdaAmount),
        formatFieldLine("תיוג פיקוד", values.commandTag),
      ]);
    },
  },
  {
    id: "vehicle-abandonment",
    tabTitle: "הפקרת ניידת",
    tabCopy: "טופס מהיר לדיווח מסודר על הפקרת ניידת.",
    title: "פורמט הפקרת ניידת",
    fields: [
      { id: "name", label: "שם", placeholder: "הקלידו שם" },
      { id: "reason", label: "סיבה", placeholder: "הקלידו סיבה" },
      { id: "location", label: "מיקום", placeholder: "הקלידו מיקום" },
      {
        id: "image",
        type: IMAGE_FIELD_TYPE,
        label: "תמונת הניידת",
        helperText: IMAGE_UPLOAD_HELPER_TEXT,
        subText: IMAGE_UPLOAD_SUBTEXT,
        removeLabel: "הסר תמונה",
      },
      {
        id: "mapImage",
        type: IMAGE_FIELD_TYPE,
        label: "תמונת מיקום ההפקרה במפה",
        helperText: IMAGE_UPLOAD_HELPER_TEXT,
        subText: IMAGE_UPLOAD_SUBTEXT,
        removeLabel: "הסר תמונה",
      },
      {
        id: "commandTag",
        label: "תיוג פיקוד",
        placeholder: "הקלידו תיוג פיקוד",
      },
    ],
    buildOutput(values) {
      return buildFormatOutput("פורמט הפקרת ניידת", [
        formatFieldLine("שם", values.name),
        formatFieldLine("סיבה", values.reason),
        formatFieldLine("מיקום", values.location),
        formatFieldLine("תמונת הניידת", values.image),
        formatFieldLine("תמונת מיקום ההפקרה במפה", values.mapImage),
        formatFieldLine("תיוג פיקוד", values.commandTag),
      ]);
    },
  },
  {
    id: "food-purchase",
    tabTitle: "קניית אוכל",
    tabCopy: "יצירת פורמט מסודר על קניית אוכל.",
    title: "פורמט קניית אוכל",
    fields: [
      { id: "mdaName", label: "שם מלא", placeholder: "הקלידו שם מלא" },
      { id: "quantity", label: "כמות", placeholder: "הקלידו כמות" },
      { id: "restaurant", label: "מסעדה", placeholder: "הקלידו מסעדה" },
      { id: "cost", label: "עלות ההזמנה", placeholder: "הקלידו עלות הזמנה" },
      {
        id: "commandTag",
        label: "תיוג פיקוד",
        placeholder: "הקלידו תיוג פיקוד",
      },
    ],
    buildOutput(values) {
      return buildFormatOutput("פורמט קניית אוכל", [
        formatFieldLine("שם מלא", values.mdaName),
        formatFieldLine("כמות", values.quantity),
        formatFieldLine("מסעדה", values.restaurant),
        formatFieldLine("עלות ההזמנה", values.cost),
        formatFieldLine("תיוג פיקוד", values.commandTag),
      ]);
    },
  },
  {
    id: "lotteries",
    tabTitle: "הגרלות",
    tabCopy: "פורמט מהיר לפתיחת הגרלה מסודרת.",
    title: "פורמט הגרלות",
    fields: [
      { id: "audience", label: "עבור מי ההגרלה", placeholder: "הקלידו עבור מי ההגרלה" },
      {
        id: "amount",
        label: "סכום ההגרלה",
        placeholder: "הקלידו סכום הגרלה",
      },
      { id: "winners", label: "כמות זוכים", placeholder: "הקלידו כמות זוכים" },
      { id: "endTime", label: "זמן סיום ההגרלה", placeholder: "הקלידו זמן סיום" },
      {
        id: "description",
        label: "מה יהיה כתוב בתיאור ההגרלה",
        placeholder: "הקלידו תיאור הגרלה",
      },
      {
        id: "commandTag",
        label: "תיוג פיקוד",
        placeholder: "הקלידו תיוג פיקוד",
      },
    ],
    buildOutput(values) {
      return buildFormatOutput("פורמט הגרלות", [
        formatFieldLine("עבור מי ההגרלה", values.audience),
        formatFieldLine("סכום ההגרלה", values.amount),
        formatFieldLine("כמות זוכים", values.winners),
        formatFieldLine("זמן סיום ההגרלה", values.endTime),
        formatFieldLine("מה יהיה כתוב בתיאור ההגרלה", values.description),
        formatFieldLine("תיוג פיקוד", values.commandTag),
      ]);
    },
  },
  {
    id: "add-hours",
    tabTitle: "הוספת שעות",
    tabCopy: "פורמט מהיר להוספת שעות עם שורת מעקב קבועה.",
    title: "הוספת שעות",
    fields: [
      { id: "mdaName", label: "שם המדא", placeholder: "הקלידו שם מד\"א" },
      { id: "duration", label: "כמות זמן", placeholder: "הקלידו כמות זמן" },
      { id: "reason", label: "סיבה", placeholder: "הקלידו סיבה" },
      { id: "proof", label: "הוכחה", placeholder: "הקלידו הוכחה" },
      { id: "commandTag", label: "תיוג פיקוד", placeholder: "הקלידו תיוג פיקוד" },
    ],
    buildOutput(values) {
      return buildFormatOutput("הוספת שעות", [
        `שם המדא: ${values.mdaName}`,
        `כמות זמן: ${values.duration}`,
        `סיבה: ${values.reason}`,
        `הוכחה: ${values.proof}`,
        `תיוג פיקוד: ${values.commandTag}`,
        "כמות הפעמים שנשלח הפורמט: 0/3",
      ]);
    },
  },
  {
    id: "remove-hours",
    tabTitle: "הורדת שעות",
    tabCopy: "פורמט מהיר להורדת שעות עם הוכחה מצורפת.",
    title: "הורדת שעות",
    fields: [
      { id: "amount", label: "כמה להוריד?", placeholder: "הקלידו כמות" },
      { id: "reason", label: "סיבה", placeholder: "הקלידו סיבה" },
      {
        id: "commandTag",
        label: "תיוג פיקוד",
        placeholder: "הקלידו תיוג פיקוד",
      },
      { id: "proof", label: "הוכחה", placeholder: "הקלידו הוכחה" },
    ],
    buildOutput(values) {
      return buildFormatOutput("הורדת שעות", [
        `כמה להוריד?: ${values.amount}`,
        `סיבה: ${values.reason}`,
        `תיוג פיקוד: ${values.commandTag}`,
        `הוכחה: ${values.proof}`,
      ]);
    },
  },
];

const persistentSettingDefinitions = [
  {
    id: "discordWebhook",
    storageKey: STORAGE_KEYS.discordWebhook,
    inputId: "discord-webhook-input",
    saveButtonId: "discord-webhook-save",
    clearButtonId: "discord-webhook-clear",
    feedbackId: "discord-webhook-feedback",
    emptyMessage: "יש להזין קישור Webhook לפני שמירה.",
    saveMessage: "קישור ה-Webhook נשמר בהצלחה",
    clearMessage: "קישור ה-Webhook נמחק",
    targets: {},
  },
  {
    id: "fixedName",
    storageKey: STORAGE_KEYS.fixedName,
    inputId: "fixed-name-input",
    saveButtonId: "fixed-name-save",
    clearButtonId: "fixed-name-clear",
    feedbackId: "fixed-name-feedback",
    emptyMessage: "יש להזין שם לפני שמירה.",
    saveMessage: "השם הקבוע נשמר",
    clearMessage: "השם הקבוע נמחק",
    targets: {
      "role-exit": "name",
      "vehicle-abandonment": "name",
      "food-purchase": "mdaName",
      "add-hours": "mdaName",
    },
  },
  {
    id: "fixedCommandTag",
    storageKey: STORAGE_KEYS.fixedCommandTag,
    inputId: "fixed-command-tag-input",
    saveButtonId: "fixed-command-tag-save",
    clearButtonId: "fixed-command-tag-clear",
    feedbackId: "fixed-command-tag-feedback",
    emptyMessage: "יש להזין תיוג לפני שמירה.",
    saveMessage: "התיוג הקבוע נשמר",
    clearMessage: "התיוג הקבוע נמחק",
    targets: {
      "role-exit": "commandTag",
      "vehicle-abandonment": "commandTag",
      "food-purchase": "commandTag",
      lotteries: "commandTag",
      "add-hours": "commandTag",
      "remove-hours": "commandTag",
    },
  },
];

const defaultState = {
  activeFormatId: formatDefinitions[0].id,
  values: formatDefinitions.reduce((formatsMap, format) => {
    formatsMap[format.id] = format.fields.reduce((fieldMap, field) => {
      fieldMap[field.id] = getFieldDefaultValue(field);
      return fieldMap;
    }, {});
    return formatsMap;
  }, {}),
};

const defaultImageState = formatDefinitions.reduce((formatsMap, format) => {
  formatsMap[format.id] = format.fields
    .filter(isImageField)
    .reduce((fieldMap, field) => {
      fieldMap[field.id] = "";
      return fieldMap;
    }, {});
  return formatsMap;
}, {});

const defaultImageLinkState = formatDefinitions.reduce((formatsMap, format) => {
  formatsMap[format.id] = format.fields
    .filter(isImageField)
    .reduce((fieldMap, field) => {
      fieldMap[field.id] = "";
      return fieldMap;
    }, {});
  return formatsMap;
}, {});

const formatMap = Object.fromEntries(formatDefinitions.map((format) => [format.id, format]));
const persistentSettingElements = {};

const tabList = document.getElementById("tab-list");
const formsRoot = document.getElementById("forms-root");

let state = loadState();
let imageState = loadImageState();
let imageLinkState = loadImageLinkState();
let persistentValues = loadPersistentValues();

applyPersistentSettings();

for (const setting of persistentSettingDefinitions) {
  persistentSettingElements[setting.id] = {
    input: document.getElementById(setting.inputId),
    saveButton: document.getElementById(setting.saveButtonId),
    clearButton: document.getElementById(setting.clearButtonId),
    feedback: document.getElementById(setting.feedbackId),
  };
}

renderTabs();
renderPanels();
bindPersistentSettingControls();
syncActiveView();

function isImageField(field) {
  return field.type === IMAGE_FIELD_TYPE;
}

function bindPersistentSettingControls() {
  for (const setting of persistentSettingDefinitions) {
    const elements = persistentSettingElements[setting.id];
    elements.input.value = persistentValues[setting.id];

    const autoSave = () => {
      const nextValue = normalizeValue(elements.input.value);
      persistentValues[setting.id] = savePersistentValue(setting, nextValue);
      applyPersistentSettings({ syncDom: true, settingIds: [setting.id] });
    };

    elements.input.addEventListener("input", autoSave);
    elements.input.addEventListener("blur", autoSave);

    elements.saveButton.addEventListener("click", () => {
      const nextValue = normalizeValue(elements.input.value);
      if (!nextValue) {
        showTimedMessage(elements.feedback, setting.emptyMessage);
        elements.input.focus();
        return;
      }

      autoSave();
      elements.input.value = persistentValues[setting.id];
      showTimedMessage(elements.feedback, setting.saveMessage);
    });

    elements.clearButton.addEventListener("click", () => {
      persistentValues[setting.id] = savePersistentValue(setting, "");
      elements.input.value = "";
      applyPersistentSettings({ syncDom: true, restorePersisted: true, settingIds: [setting.id] });
      showTimedMessage(elements.feedback, setting.clearMessage);
    });
  }
}

function loadState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEYS.formState) || "null");
    if (!savedState) {
      return cloneDefaultState();
    }

    const normalizedState = cloneDefaultState();
    normalizedState.activeFormatId = formatDefinitions.some(
      (format) => format.id === savedState.activeFormatId,
    )
      ? savedState.activeFormatId
      : defaultState.activeFormatId;

    for (const format of formatDefinitions) {
      const savedValues = savedState.values?.[format.id] || {};
      for (const field of format.fields) {
        if (isImageField(field)) {
          normalizedState.values[format.id][field.id] = "";
          continue;
        }

        normalizedState.values[format.id][field.id] = Object.prototype.hasOwnProperty.call(
          savedValues,
          field.id,
        )
          ? String(savedValues[field.id] ?? "")
          : getFieldDefaultValue(field);
      }
    }

    return normalizedState;
  } catch (error) {
    return cloneDefaultState();
  }
}

function loadImageState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEYS.imageState) || "null");
    if (!savedState || typeof savedState !== "object") {
      return cloneDefaultImageState();
    }

    const normalizedState = cloneDefaultImageState();
    for (const format of formatDefinitions) {
      for (const field of format.fields.filter(isImageField)) {
        const savedValue = savedState?.[format.id]?.[field.id];
        normalizedState[format.id][field.id] =
          typeof savedValue === "string" && savedValue.startsWith("data:image/")
            ? savedValue
            : "";
      }
    }

    return normalizedState;
  } catch (error) {
    clearImageStorage();
    return cloneDefaultImageState();
  }
}

function loadImageLinkState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEYS.imageLinkState) || "null");
    if (!savedState || typeof savedState !== "object") {
      return cloneDefaultImageLinkState();
    }

    const normalizedState = cloneDefaultImageLinkState();
    for (const format of formatDefinitions) {
      for (const field of format.fields.filter(isImageField)) {
        const savedValue = savedState?.[format.id]?.[field.id];
        normalizedState[format.id][field.id] = isPublicImageUrl(savedValue) ? savedValue : "";
      }
    }

    return normalizedState;
  } catch (error) {
    clearImageLinkStorage();
    return cloneDefaultImageLinkState();
  }
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function cloneDefaultImageState() {
  return JSON.parse(JSON.stringify(defaultImageState));
}

function cloneDefaultImageLinkState() {
  return JSON.parse(JSON.stringify(defaultImageLinkState));
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.formState, JSON.stringify(state));
}

function syncImageStorage() {
  const serializableState = cloneDefaultImageState();
  let hasPersistableImage = false;
  let skippedFields = 0;

  for (const format of formatDefinitions) {
    for (const field of format.fields.filter(isImageField)) {
      const dataUrl = getImageAttachment(format.id, field.id);
      if (!dataUrl) {
        continue;
      }

      if (isPersistableImage(dataUrl)) {
        serializableState[format.id][field.id] = dataUrl;
        hasPersistableImage = true;
      } else {
        skippedFields += 1;
      }
    }
  }

  try {
    if (hasPersistableImage) {
      localStorage.setItem(STORAGE_KEYS.imageState, JSON.stringify(serializableState));
    } else {
      localStorage.removeItem(STORAGE_KEYS.imageState);
    }

    return { ok: true, skippedFields };
  } catch (error) {
    return { ok: false, skippedFields };
  }
}

function clearImageStorage() {
  try {
    localStorage.removeItem(STORAGE_KEYS.imageState);
  } catch (error) {
    return;
  }
}

function syncImageLinkStorage() {
  const serializableState = cloneDefaultImageLinkState();
  let hasLinks = false;

  for (const format of formatDefinitions) {
    for (const field of format.fields.filter(isImageField)) {
      const publicUrl = getPublicImageUrl(format.id, field.id);
      if (!isPublicImageUrl(publicUrl)) {
        continue;
      }

      serializableState[format.id][field.id] = publicUrl;
      hasLinks = true;
    }
  }

  if (hasLinks) {
    localStorage.setItem(STORAGE_KEYS.imageLinkState, JSON.stringify(serializableState));
  } else {
    localStorage.removeItem(STORAGE_KEYS.imageLinkState);
  }
}

function clearImageLinkStorage() {
  try {
    localStorage.removeItem(STORAGE_KEYS.imageLinkState);
  } catch (error) {
    return;
  }
}

function isPersistableImage(dataUrl) {
  return typeof dataUrl === "string" && dataUrl.length > 0 && dataUrl.length <= MAX_PERSISTED_IMAGE_LENGTH;
}

function loadPersistentValues() {
  return Object.fromEntries(
    persistentSettingDefinitions.map((setting) => [
      setting.id,
      normalizeValue(localStorage.getItem(setting.storageKey) || ""),
    ]),
  );
}

function savePersistentValue(setting, value) {
  const normalizedValue = normalizeValue(value);
  if (normalizedValue) {
    localStorage.setItem(setting.storageKey, normalizedValue);
  } else {
    localStorage.removeItem(setting.storageKey);
  }

  return normalizedValue;
}

function applyPersistentSettings({
  syncDom = false,
  restorePersisted = false,
  settingIds = null,
  formatIds = null,
} = {}) {
  const filteredSettings = settingIds
    ? persistentSettingDefinitions.filter((setting) => settingIds.includes(setting.id))
    : persistentSettingDefinitions;
  const persistedState = restorePersisted ? loadState() : null;
  const touchedFormatIds = new Set();

  for (const setting of filteredSettings) {
    for (const [formatId, fieldId] of Object.entries(setting.targets)) {
      if (formatIds && !formatIds.includes(formatId)) {
        continue;
      }

      const restoredValue = normalizeValue(persistedState?.values?.[formatId]?.[fieldId] || "");
      const nextValue = persistentValues[setting.id] || restoredValue;
      state.values[formatId][fieldId] = nextValue;
      touchedFormatIds.add(formatId);

      if (syncDom) {
        syncFieldValue(formatId, fieldId, nextValue);
      }
    }
  }

  if (syncDom) {
    for (const formatId of touchedFormatIds) {
      refreshFormatOutput(formatId);
    }
  }

  saveState();
}

function renderTabs() {
  tabList.innerHTML = formatDefinitions
    .map(
      (format) => `
        <button
          class="format-tab"
          type="button"
          data-format-tab="${format.id}"
          role="tab"
          aria-selected="false"
          aria-controls="panel-${format.id}"
          id="tab-${format.id}"
        >
          <span class="tab-title">${format.tabTitle}</span>
          <span class="tab-copy">${format.tabCopy}</span>
        </button>
      `,
    )
    .join("");

  for (const tab of tabList.querySelectorAll("[data-format-tab]")) {
    tab.addEventListener("click", () => {
      state.activeFormatId = tab.dataset.formatTab;
      saveState();
      syncActiveView();
    });
  }
}

function renderPanels() {
  formsRoot.innerHTML = formatDefinitions
    .map(
      (format) => `
        <section
          class="form-panel"
          id="panel-${format.id}"
          data-format-panel="${format.id}"
          role="tabpanel"
          aria-labelledby="tab-${format.id}"
        >
          <div class="panel-card">
            <h2 class="panel-heading">${format.title}</h2>
            <p class="panel-subtitle">מלאו את כל השדות לקבלת טקסט מוכן להעתקה.</p>
            <form class="form-grid" data-format-form="${format.id}" novalidate>
              ${format.fields.map((field) => renderFieldMarkup(format, field)).join("")}
              <div class="panel-actions">
                <button class="action-button primary" type="button" data-copy-button="${format.id}">
                  העתק
                </button>
                <button class="action-button secondary" type="button" data-clear-button="${format.id}">
                  נקה
                </button>
              </div>
            </form>
          </div>

          <div class="panel-card output-card">
            <div class="output-toolbar">
              <div>
                <h2 class="panel-heading">${format.title}</h2>
                <p class="panel-subtitle">הטקסט מתעדכן בזמן אמת ומוכן להדבקה בצ'אט.</p>
              </div>
              <button
                class="icon-button"
                type="button"
                data-icon-copy="${format.id}"
                aria-label="העתקה מהירה"
                title="העתקה מהירה"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m0 16H10V7h9z"/>
                </svg>
              </button>
            </div>
            <div class="copy-state" data-copy-state="${format.id}" aria-live="polite"></div>
            ${renderOutputImageMarkup(format)}
            <pre class="output-box" data-output="${format.id}"></pre>
            <p class="output-tip">טיפ: ניתן להעתיק גם מהכפתור הקטן בצד העליון.</p>
            <button class="action-button secondary reset-button" type="button" data-reset-button="${format.id}">
              איפוס
            </button>
          </div>
        </section>
      `,
    )
    .join("");

  for (const format of formatDefinitions) {
    const panel = getPanel(format.id);
    const form = panel.querySelector(`[data-format-form="${format.id}"]`);
    const outputElement = panel.querySelector(`[data-output="${format.id}"]`);
    const copyStateElement = panel.querySelector(`[data-copy-state="${format.id}"]`);

    for (const field of format.fields) {
      if (isImageField(field)) {
        bindImageField(panel, format, field);
        syncImageFieldUi(format.id, field.id);
        continue;
      }

      const input = form.elements.namedItem(field.id);
      input.addEventListener("input", () => {
        updateFieldValue(format.id, field.id, input.value);
        setFieldError(panel, field.id, "");
        refreshOutput(format, outputElement);
      });

      input.addEventListener("blur", () => {
        validateField(panel, format, field, input.value);
      });
    }

    panel
      .querySelector(`[data-copy-button="${format.id}"]`)
      .addEventListener("click", () => handleCopy(format, panel, outputElement, copyStateElement));

    panel
      .querySelector(`[data-icon-copy="${format.id}"]`)
      .addEventListener("click", () => handleCopy(format, panel, outputElement, copyStateElement));

    panel
      .querySelector(`[data-clear-button="${format.id}"]`)
      .addEventListener("click", () => clearFormatFields(format, panel));

    panel
      .querySelector(`[data-reset-button="${format.id}"]`)
      .addEventListener("click", () => handleReset(format, panel, copyStateElement));

    refreshOutput(format, outputElement);
  }
}

function renderFieldMarkup(format, field) {
  if (isImageField(field)) {
    return renderImageFieldMarkup(format, field);
  }

  return `
    <div class="field-group" data-field-group="${field.id}">
      <label class="field-label" for="${format.id}-${field.id}">${field.label}</label>
      <input
        class="field-input"
        id="${format.id}-${field.id}"
        name="${field.id}"
        type="text"
        autocomplete="off"
        placeholder="${field.placeholder}"
        value="${escapeHtml(state.values[format.id][field.id])}"
        required
      />
      <div class="field-error" data-field-error="${field.id}"></div>
    </div>
  `;
}

function renderImageFieldMarkup(format, field) {
  return `
    <div class="field-group image-field-group" data-field-group="${field.id}">
      <label class="field-label" for="${format.id}-${field.id}-picker">${field.label}</label>
      <div
        class="image-upload"
        data-image-upload="${field.id}"
        tabindex="0"
        role="button"
        aria-describedby="${format.id}-${field.id}-helper"
        aria-label="${field.helperText}"
      >
        <input
          class="visually-hidden"
          id="${format.id}-${field.id}-picker"
          name="${field.id}"
          type="file"
          accept="image/*"
          data-image-input="${field.id}"
        />
        <div class="image-upload-empty" data-image-empty="${field.id}">
          <span class="image-upload-title">${field.helperText}</span>
          <span class="image-upload-helper" id="${format.id}-${field.id}-helper">${field.subText}</span>
        </div>
        <div class="image-upload-preview" data-image-preview="${field.id}" hidden>
          <img data-image-preview-img="${field.id}" alt="${IMAGE_PREVIEW_ALT}" />
        </div>
      </div>
      <div class="image-field-actions">
        <span class="image-status" data-image-status="${field.id}"></span>
        <button
          class="action-button secondary image-remove-button"
          type="button"
          data-image-remove="${field.id}"
          hidden
        >
          ${field.removeLabel}
        </button>
      </div>
      <div class="field-error" data-field-error="${field.id}"></div>
    </div>
  `;
}

function renderOutputImageMarkup(format) {
  const imageFields = format.fields.filter(isImageField);
  if (imageFields.length === 0) {
    return "";
  }

  return imageFields
    .map(
      (imageField) => `
    <div class="output-image-card" data-output-image-card="${imageField.id}" hidden>
      <div class="output-image-label">${imageField.label}</div>
      <img class="output-image-preview" data-output-image-preview="${imageField.id}" alt="${IMAGE_PREVIEW_ALT}" />
    </div>
  `,
    )
    .join("");
}

function bindImageField(panel, format, field) {
  const uploadArea = panel.querySelector(`[data-image-upload="${field.id}"]`);
  const fileInput = panel.querySelector(`[data-image-input="${field.id}"]`);
  const removeButton = panel.querySelector(`[data-image-remove="${field.id}"]`);
  const copyStateElement = panel.querySelector(`[data-copy-state="${format.id}"]`);

  const selectImage = async (file) => {
    if (!file) {
      return;
    }

    try {
      const dataUrl = await buildImageDataUrl(file);
      const storageResult = setImageAttachment(format.id, field.id, dataUrl);
      setFieldError(panel, field.id, "");
      if (!storageResult.ok || storageResult.skippedFields > 0) {
        showTimedMessage(copyStateElement, IMAGE_PERSIST_WARNING);
      }
    } catch (error) {
      setFieldError(panel, field.id, `${IMAGE_LOAD_ERROR} (${error.message || error})`);
    } finally {
      fileInput.value = "";
    }
  };

  // The click and keydown listeners to open the file picker have been removed

  uploadArea.addEventListener("paste", (event) => {
    const file = getImageFileFromClipboard(event.clipboardData);
    if (!file) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    selectImage(file);
  });

  // Removed panel.addEventListener("paste") to prevent double-paste issues with multiple image fields

  uploadArea.addEventListener("dragenter", (event) => {
    if (!getImageFileFromDataTransfer(event.dataTransfer)) {
      return;
    }

    event.preventDefault();
    uploadArea.classList.add("is-dragging");
  });

  uploadArea.addEventListener("dragover", (event) => {
    if (!getImageFileFromDataTransfer(event.dataTransfer)) {
      return;
    }

    event.preventDefault();
    uploadArea.classList.add("is-dragging");
  });

  uploadArea.addEventListener("dragleave", (event) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    uploadArea.classList.remove("is-dragging");
  });

  uploadArea.addEventListener("drop", (event) => {
    const file = getImageFileFromDataTransfer(event.dataTransfer);
    uploadArea.classList.remove("is-dragging");
    if (!file) {
      return;
    }

    event.preventDefault();
    selectImage(file);
  });

  fileInput.addEventListener("change", () => {
    const file = getImageFileFromFileList(fileInput.files);
    selectImage(file);
  });

  removeButton.addEventListener("click", () => {
    clearImageAttachment(format.id, field.id);
    setFieldError(panel, field.id, "");
    uploadArea.focus();
  });
}

function syncActiveView() {
  for (const tab of tabList.querySelectorAll("[data-format-tab]")) {
    const isActive = tab.dataset.formatTab === state.activeFormatId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  }

  for (const panel of formsRoot.querySelectorAll("[data-format-panel]")) {
    const isActive = panel.dataset.formatPanel === state.activeFormatId;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  }
}

function updateFieldValue(formatId, fieldId, value) {
  state.values[formatId][fieldId] = value.trimStart();
  saveState();
}

function refreshOutput(format, outputElement) {
  outputElement.textContent = buildOutputText(format.id);
}

function refreshFormatOutput(formatId) {
  const format = formatMap[formatId];
  const panel = getPanel(formatId);
  const outputElement = panel?.querySelector(`[data-output="${formatId}"]`);
  if (format && outputElement) {
    refreshOutput(format, outputElement);
  }
}

function getNormalizedValues(formatId) {
  return getNormalizedValuesForOutput(formatId);
}

function getNormalizedValuesForOutput(formatId, { preferPublicImageUrl = true } = {}) {
  const currentValues = state.values[formatId];
  const format = formatMap[formatId];
  const normalizedValues = {};

  for (const field of format.fields) {
    normalizedValues[field.id] = isImageField(field)
      ? getImageOutputValue(formatId, field.id, { preferPublicImageUrl })
      : normalizeValue(currentValues[field.id]);
  }

  return normalizedValues;
}

function buildOutputText(formatId, options = {}) {
  const format = formatMap[formatId];
  return format.buildOutput(getNormalizedValuesForOutput(formatId, options));
}

function getImageOutputValue(formatId, fieldId, { preferPublicImageUrl = true } = {}) {
  const publicUrl = getPublicImageUrl(formatId, fieldId);
  if (preferPublicImageUrl && isPublicImageUrl(publicUrl)) {
    return publicUrl;
  }

  return hasImageAttachment(formatId, fieldId) ? IMAGE_ATTACHED_TEXT : "";
}

function validateField(panel, format, field, value = "") {
  const message = isImageField(field)
    ? hasImageAttachment(format.id, field.id)
      ? ""
      : IMAGE_REQUIRED_MESSAGE
    : normalizeValue(value)
      ? ""
      : "יש למלא את השדה הזה.";
  setFieldError(panel, field.id, message);
  return !message;
}

function validateForm(format, panel) {
  let isValid = true;
  for (const field of format.fields) {
    const inputValue = isImageField(field)
      ? ""
      : panel.querySelector(`#${format.id}-${field.id}`)?.value || "";
    const fieldValid = validateField(panel, format, field, inputValue);
    if (!fieldValid) {
      isValid = false;
    }
  }

  return isValid;
}

async function handleCopy(format, panel, outputElement, copyStateElement) {
  if (!validateForm(format, panel)) {
    showTimedMessage(copyStateElement, "יש למלא את כל השדות לפני ההעתקה.");
    return;
  }

  try {
    const imageFields = format.fields.filter(isImageField);
    let hasAnyImage = false;

    for (const imageField of imageFields) {
      if (hasImageAttachment(format.id, imageField.id)) {
        hasAnyImage = true;
        const publicUrl = await ensurePublicImageUrl(format.id, imageField.id);
        if (!isPublicImageUrl(publicUrl)) {
          throw new Error("PUBLIC_URL_MISSING");
        }
      }
    }

    if (hasAnyImage) {
      const textWithPublicLink = buildOutputText(format.id, { preferPublicImageUrl: true });
      await navigator.clipboard.writeText(textWithPublicLink);
      outputElement.textContent = textWithPublicLink;
      showTimedMessage(copyStateElement, IMAGE_LINK_COPY_SUCCESS_MESSAGE);
      return;
    }

    await navigator.clipboard.writeText(outputElement.textContent);
    showTimedMessage(copyStateElement, "הטקסט הועתק");
  } catch (error) {
    showTimedMessage(
      copyStateElement,
      format.fields.some(isImageField) ? IMAGE_LINK_COPY_ERROR_MESSAGE : "לא ניתן היה להעתיק. נסו שוב.",
    );
  }
}

function handleReset(format, panel, messageElement) {
  clearFormatFields(format, panel);
  showTimedMessage(messageElement, "הפורמט אופס");
}

function clearFormatFields(format, panel) {
  const form = panel.querySelector(`[data-format-form="${format.id}"]`);

  for (const field of format.fields) {
    if (isImageField(field)) {
      clearImageAttachment(format.id, field.id);
      setFieldError(panel, field.id, "");
      continue;
    }

    const nextValue = getFieldDefaultValue(field);
    updateFieldValue(format.id, field.id, nextValue);
    const input = form.elements.namedItem(field.id);
    input.value = nextValue;
    setFieldError(panel, field.id, "");
  }

  applyPersistentSettings({ syncDom: true, formatIds: [format.id] });
  refreshFormatOutput(format.id);
}

function syncFieldValue(formatId, fieldId, value) {
  const panel = getPanel(formatId);
  const input = panel?.querySelector(`#${formatId}-${fieldId}`);
  if (input) {
    input.value = value;
  }

  if (panel) {
    setFieldError(panel, fieldId, "");
  }
}

function showTimedMessage(element, message) {
  element.textContent = message;
  if (element._timeoutId) {
    window.clearTimeout(element._timeoutId);
  }

  if (message) {
    element._timeoutId = window.setTimeout(() => {
      element.textContent = "";
      element._timeoutId = null;
    }, 2200);
  }
}

function setFieldError(panel, fieldId, message) {
  const fieldGroup = panel.querySelector(`[data-field-group="${fieldId}"]`);
  const fieldError = panel.querySelector(`[data-field-error="${fieldId}"]`);
  fieldGroup.classList.toggle("has-error", Boolean(message));
  fieldError.textContent = message;
}

function normalizeValue(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getPanel(formatId) {
  return formsRoot.querySelector(`[data-format-panel="${formatId}"]`);
}

function getImageAttachment(formatId, fieldId) {
  return imageState?.[formatId]?.[fieldId] || "";
}

function getPublicImageUrl(formatId, fieldId) {
  return imageLinkState?.[formatId]?.[fieldId] || "";
}

function hasImageAttachment(formatId, fieldId) {
  return Boolean(getImageAttachment(formatId, fieldId));
}

function setImageAttachment(formatId, fieldId, dataUrl) {
  if (!imageState[formatId]) {
    imageState[formatId] = {};
  }

  imageState[formatId][fieldId] = dataUrl;
  clearPublicImageUrl(formatId, fieldId, { refreshOutput: false });
  const storageResult = syncImageStorage();
  syncImageFieldUi(formatId, fieldId);
  refreshFormatOutput(formatId);
  return storageResult;
}

function clearImageAttachment(formatId, fieldId) {
  if (!imageState[formatId]) {
    imageState[formatId] = {};
  }

  imageState[formatId][fieldId] = "";
  clearPublicImageUrl(formatId, fieldId, { refreshOutput: false });
  syncImageStorage();
  syncImageFieldUi(formatId, fieldId);
  refreshFormatOutput(formatId);
}

function setPublicImageUrl(formatId, fieldId, publicUrl) {
  if (!imageLinkState[formatId]) {
    imageLinkState[formatId] = {};
  }

  imageLinkState[formatId][fieldId] = publicUrl;
  syncImageLinkStorage();
  refreshFormatOutput(formatId);
}

function clearPublicImageUrl(formatId, fieldId, { refreshOutput = true } = {}) {
  if (!imageLinkState[formatId]) {
    imageLinkState[formatId] = {};
  }

  imageLinkState[formatId][fieldId] = "";
  syncImageLinkStorage();
  if (refreshOutput) {
    refreshFormatOutput(formatId);
  }
}

function syncImageFieldUi(formatId, fieldId) {
  const panel = getPanel(formatId);
  if (!panel) {
    return;
  }

  const field = formatMap[formatId]?.fields.find((candidate) => candidate.id === fieldId);
  const dataUrl = getImageAttachment(formatId, fieldId);
  const hasImage = Boolean(dataUrl);
  const uploadArea = panel.querySelector(`[data-image-upload="${fieldId}"]`);
  const emptyState = panel.querySelector(`[data-image-empty="${fieldId}"]`);
  const previewWrap = panel.querySelector(`[data-image-preview="${fieldId}"]`);
  const previewImage = panel.querySelector(`[data-image-preview-img="${fieldId}"]`);
  const removeButton = panel.querySelector(`[data-image-remove="${fieldId}"]`);
  const statusText = panel.querySelector(`[data-image-status="${fieldId}"]`);
  const fileInput = panel.querySelector(`[data-image-input="${fieldId}"]`);
  const outputCard = panel.querySelector(`[data-output-image-card="${fieldId}"]`);
  const outputImage = panel.querySelector(`[data-output-image-preview="${fieldId}"]`);

  uploadArea.classList.toggle("has-image", hasImage);
  uploadArea.classList.remove("is-dragging");
  emptyState.hidden = hasImage;
  previewWrap.hidden = !hasImage;
  removeButton.hidden = !hasImage;
  statusText.textContent = hasImage ? IMAGE_ATTACHED_TEXT : field?.helperText || IMAGE_UPLOAD_HELPER_TEXT;
  statusText.classList.toggle("is-attached", hasImage);

  if (hasImage) {
    if (previewImage) previewImage.src = dataUrl;
    if (outputCard) outputCard.hidden = false;
    if (outputImage) outputImage.src = dataUrl;
    if (uploadArea) uploadArea.setAttribute("aria-label", `${field.label}: ${IMAGE_ATTACHED_TEXT}`);
  } else {
    if (previewImage) previewImage.removeAttribute("src");
    if (outputCard) outputCard.hidden = true;
    if (outputImage) outputImage.removeAttribute("src");
    if (uploadArea) uploadArea.setAttribute("aria-label", field?.helperText || IMAGE_UPLOAD_HELPER_TEXT);
    if (fileInput) {
      fileInput.value = "";
    }
  }
}

function getImageFileFromClipboard(clipboardData) {
  return getImageFileFromItems(clipboardData?.items) || getImageFileFromFileList(clipboardData?.files);
}

function getImageFileFromDataTransfer(dataTransfer) {
  return getImageFileFromItems(dataTransfer?.items) || getImageFileFromFileList(dataTransfer?.files);
}

function getImageFileFromItems(items) {
  if (!items) {
    return null;
  }

  for (const item of Array.from(items)) {
    if (item.kind === "file" && item.type.startsWith("image/")) {
      return item.getAsFile();
    }
  }

  return null;
}

function getImageFileFromFileList(files) {
  if (!files) {
    return null;
  }

  for (const file of Array.from(files)) {
    if (file.type.startsWith("image/")) {
      return file;
    }
  }

  return null;
}

async function ensurePublicImageUrl(formatId, fieldId) {
  const existingUrl = getPublicImageUrl(formatId, fieldId);
  if (isPublicImageUrl(existingUrl)) {
    return existingUrl;
  }

  const imageDataUrl = getImageAttachment(formatId, fieldId);
  if (!imageDataUrl) {
    return "";
  }

  const webhookUrl = persistentValues.discordWebhook;
  if (!webhookUrl) {
    alert("כדי להעלות את התמונה לדיסקורד באופן אוטומטי (ולעקוף חסימות), יש להגדיר קישור Webhook ב'הגדרות קבועות' בתחתית העמוד.");
    throw new Error("MISSING_WEBHOOK_URL");
  }

  const pngBlob = await dataUrlToPngBlob(imageDataUrl);
  const formData = new FormData();
  formData.append("file", pngBlob, `mada-${Date.now()}.png`);

  const uploadUrl = webhookUrl.includes("?") ? `${webhookUrl}&wait=true` : `${webhookUrl}?wait=true`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("PUBLIC_UPLOAD_FAILED");
  }

  const payload = await response.json();
  const publicUrl = payload?.attachments?.[0]?.url;

  if (!isPublicImageUrl(publicUrl)) {
    throw new Error("INVALID_PUBLIC_URL");
  }

  setPublicImageUrl(formatId, fieldId, publicUrl);
  return publicUrl;
}

function isPublicImageUrl(value) {
  return typeof value === "string" && /^https?:\/\/\S+$/i.test(value.trim());
}

function buildTmpFilesDirectUrl(value) {
  const normalizedValue = normalizeValue(value);
  if (!/^https?:\/\/tmpfiles\.org\//i.test(normalizedValue)) {
    return "";
  }

  return normalizedValue.replace(/^https?:\/\/tmpfiles\.org\//i, "https://tmpfiles.org/dl/");
}

async function buildImageDataUrl(file) {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("INVALID_IMAGE");
  }

  const originalDataUrl = await readFileAsDataUrl(file);
  const compressedDataUrl = await compressImageDataUrl(originalDataUrl);
  if (isBetterImageDataUrl(originalDataUrl, compressedDataUrl)) {
    return compressedDataUrl;
  }

  return originalDataUrl;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("READ_FAILED"));
    reader.readAsDataURL(file);
  });
}

async function compressImageDataUrl(dataUrl) {
  try {
    const image = await loadImage(dataUrl);
    const dimensions = getScaledDimensions(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const context = canvas.getContext("2d");
    if (!context) {
      return dataUrl;
    }

    context.drawImage(image, 0, 0, dimensions.width, dimensions.height);
    return canvas.toDataURL("image/webp", IMAGE_COMPRESSION_QUALITY);
  } catch (error) {
    return dataUrl;
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("IMAGE_LOAD_FAILED"));
    image.src = src;
  });
}

async function dataUrlToPngBlob(dataUrl) {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("CANVAS_CONTEXT_UNAVAILABLE");
  }

  context.drawImage(image, 0, 0);
  const blob = await canvasToBlob(canvas, "image/png");
  if (!blob) {
    throw new Error("PNG_EXPORT_FAILED");
  }

  return blob;
}

function canvasToBlob(canvas, type) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type);
  });
}

function getScaledDimensions(width, height) {
  const largestSide = Math.max(width, height);
  if (!largestSide || largestSide <= MAX_IMAGE_DIMENSION) {
    return { width, height };
  }

  const scale = MAX_IMAGE_DIMENSION / largestSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function isBetterImageDataUrl(originalDataUrl, candidateDataUrl) {
  return (
    typeof candidateDataUrl === "string" &&
    candidateDataUrl.startsWith("data:image/") &&
    candidateDataUrl.length > 0 &&
    candidateDataUrl.length < originalDataUrl.length
  );
}
