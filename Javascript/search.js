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

// Append location filters to the URL if provided
  if (governorate) {
    url += `&governorate=${encodeURIComponent(governorate)}`;
  }
  if (district) {
    url += `&district=${encodeURIComponent(district)}`;
  }
    fetch(url)
        
            .then(res => res.text()) // Get raw text first
            .then(raw => {
              // Remove any non-JSON prefix (like console messages)
              const jsonStart = raw.indexOf('{');
              const jsonData = JSON.parse(raw.slice(jsonStart));
        
              const results = jsonData.data;
        
              resultsContainer.innerHTML = '';

              if (!Array.isArray(results) || results.length === 0) {
                resultsContainer.innerHTML = '<p>No results found.</p>';
                return;
              }

            results.forEach(item => {
                const card = document.createElement('div');
                card.className = 'medicine-card';
                card.innerHTML = `
            <h2>${item.name} ${item.dosage}</h2>
            <ul class="location-list">
              ${item.locations.map(loc => `
                <li>Available at: ${loc.name}, ${loc.village}, ${loc.district}</li>
              `).join('')}
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