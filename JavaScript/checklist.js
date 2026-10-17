// ParentPath checklist and saved resources
// Save Resource buttons work on any page that loads this file.
// The checklist and saved list only run on My ParentPath (checklist.html).
// Everything is saved in this browser only (nothing is sent anywhere).
//
// Save Resource button example:
// <button class="btn btn-outline-primary btn-sm save-resource-button" type="button" aria-pressed="false"
//     data-id="pfml" data-name="Massachusetts PFML" data-category="parental" data-url="pfml.html">
//     <i class="bi bi-bookmark" aria-hidden="true"></i> <span>Save Resource</span>
// </button>

const storageKey = 'parentPathTasks';
const savedKey = 'parentPathSaved';
const categoryNames = {
    healthcare: 'Healthcare & Health Insurance',
    benefits: 'Benefits & Financial Assistance',
    parental: 'Parental Leave & Workplace Support',
    childcare: 'Childcare & Education',
    immigrant: 'Immigrant & Language Services'
};
const defaultTasks = [
    { id: 'default1', text: 'Explore healthcare resources', category: 'healthcare', section: 'beforeBaby', done: false },
    { id: 'default2', text: 'Look into WIC nutrition programs', category: 'benefits', section: 'beforeBaby', done: false },
    { id: 'default3', text: 'Review parental leave information', category: 'parental', section: 'beforeBaby', done: false },
    { id: 'default4', text: 'Research childcare options', category: 'childcare', section: 'beforeBaby', done: false },
    { id: 'default5', text: 'Explore financial assistance programs', category: 'benefits', section: 'beforeBaby', done: false },
    { id: 'default6', text: 'Learn about newborn care resources', category: 'healthcare', section: 'beforeBaby', done: false },
    { id: 'default7', text: 'Apply for health insurance', category: 'healthcare', section: 'afterBaby', done: false },
    { id: 'default8', text: 'Attend 2-6 week checkup', category: 'healthcare', section: 'afterBaby', done: false },
    { id: 'default9', text: 'Explore childcare financial assistance', category: 'childcare', section: 'afterBaby', done: false },
    { id: 'default10', text: 'Review early education programs', category: 'childcare', section: 'afterBaby', done: false },
    { id: 'default11', text: 'Look into food assistance programs', category: 'benefits', section: 'afterBaby', done: false },
    { id: 'default12', text: 'Explore immigration and family support services', category: 'immigrant', section: 'afterBaby', done: false }
];

