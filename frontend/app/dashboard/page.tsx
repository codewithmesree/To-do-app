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
    <div className="flex-1 flex flex-col items-center pt-8">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Your Tasks</h2>

        <form onSubmit={handleAdd} className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            Add Task
          </Button>
        </form>

        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading tasks...</div>
        ) : (
          <div className="space-y-3">
            {todos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No tasks found. Add one!</p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.documentId}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    todo.isCompleted ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-brand-primary/30 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => handleToggle(todo.documentId, todo.isCompleted)}
                      className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer transition-colors"
                    />
                    <span
                      className={`text-lg transition-all ${
                        todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleDelete(todo.documentId)}
                    className="px-3 py-1.5 !bg-red-50 !text-red-500 hover:!bg-red-100 shadow-none border-0 transition-colors"
                  >
                    <Trash2 size={18} />
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
