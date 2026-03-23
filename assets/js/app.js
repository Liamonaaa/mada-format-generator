const STORAGE_KEY = "mada-format-generator-state";
const DEFAULT_NAME_KEY = "mada-format-generator-default-name";

const formatDefinitions = [
  {
    id: "role-exit",
    tabTitle: "ירידה מתפקיד",
    tabCopy: "ליצירת פורמט מסודר על ירידה מתפקיד.",
    title: "פורמט ירידה מתפקיד",
    defaultNameFieldId: "name",
    fields: [
      { id: "name", label: "שם", placeholder: "הקלידו שם" },
      { id: "reason", label: "סיבה", placeholder: "מהי הסיבה?" },
      { id: "amount", label: "כמות ירידה מתפקיד", placeholder: "הקלידו כמות" },
      { id: "mdaAmount", label: "כמות המדא שיש", placeholder: "הקלידו כמות" },
    ],
    buildOutput(values) {
      return [
        "פורמט ירידה מתפקיד",
        `שם: ${values.name}`,
        `סיבה: ${values.reason}`,
        `כמות ירידה מתפקיד: ${values.amount}`,
        `כמות המדא שיש: ${values.mdaAmount}`,
      ].join("\n");
    },
  },
  {
    id: "vehicle-abandonment",
    tabTitle: "הפקרת ניידות",
    tabCopy: "טופס מהיר לדיווח מסודר על הפקרת ניידות.",
    title: "פורמט הפקרת ניידות",
    defaultNameFieldId: "name",
    fields: [
      { id: "name", label: "שם", placeholder: "הקלידו שם" },
      { id: "reason", label: "סיבה", placeholder: "מהי הסיבה?" },
      { id: "location", label: "מיקום", placeholder: "ציינו מיקום" },
      { id: "image", label: "תמונה של הניידת", placeholder: "הדביקו קישור או תיאור" },
    ],
    buildOutput(values) {
      return [
        "פורמט הפקרת ניידות",
        `שם: ${values.name}`,
        `סיבה: ${values.reason}`,
        `מיקום: ${values.location}`,
        `תמונה של הניידת: ${values.image}`,
      ].join("\n");
    },
  },
  {
    id: "food-purchase",
    tabTitle: "קניית אוכל",
    tabCopy: "יצירת הודעה נקייה ומוכנה לשליחה על רכישת אוכל.",
    title: "קניית אוכל",
    defaultNameFieldId: "mdaName",
    fields: [
      { id: "mdaName", label: "שם המדא", placeholder: "הקלידו את שם המדא" },
      { id: "quantity", label: "כמות", placeholder: "הקלידו כמות" },
      { id: "restaurant", label: "מאיזו מסעדה קניתם", placeholder: "הקלידו שם מסעדה" },
      { id: "tag", label: "תיוג הפיקוד האישי", placeholder: "הקלידו תיוג" },
    ],
    buildOutput(values) {
      return [
        "קניית אוכל",
        `שם המדא: ${values.mdaName}`,
        `כמות: ${values.quantity}`,
        `מאיזו מסעדה קניתם: ${values.restaurant}`,
        `תיוג הפיקוד האישי: ${values.tag}`,
      ].join("\n");
    },
  },
];

const defaultState = {
  activeFormatId: formatDefinitions[0].id,
  values: formatDefinitions.reduce((accumulator, format) => {
    accumulator[format.id] = format.fields.reduce((fieldMap, field) => {
      fieldMap[field.id] = "";
      return fieldMap;
    }, {});
    return accumulator;
  }, {}),
};

const defaultNameManager = {
  save(value) {
    const normalizedValue = normalizeValue(value);
    if (normalizedValue) {
      localStorage.setItem(DEFAULT_NAME_KEY, normalizedValue);
    } else {
      localStorage.removeItem(DEFAULT_NAME_KEY);
    }

    return normalizedValue;
  },

  load() {
    return normalizeValue(localStorage.getItem(DEFAULT_NAME_KEY) || "");
  },

  apply(value, { syncDom = false, restorePersisted = false } = {}) {
    const normalizedValue = normalizeValue(value);
    const persistedState = restorePersisted ? loadState() : null;

    for (const format of formatDefinitions) {
      if (!format.defaultNameFieldId) {
        continue;
      }

      const fieldId = format.defaultNameFieldId;
      const restoredValue = persistedState?.values?.[format.id]?.[fieldId] || "";
      const nextValue = normalizedValue || restoredValue;
      state.values[format.id][fieldId] = nextValue;

      if (!syncDom) {
        continue;
      }

      const panel = formsRoot.querySelector(`[data-format-panel="${format.id}"]`);
      const input = panel?.querySelector(`#${format.id}-${fieldId}`);
      const outputElement = panel?.querySelector(`[data-output="${format.id}"]`);

      if (input) {
        input.value = nextValue;
      }

      if (panel) {
        setFieldError(panel, fieldId, "");
      }

      if (outputElement) {
        refreshOutput(format, outputElement);
      }
    }

    saveState();
  },
};

