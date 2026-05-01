const state = {
    me: null,
    config: null,
    lookups: { channels: [], roles: [] },
    dirty: false,
    activeTab: "welcome"
};

const els = {
    alert: document.getElementById("alert"),
    loginView: document.getElementById("loginView"),
    dashboardView: document.getElementById("dashboardView"),
    authMessage: document.getElementById("authMessage"),
    loginButton: document.getElementById("loginButton"),
    saveButton: document.getElementById("saveButton"),
    syncButton: document.getElementById("syncButton"),
    saveState: document.getElementById("saveState"),
    guildName: document.getElementById("guildName"),
    botStatus: document.getElementById("botStatus"),
    signedInUser: document.getElementById("signedInUser"),
    lastSaved: document.getElementById("lastSaved"),
    welcomeEnabled: document.getElementById("welcomeEnabled"),
    welcomeChannel: document.getElementById("welcomeChannel"),
    welcomeMessage: document.getElementById("welcomeMessage"),
    leaveEnabled: document.getElementById("leaveEnabled"),
    leaveChannel: document.getElementById("leaveChannel"),
    leaveMessage: document.getElementById("leaveMessage"),
    reactionRoleList: document.getElementById("reactionRoleList"),
    addReactionGroup: document.getElementById("addReactionGroup"),
    logoutButton: document.getElementById("logoutButton"),
    accessUser: document.getElementById("accessUser"),
    oauthStatus: document.getElementById("oauthStatus"),
    accessBot: document.getElementById("accessBot")
};

function setAlert(message, type = "") {
    els.alert.textContent = message || "";
    els.alert.className = `alert ${type}`.trim();
    els.alert.classList.toggle("hidden", !message);
}

function setBusy(isBusy) {
    els.saveButton.disabled = isBusy;
    els.syncButton.disabled = isBusy;
}

function setDirty(isDirty = true) {
    state.dirty = isDirty;
    els.saveState.textContent = isDirty ? "Unsaved" : "Saved";
    els.saveState.classList.toggle("dirty", isDirty);
    els.saveState.classList.toggle("saved", !isDirty);
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function displayName(user) {
    if (!user) return "Unknown";
    return user.globalName || user.username || user.id || "Unknown";
}

function formatDate(value) {
    if (!value) return "Never";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown";
    return date.toLocaleString();
}

async function api(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    const request = { credentials: "same-origin", ...options, headers };

    if (request.body && typeof request.body !== "string") {
        headers["Content-Type"] = "application/json";
        request.body = JSON.stringify(request.body);
    }

    const response = await fetch(path, request);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (response.status === 401) showLogin("Discord sign in required.");
        throw new Error(data.error || data.reason || `Request failed with ${response.status}`);
    }

    return data;
}

function fillSelect(select, items, selected, placeholder) {
    select.textContent = "";

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = placeholder;
    select.appendChild(empty);

    if (selected && !items.some(item => item.id === selected)) {
        const current = document.createElement("option");
        current.value = selected;
        current.textContent = `Current ID: ${selected}`;
        select.appendChild(current);
    }

    for (const item of items) {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.name;
        select.appendChild(option);
    }

    select.value = selected || "";
}

function roleById(roleId) {
    return state.lookups.roles.find(role => role.id === roleId);
}

function updateRoleSwatch(select) {
    const swatch = select.closest(".role-field-wrap")?.querySelector(".role-swatch");
    if (!swatch) return;

    const role = roleById(select.value);
    swatch.style.background = role?.color || "#d5dde1";
}

function showLogin(message) {
    els.loginView.classList.remove("hidden");
    els.dashboardView.classList.add("hidden");
    els.authMessage.textContent = message;
    els.saveButton.disabled = true;
    els.syncButton.disabled = true;
}

function showDashboard() {
    els.loginView.classList.add("hidden");
    els.dashboardView.classList.remove("hidden");
    els.saveButton.disabled = false;
    els.syncButton.disabled = false;
}

function applyMe(me) {
    state.me = me;
    const userName = displayName(me.user);
    const botReady = me.bot?.ready ? "Connected" : "Disconnected";

    els.botStatus.textContent = botReady;
    els.accessBot.textContent = botReady;
    els.signedInUser.textContent = me.authenticated ? userName : "Signed out";
    els.accessUser.textContent = me.authenticated ? userName : "Signed out";
    els.oauthStatus.textContent = me.setup?.configured ? "Configured" : "Incomplete";
}

