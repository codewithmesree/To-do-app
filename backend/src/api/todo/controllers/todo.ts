import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::todo.todo', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.badRequest('No authenticated user found');
    }
    
    // Explicitly cast to Record<string, any>
    const currentFilters = (ctx.query.filters as Record<string, any>) || {};
    
    ctx.query.filters = {
      ...currentFilters,
      user: user.id,
    };
    
    return await super.find(ctx);
  },
  
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.badRequest('No authenticated user found');
    }
    
    const requestBody = ctx.request.body as any;
    requestBody.data = {
      ...requestBody.data,
      user: user.id,
    };
    
    return await super.create(ctx);
  },
  
  async update(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.badRequest('No authenticated user found');
    }
    
    const { id } = ctx.params;
    
    const todos = await strapi.documents('api::todo.todo').findMany({
      filters: { documentId: id, user: user.id },
    });
    
    const todoList = Array.isArray(todos) ? todos : (todos ? [todos] : []);
    
    if (todoList.length === 0) {
      return ctx.unauthorized("You cannot update this todo.");
    }
    
    return await super.update(ctx);
  },
  
  async delete(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.badRequest('No authenticated user found');
    }
    
    const { id } = ctx.params;
    
    const todos = await strapi.documents('api::todo.todo').findMany({
      filters: { documentId: id, user: user.id },
    });
    
    const todoList = Array.isArray(todos) ? todos : (todos ? [todos] : []);
    
    if (todoList.length === 0) {
      return ctx.unauthorized("You cannot delete this todo.");
    }
    
    return await super.delete(ctx);
  }
}));
