"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::todo.todo', ({ strapi }) => ({
    async find(ctx) {
        const user = ctx.state.user;
        if (!user)
            return ctx.badRequest('No authenticated user found');
        const todos = await strapi.documents('api::todo.todo').findMany({
            filters: { user: user.id },
            sort: ctx.query.sort || 'createdAt:desc',
            populate: ['user'], // explicitly populate to ensure relation is fetched if needed
        });
        return { data: todos, meta: {} };
    },
    async create(ctx) {
        const user = ctx.state.user;
        if (!user)
            return ctx.badRequest('No authenticated user found');
        const requestBody = ctx.request.body;
        const todo = await strapi.documents('api::todo.todo').create({
            data: {
                ...requestBody.data,
                user: user.id,
            },
        });
        return { data: todo };
    },
    async update(ctx) {
        const user = ctx.state.user;
        if (!user)
            return ctx.badRequest('No authenticated user found');
        const { id } = ctx.params;
        const todos = await strapi.documents('api::todo.todo').findMany({
            filters: { documentId: id, user: user.id },
        });
        const todoList = Array.isArray(todos) ? todos : (todos ? [todos] : []);
        if (todoList.length === 0)
            return ctx.unauthorized("You cannot update this todo.");
        const requestBody = ctx.request.body;
        const updatedTodo = await strapi.documents('api::todo.todo').update({
            documentId: id,
            data: requestBody.data,
        });
        return { data: updatedTodo };
    },
    async delete(ctx) {
        const user = ctx.state.user;
        if (!user)
            return ctx.badRequest('No authenticated user found');
        const { id } = ctx.params;
        const todos = await strapi.documents('api::todo.todo').findMany({
            filters: { documentId: id, user: user.id },
        });
        const todoList = Array.isArray(todos) ? todos : (todos ? [todos] : []);
        if (todoList.length === 0)
            return ctx.unauthorized("You cannot delete this todo.");
        await strapi.documents('api::todo.todo').delete({
            documentId: id,
        });
        return { data: { documentId: id } };
    }
}));
