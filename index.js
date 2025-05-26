// This is Checklist JS (START)
document.addEventListener('DOMContentLoaded', () => {
    const listEl    = document.getElementById('items-list');
    const inputEl   = document.getElementById('new-item');
    const addBtn    = document.getElementById('add-btn');
    const STORAGE   = 'myChecklistItems';
  
    // Load saved items
    const saved = JSON.parse(localStorage.getItem(STORAGE) || '[]');
    saved.forEach(item => createItem(item.text, item.checked));
  
    // Save helper
    function saveAll() {
      const arr = [];
      listEl.querySelectorAll('li').forEach(li => {
        arr.push({
          text: li.querySelector('span').textContent,
          checked: li.querySelector('input').checked
        });
      });
      localStorage.setItem(STORAGE, JSON.stringify(arr));
    }
  
    // Create & append one LI
    function createItem(text, checked = false) {
      const li = document.createElement('li');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = checked;
      const span = document.createElement('span');
      span.textContent = text;
      const del = document.createElement('button');
      del.textContent = '✕';
      del.className = 'delete-btn';
  
      cb.addEventListener('change', saveAll);
      del.addEventListener('click', () => {
        li.remove();
        saveAll();
      });
  
      li.append(cb, span, del);
      listEl.appendChild(li);
    }
  
    // Add-button handler
    addBtn.addEventListener('click', () => {
      const v = inputEl.value.trim();
      if (!v) return;
      createItem(v);
      inputEl.value = '';
      saveAll();
    });
    // Enter key
    inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') addBtn.click();
    });

    const toggleBtn = document.getElementById('checklist-toggle');
    let checklistShowing = false;
    toggleBtn.addEventListener('click', () => {
        if (!checklistShowing) {
            document.getElementById('checklist').classList.add('open');
            checklistShowing = true;
        } else {
            document.getElementById('checklist').classList.remove('open');
            checklistShowing = false;
        }
    });
  

    // ——— Draggable with Momentum ———
    const checklist = document.getElementById('checklist');

    let isDragging    = false;
    let dragOffsetX   = 0;
    let dragOffsetY   = 0;
    let lastPos       = { x: 0, y: 0, t: 0 };
    let velocity      = { x: 0, y: 0 };
    let animFrameId   = null;

    // Mouse down: start drag
    checklist.addEventListener('mousedown', e => {
    cancelInertia();
    isDragging = true;
    checklist.classList.add('dragging');
    const rect = checklist.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    lastPos = { x: e.clientX, y: e.clientY, t: performance.now() };
    });

    // Mouse move: update position, compute velocity
    document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const now = performance.now();
    const dt  = now - lastPos.t || 16;
    // current velocity (px/ms)
    velocity.x = (e.clientX - lastPos.x) / dt;
    velocity.y = (e.clientY - lastPos.y) / dt;
    lastPos = { x: e.clientX, y: e.clientY, t: now };
    // move checklist
    moveTo(e.clientX - dragOffsetX, e.clientY - dragOffsetY);
    });

    // Mouse up: end drag & kick off inertia
    document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    checklist.classList.remove('dragging');
    startInertia();
    });

    // Clamp and apply position
    function moveTo(x, y) {
    const { innerWidth: wW, innerHeight: wH } = window;
    const rect = checklist.getBoundingClientRect();
    // clamp
    x = Math.min(Math.max(0, x), wW - rect.width);
    y = Math.min(Math.max(0, y), wH - rect.height);
    checklist.style.left = x + 'px';
    checklist.style.top  = y + 'px';
    }

    // Inertia loop
    function startInertia() {
    const friction = 0.95;       // lower = quicker stop
    const minSpeed = 0.02;       // px/ms threshold to stop
    function step() {
        velocity.x *= friction;
        velocity.y *= friction;
        // if too slow, stop
        if (Math.hypot(velocity.x, velocity.y) < minSpeed) {
        cancelInertia();
        return;
        }
        // compute new pos
        const rect = checklist.getBoundingClientRect();
        let newX = rect.left + velocity.x * 16;  // assume ~60fps => 16ms/frame
        let newY = rect.top  + velocity.y * 16;
        moveTo(newX, newY);
        animFrameId = requestAnimationFrame(step);
    }
    animFrameId = requestAnimationFrame(step);
    }

    function cancelInertia() {
    if (animFrameId != null) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
    }
    // This is Checklist JS (END)

    // Sidebar Code (START)
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('sidebar-close');

    openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.add('active');
    });

    document.addEventListener('click', (e) => {
        if (openBtn.contains(e.target) || !sidebar.contains(e.target)){
            sidebar.classList.remove('active');
        }
    });


    // Sidebar Code (END)

});
