import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit2, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function App() {
  const { t, i18n } = useTranslation();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: Todo & { createdAt: string; updatedAt: string }) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
      }));
      setTodos(parsedTodos);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Create new todo
  const addTodo = () => {
    if (!newTitle.trim()) return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTodos(prev => [newTodo, ...prev]);
    setNewTitle('');
    setNewDescription('');
  };

  // Update todo
  const updateTodo = () => {
    if (!editingTodo || !editTitle.trim()) return;

    setTodos(prev => prev.map(todo => 
      todo.id === editingTodo.id
        ? {
            ...todo,
            title: editTitle.trim(),
            description: editDescription.trim(),
            updatedAt: new Date(),
          }
        : todo
    ));

    setEditingTodo(null);
    setEditTitle('');
    setEditDescription('');
    setIsEditDialogOpen(false);
  };

  // Delete todo
  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Toggle completion status
  const toggleComplete = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));
  };

  // Open edit dialog
  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditDialogOpen(true);
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {t('header.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {t('header.description')}
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-sm">
              {t('header.total')}: {totalCount}
            </Badge>
            <Badge variant="default" className="text-sm bg-green-600">
              {t('header.completed')}: {completedCount}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {t('header.pending')}: {totalCount - completedCount}
            </Badge>
          </div>
        </div>

        {/* Add New Todo Form */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              {t('form.addNewTask')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('form.taskTitleRequired')}</Label>
              <Input
                id="title"
                placeholder={t('form.taskTitlePlaceholder')}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && addTodo()}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('form.description')}</Label>
              <Input
                id="description"
                placeholder={t('form.descriptionPlaceholder')}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <Button 
              onClick={addTodo} 
              disabled={!newTitle.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('form.addTask')}
            </Button>
          </CardContent>
        </Card>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <Card className="text-center py-12 shadow-sm border-dashed border-2 border-slate-300 dark:border-slate-600">
              <CardContent>
                <div className="text-slate-500 dark:text-slate-400">
                  <Circle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">{t('empty.noTasks')}</p>
                  <p>{t('empty.getStarted')}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card 
                key={todo.id} 
                className={cn(
                  "shadow-md border-l-4 transition-all duration-200 hover:shadow-lg",
                  "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm",
                  todo.completed 
                    ? "border-l-green-500 opacity-75" 
                    : "border-l-blue-500 hover:-translate-y-1"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Completion Checkbox */}
                    <div className="mt-1">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleComplete(todo.id)}
                        className="h-5 w-5"
                      />
                    </div>
                    
                    {/* Todo Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "text-lg font-semibold mb-1 break-words",
                        todo.completed 
                          ? "line-through text-slate-500 dark:text-slate-400" 
                          : "text-slate-800 dark:text-slate-100"
                      )}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={cn(
                          "text-sm mb-3 break-words",
                          todo.completed 
                            ? "line-through text-slate-400 dark:text-slate-500" 
                            : "text-slate-600 dark:text-slate-300"
                        )}>
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                        <span>{t('task.createdDate')}: {todo.createdAt.toLocaleDateString(i18n.language)}</span>
                        {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
                          <>
                            <Separator orientation="vertical" className="h-3" />
                            <span>{t('task.updatedDate')}: {todo.updatedAt.toLocaleDateString(i18n.language)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleComplete(todo.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        {todo.completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Edit Dialog */}
                      <Dialog open={isEditDialogOpen && editingTodo?.id === todo.id} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(todo)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>{t('dialog.editTask')}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-title">{t('dialog.editTitle')}</Label>
                              <Input
                                id="edit-title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder={t('dialog.editTitlePlaceholder')}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-description">{t('dialog.editDescription')}</Label>
                              <Input
                                id="edit-description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder={t('dialog.editDescriptionPlaceholder')}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                              >
                                {t('dialog.cancel')}
                              </Button>
                              <Button
                                onClick={updateTodo}
                                disabled={!editTitle.trim()}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {t('dialog.updateTask')}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Delete Confirmation Dialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('dialog.deleteTask')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('dialog.deleteConfirmation', { title: todo.title })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('dialog.cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteTodo(todo.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {t('dialog.delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
