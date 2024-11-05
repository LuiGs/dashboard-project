import { getUserById } from '@/actions';
import { Title } from '@/components';
import { UserForm } from './ui/UserForm';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default async function UserPage({ params }: Props) {
  const { id } = params;

  const user = await getUserById(id);

  if (!user && id !== 'new') {
    redirect('/admin/users');
  }

  const title = id === 'new' ? 'Crear nuevo usuario' : 'Editar usuario';

  return (
    <>
      <Title title={title} />
      <UserForm user={user ?? {}} />
    </>
  );
}
