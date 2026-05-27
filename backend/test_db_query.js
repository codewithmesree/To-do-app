const strapi = require('@strapi/strapi');

async function test() {
  const app = await strapi().load();
  
  // Find a user
  const user = await app.db.query('plugin::users-permissions.user').findOne({});
  console.log("User:", user);
  
  if (user) {
    const todo = await app.db.query('api::todo.todo').create({
      data: {
        title: "DB Query Task",
        isCompleted: false,
        user: user.id
      }
    });
    console.log("Created Todo via DB Query:", todo);

    const fetched = await app.db.query('api::todo.todo').findMany({
      where: { user: user.id }
    });
    console.log("Fetched via DB Query:", fetched);
  }
  
  process.exit(0);
}

test();
