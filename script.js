let state = {};
let radarChart = null;
let activeSkillId = null;
let currentFilter = 'yearly';
let currentYearFilter = new Date().getFullYear(); 
let modalStack = []; 
let expandedSkills = new Set(); 

window.onload = () => { initApp(); };

function initApp() {
    const saved = localStorage.getItem('erika_tracker_data');
    if (saved) {
        state = JSON.parse(saved);
        if(!state.profile) state.profile = {}; 
    } else {
        state = DEFAULT_STATE; 
        saveToLocal(); 
    }

    const expanded = localStorage.getItem('erika_expanded_skills');
    if(expanded) expandedSkills = new Set(JSON.parse(expanded));

    if (state.settings && state.settings.sidebarCollapsed) {
        document.getElementById('sidebar').classList.add('collapsed');
    }

    updateLogo();
    renderYearSelector();
    renderDashboard();
    renderSkillsManageList();
    syncProfileUI();
    showPage('dashboard');
}

function updateLogo() {
    const txt = (state.profile && state.profile.nickname) ? state.profile.nickname : "GROWTH";
    document.getElementById('logo-text-mobile').innerText = txt;
    document.getElementById('logo-text-desktop').innerText = txt;
}

function renderYearSelector() {
    const select = document.getElementById('dashboardYearSelect');
    select.innerHTML = '';
    const years = new Set([new Date().getFullYear()]); 
    state.skills.forEach(s => {
        if(s.deadline) years.add(new Date(s.deadline).getFullYear());
    });
    const sortedYears = Array.from(years).sort((a,b) => a - b);
    sortedYears.forEach(y => {
        const opt = document.createElement('option');
        opt.value = y;
        opt.innerText = y;
        if(y === currentYearFilter) opt.selected = true;
        select.appendChild(opt);
    });
}

function handleYearChange() {
    currentYearFilter = parseInt(document.getElementById('dashboardYearSelect').value);
    renderDashboard();
}

function resetToDefault() {
    if(confirm("Are you sure? This will delete all progress and reset to default.")) {
        localStorage.removeItem('erika_tracker_data');
        localStorage.removeItem('erika_expanded_skills');
        location.reload(); 
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page-view').forEach(p => p.style.display = 'none');
    const page = document.getElementById(pageId);
    page.style.display = 'flex'; 
    page.style.flexDirection = 'column';
    page.style.height = '100%';
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active');
    if (window.innerWidth <= 768) toggleMobileSidebar(); 
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    state.settings = state.settings || {};
    state.settings.sidebarCollapsed = sidebar.classList.contains('collapsed');
    saveToLocal();
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
}

function saveToLocal() { localStorage.setItem('erika_tracker_data', JSON.stringify(state)); }

function exportData() {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Growth_Data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function importData(event) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.skills) {
                state = imported;
                saveToLocal();
                location.reload();
            }
        } catch (err) { alert("Invalid Tracker Data File"); }
    };
    reader.readAsText(event.target.files[0]);
}

function syncProfileUI() {
    if(state.profile) {
        document.getElementById('prof-nickname').value = state.profile.nickname || "";
        document.getElementById('prof-name').value = state.profile.name || "";
        document.getElementById('prof-age').value = state.profile.age || "";
        document.getElementById('prof-bday').value = state.profile.birthday || "";
    }
}

function saveProfile() {
    if(!state.profile) state.profile = {};
    state.profile.nickname = document.getElementById('prof-nickname').value;
    state.profile.name = document.getElementById('prof-name').value;
    state.profile.age = document.getElementById('prof-age').value;
    state.profile.birthday = document.getElementById('prof-bday').value;
    saveToLocal();
    updateLogo();
    alert("Profile Updated Successfully!");
}

function setFilter(filterType) {
    currentFilter = filterType;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === filterType);
    });
    renderDashboard();
}

function getFilteredSkills() {
    const now = new Date();
    return state.skills.filter(skill => {
        const deadline = new Date(skill.deadline);
        if (deadline.getFullYear() !== currentYearFilter) return false;
        if (currentFilter === 'monthly') return deadline.getMonth() === now.getMonth();
        if (currentFilter === 'weekly') {
            const nextWeek = new Date();
            nextWeek.setDate(now.getDate() + 7);
            return deadline <= nextWeek && deadline >= now;
        }
        return true; 
    });
}

function renderDashboard() {
    renderRadar();
    renderTaskList();
    updateMotivation();
}

