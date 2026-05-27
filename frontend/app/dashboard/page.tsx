'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Calendar, Search } from 'lucide-react';

interface Todo {
  id: number;
  documentId: string;
  title: string;
  isCompleted: boolean;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
}

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await api.get('/todos?sort=createdAt:desc');
      setTodos(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const res = await api.post('/todos', {
        data: {
          title: newTodo,
          isCompleted: false,
          user: user?.id,
          dueDate: newDueDate || null,
          priority: newPriority,
        },
      });
      setTodos([res.data.data, ...todos]);
      setNewTodo('');
      setNewDueDate('');
      setNewPriority('medium');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (documentId: string, currentStatus: boolean) => {
    try {
      const res = await api.put(`/todos/${documentId}`, {
        data: {
          isCompleted: !currentStatus,
        },
      });
      setTodos(
        todos.map((t) => (t.documentId === documentId ? res.data.data : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await api.delete(`/todos/${documentId}`);
      setTodos(todos.filter((t) => t.documentId !== documentId));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed' && !todo.isCompleted) return false;
    if (filter === 'pending' && todo.isCompleted) return false;
    if (searchQuery && !todo.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center pt-8 pb-12 px-4">
      <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Your Tasks</h2>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-brand-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${f !== 'completed' ? 'border-r border-gray-200' : ''}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAdd} className="flex flex-col gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 bg-white"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-brand-primary">
              <Calendar size={18} className="text-gray-400" />
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full text-sm outline-none text-gray-700 bg-transparent"
              />
            </div>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="flex-1 bg-white rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <Button type="submit" className="sm:w-auto">
              Add Task
            </Button>
          </div>
        </form>

        {/* Task List */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading tasks...</div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {todos.length === 0 ? 'No tasks found. Add one!' : 'No tasks match your filters.'}
              </p>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.documentId}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all gap-4 ${
                    todo.isCompleted ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-brand-primary/30 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => handleToggle(todo.documentId, todo.isCompleted)}
                      className="w-5 h-5 mt-1 sm:mt-0 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer transition-colors"
                    />
                    <div className="flex flex-col">
                      <span
                        className={`text-lg transition-all ${
                          todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-800 font-medium'
                        }`}
                      >
                        {todo.title}
                      </span>
                      {todo.dueDate && (
                        <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-9 sm:pl-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getPriorityColor(todo.priority)}`}>
                      {todo.priority?.toUpperCase() || 'MEDIUM'}
                    </span>
                    <Button
                      onClick={() => handleDelete(todo.documentId)}
                      className="px-3 py-1.5 !bg-red-50 !text-red-500 hover:!bg-red-100 shadow-none border-0 transition-colors h-auto"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
