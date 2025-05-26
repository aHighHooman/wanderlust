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
    // ——— Draggable with Momentum ———
    const checklist = document.getElementById('checklist');

    let isDragging    = false;
    let dragOffsetX   = 0;
    let dragOffsetY   = 0;
    let lastPos       = { x: 0, y: 0, t: 0 };
    let velocity      = { x: 0, y: 0 };
    let animFrameId   = null;

    function getClientX(event) {
        return event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
    }

    function getClientY(event) {
        return event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
    }

    function startDrag(event) {
        cancelInertia();
        isDragging = true;
        checklist.classList.add('dragging');
        const rect = checklist.getBoundingClientRect();
        dragOffsetX = getClientX(event) - rect.left;
        dragOffsetY = getClientY(event) - rect.top;
        lastPos = { x: getClientX(event), y: getClientY(event), t: performance.now() };
    }

    function drag(event) {
        if (!isDragging) return;
        const now = performance.now();
        const dt  = now - lastPos.t || 16;
        // current velocity (px/ms)
        velocity.x = (getClientX(event) - lastPos.x) / dt;
        velocity.y = (getClientY(event) - lastPos.y) / dt;
        lastPos = { x: getClientX(event), y: getClientY(event), t: now };
        // move checklist
        moveTo(getClientX(event) - dragOffsetX, getClientY(event) - dragOffsetY);
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        checklist.classList.remove('dragging');
        startInertia();
    }

    // Mouse down: start drag
    checklist.addEventListener('mousedown', startDrag);
    checklist.addEventListener('touchstart', startDrag);

    // Mouse move: update position, compute velocity
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);

    // Mouse up: end drag & kick off inertia
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    // Clamp and apply position
    function moveTo(x, y) {
        const { innerWidth: wW, innerHeight: wH } = window;
        const rect = checklist.getBoundingClientRect();
        // clamp
        x = Math.min(Math.max(0, x), wW - rect.width);
        y = Math.min(Math.max(0, y), wH - rect.height);
        checklist.style.left = x + 'px';
        checklist.style.top  = y + 'px';
    }

    // Inertia loop
    function startInertia() {
        const friction = 0.95;       // lower = quicker stop
        const minSpeed = 0.02;       // px/ms threshold to stop
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
            let newX = rect.left + velocity.x * 16;  // assume ~60fps => 16ms/frame
            let newY = rect.top  + velocity.y * 16;
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