function formatLabelForChart(str, isMobile) {
    if (isMobile) {
        let short = str.replace(/\(.*\)/, '').trim();
        if (short.length > 6) return short.substring(0, 4) + "..";
        return short;
    }
    if(str.includes('(')) return str.split('(').map((part, index) => index > 0 ? '(' + part : part.trim());
    return str;
}

function renderRadar() {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const filtered = getFilteredSkills();
    
    // STRICT FILTER: Only show Top Level (Parents) on Radar
    const displaySkills = filtered.filter(s => s.parentId === null);
    
    const isMobile = window.innerWidth <= 768;
    const labels = displaySkills.map(s => formatLabelForChart(s.name, isMobile));
    const values = displaySkills.map(s => calculateProgress(s.id));

    if (radarChart) radarChart.destroy();
    
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: `Status (${currentFilter}) - ${currentYearFilter}`,
                data: values,
                backgroundColor: 'rgba(77, 171, 255, 0.2)',
                borderColor: '#4DABFF',
                pointBackgroundColor: '#4DABFF',
                borderWidth: 3
            }, {
                label: 'Goal',
                data: displaySkills.map(() => 100),
                borderColor: 'rgba(51, 60, 78, 0.2)',
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            layout: { padding: isMobile ? 0 : 20 },
            scales: { 
                r: { 
                    beginAtZero: true, max: 100, 
                    pointLabels: { size: isMobile ? 10 : 12 },
                    ticks: { display: !isMobile }
                } 
            },
            plugins: { legend: { display: !isMobile, position: 'bottom' } }
        }
    });
}

function calculateProgress(skillId) {
    const skill = state.skills.find(s => s.id === skillId);
    if (!skill) return 0;
    const children = state.skills.filter(s => s.parentId === skillId);
    if (children.length === 0) {
        const globalLvl = state.config.levels.find(l => l.id === skill.levelId);
        if (globalLvl) return globalLvl.value;
        if (skill.milestones) {
            const custom = skill.milestones.find(m => m.id === skill.levelId);
            if (custom) return parseInt(custom.value);
        }
        return 0;
    }
    const totalProgress = children.reduce((acc, child) => acc + calculateProgress(child.id), 0);
    return Math.round(totalProgress / children.length);
}

function renderTaskList() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    const sorted = getFilteredSkills().sort((a,b) => new Date(a.deadline) - new Date(b.deadline));

    // STRICT FILTER: Only show PARENT skills in the Milestones Table
    const parentsOnly = sorted.filter(s => s.parentId === null);

    if (parentsOnly.length === 0) {
        list.innerHTML = `<p style="color:#94A3B8; text-align:center; padding-top:20px;">No milestones found for ${currentYearFilter}.</p>`;
        return;
    }

    parentsOnly.forEach(skill => {
        let label = "Unknown";
        const progressVal = calculateProgress(skill.id);
        const globalLvl = state.config.levels.find(l => l.value === progressVal);
        if(globalLvl) label = globalLvl.label;
        else label = `${progressVal}% Completed`;

        const div = document.createElement('div');
        div.className = 'task-item'; 
        div.innerHTML = `
            <div class="task-text-group">
                <div class="task-name">${skill.name}</div>
                <div style="font-size:0.8rem; color:#64748B;">Status: ${label}</div>
                ${skill.note ? `<div style="font-size:0.75rem; color:#4DABFF; margin-top:2px;">"${skill.note}"</div>` : ''}
            </div>
            <button class="filter-btn" style="border-color:var(--electric); color:var(--electric); font-size:0.8rem; white-space:nowrap;" onclick="openUpdateModal(${skill.id})">Update</button>
        `;
        list.appendChild(div);
    });
}

function updateMotivation() {
    const parents = state.skills.filter(s => !s.parentId);
    if (parents.length === 0) return;
    const total = parents.reduce((acc, s) => acc + calculateProgress(s.id), 0);
    const avg = Math.round(total / parents.length);
    document.getElementById('motivation-text').innerText = `Total Growth Progress: ${avg}%`;
}

// === NEW: TOGGLE FILTER VISIBILITY ===
function toggleFilters() {
    const panel = document.getElementById('filter-panel');
    const icon = document.getElementById('filter-toggle-icon');
    
    // By default CSS has display:flex (via class), so verify if it's currently hidden
    // We check style.display because CSS class sets it to flex/block.
    // If it's visible, hide it.
    
    const isHidden = panel.style.display === 'none';
    
    if (isHidden) {
        panel.style.display = 'flex';
        icon.innerText = '▼';
    } else {
        panel.style.display = 'none';
        icon.innerText = '▶';
    }
}

