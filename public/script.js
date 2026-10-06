document.addEventListener('DOMContentLoaded', () => {
  fetchWorkouts();

  document.getElementById('workout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const duration = document.getElementById('duration').value;
    const date = document.getElementById('date').value;

    await fetch('/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, duration: Number(duration), date })
    });

    document.getElementById('workout-form').reset();
    fetchWorkouts();
  });

  document.getElementById('filter-category').addEventListener('change', (e) => {
    fetchWorkouts(e.target.value);
  });
});

async function fetchWorkouts(filterCategory = 'all') {
  try {
    const res = await fetch('/workouts');
    const data = await res.json();
    const list = document.getElementById('workout-list');
    list.innerHTML = '';

    const filtered = filterCategory === 'all' 
      ? data 
      : data.filter(item => item.category === filterCategory);

    filtered.forEach(item => {
      const div = document.createElement('div');
      div.className = 'workout-item';
      div.innerHTML = `
        <div>
          <strong>${item.title}</strong> (${item.category}) - ${item.duration} นาที<br>
          <small class="text-muted">วันที่: ${item.date ? item.date.split('T')[0] : ''}</small>
        </div>
        <button class="btn-danger" onclick="deleteWorkout('${item._id || item.id}')">ลบ</button>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.error('Error fetching workouts:', err);
  }
}

async function deleteWorkout(id) {
  await fetch(`/workouts/${id}`, { method: 'DELETE' });
  fetchWorkouts(document.getElementById('filter-category').value);
}