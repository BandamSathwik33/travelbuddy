async function test() {
  try {
    console.log('Registering test user...');
    const email = `testuser_${Date.now()}@test.com`;
    let res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email,
        password: 'password123'
      })
    });
    let data = await res.json();
    if (!res.ok) throw data;
    const token = data.token;
    console.log('Got token:', token);

    console.log('Creating trip...');
    res = await fetch('http://localhost:5000/api/trips', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        name: 'Test Trip',
        destination: 'Tirupati, India',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 1500,
        travelers: 2,
        interests: ['temples', 'culture']
      })
    });
    data = await res.json();
    if (!res.ok) throw data;
    const tripId = data.data._id;
    console.log('Got tripId:', tripId);

    console.log('Generating itinerary...');
    res = await fetch('http://localhost:5000/api/itinerary/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ tripId })
    });
    data = await res.json();
    if (!res.ok) throw data;
    
    console.log('Success! Received itinerary.');
    console.log('Days generated:', data.data.days.length);
    console.log('Sample day:', data.data.days[0].title);
  } catch (error) {
    console.error('Error testing endpoint:');
    console.error(error);
  }
}

test();
