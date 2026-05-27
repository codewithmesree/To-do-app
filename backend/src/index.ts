import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Automatically grant find, create, update, delete permissions on the Todo API
    // to the "Authenticated" role.
    try {
      const authenticatedRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'authenticated' } });

      if (authenticatedRole) {
        const permissionsToGrant = ['find', 'create', 'update', 'delete'];

        for (const action of permissionsToGrant) {
          const actionString = `api::todo.todo.${action}`;

          const existingPermission = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({
              where: {
                action: actionString,
                role: authenticatedRole.id,
              },
            });

          if (!existingPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action: actionString,
                role: authenticatedRole.id,
              },
            });
          }
        }
      }
    } catch (error) {
      console.error('Error setting up permissions:', error);
    }
  },
};
