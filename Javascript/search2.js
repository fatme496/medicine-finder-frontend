document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const medicine = document.getElementById('medicineInput').value.trim();
    const governorate = document.getElementById('governorateSelect').value;
    const district = document.getElementById('districtSelect').value;
    const resultsContainer = document.getElementById('resultsContainer');
  
    if (!medicine) {
      alert("Please enter a medicine name.");
      return;
    }
  
    let url = `http://localhost/medicine-finder-backend/routes/stockRoutes.php?action=searchGrouped&name=${encodeURIComponent(medicine)}`;
    if (governorate) url += `&governorate=${encodeURIComponent(governorate)}`;
    if (district) url += `&district=${encodeURIComponent(district)}`;
  
    fetch(url)
      .then(res => res.text())
      .then(raw => {
        const jsonStart = raw.indexOf('{');
        const jsonData = JSON.parse(raw.slice(jsonStart));
        const results = jsonData.data;
  
        resultsContainer.innerHTML = '';
  
        if (!Array.isArray(results) || results.length === 0) {
          resultsContainer.innerHTML = '<p>No results found.</p>';
          return;
        }
  
        // Group by location (village + district + name)
        const locationMap = {};
  
        results.forEach(item => {
          item.locations.forEach(loc => {
            const key = `${loc.village}||${loc.district}||${loc.name}`;
            if (!locationMap[key]) {
              locationMap[key] = [];
            }
            locationMap[key].push({
              name: item.name,
              dosage: item.dosage
            });
          });
        });
  
        // Render grouped location cards
        Object.entries(locationMap).forEach(([key, medicines]) => {
          const [village, district, name] = key.split('||');
          const card = document.createElement('div');
          card.className = 'location-card';
          card.innerHTML = `
            <h3>${village}, ${district} (${name})</h3>
            <ul class="medicine-list">
              ${medicines.map(m => `<li><strong>${m.name}</strong> - ${m.dosage}</li>`).join('')}
            </ul>
          `;
          resultsContainer.appendChild(card);
        });
      })
      .catch(error => {
        console.error("Fetch error:", error);
        resultsContainer.innerHTML = `<p>Error retrieving data: ${error.message}</p>`;
      });
  });  