function renderWelcome() {
    const config = state.config;
    els.welcomeEnabled.checked = Boolean(config.welcome.enabled);
    fillSelect(els.welcomeChannel, state.lookups.channels, config.welcome.channelId, "Select a channel");
    els.welcomeMessage.value = config.welcome.message || "";

    els.leaveEnabled.checked = Boolean(config.leave.enabled);
    fillSelect(els.leaveChannel, state.lookups.channels, config.leave.channelId, "Select a channel");
    els.leaveMessage.value = config.leave.message || "";
}

function createOptionRow(option, groupIndex, optionIndex) {
    const row = document.createElement("div");
    row.className = "option-row";
    row.dataset.optionIndex = String(optionIndex);
    row.innerHTML = `
        <label class="field">
            <span>Emoji</span>
            <input data-role="emoji" type="text" maxlength="128" value="${escapeHtml(option.emoji)}">
        </label>
        <label class="field role-field-wrap">
            <span>Role</span>
            <select data-role="role"></select>
            <span class="role-swatch" aria-hidden="true"></span>
        </label>
        <label class="field">
            <span>Label</span>
            <input data-role="label" type="text" maxlength="80" value="${escapeHtml(option.label)}">
        </label>
        <button class="ghost danger-text" data-action="remove-option" data-group-index="${groupIndex}" data-option-index="${optionIndex}" type="button">Remove</button>
    `;

    const roleSelect = row.querySelector('[data-role="role"]');
    fillSelect(roleSelect, state.lookups.roles, option.roleId, "Select a role");
    updateRoleSwatch(roleSelect);
    return row;
}

function renderReactionRoles() {
    const template = document.getElementById("reactionGroupTemplate");
    els.reactionRoleList.textContent = "";

    state.config.reactionRoles.forEach((group, groupIndex) => {
        const card = template.content.firstElementChild.cloneNode(true);
        card.dataset.groupIndex = String(groupIndex);
        card.dataset.groupId = group.id || "";
        card.dataset.messageId = group.messageId || "";

        card.querySelector('[data-role="enabled"]').checked = Boolean(group.enabled);
        card.querySelector('[data-role="name"]').value = group.name || "";
        card.querySelector('[data-role="message"]').value = group.message || "";
        fillSelect(card.querySelector('[data-role="channel"]'), state.lookups.channels, group.channelId, "Select a channel");

        const optionList = card.querySelector(".option-list");
        const options = group.options?.length ? group.options : [{ emoji: "", roleId: "", label: "" }];
        options.forEach((option, optionIndex) => {
            optionList.appendChild(createOptionRow(option, groupIndex, optionIndex));
        });

        els.reactionRoleList.appendChild(card);
    });
}

function renderAll() {
    const lookups = state.lookups || {};
    if (lookups.guild?.name) els.guildName.textContent = lookups.guild.name;

    renderWelcome();
    renderReactionRoles();
    els.lastSaved.textContent = formatDate(state.config.updatedAt);
    setDirty(false);
}

function readConfigFromDom() {
    const reactionRoles = [...els.reactionRoleList.querySelectorAll(".reaction-card")].map((card, groupIndex) => {
        const options = [...card.querySelectorAll(".option-row")].map(row => ({
            emoji: row.querySelector('[data-role="emoji"]').value.trim(),
            roleId: row.querySelector('[data-role="role"]').value.trim(),
            label: row.querySelector('[data-role="label"]').value.trim()
        }));

        return {
            id: card.dataset.groupId || `reaction-${Date.now()}-${groupIndex}`,
            name: card.querySelector('[data-role="name"]').value.trim(),
            enabled: card.querySelector('[data-role="enabled"]').checked,
            channelId: card.querySelector('[data-role="channel"]').value,
            messageId: card.dataset.messageId || "",
            message: card.querySelector('[data-role="message"]').value,
            options
        };
    });

    return {
        ...state.config,
        welcome: {
            enabled: els.welcomeEnabled.checked,
            channelId: els.welcomeChannel.value,
            message: els.welcomeMessage.value
        },
        leave: {
            enabled: els.leaveEnabled.checked,
            channelId: els.leaveChannel.value,
            message: els.leaveMessage.value
        },
        reactionRoles
    };
}

function summarizeSync(sync) {
    if (!sync) return "Saved.";
    if (sync.skipped) return `Saved. Sync skipped: ${sync.reason}`;
    if (sync.error) return `Saved. Sync issue: ${sync.error}`;

    const results = sync.results || [];
    const active = results.filter(item => !item.skipped).length;
    const skipped = results.filter(item => item.skipped).length;
    const reactionErrors = results.flatMap(item => item.reactionErrors || []);

    if (reactionErrors.length) return `Saved. ${active} messages synced, ${reactionErrors.length} reactions need checking.`;
    if (skipped) return `Saved. ${active} messages synced, ${skipped} skipped.`;
    return `Saved. ${active} messages synced.`;
}

