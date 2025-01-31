import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Timestamp;
  userId: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const db = getFirestore();

  useEffect(() => {
    if (!user) return;

    const todosQuery = query(
      collection(db, 'todos'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(todosQuery, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[];
      
      setTodos(todosData);
    });

    return () => unsubscribe();
  }, [db, user]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTodo.trim()) return;

    try {
      await addDoc(collection(db, 'todos'), {
        text: newTodo.trim(),
        completed: false,
        createdAt: Timestamp.now(),
        userId: user.uid
      });
      
      setNewTodo('');
      toast({
        title: "Todo added",
        description: "Your todo has been saved."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error adding todo",
        description: "Please try again."
      });
    }
  };

  const toggleTodo = async (todoId: string, completed: boolean) => {
    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, { completed });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating todo",
        description: "Please try again."
      });
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      await deleteDoc(doc(db, 'todos', todoId));
      toast({
        title: "Todo deleted"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting todo"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTodo(e as any);
    }
  };

  return (
    <Card className="p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">Things to Do</h2>
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </form>
      <div className="space-y-2">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-2 group">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={(checked) => toggleTodo(todo.id, checked as boolean)}
            />
            <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
              {todo.text}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteTodo(todo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TodoList;