// ... [Search/Filter functions] ...
function renderSkillsManageList() {
    const list = document.getElementById('skills-manage-list');
    const searchVal = document.getElementById('filterSearch').value.toLowerCase();
    const hierarchyFilter = document.getElementById('skillsFilter').value;
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    const sort = document.getElementById('skillsSort').value;

    list.innerHTML = ''; 
    let items = state.skills;

    if(searchVal) items = items.filter(s => s.name.toLowerCase().includes(searchVal));
    if(hierarchyFilter === 'parents') items = items.filter(s => s.parentId === null);
    if(hierarchyFilter === 'children') items = items.filter(s => s.parentId !== null);
    if(dateFrom) items = items.filter(s => new Date(s.startDate) >= new Date(dateFrom));
    if(dateTo) items = items.filter(s => new Date(s.deadline) <= new Date(dateTo));

    const isCustomSort = sort !== 'name_asc'; 
    if (items.length === 0) {
        list.innerHTML = '<p style="color:#888; text-align:center; padding:20px;">No skills match criteria.</p>';
        return;
    }
    const isFiltered = searchVal || dateFrom || dateTo || hierarchyFilter !== 'all' || isCustomSort;

    if (isFiltered) {
        let sortedItems = [...items].sort((a,b) => {
            if(sort === 'deadline_asc') return new Date(a.deadline) - new Date(b.deadline);
            if(sort === 'deadline_desc') return new Date(b.deadline) - new Date(a.deadline);
            return a.name.localeCompare(b.name);
        });
        sortedItems.forEach(skill => list.appendChild(createSkillItem(skill, 0, false))); 
    } else {
        const parents = state.skills.filter(s => !s.parentId).sort((a,b)=>a.name.localeCompare(b.name));
        parents.forEach(parent => {
            const hasChildren = state.skills.some(s => s.parentId === parent.id);
            list.appendChild(createSkillItem(parent, 0, hasChildren));
            if (hasChildren && expandedSkills.has(parent.id)) {
                renderChildrenRecursively(parent.id, 1, list);
            }
        });
    }
}

function renderChildrenRecursively(parentId, depth, container) {
    const children = state.skills.filter(s => s.parentId === parentId).sort((a,b)=>a.name.localeCompare(b.name));
    children.forEach(child => {
        const hasChildren = state.skills.some(s => s.parentId === child.id);
        container.appendChild(createSkillItem(child, depth, hasChildren));
        if (hasChildren && expandedSkills.has(child.id)) {
            renderChildrenRecursively(child.id, depth + 1, container);
        }
    });
}

function createSkillItem(skill, depth, hasChildren) {
    const div = document.createElement('div');
    const indent = depth * 20; 
    const borderStyle = depth > 0 ? `border-left: 2px solid #E2E8F0; margin-left: ${indent}px;` : '';
    div.className = 'task-item'; 
    div.style.cssText = `${borderStyle} padding-left: 10px;`; 
    
    const toggleIcon = hasChildren ? (expandedSkills.has(skill.id) ? '▼' : '▶') : '';
    const toggleBtn = hasChildren 
        ? `<button class="btn-expand" onclick="toggleChildren(${skill.id})">${toggleIcon}</button>` 
        : `<span style="width:20px; display:inline-block; margin-right:5px;"></span>`; 

    const weight = depth === 0 ? '600' : '400';
    div.innerHTML = `
        <div class="task-text-group" style="flex-direction:row;">
            ${toggleBtn}
            <div style="display:flex; flex-direction:column; min-width:0;">
                <div class="task-name" style="font-weight:${weight}; color:#333">${skill.name}</div>
                <div style="font-size: 0.75rem; color: #94A3B8;">Due: ${skill.deadline}</div>
            </div>
        </div>
        <div class="action-group">
            <button class="btn-edit" onclick="openEditSkillModal(${skill.id})">Edit</button>
            <button class="btn-delete" onclick="deleteSkill(${skill.id})">Del</button>
        </div>
    `;
    return div;
}

function toggleChildren(id) {
    if (expandedSkills.has(id)) expandedSkills.delete(id);
    else expandedSkills.add(id);
    localStorage.setItem('erika_expanded_skills', JSON.stringify([...expandedSkills]));
    renderSkillsManageList();
}

function addMilestoneRow(val='', label='') {
    const container = document.getElementById('milestone-container');
    const div = document.createElement('div');
    div.className = 'milestone-row';
    div.innerHTML = `<input type="number" class="ms-val" value="${val}"><input type="text" class="ms-label" value="${label}"><button class="btn-remove-row" onclick="this.parentElement.remove()">×</button>`;
    container.appendChild(div);
}