async function saveConfig() {
    setBusy(true);
    setAlert("");

    try {
        const payload = readConfigFromDom();
        const data = await api("/api/dashboard/config", {
            method: "PUT",
            body: payload
        });

        state.config = data.config;
        renderAll();
        setAlert(summarizeSync(data.sync));
    } catch (error) {
        setAlert(error.message, "error");
    } finally {
        setBusy(false);
    }
}

async function syncReactionRoles() {
    if (state.dirty) {
        await saveConfig();
        return;
    }

    setBusy(true);
    setAlert("");

    try {
        const data = await api("/api/dashboard/reaction-roles/sync", { method: "POST" });
        state.config = data.config || state.config;
        renderAll();
        setAlert(summarizeSync(data));
    } catch (error) {
        setAlert(error.message, "error");
    } finally {
        setBusy(false);
    }
}

async function loadConfig() {
    const data = await api("/api/dashboard/config");
    state.config = data.config;
    state.lookups = data.lookups || { channels: [], roles: [] };
    renderAll();
    showDashboard();
}

async function loadMe() {
    const params = new URLSearchParams(window.location.search);
    const authReason = params.get("auth");
    const reasonText = {
        denied: "Your Discord account is missing the required access role.",
        setup: "Dashboard OAuth setup is incomplete on the server.",
        error: "Discord sign in failed. Try again."
    }[authReason];

    if (authReason) {
        window.history.replaceState({}, document.title, "/dashboard");
    }

    try {
        const me = await api("/api/dashboard/me");
        applyMe(me);

        if (!me.setup?.configured) {
            showLogin(`Missing server settings: ${(me.setup?.missing || []).join(", ")}`);
            return;
        }

        if (!me.authenticated) {
            showLogin(reasonText || "Only approved Discord accounts can open these controls.");
            return;
        }

        if (reasonText) setAlert(reasonText, authReason === "denied" ? "error" : "");
        await loadConfig();
    } catch (error) {
        showLogin("Dashboard is unavailable right now.");
        setAlert(error.message, "error");
    }
}

function selectTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll(".nav-tab").forEach(button => {
        button.classList.toggle("active", button.dataset.tab === tabName);
    });
    document.querySelectorAll(".settings-section").forEach(section => {
        section.classList.toggle("active", section.dataset.panel === tabName);
    });
}

function addReactionGroup() {
    state.config = readConfigFromDom();
    state.config.reactionRoles.push({
        id: `reaction-${Date.now()}`,
        name: "New reaction message",
        enabled: true,
        channelId: state.lookups.channels[0]?.id || "",
        messageId: "",
        message: "React below to choose a role.",
        options: [{ emoji: "", roleId: "", label: "" }]
    });
    renderReactionRoles();
    setDirty();
}

function handleReactionAction(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const card = button.closest(".reaction-card");
    const groupIndex = Number(card?.dataset.groupIndex);
    if (!Number.isInteger(groupIndex)) return;

    state.config = readConfigFromDom();

    if (button.dataset.action === "remove-group") {
        state.config.reactionRoles.splice(groupIndex, 1);
    }

    if (button.dataset.action === "add-option") {
        state.config.reactionRoles[groupIndex].options.push({ emoji: "", roleId: "", label: "" });
    }

    if (button.dataset.action === "remove-option") {
        const optionIndex = Number(button.dataset.optionIndex);
        if (Number.isInteger(optionIndex)) {
            state.config.reactionRoles[groupIndex].options.splice(optionIndex, 1);
        }
    }

    renderReactionRoles();
    setDirty();
}

async function logout() {
    await api("/api/dashboard/logout", { method: "POST" }).catch(() => ({}));
    window.location.href = "/dashboard";
}

document.querySelectorAll(".nav-tab").forEach(button => {
    button.addEventListener("click", () => selectTab(button.dataset.tab));
});

document.getElementById("configForm").addEventListener("input", () => setDirty());
document.getElementById("configForm").addEventListener("change", event => {
    if (event.target.matches('[data-role="role"]')) updateRoleSwatch(event.target);
    setDirty();
});

els.saveButton.addEventListener("click", saveConfig);
els.syncButton.addEventListener("click", syncReactionRoles);
els.addReactionGroup.addEventListener("click", addReactionGroup);
els.reactionRoleList.addEventListener("click", handleReactionAction);
els.logoutButton.addEventListener("click", logout);

setDirty(false);
loadMe();
