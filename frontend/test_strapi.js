const axios = require('axios');

async function test() {
  let ready = false;
  
  console.log("Waiting for Strapi to start...");
  for (let i = 0; i < 30; i++) {
    try {
      await axios.get('http://localhost:1337/_health');
      ready = true;
      break;
    } catch(e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  if (!ready) {
    console.log("Strapi not ready.");
    return;
  }
  console.log("Strapi is ready. Testing...");

  try {
    const registerRes = await axios.post('http://localhost:1337/api/auth/local/register', {
      username: 'testuser_' + Date.now(),
      email: `test_${Date.now()}@test.com`,
      password: 'Password123!',
    });
    const jwt = registerRes.data.jwt;

    const headers = { Authorization: `Bearer ${jwt}` };

    const createRes = await axios.post('http://localhost:1337/api/todos', {
      data: { title: "Test task", isCompleted: false }
    }, { headers });
    
    const todo = createRes.data.data;
    console.log("Created Todo:", todo);

    // Get all todos
    const getRes = await axios.get('http://localhost:1337/api/todos', { headers });
    console.log("Get Todos length:", getRes.data.data.length);

    // Update
    try {
      const updateRes = await axios.put(`http://localhost:1337/api/todos/${todo.documentId}`, {
        data: { isCompleted: true }
      }, { headers });
      console.log("Updated Todo completed:", updateRes.data.data.isCompleted);
    } catch (e) {
      console.log("Update Failed:", e.response?.status, e.response?.data);
    }

  } catch (err) {
    console.error("ERROR DATA:", JSON.stringify(err.response?.data, null, 2));
  }
}

test();
