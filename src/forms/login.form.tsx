'use client';

import { signInWithCredentials } from '@/actions/sign-in';
import { addToast, Button, Form, Input } from '@heroui/react';
import { useEffect, useState, useTransition } from 'react';

interface IProps {
  onClose: () => void;
}

const LoginForm = ({ onClose }: IProps) => {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await signInWithCredentials(formData.email, formData.password);

      if (result.error !== undefined) {
        setError(result.error);
        addToast({ title: result.error, color: 'danger' });
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        window.location.reload();
        setError(null);
        onClose();
      }

      // console.log(result);
      // router.refresh();
    });
  };

  return (
    <Form className="w-full" onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Input
        aria-label="Email"
        isRequired
        name="email"
        placeholder="Введите email"
        type="email"
        value={formData.email}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none ',
        }}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        validate={(value) => {
          if (!value) return 'Почта обязательна';
          return null;
        }}
      />
      <Input
        isRequired
        name="password"
        placeholder="Введите пароль"
        type="password"
        value={formData.password}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none ',
        }}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        validate={(value) => {
          if (!value) return 'Пароль обязателен';
          return null;
        }}
      />

      <div className="flex w-full  gap-4 items-center pt-8 justify-end">
        <Button variant="light" onPress={onClose}>
          Отмена
        </Button>
        <Button color="primary" type="submit" isLoading={isPending}>
          Войти
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