function openAddSkillModal() { 
    modalStack=[]; updateBackButton();
    document.getElementById('entryModalTitle').innerText="Add New Skill";
    document.getElementById('skill-id-hidden').value="";
    document.getElementById('skill-name-input').value="";
    document.getElementById('skill-deadline-input').value="";
    document.getElementById('milestone-container').innerHTML='';
    document.getElementById('relation-tree-container').style.display='none';
    
    // Hide sub-skill button in Create mode (since no ID exists yet)
    document.getElementById('sub-skill-section').style.display='none';

    populateParentDropdown(null);
    document.getElementById('skillEntryModal').style.display='flex';
}

function openEditSkillModal(id) { 
    modalStack=[]; 
    loadModalContent(id); 
    document.getElementById('skillEntryModal').style.display='flex'; 
}

function navigateToSkill(id) { 
    const cur=document.getElementById('skill-id-hidden').value; 
    if(cur) modalStack.push(parseInt(cur)); 
    loadModalContent(id); 
}

function navigateBack() { if(modalStack.length>0) loadModalContent(modalStack.pop()); }
function updateBackButton() { document.getElementById('modal-back-btn').style.display = modalStack.length > 0 ? 'block' : 'none'; }

function loadModalContent(id) {
    const skill=state.skills.find(s=>s.id===id); if(!skill) return; updateBackButton();
    document.getElementById('entryModalTitle').innerText="Edit Skill";
    document.getElementById('skill-id-hidden').value=skill.id;
    document.getElementById('skill-name-input').value=skill.name;
    document.getElementById('skill-deadline-input').value=skill.deadline;
    
    const con=document.getElementById('milestone-container'); con.innerHTML='';
    if(skill.milestones) skill.milestones.forEach(m=>addMilestoneRow(m.value,m.label));
    
    populateParentDropdown(skill.parentId, skill.id); 
    renderRelationshipTree(skill);
    
    // Show sub-skill button in Edit mode
    document.getElementById('sub-skill-section').style.display='block';
}

// === NEW: FUNCTION TO CREATE SUB-SKILL FROM MODAL ===
function createSubSkill() {
    // 1. Save current parent data first if needed (optional)
    // 2. Get Parent ID
    const parentId = document.getElementById('skill-id-hidden').value;
    if(!parentId) return;

    // 3. Reset Modal for New Entry
    modalStack.push(parseInt(parentId)); // Save parent to stack so we can go back
    document.getElementById('entryModalTitle').innerText="Add Sub-Skill";
    document.getElementById('skill-id-hidden').value=""; // New ID will be generated
    document.getElementById('skill-name-input').value="";
    // Keep same deadline as parent by default? or empty?
    // document.getElementById('skill-deadline-input').value=""; 
    document.getElementById('milestone-container').innerHTML='';
    
    populateParentDropdown(parseInt(parentId)); // Trigger dropdown
    document.getElementById('skill-parent-input').value = parentId; // Set Parent
    
    document.getElementById('relation-tree-container').style.display='none';
    document.getElementById('sub-skill-section').style.display='none'; // Can't add child to new skill yet
    updateBackButton();
}

function renderRelationshipTree(currentSkill) { 
    const container=document.getElementById('relation-tree-list');
    const wrapper=document.getElementById('relation-tree-container');
    container.innerHTML=''; wrapper.style.display='block';
    if(currentSkill.parentId){
        const p=state.skills.find(s=>s.id===currentSkill.parentId);
        if(p) container.appendChild(createRelationNode(p,'parent'));
    }
    container.appendChild(createRelationNode(currentSkill,'current'));
    const ch=state.skills.filter(s=>s.parentId===currentSkill.id);
    ch.forEach(c=>container.appendChild(createRelationNode(c,'child')));
}

function createRelationNode(skill,type) {
    const div=document.createElement('div'); div.className=`relation-node ${type}`;
    if(type!=='current') div.onclick=()=>navigateToSkill(skill.id);
    div.innerHTML=`<div class="node-info"><span class="node-name">${skill.name}</span><span class="node-role">${type}</span></div><div class="progress-mini"><div class="progress-fill" style="width:${calculateProgress(skill.id)}%"></div></div>`;
    return div;
}

