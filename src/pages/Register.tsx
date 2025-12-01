import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../lib/api'; 
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'; // Asumo que ya instalaste esta UI

// --- 1. ESQUEMA DE VALIDACIÓN (ZOD) ---
// Alineado con las reglas de seguridad de tu backend (letras, números, mayúsculas)
const registerSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio."),
  surname: z.string().min(2, "El apellido es obligatorio."),
  alias: z.string().min(3, "El alias debe tener al menos 3 caracteres."),
  email: z.string().email("El email no es válido."),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula.")
    .regex(/[0-9]/, "Debe contener al menos un número."),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post('/auth/register', data);
      
      toast.success('¡Registro exitoso! Esperando aprobación del administrador.');
      navigate('/login'); // Redirigir al login para que el usuario espere la aprobación
      
    } catch (error: any) {
      console.error("Error de API:", error.response?.data);
      const message = error.response?.data?.message || 'Error desconocido al registrar.';
      toast.error(message);
    }
  };

  const getError = (field: keyof RegisterFormData) => errors[field]?.message;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 pt-20 md:pt-0">
      <Card className="w-full max-w-md p-8 rounded-xl shadow-2xl bg-gray-800 border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Crear Cuenta</h2>
          <p className="mt-2 text-gray-400">Tu aventura Survivor comienza aquí.</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <InputGroup 
              label="Nombre" 
              name="name" 
              type="text" 
              register={register} 
              error={getError('name')} 
            />
            {/* Apellido */}
            <InputGroup 
              label="Apellido" 
              name="surname" 
              type="text" 
              register={register} 
              error={getError('surname')} 
            />
          </div>
          
          {/* Alias y Email */}
          <InputGroup 
            label="Alias de Jugador" 
            name="alias" 
            type="text" 
            register={register} 
            error={getError('alias')} 
          />
          <InputGroup 
            label="Email" 
            name="email" 
            type="email" 
            register={register} 
            error={getError('email')} 
          />
          
          {/* Contraseña */}
          <InputGroup 
            label="Contraseña" 
            name="password" 
            type="password" 
            register={register} 
            error={getError('password')} 
            placeholder="Mín. 8 caracteres, 1 Mayús, 1 Número"
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-sm font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Solicitar Acceso'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm font-medium text-green-400 hover:text-green-300">
            ¿Ya tienes cuenta? Inicia Sesión
          </Link>
        </div>
      </Card>
    </div>
  );
}

// --- Componente auxiliar para formularios (para mantener el código limpio) ---
const InputGroup: React.FC<any> = ({ label, name, type, register, error, placeholder }) => (
    <div className="space-y-1">
        <label htmlFor={name} className="text-sm font-medium text-gray-300">
            {label}
        </label>
        <input
            id={name}
            type={type}
            className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white outline-none 
                ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-green-500'}`}
            placeholder={placeholder}
            {...register(name)}
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
);