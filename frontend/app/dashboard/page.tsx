'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2 } from 'lucide-react';

interface Todo {
  id: number;
  documentId: string;
  title: string;
  isCompleted: boolean;
}

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      // Strapi v5 uses documentId for most operations instead of ID, but both are often returned.
      // We will filter by user if Custom User Filtering is enabled.
      // Assuming Custom User Filtering overrides the controller to automatically filter.
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
      // Pass the user to connect it, though custom controller might do it automatically.
      const res = await api.post('/todos', {
        data: {
          title: newTodo,
          isCompleted: false,
          user: user?.id,
        },
      });
      setTodos([res.data.data, ...todos]);
      setNewTodo('');
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

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-4xl font-black mb-8 uppercase">Your Tasks</h2>

        <form onSubmit={handleAdd} className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="bg-pastel-blue hover:bg-blue-300">
            Add Task
          </Button>
        </form>

        {loading ? (
          <div className="text-center font-bold">Loading tasks...</div>
        ) : (
          <div className="space-y-4">
            {todos.length === 0 ? (
              <p className="text-center font-bold text-gray-500">No tasks found. Add one!</p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.documentId}
                  className="flex items-center justify-between p-4 border-2 border-black bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => handleToggle(todo.documentId, todo.isCompleted)}
                      className="w-6 h-6 border-2 border-black appearance-none checked:bg-black checked:after:content-['✓'] checked:after:text-white checked:after:flex checked:after:items-center checked:after:justify-center transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                    />
                    <span
                      className={`text-xl font-bold ${
                        todo.isCompleted ? 'line-through text-gray-400' : ''
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleDelete(todo.documentId)}
                    className="px-3 py-1 bg-red-400 hover:bg-red-500"
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