function populateParentDropdown(sel, cur) {
    const el=document.getElementById('skill-parent-input'); el.innerHTML='<option value="">None (Top Level)</option>';
    state.skills.filter(s=>s.id!==cur).forEach(s=>el.innerHTML+=`<option value="${s.id}" ${s.id===sel?'selected':''}>${s.name} (${s.deadline})</option>`);
}

function closeEntryModal() { document.getElementById('skillEntryModal').style.display='none'; }

function saveSkillData() {
    const id=document.getElementById('skill-id-hidden').value;
    const name=document.getElementById('skill-name-input').value;
    const deadline=document.getElementById('skill-deadline-input').value;
    const parentId=document.getElementById('skill-parent-input').value;
    if(!name||!deadline){alert("Name/Date required");return;}
    let milestones=[]; document.querySelectorAll('.milestone-row').forEach((r,i)=>{
        const v=r.querySelector('.ms-val').value; const l=r.querySelector('.ms-label').value;
        if(v&&l) milestones.push({id:`c_${Date.now()}_${i}`, value:parseInt(v), label:l});
    });
    if(id){
        const s=state.skills.find(x=>x.id==id);
        if(s){ s.name=name; s.deadline=deadline; s.parentId=parentId?parseInt(parentId):null; s.milestones=milestones; }
    } else {
        state.skills.push({id:Date.now(), name, levelId:"l1", startDate:new Date().toISOString().split('T')[0], deadline, parentId:parentId?parseInt(parentId):null, milestones});
    }
    saveToLocal(); renderYearSelector(); 
    if(id) loadModalContent(parseInt(id)); else closeEntryModal();
    renderSkillsManageList(); renderDashboard();
}

function deleteSkill(id) {
    if(confirm("Delete this skill and children?")){
        let ids=[id]; const find=(pid)=>{state.skills.filter(s=>s.parentId===pid).forEach(c=>{ids.push(c.id);find(c.id);})}; find(id);
        state.skills=state.skills.filter(s=>!ids.includes(s.id));
        saveToLocal(); renderSkillsManageList(); renderDashboard(); renderYearSelector();
    }
}

function openUpdateModal(id) {
    activeSkillId = id;
    const skill = state.skills.find(s => s.id === id);
    const children = state.skills.filter(s => s.parentId === id);
    
    document.getElementById('modalSkillName').innerText = skill.name;
    document.getElementById('update-note-input').value = skill.note || "";

    const container = document.getElementById('levelOptions');
    container.innerHTML = '';

    // CASE 1: SKILL HAS CHILDREN (Parent View)
    if (children.length > 0) {
        document.getElementById('update-note-input').style.display = 'none'; 
        
        const info = document.createElement('p');
        info.innerHTML = `<span style="color:#64748B; font-size:0.9rem;">This is a composite skill. Its progress is calculated from the children below. Click a sub-skill to update it.</span>`;
        container.appendChild(info);

        children.forEach(child => {
            const btn = document.createElement('div');
            btn.className = 'level-btn child-link-btn';
            
            const prog = calculateProgress(child.id);
            let label = `${prog}%`;
            const lvl = state.config.levels.find(l => l.value === prog);
            if(lvl) label = lvl.label;

            btn.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong>${child.name}</strong>
                        <div style="font-size:0.8rem; color:#64748B;">Current: ${label}</div>
                    </div>
                    <div style="background:#E6FFF9; color:#00D1A0; padding:4px 10px; border-radius:12px; font-size:0.8rem;">Update →</div>
                </div>
            `;
            btn.onclick = () => {
                closeModal();
                setTimeout(() => openUpdateModal(child.id), 100);
            };
            container.appendChild(btn);
        });

    } else {
        // CASE 2: LEAF SKILL
        document.getElementById('update-note-input').style.display = 'block';
        
        const levelsToRender = (skill.milestones && skill.milestones.length > 0) 
            ? skill.milestones.sort((a,b) => a.value - b.value) 
            : state.config.levels;

        levelsToRender.forEach(lvl => {
            const btn = document.createElement('div');
            btn.className = 'level-btn';
            if (lvl.id === skill.levelId) btn.style.borderColor = 'var(--electric)';
            btn.innerHTML = `<strong>${lvl.label}</strong> <span style="float:right">${lvl.value}%</span>`;
            btn.onclick = () => {
                skill.levelId = lvl.id;
                skill.note = document.getElementById('update-note-input').value;
                saveToLocal();
                closeModal();
                renderDashboard();
                renderSkillsManageList(); 
            };
            container.appendChild(btn);
        });
    }

    document.getElementById('updateModal').style.display = 'flex';
}

function closeModal() { document.getElementById('updateModal').style.display = 'none'; }