// Saved resources list, shared by the Save Resource buttons and My ParentPath
function getSaved() {
    try {
        const saved = JSON.parse(localStorage.getItem(savedKey));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function setSaved(saved) {
    try {
        localStorage.setItem(savedKey, JSON.stringify(saved));
    } catch (error) {
        // Storage blocked, nothing can be saved on this visit
    }
}

// Save Resource buttons
function showButtonState(button, isSaved) {
    // Skip buttons that are already correct, so updating them doesn't trigger the observer below again
    if (button.getAttribute('aria-pressed') === String(isSaved)) {
        return;
    }
    button.setAttribute('aria-pressed', isSaved);
    button.classList.toggle('active', isSaved);
    button.querySelector('i').className = isSaved ? 'bi bi-bookmark-fill' : 'bi bi-bookmark';
    button.querySelector('span').textContent = isSaved ? 'Saved' : 'Save Resource';
}

// Only allows normal page links (with or without ?query), so a saved link can never run code
function safeUrl(url) {
    try {
        const parsed = new URL(url, document.baseURI);
        if (['http:', 'https:', location.protocol].includes(parsed.protocol)) {
            return url;
        }
    } catch (error) {
        // Not a usable link
    }
    return '#';
}

// Shows Saved or Save Resource on every button, including cards added to the page later
function syncSaveButtons() {
    const savedIds = getSaved().map((item) => item.id);
    document.querySelectorAll('.save-resource-button').forEach((button) => {
        showButtonState(button, savedIds.includes(button.dataset.id));
    });
}

document.addEventListener('click', (event) => {
    const button = event.target.closest('.save-resource-button');
    if (!button) {
        return;
    }
    const saved = getSaved();
    const isSaved = saved.some((item) => item.id === button.dataset.id);

    if (isSaved) {
        setSaved(saved.filter((item) => item.id !== button.dataset.id));
    } else {
        saved.push({
            id: button.dataset.id,
            name: button.dataset.name,
            category: button.dataset.category,
            url: button.dataset.url
        });
        setSaved(saved);
    }
    syncSaveButtons();
});

// Cards added by JavaScript after the page loads (or buttons whose data-id is filled in later) get their state too
new MutationObserver(syncSaveButtons).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-id'] });
syncSaveButtons();

// Everything below only runs on My ParentPath
function startChecklist() {
    const lists = {
        beforeBaby: document.getElementById('beforeBabyTasks'),
        afterBaby: document.getElementById('afterBabyTasks')
    };
    const accordion = document.getElementById('checklistAccordion');
    const savedList = document.getElementById('savedList');
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');
    const progressTrack = document.getElementById('progressTrack');
    const addTaskButton = document.getElementById('addTaskButton');
    const downloadTextButton = document.getElementById('downloadTextButton');
    const printButton = document.getElementById('printButton');
    const taskForm = document.getElementById('taskForm');
    const taskText = document.getElementById('taskText');
    const taskCategory = document.getElementById('taskCategory');
    const taskSection = document.getElementById('taskSection');
    const taskModalTitle = document.getElementById('taskModalTitle');
    const taskModalElement = document.getElementById('taskModal');
    const taskModal = new bootstrap.Modal(taskModalElement);

    let tasks = loadTasks();
    let editingId = null;

    function loadTasks() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey));
            if (Array.isArray(saved)) {
                return saved;
            }
        } catch (error) {
            // Nothing saved yet or storage blocked
        }
        return defaultTasks.map((task) => ({ ...task }));
    }

    function saveTasks() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(tasks));
        } catch (error) {
            // Storage blocked, the checklist still works for this visit
        }
    }

    // Keeps typed text from being read as HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function taskHtml(task) {
        return `
            <li class="list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="task-${task.id}" data-id="${task.id}" ${task.done ? 'checked' : ''}>
                    <label class="form-check-label" for="task-${task.id}">${escapeHtml(task.text)}</label>
                </div>
                <div class="task-actions d-flex align-items-center gap-2">
                    <span class="badge badge-${task.category}">${escapeHtml(categoryNames[task.category])}</span>
                    <div class="dropdown d-print-none">
                        <button class="btn btn-sm btn-link text-muted" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Task options for ${escapeHtml(task.text)}">
                            <i class="bi bi-three-dots-vertical" aria-hidden="true"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><button class="dropdown-item" type="button" data-action="edit" data-id="${task.id}">Edit</button></li>
                            <li><button class="dropdown-item" type="button" data-action="remove" data-id="${task.id}">Remove</button></li>
                        </ul>
                    </div>
                </div>
            </li>`;
    }

    function renderTasks() {
        Object.keys(lists).forEach((section) => {
            const sectionTasks = tasks.filter((task) => task.section === section);
            lists[section].innerHTML = sectionTasks.length
                ? sectionTasks.map(taskHtml).join('')
                : '<li class="list-group-item text-body-secondary">No tasks here yet. Use Add Checklist Item to add one.</li>';
        });
        updateProgress();
    }

    function updateProgress() {
        const total = tasks.length;
        const done = tasks.filter((task) => task.done).length;
        const percent = total === 0 ? 0 : Math.round((done / total) * 100);

        progressText.textContent = `${done} of ${total} tasks completed`;
        progressBar.style.width = `${percent}%`;
        progressBar.textContent = `${percent}%`;
        progressTrack.setAttribute('aria-valuenow', percent);
    }

    // Check or uncheck a task
    accordion.addEventListener('change', (event) => {
        const box = event.target.closest('.form-check-input');
        if (!box) {
            return;
        }
        const task = tasks.find((item) => item.id === box.dataset.id);
        task.done = box.checked;
        saveTasks();
        updateProgress();
    });

    // Edit or remove a task from its menu
    accordion.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) {
            return;
        }
        const task = tasks.find((item) => item.id === button.dataset.id);

        if (button.dataset.action === 'remove') {
            tasks = tasks.filter((item) => item.id !== task.id);
            saveTasks();
            renderTasks();
        } else {
            openModal(task);
        }
    });

    // Opens the window empty to add a task, or filled in to edit one
    function openModal(task) {
        editingId = task ? task.id : null;
        taskModalTitle.textContent = task ? 'Edit Checklist Item' : 'Add Checklist Item';
        taskText.value = task ? task.text : '';
        taskCategory.value = task ? task.category : 'healthcare';
        taskSection.value = task ? task.section : 'beforeBaby';
        taskModal.show();
    }

    // Builds a plain text copy of the checklist and saves it to the user's device
    function buildChecklistText() {
        const done = tasks.filter((task) => task.done).length;
        const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const sections = [['beforeBaby', 'BEFORE BABY'], ['afterBaby', 'AFTER BABY']];
        const lines = ['MY PARENTPATH CHECKLIST', `Saved on ${today}`, '', `Progress: ${done} of ${tasks.length} tasks completed (${percent}%)`];

        sections.forEach(([section, title]) => {
            lines.push('', title);
            const sectionTasks = tasks.filter((task) => task.section === section);
            if (sectionTasks.length === 0) {
                lines.push('(no tasks)');
            }
            sectionTasks.forEach((task) => {
                lines.push(`[${task.done ? 'x' : ' '}] ${task.text} (${categoryNames[task.category]})`);
            });
        });

        const saved = getSaved();
        lines.push('', 'SAVED RESOURCES');
        if (saved.length === 0) {
            lines.push('(none saved)');
        }
        saved.forEach((item) => {
            const label = categoryNames[item.category] ? ` (${categoryNames[item.category]})` : '';
            // Links are written out in full so they still work outside the website
            const url = safeUrl(item.url);
            const address = url === '#' ? '' : new URL(url, document.baseURI).href;
            const link = /^https?:/i.test(address) ? ` - ${address}` : '';
            lines.push(`- ${item.name}${label}${link}`);
        });

        lines.push('', 'ParentPath is not an official government website.', 'Always check program details with the official source.');
        return lines.join('\r\n');
    }

    downloadTextButton.addEventListener('click', () => {
        const file = new Blob([buildChecklistText()], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = 'my-parentpath-checklist.txt';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
    });

    // Print dialog also lets the user choose Save as PDF
    printButton.addEventListener('click', () => {
        window.print();
    });

    addTaskButton.addEventListener('click', () => {
        openModal(null);
    });

    taskModalElement.addEventListener('shown.bs.modal', () => {
        taskText.focus();
    });

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const text = taskText.value.trim();
        if (text === '') {
            return;
        }

        if (editingId) {
            const task = tasks.find((item) => item.id === editingId);
            task.text = text;
            task.category = taskCategory.value;
            task.section = taskSection.value;
        } else {
            tasks.push({
                id: `custom${Date.now()}`,
                text: text,
                category: taskCategory.value,
                section: taskSection.value,
                done: false
            });
        }
        saveTasks();
        renderTasks();
        taskModal.hide();
    });

    // Saved resources (added with the Save Resource buttons on other pages)
    function renderSaved() {
        const saved = getSaved();
        if (saved.length === 0) {
            savedList.innerHTML = '<p class="saved-empty mb-0">No saved resources yet. Browse <a href="find-services.html">Find Services</a> and use Save Resource to bookmark them here.</p>';
            return;
        }
        savedList.innerHTML = saved.map((item) => `
            <div class="list-group-item d-flex justify-content-between align-items-center gap-2 px-0 py-3">
                <a class="saved-link text-decoration-none flex-grow-1" href="${escapeHtml(safeUrl(item.url))}">
                    <span class="d-block fw-semibold mb-1">${escapeHtml(item.name)}</span>
                    ${categoryNames[item.category] ? `<span class="badge badge-${item.category}">${escapeHtml(categoryNames[item.category])}</span>` : ''}
                </a>
                <button class="btn btn-sm btn-link text-muted d-print-none" type="button" data-remove-saved="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.name)} from saved resources">
                    <i class="bi bi-x-lg" aria-hidden="true"></i>
                </button>
            </div>`).join('');
    }

    savedList.addEventListener('click', (event) => {
        const button = event.target.closest('[data-remove-saved]');
        if (!button) {
            return;
        }
        setSaved(getSaved().filter((item) => item.id !== button.dataset.removeSaved));
        renderSaved();
    });

    // Updates the list if a resource was saved in another tab
    window.addEventListener('storage', renderSaved);

    renderTasks();
    renderSaved();
}

if (document.getElementById('checklistAccordion')) {
    startChecklist();
}