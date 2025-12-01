import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../lib/api'; 
import { useAuthStore } from '../store/authStore'; 
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'; 
import { InputGroup } from '@/components/forms/InputGroup'; // Importar el componente fijo

// --- 1. ESQUEMA DE VALIDACIÓN (ZOD) ---
const loginSchema = z.object({
  email: z.string().email("El email no es válido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore(); 
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post('/auth/login', { 
          email: data.email, 
          password: data.password 
      });
      
      login(res.data.token, res.data.user);

      toast.success(`¡Bienvenido, ${res.data.user.alias}!`);
      navigate('/'); 
      
    } catch (error: any) {
      console.error("Error de API:", error.response?.data);
      toast.error(error.response?.data?.message || 'Error al iniciar sesión.');
    }
  };

  const getError = (field: keyof LoginFormData) => errors[field]?.message;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 pt-20 md:pt-0">
      <Card className="w-full max-w-md space-y-6 p-8 rounded-xl shadow-2xl bg-gray-800 border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Acceder a mi Cuenta</h2>
          <p className="mt-2 text-gray-400">Introduce tus credenciales</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Email */}
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
          />
          
          <Link to="/forgot-password" className="text-sm block text-right font-medium text-red-400 hover:text-red-300">
            ¿Olvidaste tu contraseña?
          </Link>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-sm font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Verificando...' : 'Entrar al Juego'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-medium text-green-400 hover:text-green-300">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}