const tabList = document.getElementById("tab-list");
const formsRoot = document.getElementById("forms-root");
const defaultNameInput = document.getElementById("default-name-input");
const defaultNameSaveButton = document.getElementById("default-name-save");
const defaultNameClearButton = document.getElementById("default-name-clear");
const defaultNameFeedback = document.getElementById("default-name-feedback");

let state = loadState();
let defaultName = defaultNameManager.load();
defaultNameManager.apply(defaultName);

renderTabs();
renderPanels();
bindDefaultNameControls();
syncActiveView();

function bindDefaultNameControls() {
  defaultNameInput.value = defaultName;

  defaultNameSaveButton.addEventListener("click", () => {
    const nextDefaultName = normalizeValue(defaultNameInput.value);
    if (!nextDefaultName) {
      showTimedMessage(defaultNameFeedback, "יש להזין שם לפני שמירה.");
      defaultNameInput.focus();
      return;
    }

    defaultName = defaultNameManager.save(nextDefaultName);
    defaultNameInput.value = defaultName;
    defaultNameManager.apply(defaultName, { syncDom: true });
    showTimedMessage(defaultNameFeedback, "השם הקבוע נשמר");
  });

  defaultNameClearButton.addEventListener("click", () => {
    defaultName = defaultNameManager.save("");
    defaultNameInput.value = "";
    defaultNameManager.apply(defaultName, { syncDom: true, restorePersisted: true });
    showTimedMessage(defaultNameFeedback, "השם הקבוע נמחק");
  });
}

function loadState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
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
        normalizedState.values[format.id][field.id] = String(savedValues[field.id] || "");
      }
    }

    return normalizedState;
  } catch (error) {
    return cloneDefaultState();
  }
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
              ${format.fields
                .map(
                  (field) => `
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
                  `,
                )
                .join("")}
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
    const panel = formsRoot.querySelector(`[data-format-panel="${format.id}"]`);
    const form = panel.querySelector(`[data-format-form="${format.id}"]`);
    const outputElement = panel.querySelector(`[data-output="${format.id}"]`);
    const copyStateElement = panel.querySelector(`[data-copy-state="${format.id}"]`);

    for (const field of format.fields) {
      const input = form.elements.namedItem(field.id);
      input.addEventListener("input", () => {
        updateFieldValue(format.id, field.id, input.value);
        setFieldError(panel, field.id, "");
        refreshOutput(format, outputElement);
      });

      input.addEventListener("blur", () => {
        validateField(panel, field, input.value);
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
      .addEventListener("click", () => clearFormatFields(format, panel, outputElement));

    panel
      .querySelector(`[data-reset-button="${format.id}"]`)
      .addEventListener("click", () => handleReset(format, panel, outputElement, copyStateElement));

    refreshOutput(format, outputElement);
  }
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
  outputElement.textContent = format.buildOutput(getNormalizedValues(format.id));
}

function getNormalizedValues(formatId) {
  const currentValues = state.values[formatId];
  return Object.fromEntries(
    Object.entries(currentValues).map(([key, value]) => [key, value.trim()]),
  );
}

function validateField(panel, field, value) {
  const message = value.trim() ? "" : "יש למלא את השדה הזה.";
  setFieldError(panel, field.id, message);
  return !message;
}

function validateForm(format, panel) {
  let isValid = true;
  for (const field of format.fields) {
    const input = panel.querySelector(`#${format.id}-${field.id}`);
    const fieldValid = validateField(panel, field, input.value);
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
    await navigator.clipboard.writeText(outputElement.textContent);
    showTimedMessage(copyStateElement, "הטקסט הועתק");
  } catch (error) {
    showTimedMessage(copyStateElement, "לא ניתן היה להעתיק. נסו שוב.");
  }
}

function handleReset(format, panel, outputElement, messageElement) {
  clearFormatFields(format, panel, outputElement);
  showTimedMessage(messageElement, "הפורמט אופס");
}

function clearFormatFields(format, panel, outputElement) {
  const form = panel.querySelector(`[data-format-form="${format.id}"]`);

  for (const field of format.fields) {
    updateFieldValue(format.id, field.id, "");
    const input = form.elements.namedItem(field.id);
    input.value = "";
    setFieldError(panel, field.id, "");
  }

  if (defaultName && format.defaultNameFieldId) {
    const defaultFieldId = format.defaultNameFieldId;
    updateFieldValue(format.id, defaultFieldId, defaultName);
    const defaultInput = form.elements.namedItem(defaultFieldId);
    defaultInput.value = defaultName;
    setFieldError(panel, defaultFieldId, "");
  }

  refreshOutput(format, outputElement);
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
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
