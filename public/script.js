document.addEventListener('DOMContentLoaded', () => {
  const workoutForm = document.getElementById('workout-form');
  const titleInput = document.getElementById('title');
  const typeSelect = document.getElementById('type');
  const durationInput = document.getElementById('duration');
  const dateInput = document.getElementById('date');
  const filterSelect = document.getElementById('filter-type');
  const workoutList = document.getElementById('workout-list');

  let allWorkouts = [];

  // โหลดรายการเมื่อเปิดหน้าเว็บ
  fetchWorkouts();

  async function fetchWorkouts() {
    try {
      const res = await fetch('/api/workouts');
      allWorkouts = await res.json();
      renderWorkouts(allWorkouts);
    } catch (err) {
      console.error('Error fetching workouts:', err);
    }
  }

  function renderWorkouts(workouts) {
    if (!workoutList) return;
    workoutList.innerHTML = '';

    if (!workouts || workouts.length === 0) {
      workoutList.innerHTML = '<p style="color: #666; padding: 10px 0;">ยังไม่มีรายการออกกำลังกาย</p>';
      return;
    }

    workouts.forEach((item) => {
      const card = document.createElement('div');
      card.style.cssText = 'border-bottom: 1px solid #eee; padding: 12px 0; display: flex; justify-content: space-between; align-items: center;';
      card.innerHTML = `
        <div>
          <strong style="font-size: 1.1em;">${item.title}</strong> 
          <span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 12px; font-size: 0.85em;">${item.type}</span><br>
          <small style="color: #666;">⏱️ ${item.duration} นาที | 📅 ${item.date}</small>
        </div>
        <button class="delete-btn" data-id="${item.id}" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">ลบ</button>
      `;
      workoutList.appendChild(card);
    });

    // ผูกปุ่มลบ
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        deleteWorkout(id);
      });
    });
  }

  // Event เมื่อกดปุ่มบันทึก
  if (workoutForm) {
    workoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newWorkout = {
        title: titleInput.value,
        type: typeSelect.value,
        duration: Number(durationInput.value),
        date: dateInput.value
      };

      try {
        const res = await fetch('/api/workouts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newWorkout)
        });

        if (res.ok) {
          workoutForm.reset();
          fetchWorkouts(); // โหลดรายการใหม่ทันที
        } else {
          alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
      } catch (err) {
        console.error('Error adding workout:', err);
      }
    });
  }

  // Event เมื่อเปลี่ยนตัวกรองประเภท
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      const selectedType = e.target.value;
      if (selectedType === 'ทั้งหมด' || selectedType === '') {
        renderWorkouts(allWorkouts);
      } else {
        const filtered = allWorkouts.filter(w => w.type === selectedType);
        renderWorkouts(filtered);
      }
    });
  }

  // ฟังก์ชันลบรายการ
  async function deleteWorkout(id) {
    if (!confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/workouts/${id}`, { method: 'DELETE' });
      if (res.ok) fetchWorkouts();
    } catch (err) {
      console.error('Error deleting workout:', err);
    }
  }
});